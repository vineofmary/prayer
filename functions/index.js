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
// Models:
//   - gemini-3-flash-preview (Default: Ultra-Low Latency Gemini 3 Flash, 0 thinking)
//   - gemini-2.5-flash (Fast Production Gemini 2.5 Flash, 0 thinking)
// Supports both Multimodal Audio Chunks (audioBase64) and Text Transcripts (text)
// ============================================================================
const ALLOWED_MODELS = {
  "gemini-3-flash-preview": {
    location: "global",
    thinkingConfig: { thinkingBudget: 0 },
    fallbackChain: [
      { modelId: "gemini-2.5-flash", location: "global", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-2.5-flash", location: "us-central1", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-2.5-flash", location: "us-east4", thinkingConfig: { thinkingBudget: 0 } }
    ]
  },
  "gemini-2.5-flash": {
    location: "global",
    thinkingConfig: { thinkingBudget: 0 },
    fallbackChain: [
      { modelId: "gemini-2.5-flash", location: "us-central1", thinkingConfig: { thinkingBudget: 0 } },
      { modelId: "gemini-3-flash-preview", location: "global", thinkingConfig: { thinkingBudget: 0 } },
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

const TARGUMA_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    isSilence: { type: "BOOLEAN" },
    sourceText: { type: "STRING" },
    translatedText: { type: "STRING" }
  },
  required: ["isSilence", "sourceText", "translatedText"]
};

const TARGUMA_SYSTEM_INSTRUCTION = `You are "Targuma" (ተርጉማ), a faithful real-time interpreter for an Ethiopian & Eritrean Orthodox Tewahedo Church (EOTC) parish ("The Mount of Mercy" / ደብረ ምሕረት).
Your role is to transcribe and translate live spoken sermons and church announcements accurately, naturally, and with zero hallucination.

CRITICAL RULES:
1. ZERO HALLUCINATION & SILENCE DETECTION:
   - Translate ONLY words that are clearly spoken in the input.
   - NEVER guess, invent, or insert religious phrases that were not actually spoken.
   - If the audio clip is muffled, distant, music/chanting, coughing, static, or too unclear to transcribe confidently, you MUST return:
     {"isSilence": true, "sourceText": "", "translatedText": ""}
2. STRICT TARGET LANGUAGE OUTPUT:
   - "translatedText" MUST be written entirely in the requested target language.
   - Never leave raw Ethiopic script (ፊደል) inside an English or Spanish "translatedText".
3. GE'EZ & EOTC LITURGICAL TERMS (STYLE B — GOLD ITALIC + BRACKETED MEANING):
   - Whenever the speaker utters a Ge'ez or EOTC liturgical/ecclesial term or blessing formula, ALWAYS format it in "translatedText" using asterisks and square brackets: *Phonetic Term* [Meaning].
   - Examples to always format as *Phonetic* [Meaning]:
     * *Qidase* [Divine Liturgy], *Qiddus Qurban* [Holy Communion], *Tabot* [Ark of the Covenant], *Suba'e* [Spiritual Retreat], *Nisiha* [Repentance], *Nisiha Abbat* [Confession Father], *Mahlet* [Liturgical Chanting], *Sebeka Gubae* [Parish Council], *Senbet Timhirt Bet* [Sunday School], *Kidane Mihret* [Covenant of Mercy], *Debre Mihret* [Mount of Mercy], *Weladite Amlak* [Mother of God], *Medhane Alem* [Savior of the World], *Egziabher* [Lord God], *Qale Hiwot Yasemalin* [May He let us hear the Word of Life], *Tselot* [Prayer], *Tsom* [Fasting], *Bereket* [Blessing], * Mihla* [Supplication].
   - Also translate Divine and Sacred names faithfully (e.g. Jesus Christ, Holy Spirit, Holy Trinity, Our Lady Saint Mary, Virgin Mary, God, Lord) so the app can rubricate them in red.
4. STRICT JSON OUTPUT:
   Respond with ONLY a valid JSON object matching the schema:
   {"isSilence": false, "sourceText": "<verbatim transcription in source language>", "translatedText": "<accurate translation in target language>"}`;

let cachedAuthClient = null;
async function getVertexAccessToken() {
  if (!cachedAuthClient) {
    cachedAuthClient = await vertexAuth.getClient();
  }
  const tokenResponse = await cachedAuthClient.getAccessToken();
  return tokenResponse.token || tokenResponse;
}

async function callVertexGemini({ projectId, accessToken, modelId, location, parts, thinkingConfig, timeoutMs = 4200 }) {
  const endpointHost =
    location === "global"
      ? "https://aiplatform.googleapis.com"
      : `https://${location}-aiplatform.googleapis.com`;

  const url = `${endpointHost}/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:generateContent`;

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
      Authorization: `Bearer ${accessToken}`,
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
    timeoutSeconds: 30,
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

      const requestedModel = ALLOWED_MODELS[body.model] ? body.model : "gemini-3-flash-preview";
      const modelSpec = ALLOWED_MODELS[requestedModel];
      const sourceLang = LANG_NAMES[body.sourceLang] ? body.sourceLang : "am";
      const targetLang = LANG_NAMES[body.targetLang] ? body.targetLang : "en";
      const recentContext = Array.isArray(body.recentContext)
        ? body.recentContext.slice(-2).join(" | ")
        : String(body.recentContext || "");

      const textInput = String(body.text || "").trim();
      const audioBase64 = String(body.audioBase64 || "").trim();
      const mimeType = String(body.mimeType || "audio/webm").trim();

      if (!textInput && !audioBase64) {
        res.status(400).json({ error: "Either text or audioBase64 is required." });
        return;
      }

      const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT || "mount-of-mercy";
      const accessToken = await getVertexAccessToken();

      const parts = [];
      if (audioBase64) {
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: audioBase64
          }
        });
        parts.push({
          text: `Transcribe the spoken ${LANG_NAMES[sourceLang]} speech in this audio clip and translate it into ${LANG_NAMES[targetLang]}.
${recentContext ? `Immediate preceding phrase for sentence continuity only (do NOT repeat or re-translate this): "${recentContext}"` : ""}
If there is no clear, intelligible human speech in this clip, return {"isSilence": true, "sourceText": "", "translatedText": ""}.
Otherwise return {"isSilence": false, "sourceText": "<${LANG_NAMES[sourceLang]} transcription>", "translatedText": "<${LANG_NAMES[targetLang]} translation>"}.`
        });
      } else {
        parts.push({
          text: `Translate this spoken church sermon/announcement phrase from ${LANG_NAMES[sourceLang]} into ${LANG_NAMES[targetLang]}.
${recentContext ? `Immediate preceding phrase for continuity only (do NOT repeat): "${recentContext}"` : ""}
Phrase to translate: "${textInput}"
Return JSON with "isSilence": false, "sourceText": "${textInput.replace(/"/g, '\\"')}", and "translatedText" written strictly in ${LANG_NAMES[targetLang]}.`
        });
      }

      const attempts = [
        { modelId: requestedModel, location: modelSpec.location, thinkingConfig: modelSpec.thinkingConfig, timeoutMs: 4200 },
        ...modelSpec.fallbackChain.map((fb) => ({ ...fb, timeoutMs: 4200 }))
      ];

      const startMs = Date.now();
      let activeModelUsed = requestedModel;
      let vertexResp = null;
      let lastErrText = "";

      for (const attempt of attempts) {
        try {
          activeModelUsed = `${attempt.modelId}@${attempt.location}`;
          const resp = await callVertexGemini({
            projectId,
            accessToken,
            modelId: attempt.modelId,
            location: attempt.location,
            parts,
            thinkingConfig: attempt.thinkingConfig,
            timeoutMs: attempt.timeoutMs
          });

          if (resp.ok) {
            vertexResp = resp;
            activeModelUsed = attempt.modelId;
            break;
          }

          lastErrText = await resp.text();
          // Retry on 429 (Resource Exhausted) or 5xx
          if (resp.status !== 429 && resp.status < 500) {
            vertexResp = resp;
            break;
          }
        } catch (attemptErr) {
          lastErrText = attemptErr.message || String(attemptErr);
          // Timeout / network error on this endpoint -> immediately try next fallback in chain
        }
      }

      if (!vertexResp || !vertexResp.ok) {
        console.warn(`All Vertex attempts exhausted (${activeModelUsed}):`, lastErrText);
        // Return a graceful 200 with isSilence: true rather than 429/504 so live captioning never crashes or logs errors
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

