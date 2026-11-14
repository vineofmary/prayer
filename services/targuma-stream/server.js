'use strict';

const http = require('node:http');
const { WebSocketServer, WebSocket } = require('ws');
const speechPkg = require('@google-cloud/speech');
const { v2: speechV2, protos } = speechPkg;
const { TranslationServiceClient } = require('@google-cloud/translate');
const { GoogleAuth, OAuth2Client } = require('google-auth-library');

const PORT = Number(process.env.PORT || 8080);
const PROJECT_ID =
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCP_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  'mount-of-mercy';

const SPEECH_LOCATION = 'us';
const SPEECH_RECOGNIZER = `projects/${PROJECT_ID}/locations/${SPEECH_LOCATION}/recognizers/_`;
const STREAM_SOFT_ROTATE_MS = 200 * 1000;   // Rotate cleanly on final boundary after 3m20s
const STREAM_HARD_ROTATE_MS = 265 * 1000;   // Rotate before Speech V2's 305s hard cap
const STREAM_IDLE_CLOSE_MS = 8500;          // Close gRPC STT stream during extended silence to save Speech V2 cost
const MAX_GRPC_AUDIO_BYTES = 16384;         // Well below Speech V2's 25.6 KB per-message cap
const MIN_UTTERANCE_RMS = 0.0035;           // Suppress accidental noise hallucinations on near-zero PCM

// Prosodic Breath-Pause Clause Endpointing (flushes Chirp 3 ONLY on true silent breath pauses, never mid-syllable)
const CLAUSE_MIN_SPEECH_MS = 2000;          // Minimum spoken duration before flushing on a natural breath pause
const CLAUSE_BREATH_PAUSE_MS = 200;         // 200ms silent inter-clause dip triggers clean Chirp 3 USM finalization
const RELATIVE_PAUSE_RATIO = 0.28;          // Adaptive dip threshold relative to rolling speech RMS
const GEMINI_CLAUSE_DEADLINE_MS = 1250;     // Max wait for single-shot Gemini polish before NMT instant fallback

const CHIRP3_LANG_MAP = {
  am: 'am-ET',
  en: 'en-US',
  es: 'es-US'
};

const NMT_LANG_MAP = {
  am: 'am',
  ti: 'ti',
  en: 'en',
  es: 'es'
};

const LANG_NAMES = {
  am: 'Amharic (አማርኛ)',
  ti: 'Tigrinya (ትግርኛ)',
  en: 'English',
  es: 'Spanish (Español)'
};

const ALLOWED_MODELS = {
  'gemini-2.5-flash': {
    location: 'us-central1',
    thinkingConfig: { thinkingBudget: 0 },
    fallbackChain: [
      { modelId: 'gemini-2.5-flash', location: 'global', thinkingConfig: { thinkingBudget: 0 } },
      { modelId: 'gemini-3-flash-preview', location: 'global', thinkingConfig: { thinkingBudget: 0 } },
      { modelId: 'gemini-2.5-flash', location: 'us-east4', thinkingConfig: { thinkingBudget: 0 } }
    ]
  },
  'gemini-3-flash-preview': {
    location: 'global',
    thinkingConfig: { thinkingBudget: 0 },
    fallbackChain: [
      { modelId: 'gemini-2.5-flash', location: 'us-central1', thinkingConfig: { thinkingBudget: 0 } },
      { modelId: 'gemini-2.5-flash', location: 'global', thinkingConfig: { thinkingBudget: 0 } },
      { modelId: 'gemini-2.5-flash', location: 'us-east4', thinkingConfig: { thinkingBudget: 0 } }
    ]
  }
};

// Target-first property ordering for SSE / JSON audio fallback
const TARGUMA_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  propertyOrdering: ['isSilence', 'translatedText', 'sourceText'],
  properties: {
    isSilence: { type: 'BOOLEAN' },
    translatedText: { type: 'STRING' },
    sourceText: { type: 'STRING' }
  },
  required: ['isSilence', 'translatedText', 'sourceText']
};

const TARGUMA_CONCISE_SYSTEM_PROMPT = `You are "Targuma" (ተርጉማ), real-time interpreter for an Ethiopian & Eritrean Orthodox Tewahedo Church (EOTC) parish ("The Mount of Mercy" / ደብረ ምሕረት).
Rules:
1. Translate ONLY spoken speech into clear, natural clause-sized phrasing. Never invent religious phrases. If audio has no clear speech, return {"isSilence":true,"translatedText":"","sourceText":""}.
2. Write "translatedText" strictly in the target language (zero raw Ethiopic script in English/Spanish).
3. Format EOTC liturgical terms in "translatedText" as *Phonetic* [Meaning], e.g. *Qidase* [Divine Liturgy], *Qiddus Qurban* [Holy Communion], *Tabot* [Ark of the Covenant], *Suba'e* [Spiritual Retreat], *Nisiha* [Repentance], *Mahlet* [Liturgical Chanting], *Qale Hiwot Yasemalin* [May He let us hear the Word of Life], *Sebeka Gubae* [Parish Council], *Senbet Timhirt Bet* [Sunday School], *Kidane Mihret* [Covenant of Mercy], *Debre Mihret* [Mount of Mercy], *Teamire Mariam* [Miracles of Mary]. Translate sacred names faithfully (Our Lord Jesus Christ, Holy Spirit, Holy Trinity, Our Lady Saint Mary, Archangel Saint Michael, His Grace Abune).`;

