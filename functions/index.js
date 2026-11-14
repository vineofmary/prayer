const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { TranslationServiceClient } = require("@google-cloud/translate");
const { GoogleAuth } = require("google-auth-library");

admin.initializeApp();
const db = admin.firestore();
const translationClient = new TranslationServiceClient();
const vertexAuth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"]
});

const AUTO_LANGUAGES = {
  'spanish': 'es',
  'french': 'fr',
  'arabic': 'ar',
  'greek': 'el',
  'hebrew': 'he',
  'malayalam': 'ml'
};

exports.translatePrayer = onDocumentUpdated("prayers/{docId}", async (event) => {
  const newValue = event.data.after.data();
  const previousValue = event.data.before.data();

  // Only trigger if english text changed and is not empty
  if (newValue.english === previousValue.english || !newValue.english) {
    return null;
  }

  console.log(`English text changed for ${event.params.docId}. Translating...`);

  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const location = 'global';
  const translations = {};

  for (const [langKey, langCode] of Object.entries(AUTO_LANGUAGES)) {
    // skip if manually marked as official/verified
    if (newValue[`${langKey}_is_official`] === true) {
      console.log(`Skipping ${langKey} - marked official.`);
      continue;
    }

    try {
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [newValue.english],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: langCode,
      };

      const [response] = await translationClient.translateText(request);
      translations[langKey] = response.translations[0].translatedText;
      translations[`${langKey}_is_official`] = false; 
    } catch (error) {
      console.error(`Error translating to ${langKey}:`, error);
    }
  }

  if (Object.keys(translations).length > 0) {
    return event.data.after.ref.update(translations);
  }

  return null;
});

// ============================================================================
// TARGUMA (ተርጉማ) — Vertex AI Gemini Live Sermon & Announcement Interpreter
// Supports:
//   1. Streaming SSE (`stream: true` via `:streamGenerateContent?alt=sse`)
//   2. Ultra-Fast Cloud Translation V3 (`mode: "nmt"`)
//   3. Backwards-compatible Unary JSON (`stream: false`)
// ============================================================================
const ALLOWED_MODELS = {
  "gemini-2.5-flash": {
    location: "us-central1",
    thinkingConfig: { thinkingBudget: 0 },
    fallbackChain: [
      { modelId: "gemini-2.5-flash", location: "global", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-3-flash-preview", location: "global", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-2.5-flash", location: "us-east4", thinkingConfig: { thinkingBudget: 0 } }
    ]
  },
  "gemini-3-flash-preview": {
    location: "global",
    thinkingConfig: { thinkingBudget: 0 },
    fallbackChain: [
      { modelId: "gemini-2.5-flash", location: "us-central1", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-2.5-flash", location: "global", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-2.5-flash", location: "us-east4", thinkingConfig: { thinkingBudget: 0 } }
    ]
  }
};

const LANG_NAMES = {
  am: "Amharic (አማርኛ)",
  ti: "Tigrinya (ትግርኛ)",
  en: "English",
  es: "Spanish (Español)"
};

// Target-first property ordering yields first English/target words ~600ms earlier when streaming
const TARGUMA_RESPONSE_SCHEMA = {
  type: "OBJECT",
  propertyOrdering: ["isSilence", "translatedText", "sourceText"],
  properties: {
    isSilence: { type: "BOOLEAN" },
    translatedText: { type: "STRING" },
    sourceText: { type: "STRING" }
  },
  required: ["isSilence", "translatedText", "sourceText"]
};

