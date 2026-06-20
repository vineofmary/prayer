const fs = require('fs');
const path = require('path');
const { TranslationServiceClient } = require('@google-cloud/translate');

// Use the service account from the root directory
const serviceAccount = require('../service-account.json');

const translationClient = new TranslationServiceClient({
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  },
  projectId: serviceAccount.project_id
});

const kidaseFilePath = path.join(__dirname, '../app/src/main/assets/js/kidase.js');

async function main() {
    let content = fs.readFileSync(kidaseFilePath, 'utf8');
    const jsonStr = content.replace(/^const kidaseData = /, '').replace(/;?\s*$/, '');
    const data = JSON.parse(jsonStr);

    let count = 0;
    const itemsToTranslate = [];

    // Collect all items to translate
    for (const key of Object.keys(data)) {
        const arr = data[key];
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            
            // Skip if Spanish already exists and is non-empty
            if (item.spanish && item.spanish.trim() !== "") {
                continue;
            }

            let textToTranslate = item.english;

            // Only translate if English text exists
            if (!textToTranslate || textToTranslate.trim() === "") {
                // If it doesn't have English, ensure spanish is empty string
                item.spanish = "";
                continue;
            }
            
            itemsToTranslate.push({ item, textToTranslate, sourceLang: 'en' });
        }
    }

    console.log(`Found ${itemsToTranslate.length} items to translate.`);

    // Group by sourceLang
    const byLang = { 'en': [], 'am': [] };
    for (const entry of itemsToTranslate) {
        if (byLang[entry.sourceLang]) {
            byLang[entry.sourceLang].push(entry);
        }
    }

    const projectId = serviceAccount.project_id;
    const location = 'global';

    for (const lang of Object.keys(byLang)) {
        const entries = byLang[lang];
        if (entries.length === 0) continue;
        
        console.log(`Translating ${entries.length} items from ${lang} to Spanish...`);
        
        const BATCH_SIZE = 100;
        for (let i = 0; i < entries.length; i += BATCH_SIZE) {
            const batch = entries.slice(i, i + BATCH_SIZE);
            const contents = batch.map(e => e.textToTranslate);
            
            const request = {
                parent: `projects/${projectId}/locations/${location}`,
                contents: contents,
                mimeType: 'text/plain',
                sourceLanguageCode: lang,
                targetLanguageCode: 'es',
            };

            try {
                const [response] = await translationClient.translateText(request);
                for (let j = 0; j < batch.length; j++) {
                    batch[j].item.spanish = response.translations[j].translatedText;
                }
                count += batch.length;
                console.log(`Progress: ${count} / ${itemsToTranslate.length}`);
            } catch (err) {
                console.error(`Batch translation failed:`, err);
                break;
            }
        }
    }

    const output = `const kidaseData = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(kidaseFilePath, output, 'utf8');
    console.log(`Finished translating ${count} items. File written successfully.`);
}

main().catch(console.error);