const TARGUMA_CLAUSE_SYSTEM_PROMPT = `You translate one live spoken clause at a time from an Ethiopian & Eritrean Orthodox Tewahedo Church (EOTC) sermon, Miracle of Mary reading, or announcement.
Rules:
1. Translate ONLY the current spoken clause faithfully and naturally so a congregation listener can read this single clause effortlessly without confusion.
2. Because Amharic and Tigrinya often use long multi-clause SOV sentences, make this clause read smoothly as a clean, self-contained portion of the thought (connecting naturally to any preceding context without repeating words already translated in previous clauses, and without inventing unstated words).
3. Never include raw Ethiopic script in English or Spanish output.
4. Format EOTC liturgical terms as *Phonetic* [Meaning] (e.g. *Qidase* [Divine Liturgy], *Tabot* [Ark of the Covenant], *Qale Hiwot Yasemalin* [May He let us hear the Word of Life], *Kidane Mihret* [Covenant of Mercy], *Debre Mihret* [Mount of Mercy], *Teamire Mariam* [Miracles of Mary]) and translate sacred/hierarchical titles faithfully (His Grace Abune, Archangel Saint Michael, Our Lady Saint Mary).
5. Respond with JSON: {"translatedText":"<clean clause translation>"}`;

const CLAUSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    translatedText: { type: 'STRING' }
  },
  required: ['translatedText']
};

// Amharic / Tigrinya / English / Spanish clause boundary vocabulary for splitting long run-on speech
const CLAUSE_STARTER_WORDS = new Set([
  'እንግዲህ', 'ስለዚህ', 'ደግሞ', 'ደግሞም', 'እንዲሁም', 'ወይም', 'ማለትም',
  'ምክንያቱም', 'በተለይ', 'ከዚያም', 'በመሆኑም', 'ይህም', 'ይህ', 'ዛሬ', 'ነገር', 'ዳሩ',
  'ብቻ', 'ስለሆነም', 'እንኳን', 'በዚህም',
  'and', 'but', 'because', 'therefore', 'however', 'moreover', 'while', 'which', 'who',
  'pero', 'porque', 'cuando', 'además', 'entonces'
]);

const CLAUSE_ENDER_WORDS = new Set([
  'ሲሆን', 'በኋላ', 'በፊት', 'ጊዜ', 'እለት', 'ዕለት', 'ዘንድ', 'ብሎ', 'ብላ', 'ብለው',
  'ነው', 'ናት', 'ናቸው', 'ነበር', 'ይባላል', 'ይላል', 'ይሆናል', 'ማለት', 'ማርያም', 'ክርስቶስ'
]);

// --- Cloud Clients ---
function buildAuthOptions() {
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    const oauth = new OAuth2Client();
    oauth.setCredentials({ access_token: process.env.GOOGLE_ACCESS_TOKEN });
    return { authClient: oauth, projectId: PROJECT_ID };
  }
  return { projectId: PROJECT_ID };
}

const authOpts = buildAuthOptions();
const speechClient = new speechV2.SpeechClient({
  apiEndpoint: `${SPEECH_LOCATION}-speech.googleapis.com`,
  ...authOpts
});
const translateClient = new TranslationServiceClient(authOpts);
const vertexAuth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

let cachedVertexAuthClient = null;
async function getVertexAccessToken() {
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    return process.env.GOOGLE_ACCESS_TOKEN;
  }
  if (!cachedVertexAuthClient) {
    cachedVertexAuthClient = await vertexAuth.getClient();
  }
  const tokenResp = await cachedVertexAuthClient.getAccessToken();
  return tokenResp.token || tokenResp;
}

// Fast LRU Cache for NMT translations
const nmtCache = new Map();
function putNmtCache(key, val) {
  if (nmtCache.size > 600) {
    const oldest = nmtCache.keys().next().value;
    nmtCache.delete(oldest);
  }
  nmtCache.set(key, val);
}

async function fastCloudTranslate(text, sourceLang, targetLang) {
  const clean = String(text || '').trim();
  if (!clean) return '';
  if (sourceLang === targetLang) return clean;

  const srcCode = NMT_LANG_MAP[sourceLang] || 'am';
  const tgtCode = NMT_LANG_MAP[targetLang] || 'en';
  const cacheKey = `${srcCode}:${tgtCode}:${clean}`;
  if (nmtCache.has(cacheKey)) {
    return nmtCache.get(cacheKey);
  }

  const [response] = await translateClient.translateText({
    parent: `projects/${PROJECT_ID}/locations/us-central1`,
    contents: [clean],
    mimeType: 'text/plain',
    sourceLanguageCode: srcCode,
    targetLanguageCode: tgtCode
  });

  const translated = String(response?.translations?.[0]?.translatedText || '').trim();
  if (translated) {
    putNmtCache(cacheKey, translated);
  }
  return translated;
}

