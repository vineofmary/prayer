const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { TranslationServiceClient } = require("@google-cloud/translate");

admin.initializeApp();
const db = admin.firestore();
const translationClient = new TranslationServiceClient();

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
