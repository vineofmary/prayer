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
3. Format EOTC liturgical terms in "translatedText" as *Phonetic* [Meaning], e.g. *Qidase* [Divine Liturgy], *Qiddus Qurban* [Holy Communion], *Tabot* [Ark of the Covenant], *Suba'e* [Spiritual Retreat], *Nisiha* [Repentance], *Mahlet* [Liturgical Chanting], *Qale Hiwot Yasemalin* [May He let us hear the Word of Life], *Sebeka Gubae* [Parish Council], *Senbet Timhirt Bet* [Sunday School], *Kidane Mihret* [Covenant of Mercy], *Debre Mihret* [Mount of Mercy], *Teamire Mariam* [Miracles of Mary]. Translate sacred and hierarchical names faithfully (Our Lord Jesus Christ, Holy Spirit, Holy Trinity, Our Lady Saint Mary, Archangel Saint Michael, His Grace Abune).
4. Safeguard: Never emit vulgar profanity, modern expletives, or slurs due to background noise or phonetic misinterpretation; always choose accurate, context-appropriate EOTC phrasing.`;

// --- Profanity Safeguard (All Targuma Languages: en, es, am, ti) ---
const LATIN_PROFANITY_CORE =
  "(?:" +
  "(?:mother)?fuck(?:er|ers|ing|ed|s|head|wit|face|boy|off|tard)?|" +
  "(?:bull|horse|dog|dip|bat|ape)?shit(?:s|ty|tier|tiest|ting|ted|head|face|hole|load|storm|show|e)?|" +
  "bitch(?:es|ing|ed|y)?|" +
  "cunt(?:s|y)?|" +
  "(?:asshole|asshat|asswipe|dumbass|jackass|fatass|badass|smartass|kissass|kickass)(?:s|es)?|" +
  "(?:cocksuck(?:er|ers|ing)|cockhead|dickhead|dickface|dickwad|dickless)|" +
  "puss(?:y|ies)|" +
  "slut(?:s|ty|tish)?|" +
  "skank(?:s|y)?|" +
  "(?:twat|wanker|tosser|bollocks|bugger)(?:s|ed|ing)?|" +
  "douche(?:bag|bags)?|" +
  "piss(?:ed|ing|es|er|head)?|" +
  "goddamn(?:ed|it)?|" +
  "(?:jerkoff|jackoff|handjob|blowjob|rimjob)s?|" +
  "tits|titt(?:y|ies)|" +
  "nigg(?:er|ers|a|as|ah|ahs)|" +
  "fag(?:got|gots|s)?|" +
  "dyke(?:s)?|" +
  "trann(?:y|ies)|" +
  "retard(?:ed|s)?|" +
  "kike(?:s)?|spic(?:s)?|wetback(?:s)?|paki(?:s)?|" +
  "(?:hijueputa|hijeputa|putamadre|putazo|putada|puta|putas|puto|putos)|" +
  "(?:comemierda|mierda|mierdas)|" +
  "(?:cabr[oó]n|cabrona|cabrones|cabronazo)|" +
  "(?:pendej[oa]s?|pendejada|pendejadas)|" +
  "(?:coj[oó]n|cojones|acojonad[oa]s?)|" +
  "jod(?:er|id[oa]s?|iendo)|" +
  "chinga(?:r|da|dos|das|do|dera)?|ching[oó]n|chingon(?:a|es|as)|chingue(?:n|s)?|" +
  "(?:careverga|verga|vergas|vergazo)|" +
  "(?:culer[oa]s?|culiad[oa]s?|culos?)|" +
  "carajos?|" +
  "(?:gilipollas|pollas?)|" +
  "pinches?|" +
  "(?:mam[oó]n|mamona|mamones|mamadas?)|" +
  "(?:maric[oó]n|maricones|maricas?)|" +
  "(?:malparid[oa]s?|pirobo|huev[oó]n|huevones|web[oó]n|weones)|" +
  "coños?" +
  ")";

const ETHIOPIC_PROFANITY_CORE =
  "(?:" +
  "ሸርሙጣ|ሽርሙጣ|ሻርሙጣ|ሸርሙጦች|ሽርሙጦች|" +
  "ቅዘናም|ቅዘን|ቀዘናም|ቀዘን|ቆዘነ|" +
  "ልብዳ|ብዳ|ተበዳች|ተበዱ|ተበዳ|ተባዳ|ትበዳ|ይበዳ|የሚበዳ|በዳሁ|በዳህ|በዳሽ|" +
  "እምስ|እምሲ|እምሷ|እምስሽ|" +
  "ቁላው|ቁላህ|ቁላ|ቍላ|" +
  "ሸሌዎች|ሸሌ|" +
  "መዓኮርካ|መዓኮርኪ|መዓኮር" +
  ")";

const LATIN_PROFANITY_TEST_RE = new RegExp(`(?:^|[^A-Za-zÀ-ÖØ-öø-ÿ0-9_])${LATIN_PROFANITY_CORE}(?=$|[^A-Za-zÀ-ÖØ-öø-ÿ0-9_])`, "i");
const LATIN_PROFANITY_REPLACE_RE = new RegExp(`(^|[^A-Za-zÀ-ÖØ-öø-ÿ0-9_])(${LATIN_PROFANITY_CORE})(?=$|[^A-Za-zÀ-ÖØ-öø-ÿ0-9_])`, "gi");
const ETHIOPIC_PROFANITY_TEST_RE = new RegExp(`(?:^|[^\\u1200-\\u137F])${ETHIOPIC_PROFANITY_CORE}(?=$|[^\\u1200-\\u137F])`);
const ETHIOPIC_PROFANITY_REPLACE_RE = new RegExp(`(^|[^\\u1200-\\u137F])(${ETHIOPIC_PROFANITY_CORE})(?=$|[^\\u1200-\\u137F])`, "g");

function maskWordFirstLetter(word) {
  const chars = Array.from(String(word || ""));
  if (chars.length <= 1) return "*";
  return chars[0] + "*".repeat(chars.length - 1);
}

function containsProfanity(text) {
  const str = String(text || "");
  if (!str) return false;
  return LATIN_PROFANITY_TEST_RE.test(str) || ETHIOPIC_PROFANITY_TEST_RE.test(str);
}

function maskProfanity(text) {
  const str = String(text || "");
  if (!str) return "";
  let out = str.replace(LATIN_PROFANITY_REPLACE_RE, (_, prefix, word) => prefix + maskWordFirstLetter(word));
  out = out.replace(ETHIOPIC_PROFANITY_REPLACE_RE, (_, prefix, word) => prefix + maskWordFirstLetter(word));
  return out;
}

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
          let safeText = textInput;
          if (containsProfanity(safeText)) {
            try {
              const accessToken = await getVertexAccessToken();
              const reprocessParts = [{
                text: `A live church caption produced: "${safeText}", which triggered a vulgar-profanity safeguard and may be a phonetic ASR mishearing in an Ethiopian/Eritrean Orthodox Tewahedo Church (EOTC) sermon or reading. Re-evaluate carefully in context and return the accurate, clean phrase in ${LANG_NAMES[targetLang] || targetLang} with zero vulgar profanity or slurs.`
              }];
              const resp = await callVertexGemini({
                projectId,
                accessToken,
                modelId: requestedModel,
                location: modelSpec.location,
                parts: reprocessParts,
                thinkingConfig: modelSpec.thinkingConfig,
                stream: false,
                timeoutMs: 2200
              });
              if (resp.ok) {
                const vData = await resp.json();
                const cParts = vData?.candidates?.[0]?.content?.parts || [];
                const tPart = cParts.find((p) => typeof p.text === "string" && !p.thought) || cParts[cParts.length - 1];
                const parsedClean = JSON.parse(tPart?.text || "{}");
                if (parsedClean?.translatedText) {
                  safeText = String(parsedClean.translatedText).trim();
                }
              }
            } catch (_) {}
            safeText = maskProfanity(safeText);
          }
          res.status(200).json({
            model: "identity",
            latencyMs: Date.now() - startMs,
            isSilence: false,
            sourceText: maskProfanity(textInput),
            translatedText: safeText
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
          let translatedText = String(nmtResp?.translations?.[0]?.translatedText || "").trim();
          if (translatedText && containsProfanity(translatedText)) {
            try {
              const accessToken = await getVertexAccessToken();
              const reprocessParts = [{
                text: `An initial translation of this EOTC church phrase (${LANG_NAMES[sourceLang] || sourceLang}) produced: "${translatedText}", which triggered a vulgar-profanity safeguard. Re-translate faithfully into ${LANG_NAMES[targetLang] || targetLang} within an EOTC liturgical/sermon context with zero vulgar profanity or slurs.\nPhrase: "${textInput}"`
              }];
              const resp = await callVertexGemini({
                projectId,
                accessToken,
                modelId: requestedModel,
                location: modelSpec.location,
                parts: reprocessParts,
                thinkingConfig: modelSpec.thinkingConfig,
                stream: false,
                timeoutMs: 2200
              });
              if (resp.ok) {
                const vData = await resp.json();
                const cParts = vData?.candidates?.[0]?.content?.parts || [];
                const tPart = cParts.find((p) => typeof p.text === "string" && !p.thought) || cParts[cParts.length - 1];
                const parsedClean = JSON.parse(tPart?.text || "{}");
                if (parsedClean?.translatedText) {
                  translatedText = String(parsedClean.translatedText).trim();
                }
              }
            } catch (_) {}
            translatedText = maskProfanity(translatedText);
          }
          res.status(200).json({
            model: "cloud-translate-v3",
            latencyMs: Date.now() - startMs,
            isSilence: false,
            sourceText: maskProfanity(textInput),
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
                    translatedText: maskProfanity(partialTarget),
                    sourceText: maskProfanity(partialSource),
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

        let finalSource = String(parsed.sourceText || textInput || "").trim();
        let finalTranslated = String(parsed.translatedText || lastEmittedDraft || "").trim();
        if (!parsed.isSilence && finalTranslated && containsProfanity(finalTranslated)) {
          try {
            const reprocessParts = [];
            if (audioBase64) {
              reprocessParts.push({ inlineData: { mimeType: mimeType, data: audioBase64 } });
            }
            reprocessParts.push({
              text: `An initial translation produced: "${finalTranslated}", which triggered a vulgar-profanity safeguard (likely an ASR phonetic glitch or literal mistranslation). Re-evaluate the spoken EOTC church phrase (${LANG_NAMES[sourceLang] || sourceLang}) and produce an accurate, context-appropriate ${LANG_NAMES[targetLang] || targetLang} translation with zero vulgar profanity or slurs.` + (finalSource ? `\nTranscript: "${finalSource}"` : "")
            });
            const fbAttempt = attempts.find((a) => a.modelId === activeModelUsed) || attempts[0];
            const reResp = await callVertexGemini({
              projectId,
              accessToken,
              modelId: fbAttempt.modelId,
              location: fbAttempt.location,
              parts: reprocessParts,
              thinkingConfig: fbAttempt.thinkingConfig,
              stream: false,
              timeoutMs: 2200
            });
            if (reResp.ok) {
              const vData = await reResp.json();
              const cParts = vData?.candidates?.[0]?.content?.parts || [];
              const tPart = cParts.find((p) => typeof p.text === "string" && !p.thought) || cParts[cParts.length - 1];
              const parsedClean = JSON.parse(tPart?.text || "{}");
              if (parsedClean?.translatedText) {
                finalTranslated = String(parsedClean.translatedText).trim();
              }
            }
          } catch (_) {}
        }
        finalSource = maskProfanity(finalSource);
        finalTranslated = maskProfanity(finalTranslated);

        const donePayload = JSON.stringify({
          type: "done",
          model: activeModelUsed,
          latencyMs: Date.now() - startMs,
          isSilence: Boolean(parsed.isSilence),
          sourceText: finalSource,
          translatedText: finalTranslated
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

      let finalSource = String(parsed.sourceText || textInput || "").trim();
      let finalTranslated = String(parsed.translatedText || "").trim();
      if (!parsed.isSilence && finalTranslated && containsProfanity(finalTranslated)) {
        try {
          const reprocessParts = [];
          if (audioBase64) {
            reprocessParts.push({ inlineData: { mimeType: mimeType, data: audioBase64 } });
          }
          reprocessParts.push({
            text: `An initial translation produced: "${finalTranslated}", which triggered a vulgar-profanity safeguard (likely an ASR phonetic glitch or literal mistranslation). Re-evaluate the spoken EOTC church phrase (${LANG_NAMES[sourceLang] || sourceLang}) and produce an accurate, context-appropriate ${LANG_NAMES[targetLang] || targetLang} translation with zero vulgar profanity or slurs.` + (finalSource ? `\nTranscript: "${finalSource}"` : "")
          });
          const fbAttempt = attempts.find((a) => a.modelId === activeModelUsed) || attempts[0];
          const reResp = await callVertexGemini({
            projectId,
            accessToken,
            modelId: fbAttempt.modelId,
            location: fbAttempt.location,
            parts: reprocessParts,
            thinkingConfig: fbAttempt.thinkingConfig,
            stream: false,
            timeoutMs: 2200
          });
          if (reResp.ok) {
            const vData = await reResp.json();
            const cParts = vData?.candidates?.[0]?.content?.parts || [];
            const tPart = cParts.find((p) => typeof p.text === "string" && !p.thought) || cParts[cParts.length - 1];
            const parsedClean = JSON.parse(tPart?.text || "{}");
            if (parsedClean?.translatedText) {
              finalTranslated = String(parsedClean.translatedText).trim();
            }
          }
        } catch (_) {}
      }
      finalSource = maskProfanity(finalSource);
      finalTranslated = maskProfanity(finalTranslated);

      res.status(200).json({
        model: activeModelUsed,
        latencyMs,
        isSilence: Boolean(parsed.isSilence),
        sourceText: finalSource,
        translatedText: finalTranslated,
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