async function translateClauseWithGemini({
  sourceText,
  sourceLang,
  targetLang,
  recentSourceContext,
  recentTargetContext,
  modelId,
  timeoutMs
}) {
  const cleanSource = String(sourceText || '').trim();
  if (!cleanSource) return '';
  if (sourceLang === targetLang) return cleanSource;

  const specKey = ALLOWED_MODELS[modelId] ? modelId : 'gemini-2.5-flash';
  const spec = ALLOWED_MODELS[specKey];
  const accessToken = await getVertexAccessToken();

  const endpointHost =
    spec.location === 'global'
      ? 'https://aiplatform.googleapis.com'
      : `https://${spec.location}-aiplatform.googleapis.com`;
  const url = `${endpointHost}/v1/projects/${PROJECT_ID}/locations/${spec.location}/publishers/google/models/${specKey}:generateContent`;

  let ctxBlock = '';
  if (recentSourceContext && recentSourceContext.length > 0) {
    ctxBlock += `Preceding spoken clauses (already shown — do NOT repeat): "${recentSourceContext.slice(-2).join(' | ')}"\n`;
  }
  if (recentTargetContext && recentTargetContext.length > 0) {
    ctxBlock += `Preceding displayed captions (continue naturally from this if part of same sentence): "${recentTargetContext.slice(-2).join(' | ')}"\n`;
  }

  const prompt = `${ctxBlock}Current spoken clause (${LANG_NAMES[sourceLang] || sourceLang}): "${cleanSource}"
Translate ONLY this current clause into natural ${LANG_NAMES[targetLang] || targetLang}:`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-goog-user-project': PROJECT_ID
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: TARGUMA_CLAUSE_SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 160,
        responseMimeType: 'application/json',
        responseSchema: CLAUSE_SCHEMA,
        thinkingConfig: spec.thinkingConfig
      }
    }),
    signal: AbortSignal.timeout(timeoutMs || GEMINI_CLAUSE_DEADLINE_MS)
  });

  if (!resp.ok) return '';
  const data = await resp.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const textPart = parts.find((p) => typeof p.text === 'string' && !p.thought) || parts[parts.length - 1];
  if (!textPart?.text) return '';
  try {
    const parsed = JSON.parse(textPart.text);
    return String(parsed.translatedText || '').trim();
  } catch (_) {
    return '';
  }
}

/**
 * Single-shot immutable clause translation:
 * Fires Vertex AI Gemini Flash (`thinkingBudget: 0`) AND Cloud Translation V3 in parallel!
 * Returns ONE authoritative, liturgically formatted clause in ~550-650ms so displayed captions NEVER mutate.
 */
async function translateImmutableClause({
  sourceText,
  sourceLang,
  targetLang,
  recentSourceContext,
  recentTargetContext,
  modelId,
  enablePolish
}) {
  const cleanSource = String(sourceText || '').trim();
  if (!cleanSource) return { translatedText: '', polished: false, translateMs: 0 };
  if (sourceLang === targetLang) {
    return { translatedText: cleanSource, polished: true, translateMs: 0 };
  }

  const t0 = Date.now();
  const nmtPromise = fastCloudTranslate(cleanSource, sourceLang, targetLang).catch(() => '');

  if (!enablePolish) {
    const nmtText = await nmtPromise;
    return { translatedText: nmtText, polished: false, translateMs: Date.now() - t0 };
  }

  const geminiPromise = translateClauseWithGemini({
    sourceText: cleanSource,
    sourceLang,
    targetLang,
    recentSourceContext,
    recentTargetContext,
    modelId,
    timeoutMs: GEMINI_CLAUSE_DEADLINE_MS
  }).catch(() => '');

  const geminiText = await geminiPromise;
  if (geminiText) {
    return { translatedText: geminiText, polished: true, translateMs: Date.now() - t0 };
  }

  const fallbackNmt = await nmtPromise;
  return { translatedText: fallbackNmt, polished: false, translateMs: Date.now() - t0 };
}

// Compute RMS of 16-bit signed little-endian PCM buffer
function computePcm16Rms(buf) {
  if (!buf || buf.length < 2) return 0;
  const sampleCount = Math.floor(buf.length / 2);
  let sumSq = 0;
  for (let i = 0; i < sampleCount * 2; i += 2) {
    const s = buf.readInt16LE(i) / 32768;
    sumSq += s * s;
  }
  return Math.sqrt(sumSq / sampleCount);
}

/**
 * Finds a confident, syntactically natural clause boundary inside continuous run-on speech
 * while holding back at least `rightGuardWords` at the leading edge so USM bidirectional
 * attention has already stabilized the prefix we commit.
 */