const TARGUMA_SYSTEM_INSTRUCTION = `You are "Targuma" (ተርጉማ), real-time interpreter for an Ethiopian & Eritrean Orthodox Tewahedo Church (EOTC) parish ("The Mount of Mercy" / ደብረ ምሕረት).
Rules:
1. Translate ONLY clearly spoken speech accurately and naturally. Never invent religious phrases. If audio has no intelligible speech, return {"isSilence":true,"translatedText":"","sourceText":""}.
2. Write "translatedText" strictly in the target language (zero raw Ethiopic script in English/Spanish).
3. Format EOTC liturgical terms in "translatedText" as *Phonetic* [Meaning], e.g. *Qidase* [Divine Liturgy], *Qiddus Qurban* [Holy Communion], *Tabot* [Ark of the Covenant], *Suba'e* [Spiritual Retreat], *Nisiha* [Repentance], *Mahlet* [Liturgical Chanting], *Qale Hiwot Yasemalin* [May He let us hear the Word of Life], *Sebeka Gubae* [Parish Council], *Senbet Timhirt Bet* [Sunday School], *Kidane Mihret* [Covenant of Mercy], *Debre Mihret* [Mount of Mercy], *Teamire Mariam* [Miracles of Mary]. Translate sacred and hierarchical names faithfully (Our Lord Jesus Christ, Holy Spirit, Holy Trinity, Our Lady Saint Mary, Archangel Saint Michael, His Grace Abune).`;

let cachedAuthClient = null;
async function getVertexAccessToken() {
  if (!cachedAuthClient) {
    cachedAuthClient = await vertexAuth.getClient();
  }
  const tokenResponse = await cachedAuthClient.getAccessToken();
  return tokenResponse.token || tokenResponse;
}

function extractPartialJsonField(rawPartialJson, fieldName) {
  const marker = '"' + fieldName + '"';
  const keyIdx = rawPartialJson.indexOf(marker);
  if (keyIdx < 0) return "";
  const colonIdx = rawPartialJson.indexOf(":", keyIdx + marker.length);
  if (colonIdx < 0) return "";
  const firstQuote = rawPartialJson.indexOf('"', colonIdx + 1);
  if (firstQuote < 0) return "";

  let out = "";
  let escaped = false;
  for (let i = firstQuote + 1; i < rawPartialJson.length; i++) {
    const ch = rawPartialJson[i];
    if (escaped) {
      if (ch === "n") out += "\n";
      else if (ch === "t") out += "\t";
      else if (ch === '"') out += '"';
      else if (ch === "\\") out += "\\";
      else out += ch;
      escaped = false;
    } else if (ch === "\\") {
      escaped = true;
    } else if (ch === '"') {
      break;
    } else {
      out += ch;
    }
  }
  return out.trim();
}

async function callVertexGemini({ projectId, accessToken, modelId, location, parts, thinkingConfig, stream = false, timeoutMs = 4500 }) {
  const endpointHost =
    location === "global"
      ? "https://aiplatform.googleapis.com"
      : "https://" + location + "-aiplatform.googleapis.com";

  const action = stream ? "streamGenerateContent?alt=sse" : "generateContent";
  const url = endpointHost + "/v1/projects/" + projectId + "/locations/" + location + "/publishers/google/models/" + modelId + ":" + action;

  const vertexPayload = {
    systemInstruction: {
      parts: [{ text: TARGUMA_SYSTEM_INSTRUCTION }]
    },
    contents: [
      {
        role: "user",
        parts: parts
      }
    ],
    generationConfig: {
      temperature: 0.0,
      maxOutputTokens: 220,
      responseMimeType: "application/json",
      responseSchema: TARGUMA_RESPONSE_SCHEMA,
      thinkingConfig: thinkingConfig
    }
  };

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(vertexPayload),
    signal: AbortSignal.timeout(timeoutMs)
  });
}

