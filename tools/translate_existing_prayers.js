const admin = require('firebase-admin');
const { TranslationServiceClient } = require('@google-cloud/translate');
const fs = require('fs');

// Path to your service account key
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

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

async function translateExisting() {
  console.log('Fetching all prayers from Firestore...');
  const snapshot = await db.collection('prayers').get();
  console.log(`Found ${snapshot.size} documents.`);

  const projectId = serviceAccount.project_id;
  const location = 'global';

  let count = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const translations = {};
    let needsUpdate = false;

    if (!data.english) continue;

    for (const [langKey, langCode] of Object.entries(AUTO_LANGUAGES)) {
      // 1. If content already exists, mark it as official (to protect it)
      if (data[langKey] && data[langKey].trim() !== '') {
        if (data[`${langKey}_is_official`] !== true) {
          translations[`${langKey}_is_official`] = true;
          needsUpdate = true;
        }
        continue;
      }

      // 2. If content is missing, translate it
      console.log(`Translating [${doc.id}] to ${langKey}...`);
      try {
        const request = {
          parent: `projects/${projectId}/locations/${location}`,
          contents: [data.english],
          mimeType: 'text/plain',
          sourceLanguageCode: 'en',
          targetLanguageCode: langCode,
        };

        const [response] = await translationClient.translateText(request);
        translations[langKey] = response.translations[0].translatedText;
        translations[`${langKey}_is_official`] = false; // Auto-translations are unofficial
        needsUpdate = true;
      } catch (error) {
        console.error(`Error translating [${doc.id}] to ${langKey}:`, error);
      }
    }

    if (needsUpdate) {
      await doc.ref.update(translations);
      count++;
      if (count % 10 === 0) {
        console.log(`Processed ${count} updates...`);
      }
    }
  }

  console.log('One-time translation complete!');
}

translateExisting().catch(console.error);