function findConfidentClauseSplitIndex(uncommittedText, isFinal = false) {
  const trimmed = String(uncommittedText || '').trim();
  if (!trimmed) return -1;

  // Tokenize with character offsets so we can slice exact substrings cleanly
  const tokens = [];
  const tokenRegex = /\S+/g;
  let m;
  while ((m = tokenRegex.exec(trimmed)) !== null) {
    tokens.push({
      word: m[0],
      clean: m[0].replace(/^[«"'(]+|[።፤፣?!.;:»"')]+$/g, '').toLowerCase(),
      start: m.index,
      end: m.index + m[0].length
    });
  }

  const rightGuard = isFinal ? 0 : 3;
  const minClauseWords = 5;
  const maxSafeWordIdx = tokens.length - rightGuard - 1; // inclusive index of last safe word

  // Need enough words to form a meaningful clause plus right-edge stability guard
  if (isFinal && tokens.length <= 10) return -1;
  if (!isFinal && tokens.length < 10) return -1;
  if (maxSafeWordIdx < minClauseWords - 1) return -1;

  const upperSearchIdx = Math.min(maxSafeWordIdx, 11);

  // 1. Prefer Ethiopic or Latin clause/sentence punctuation (`።`, `፤`, `፣`, `,`, `.`, `;`, `:`, `?`, `!`)
  for (let i = minClauseWords - 1; i <= upperSearchIdx; i++) {
    if (/[።፤፣?!.;:]$/.test(tokens[i].word)) {
      const remaining = tokens.length - (i + 1);
      if (!isFinal || remaining >= 4) {
        return tokens[i].end;
      }
    }
  }

  // 2. Prefer Amharic/Tigrinya clause-ending verbs/converbs/postpositions or splitting right before a conjunction/discourse starter
  for (let i = minClauseWords - 1; i <= upperSearchIdx; i++) {
    const remaining = tokens.length - (i + 1);
    if (isFinal && remaining < 4) break;

    if (CLAUSE_ENDER_WORDS.has(tokens[i].clean)) {
      return tokens[i].end;
    }
    if (i + 1 < tokens.length && CLAUSE_STARTER_WORDS.has(tokens[i + 1].clean)) {
      return tokens[i].end;
    }
  }

  // 3. Fallback for unbroken rapid run-on speech (>= 12 words interim, or >= 13 words final): split cleanly at 8 words
  if ((!isFinal && tokens.length >= 12) || (isFinal && tokens.length >= 13)) {
    const splitWordIdx = Math.min(7, maxSafeWordIdx);
    return tokens[splitWordIdx].end;
  }

  return -1;
}

// Extract partial "translatedText" value from an incomplete streaming JSON string (for HTTP SSE audio endpoint)
function extractPartialJsonField(rawPartialJson, fieldName) {
  const marker = `"${fieldName}"`;
  const keyIdx = rawPartialJson.indexOf(marker);
  if (keyIdx < 0) return '';
  const colonIdx = rawPartialJson.indexOf(':', keyIdx + marker.length);
  if (colonIdx < 0) return '';
  const firstQuote = rawPartialJson.indexOf('"', colonIdx + 1);
  if (firstQuote < 0) return '';

  let out = '';
  let escaped = false;
  for (let i = firstQuote + 1; i < rawPartialJson.length; i++) {
    const ch = rawPartialJson[i];
    if (escaped) {
      if (ch === 'n') out += '\n';
      else if (ch === 't') out += '\t';
      else if (ch === '"') out += '"';
      else if (ch === '\\') out += '\\';
      else out += ch;
      escaped = false;
    } else if (ch === '\\') {
      escaped = true;
    } else if (ch === '"') {
      break;
    } else {
      out += ch;
    }
  }
  return out.trim();
}

// ============================================================================
// HTTP Handler: /healthz and /targumaGemini (Unary JSON + Streaming SSE + Fast NMT)
// ============================================================================
async function callVertexGemini({ modelId, location, parts, thinkingConfig, stream = false, timeoutMs = 4500 }) {
  const accessToken = await getVertexAccessToken();
  const endpointHost =
    location === 'global'
      ? 'https://aiplatform.googleapis.com'
      : `https://${location}-aiplatform.googleapis.com`;
  const method = stream ? 'streamGenerateContent?alt=sse' : 'generateContent';
  const url = `${endpointHost}/v1/projects/${PROJECT_ID}/locations/${location}/publishers/google/models/${modelId}:${method}`;

  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'x-goog-user-project': PROJECT_ID
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: TARGUMA_CONCISE_SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 220,
        responseMimeType: 'application/json',
        responseSchema: TARGUMA_RESPONSE_SCHEMA,
        thinkingConfig
      }
    }),
    signal: AbortSignal.timeout(timeoutMs)
  });
}