exports.targumaGemini = onRequest(
  {
    region: "us-central1",
    cors: true,
    timeoutSeconds: 60,
    memory: "512MiB",
    minInstances: 0,
    maxInstances: 60
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "86400");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method Not Allowed" });
      return;
    }

    try {
      let body = req.body || {};
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (e) {
          body = {};
        }
      } else if (Buffer.isBuffer(body)) {
        try {
          body = JSON.parse(body.toString("utf8"));
        } catch (e) {
          body = {};
        }
      }

      const requestedModel = ALLOWED_MODELS[body.model] ? body.model : "gemini-2.5-flash";
      const modelSpec = ALLOWED_MODELS[requestedModel];
      const sourceLang = LANG_NAMES[body.sourceLang] ? body.sourceLang : "am";
      const targetLang = LANG_NAMES[body.targetLang] ? body.targetLang : "en";
      const wantStream = Boolean(body.stream);
      const mode = String(body.mode || "gemini");
      const recentContext = Array.isArray(body.recentContext)
        ? body.recentContext.slice(-3).join(" | ")
        : String(body.recentContext || "");

      const textInput = String(body.text || "").trim();
      const audioBase64 = String(body.audioBase64 || "").trim();
      const mimeType = String(body.mimeType || "audio/wav").trim();

      if (!textInput && !audioBase64) {
        res.status(400).json({ error: "Either text or audioBase64 is required." });
        return;
      }

      const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || "mount-of-mercy";
      const startMs = Date.now();

      // Fast Cloud Translation V3 path for instant draft / retranslation
      if (mode === "nmt" && textInput && !audioBase64) {
        if (sourceLang === targetLang) {
          res.status(200).json({
            model: "identity",
            latencyMs: 0,
            isSilence: false,
            sourceText: textInput,
            translatedText: textInput
          });
          return;
        }
        try {
          const [nmtResp] = await translationClient.translateText({
            parent: "projects/" + projectId + "/locations/us-central1",
            contents: [textInput],
            mimeType: "text/plain",
            sourceLanguageCode: sourceLang,
            targetLanguageCode: targetLang
          });
          const translatedText = String(nmtResp?.translations?.[0]?.translatedText || "").trim();
          res.status(200).json({
            model: "cloud-translate-v3",
            latencyMs: Date.now() - startMs,
            isSilence: false,
            sourceText: textInput,
            translatedText: translatedText
          });
          return;
        } catch (nmtErr) {
          console.warn("Cloud Translate fallback to Gemini:", nmtErr.message);
        }
      }

      const accessToken = await getVertexAccessToken();

      const parts = [];
      const ctxSuffix = recentContext ? '\nPreceding context (do NOT repeat): "' + recentContext + '"' : "";
      if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: audioBase64
          }
        });
        parts.push({
          text: "Transcribe " + LANG_NAMES[sourceLang] + " speech and translate into " + LANG_NAMES[targetLang] + "." + ctxSuffix
        });
      } else {
        parts.push({
          text: "Translate spoken church phrase from " + LANG_NAMES[sourceLang] + " into " + LANG_NAMES[targetLang] + "." + ctxSuffix + '\nPhrase: "' + textInput + '"'
        });
      }

      const attempts = [
        { modelId: requestedModel, location: modelSpec.location, thinkingConfig: modelSpec.thinkingConfig, timeoutMs: 4500 },
        ...modelSpec.fallbackChain.map((fb) => ({ ...fb, timeoutMs: 4500 }))
      ];

      // Streaming SSE path (`stream: true`)
      if (wantStream) {
        res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache, no-transform");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        if (typeof res.flushHeaders === "function") {
          res.flushHeaders();
        }

        let streamResp = null;
        let activeModelUsed = requestedModel;
        for (const attempt of attempts) {
          try {
            const resp = await callVertexGemini({
              projectId,
              accessToken,
              modelId: attempt.modelId,
              location: attempt.location,
              parts,
              thinkingConfig: attempt.thinkingConfig,
              stream: true,
              timeoutMs: attempt.timeoutMs
            });
            if (resp.ok && resp.body) {
              streamResp = resp;
              activeModelUsed = attempt.modelId;
              break;
            }
          } catch (_) {}
        }

        if (!streamResp || !streamResp.body) {
          const emptyDone = JSON.stringify({
            type: "done",
            isSilence: true,
            sourceText: "",
            translatedText: "",
            latencyMs: Date.now() - startMs
          });
          res.write("data: " + emptyDone + "\n\n");
          res.end();
          return;
        }

        let accumulatedJson = "";
        let lastEmittedDraft = "";
        let sseBuffer = "";
        const decoder = new TextDecoder();

        try {
          for await (const chunk of streamResp.body) {
            sseBuffer += decoder.decode(chunk, { stream: true });
            const lines = sseBuffer.split("\n");
            sseBuffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payloadStr = trimmed.slice(5).trim();
              if (!payloadStr || payloadStr === "[DONE]") continue;
              try {
                const evt = JSON.parse(payloadStr);
                const cParts = evt?.candidates?.[0]?.content?.parts || [];
                for (const p of cParts) {
                  if (typeof p.text === "string" && !p.thought) {
                    accumulatedJson += p.text;
                  }
                }
                if (accumulatedJson.includes('"isSilence":true') || accumulatedJson.includes('"isSilence": true')) {
                  continue;
                }
                const partialTarget = extractPartialJsonField(accumulatedJson, "translatedText");
                if (partialTarget && partialTarget !== lastEmittedDraft) {
                  lastEmittedDraft = partialTarget;
                  const partialSource = extractPartialJsonField(accumulatedJson, "sourceText");
                  const draftPayload = JSON.stringify({
                    type: "draft",
                    translatedText: partialTarget,
                    sourceText: partialSource,
                    ttftMs: Date.now() - startMs
                  });
                  res.write("data: " + draftPayload + "\n\n");
                }
              } catch (_) {}
            }
          }
        } catch (_) {}

        let parsed = { isSilence: false, sourceText: textInput, translatedText: lastEmittedDraft };
        try {
          parsed = JSON.parse(accumulatedJson || "{}");
        } catch (_) {}

        const donePayload = JSON.stringify({
          type: "done",
          model: activeModelUsed,
          latencyMs: Date.now() - startMs,
          isSilence: Boolean(parsed.isSilence),
          sourceText: String(parsed.sourceText || textInput || "").trim(),
          translatedText: String(parsed.translatedText || lastEmittedDraft || "").trim()
        });
        res.write("data: " + donePayload + "\n\n");
        res.end();
        return;
      }

      // Unary JSON path (full fallback chain across ANY non-OK status)
      let activeModelUsed = requestedModel;
      let vertexResp = null;
      let lastErrText = "";

      for (const attempt of attempts) {
        try {
          activeModelUsed = attempt.modelId + "@" + attempt.location;
          const resp = await callVertexGemini({
            projectId,
            accessToken,
            modelId: attempt.modelId,
            location: attempt.location,
            parts,
            thinkingConfig: attempt.thinkingConfig,
            stream: false,
            timeoutMs: attempt.timeoutMs
          });

          if (resp.ok) {
            vertexResp = resp;
            activeModelUsed = attempt.modelId;
            break;
          }
          lastErrText = await resp.text();
        } catch (attemptErr) {
          lastErrText = attemptErr.message || String(attemptErr);
        }
      }

      if (!vertexResp || !vertexResp.ok) {
        console.warn("All Vertex attempts exhausted (" + activeModelUsed + "):", lastErrText);
        res.status(200).json({
          model: activeModelUsed,
          latencyMs: Date.now() - startMs,
          isSilence: true,
          sourceText: "",
          translatedText: "",
          transientRetryExhausted: true
        });
        return;
      }

      const vertexData = await vertexResp.json();
      const latencyMs = Date.now() - startMs;
      const candidateParts = vertexData?.candidates?.[0]?.content?.parts || [];
      const textPart = candidateParts.find((p) => typeof p.text === "string" && !p.thought) || candidateParts[candidateParts.length - 1];
      const rawJsonText = textPart?.text || "{}";

      let parsed = { isSilence: false, sourceText: textInput, translatedText: "" };
      try {
        parsed = JSON.parse(rawJsonText);
      } catch (e) {
        parsed = { isSilence: false, sourceText: textInput, translatedText: rawJsonText };
      }

      res.status(200).json({
        model: activeModelUsed,
        latencyMs,
        isSilence: Boolean(parsed.isSilence),
        sourceText: String(parsed.sourceText || textInput || "").trim(),
        translatedText: String(parsed.translatedText || "").trim(),
        usage: vertexData?.usageMetadata || {}
      });
    } catch (err) {
      console.error("targumaGemini error:", err);
      res.status(200).json({
        isSilence: true,
        sourceText: "",
        translatedText: "",
        error: err.message || "Internal Server Error"
      });
    }
  }
);