async function handleTargumaHttp(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/healthz' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'targuma-stream', mode: 'immutable-clause-v3', speechLocation: SPEECH_LOCATION }));
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const chunks = [];
  for await (const c of req) chunks.push(c);
  let body = {};
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch (_) {
    body = {};
  }

  const requestedModel = ALLOWED_MODELS[body.model] ? body.model : 'gemini-2.5-flash';
  const modelSpec = ALLOWED_MODELS[requestedModel];
  const sourceLang = LANG_NAMES[body.sourceLang] ? body.sourceLang : 'am';
  const targetLang = LANG_NAMES[body.targetLang] ? body.targetLang : 'en';
  const wantStream = Boolean(body.stream);
  const mode = String(body.mode || 'gemini');
  const recentContext = Array.isArray(body.recentContext)
    ? body.recentContext.slice(-3).join(' | ')
    : String(body.recentContext || '');
  const textInput = String(body.text || '').trim();
  const audioBase64 = String(body.audioBase64 || '').trim();
  const mimeType = String(body.mimeType || 'audio/wav').trim();

  if (!textInput && !audioBase64) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Either text or audioBase64 is required.' }));
    return;
  }

  const startMs = Date.now();

  // Fast Cloud Translate V3 path for instant text retranslation
  if (mode === 'nmt' && textInput && !audioBase64) {
    try {
      const translatedText = await fastCloudTranslate(textInput, sourceLang, targetLang);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        model: 'cloud-translate-v3',
        latencyMs: Date.now() - startMs,
        isSilence: false,
        sourceText: textInput,
        translatedText
      }));
      return;
    } catch (_) {
      // Fall through to Gemini on NMT error
    }
  }

  const parts = [];
  const ctxSuffix = recentContext ? '\nPreceding context (do NOT repeat): "' + recentContext + '"' : '';
  if (audioBase64) {
    parts.push({ inlineData: { mimeType, data: audioBase64 } });
    parts.push({
      text: 'Transcribe ' + LANG_NAMES[sourceLang] + ' speech and translate into ' + LANG_NAMES[targetLang] + ' as one clear, natural clause.' + ctxSuffix
    });
  } else {
    parts.push({
      text: 'Translate spoken EOTC clause from ' + LANG_NAMES[sourceLang] + ' into ' + LANG_NAMES[targetLang] + '.' + ctxSuffix + '\nClause: "' + textInput + '"'
    });
  }

  const attempts = [
    { modelId: requestedModel, location: modelSpec.location, thinkingConfig: modelSpec.thinkingConfig, timeoutMs: 4500 },
    ...modelSpec.fallbackChain.map((fb) => ({ ...fb, timeoutMs: 4500 }))
  ];

  // Streaming SSE path
  if (wantStream) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    let streamResp = null;
    let activeModelUsed = requestedModel;
    for (const attempt of attempts) {
      try {
        const resp = await callVertexGemini({ ...attempt, parts, stream: true });
        if (resp.ok && resp.body) {
          streamResp = resp;
          activeModelUsed = attempt.modelId;
          break;
        }
      } catch (_) {}
    }

    if (!streamResp || !streamResp.body) {
      const emptyDone = JSON.stringify({
        type: 'done',
        isSilence: true,
        sourceText: '',
        translatedText: '',
        latencyMs: Date.now() - startMs
      });
      res.write('data: ' + emptyDone + '\n\n');
      res.end();
      return;
    }

    let accumulatedJson = '';
    let lastEmittedDraft = '';
    let sseBuffer = '';
    const decoder = new TextDecoder();

    try {
      for await (const chunk of streamResp.body) {
        sseBuffer += decoder.decode(chunk, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payloadStr = trimmed.slice(5).trim();
          if (!payloadStr || payloadStr === '[DONE]') continue;
          try {
            const evt = JSON.parse(payloadStr);
            const cParts = evt?.candidates?.[0]?.content?.parts || [];
            for (const p of cParts) {
              if (typeof p.text === 'string' && !p.thought) {
                accumulatedJson += p.text;
              }
            }
            if (accumulatedJson.includes('"isSilence":true') || accumulatedJson.includes('"isSilence": true')) {
              continue;
            }
            const partialTarget = extractPartialJsonField(accumulatedJson, 'translatedText');
            if (partialTarget) {
              lastEmittedDraft = partialTarget;
            }
          } catch (_) {}
        }
      }
    } catch (_) {}

    let parsed = { isSilence: false, sourceText: textInput, translatedText: lastEmittedDraft };
    try {
      parsed = JSON.parse(accumulatedJson || '{}');
    } catch (_) {}

    const finalPayload = JSON.stringify({
      type: 'done',
      model: activeModelUsed,
      latencyMs: Date.now() - startMs,
      isSilence: Boolean(parsed.isSilence),
      sourceText: String(parsed.sourceText || textInput || '').trim(),
      translatedText: String(parsed.translatedText || lastEmittedDraft || '').trim()
    });
    res.write('data: ' + finalPayload + '\n\n');
    res.end();
    return;
  }

  // Standard Unary JSON path
  let vertexResp = null;
  let activeModelUsed = requestedModel;
  for (const attempt of attempts) {
    try {
      const resp = await callVertexGemini({ ...attempt, parts, stream: false });
      if (resp.ok) {
        vertexResp = resp;
        activeModelUsed = attempt.modelId;
        break;
      }
    } catch (_) {}
  }

  if (!vertexResp || !vertexResp.ok) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      model: activeModelUsed,
      latencyMs: Date.now() - startMs,
      isSilence: true,
      sourceText: '',
      translatedText: '',
      transientRetryExhausted: true
    }));
    return;
  }

  const vertexData = await vertexResp.json();
  const cParts = vertexData?.candidates?.[0]?.content?.parts || [];
  const textPart = cParts.find((p) => typeof p.text === 'string' && !p.thought) || cParts[cParts.length - 1];
  let parsed = { isSilence: false, sourceText: textInput, translatedText: '' };
  try {
    parsed = JSON.parse(textPart?.text || '{}');
  } catch (_) {}

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    model: activeModelUsed,
    latencyMs: Date.now() - startMs,
    isSilence: Boolean(parsed.isSilence),
    sourceText: String(parsed.sourceText || textInput || '').trim(),
    translatedText: String(parsed.translatedText || '').trim(),
    usage: vertexData?.usageMetadata || {}
  }));
}

// ============================================================================
// WebSocket Handler: Confident Clause-by-Clause Chirp 3 USM + Single-Shot Gemini Polish
// ============================================================================
function attachChirp3WebSocketServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    let sourceLang = 'am';
    let targetLang = 'en';
    let sampleRate = 16000;
    let modelId = 'gemini-2.5-flash';
    let enablePolish = true;
    let isClosed = false;

    let activeSession = null;
    const drainingSessions = new Set();
    let idleCloseTimer = null;

    // 200ms quiet/lookbehind buffer (2 frames @ 16kHz Int16 = 6400 bytes) for clean stream handoffs
    let recentPcmFrames = [];
    const MAX_LOOKBEHIND_FRAMES = 2;

    // Monotonic clause sequence allocator + serialized emitter so clauses always arrive in exact spoken order
    let nextClauseSeq = 0;
    let emitChain = Promise.resolve();
    let recentSourceClauses = [];
    let recentTargetClauses = [];

    // Adaptive prosodic breath-pause tracker
    let rollingSpeechRms = 0.045;

    function sendJson(payload) {
      if (!isClosed && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(payload));
        } catch (_) {}
      }
    }

    function pushRecentFrame(buf) {
      recentPcmFrames.push(buf);
      while (recentPcmFrames.length > MAX_LOOKBEHIND_FRAMES) {
        recentPcmFrames.shift();
      }
    }

    function enqueueClauseCommit(clauseSource) {
      const cleanSource = String(clauseSource || '').trim();
      if (!cleanSource || isClosed) return;

      const seq = ++nextClauseSeq;
      const segId = `clause_${Date.now().toString(36)}_${seq}`;

      // Serialize translation + emission along `emitChain` so consecutive clauses share exact preceding context
      // and always arrive at the viewer in strict chronological order without ever mutating afterward!
      emitChain = emitChain
        .then(async () => {
          if (isClosed) return;

          // Split extra-long final chunks if Chirp 3 flushed two clauses together
          const subClauses = [];
          let remaining = cleanSource;
          while (remaining) {
            const idx = findConfidentClauseSplitIndex(remaining, true);
            if (idx > 0) {
              subClauses.push(remaining.slice(0, idx).trim());
              remaining = remaining.slice(idx).trim();
            } else {
              subClauses.push(remaining);
              break;
            }
          }

          for (let i = 0; i < subClauses.length; i++) {
            const subSource = subClauses[i];
            if (!subSource || isClosed) continue;

            const subSegId = subClauses.length === 1 ? segId : `${segId}_${i + 1}`;
            const subSeq = subClauses.length === 1 ? seq : Number((seq + i * 0.01).toFixed(2));

            const result = await translateImmutableClause({
              sourceText: subSource,
              sourceLang,
              targetLang,
              recentSourceContext: recentSourceClauses.slice(-2),
              recentTargetContext: recentTargetClauses.slice(-2),
              modelId,
              enablePolish
            });

            if (result.translatedText && !isClosed) {
              recentSourceClauses.push(subSource);
              if (recentSourceClauses.length > 4) recentSourceClauses = recentSourceClauses.slice(-4);
              recentTargetClauses.push(result.translatedText);
              if (recentTargetClauses.length > 4) recentTargetClauses = recentTargetClauses.slice(-4);

              sendJson({
                type: 'commit',
                seq: subSeq,
                segmentId: subSegId,
                sourceText: subSource,
                translatedText: result.translatedText,
                polished: result.polished,
                nmtMs: result.translateMs
              });
            }
          }
        })
        .catch(() => {});
    }

    function writeAudioBufferSafe(stream, buf) {
      if (!stream || !buf || buf.length === 0) return;
      for (let offset = 0; offset < buf.length; offset += MAX_GRPC_AUDIO_BYTES) {
        const slice = buf.subarray(offset, Math.min(offset + MAX_GRPC_AUDIO_BYTES, buf.length));
        try {
          stream.write({ audio: slice });
        } catch (_) {}
      }
    }

    /**
     * Gracefully half-closes an active Chirp 3 stream at a breath pause so it emits its
     * authoritative `isFinal` transcript (~650ms) while a fresh stream immediately captures the next clause.
     */
    function flushSessionGracefully(session) {
      if (!session || session.flushed) return;
      session.flushed = true;
      if (activeSession === session) {
        activeSession = null;
      }
      drainingSessions.add(session);
      try {
        session.stream.end();
      } catch (_) {
        drainingSessions.delete(session);
      }
      // Safety cleanup if gRPC never closes
      setTimeout(() => {
        if (drainingSessions.has(session)) {
          drainingSessions.delete(session);
          try {
            session.stream.destroy();
          } catch (_) {}
        }
      }, 6000);
    }

    function forceCloseAllSessions() {
      if (idleCloseTimer) {
        clearTimeout(idleCloseTimer);
        idleCloseTimer = null;
      }
      if (activeSession) {
        const s = activeSession;
        activeSession = null;
        s.aborted = true;
        try {
          s.stream.removeAllListeners('error');
          s.stream.on('error', () => {});
          s.stream.end();
        } catch (_) {}
      }
      for (const s of drainingSessions) {
        s.aborted = true;
        try {
          s.stream.removeAllListeners('error');
          s.stream.on('error', () => {});
          s.stream.end();
        } catch (_) {}
      }
      drainingSessions.clear();
    }

    function refreshIdleTimer() {
      if (idleCloseTimer) clearTimeout(idleCloseTimer);
      idleCloseTimer = setTimeout(() => {
        if (activeSession) {
          flushSessionGracefully(activeSession);
        }
      }, STREAM_IDLE_CLOSE_MS);
    }

    function openChirp3Session(seedWithLookbehind = false) {
      const bcp47 = CHIRP3_LANG_MAP[sourceLang];
      if (!bcp47) {
        sendJson({
          type: 'fallback_required',
          reason: `Locale ${sourceLang} uses Gemini SSE clause pipeline`
        });
        return null;
      }

      const stream = speechClient._streamingRecognize({
        otherArgs: {
          headers: {
            'x-goog-request-params': `recognizer=${encodeURIComponent(SPEECH_RECOGNIZER)}`,
            'x-goog-user-project': PROJECT_ID
          }
        }
      });

      const session = {
        stream,
        openedAt: Date.now(),
        committedPrefixLen: 0,
        maxRms: 0,
        spokenMs: 0,
        breathLowMs: 0,
        flushed: false,
        aborted: false
      };

      activeSession = session;

      stream.on('data', (response) => {
        if (session.aborted || isClosed) return;

        for (const res of response.results || []) {
          const fullTranscript = String(res.alternatives?.[0]?.transcript || '').trim();
          if (!fullTranscript) continue;

          // Zero-hallucination guard: ignore stray ASR output if microphone energy was near digital zero
          if (session.maxRms < MIN_UTTERANCE_RMS) continue;

          if (fullTranscript.length < session.committedPrefixLen) {
            session.committedPrefixLen = 0;
          }

          let uncommitted = fullTranscript.slice(session.committedPrefixLen).trim();
          if (!uncommitted) continue;

          if (!res.isFinal) {
            // If speaker speaks non-stop without taking a breath, split confident syntactic prefix clauses cleanly
            while (uncommitted) {
              const splitIdx = findConfidentClauseSplitIndex(uncommitted, false);
              if (splitIdx <= 0) break;

              const prefixToCommit = uncommitted.slice(0, splitIdx).trim();
              uncommitted = uncommitted.slice(splitIdx).trim();

              const rawMatchIdx = fullTranscript.indexOf(prefixToCommit, session.committedPrefixLen);
              if (rawMatchIdx >= 0) {
                session.committedPrefixLen = rawMatchIdx + prefixToCommit.length;
              } else {
                session.committedPrefixLen += splitIdx;
              }

              if (prefixToCommit) {
                enqueueClauseCommit(prefixToCommit);
              }
            }
          } else {
            // Utterance or breath-segmented clause finalized by Chirp 3 USM
            session.committedPrefixLen = 0;
            session.spokenMs = 0;
            session.breathLowMs = 0;

            if (uncommitted) {
              enqueueClauseCommit(uncommitted);
            }

            if (activeSession === session && Date.now() - session.openedAt >= STREAM_SOFT_ROTATE_MS && !isClosed) {
              flushSessionGracefully(session);
            }
          }
        }
      });

      stream.on('error', (err) => {
        drainingSessions.delete(session);
        if (session.aborted || isClosed) return;
        console.warn('Chirp 3 session notice:', err.message);
        if (activeSession === session) {
          activeSession = null;
        }
        if (err.code === 3) {
          sendJson({ type: 'fallback_required', reason: err.message });
        }
      });

      stream.on('end', () => {
        drainingSessions.delete(session);
        if (activeSession === session) {
          activeSession = null;
        }
      });

      stream.write({
        recognizer: SPEECH_RECOGNIZER,
        streamingConfig: {
          config: {
            explicitDecodingConfig: {
              encoding: protos.google.cloud.speech.v2.ExplicitDecodingConfig.AudioEncoding.LINEAR16,
              sampleRateHertz: sampleRate,
              audioChannelCount: 1
            },
            languageCodes: [bcp47],
            model: 'chirp_3',
            features: {
              enableAutomaticPunctuation: true
            },
            denoiserConfig: {
              denoiseAudio: true,
              snrThreshold: 2.0
            }
          },
          streamingFeatures: {
            interimResults: true,
            enableVoiceActivityEvents: true
          }
        }
      });

      if (seedWithLookbehind && recentPcmFrames.length > 0) {
        for (const frame of recentPcmFrames) {
          writeAudioBufferSafe(stream, frame);
        }
      }

      refreshIdleTimer();
      return session;
    }

    ws.on('message', (data, isBinary) => {
      if (isClosed) return;

      if (!isBinary) {
        let msg = {};
        try {
          msg = JSON.parse(data.toString('utf8'));
        } catch (_) {
          return;
        }

        if (msg.type === 'ping') {
          sendJson({ type: 'pong', ts: msg.ts || Date.now() });
          return;
        }

        if (msg.type === 'start') {
          sourceLang = LANG_NAMES[msg.sourceLang] ? msg.sourceLang : 'am';
          targetLang = LANG_NAMES[msg.targetLang] ? msg.targetLang : 'en';
          sampleRate = Number(msg.sampleRate) || 16000;
          modelId = ALLOWED_MODELS[msg.model] ? msg.model : 'gemini-2.5-flash';
          enablePolish = msg.enablePolish !== false;

          const bcp47 = CHIRP3_LANG_MAP[sourceLang];
          if (!bcp47) {
            sendJson({ type: 'fallback_required', reason: 'Source language uses Gemini SSE clause pipeline' });
            return;
          }
          forceCloseAllSessions();
          openChirp3Session(false);
          sendJson({ type: 'ready', engine: 'chirp_3_immutable_clause', bcp47 });
          return;
        }

        if (msg.type === 'config') {
          const prevSource = sourceLang;
          if (msg.sourceLang && LANG_NAMES[msg.sourceLang]) sourceLang = msg.sourceLang;
          if (msg.targetLang && LANG_NAMES[msg.targetLang]) targetLang = msg.targetLang;
          if (msg.model && ALLOWED_MODELS[msg.model]) modelId = msg.model;
          if (typeof msg.enablePolish === 'boolean') enablePolish = msg.enablePolish;
          if (sourceLang !== prevSource) {
            forceCloseAllSessions();
            openChirp3Session(false);
          }
          return;
        }

        if (msg.type === 'flush') {
          if (activeSession) {
            flushSessionGracefully(activeSession);
          }
          return;
        }

        if (msg.type === 'stop') {
          if (activeSession && activeSession.spokenMs > 0) {
            flushSessionGracefully(activeSession);
          } else {
            forceCloseAllSessions();
          }
          return;
        }
        return;
      }

      // Binary 16kHz Int16LE PCM frame (typically 100ms = 3200 bytes)
      const pcmBuf = Buffer.isBuffer(data) ? data : Buffer.from(data);
      if (pcmBuf.length === 0) return;

      const frameDurationMs = (pcmBuf.length / 2 / sampleRate) * 1000;
      const rms = computePcm16Rms(pcmBuf);
      pushRecentFrame(pcmBuf);

      const adaptivePauseThreshold = Math.max(0.009, rollingSpeechRms * RELATIVE_PAUSE_RATIO);

      // Wake up from idle when voice starts
      if (!activeSession) {
        if (rms < MIN_UTTERANCE_RMS) return;
        openChirp3Session(true);
        if (!activeSession) return;
      } else if (Date.now() - activeSession.openedAt >= STREAM_HARD_ROTATE_MS) {
        flushSessionGracefully(activeSession);
        openChirp3Session(true);
      }

      if (rms > activeSession.maxRms) {
        activeSession.maxRms = rms;
      }

      writeAudioBufferSafe(activeSession.stream, pcmBuf);
      refreshIdleTimer();

      if (rms >= adaptivePauseThreshold) {
        rollingSpeechRms = rollingSpeechRms * 0.90 + rms * 0.10;
        activeSession.spokenMs += frameDurationMs;
        activeSession.breathLowMs = 0;
      } else if (activeSession.spokenMs > 0) {
        activeSession.breathLowMs += frameDurationMs;
      }

      // Prosodic Breath-Pause Endpoint:
      // Flush Chirp 3 ONLY during a genuine >= 200ms breath pause (never mid-word);
      // unbroken rapid speech is segmented syntactically in text space by findConfidentClauseSplitIndex.
      if (
        activeSession.spokenMs >= CLAUSE_MIN_SPEECH_MS &&
        activeSession.breathLowMs >= CLAUSE_BREATH_PAUSE_MS
      ) {
        flushSessionGracefully(activeSession);
        openChirp3Session(true);
      }
    });

    ws.on('close', () => {
      isClosed = true;
      forceCloseAllSessions();
    });

    ws.on('error', () => {
      isClosed = true;
      forceCloseAllSessions();
    });
  });
}

// Export pure helpers for unit testing while starting server when run directly
if (require.main === module) {
  const server = http.createServer((req, res) => {
    handleTargumaHttp(req, res).catch((err) => {
      console.error('HTTP handler error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    });
  });

  attachChirp3WebSocketServer(server);

  server.listen(PORT, () => {
    console.log(`Targuma Immutable-Clause Server listening on port ${PORT} (project=${PROJECT_ID}, speech=${SPEECH_LOCATION})`);
  });
}

module.exports = {
  findConfidentClauseSplitIndex,
  computePcm16Rms
};
