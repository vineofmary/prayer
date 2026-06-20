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

const TARGET_LANGS = {
  'french': 'fr',
  'arabic': 'ar',
  'greek': 'el',
  'hebrew': 'he',
  'malayalam': 'ml'
};

async function main() {
    let content = fs.readFileSync(kidaseFilePath, 'utf8');
    const jsonStr = content.replace(/^const kidaseData = /, '').replace(/;?\s*$/, '');
    const data = JSON.parse(jsonStr);

    let count = 0;

    const projectId = serviceAccount.project_id;
    const location = 'global';

    for (const [langKey, targetLangCode] of Object.entries(TARGET_LANGS)) {
        console.log(`\nStarting translations for: ${langKey} (${targetLangCode})`);
        
        const itemsToTranslate = [];
        
        // Collect all items to translate
        for (const key of Object.keys(data)) {
            const arr = data[key];
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                
                // Skip if translation already exists and is non-empty
                if (item[langKey] && item[langKey].trim() !== "") {
                    continue;
                }

                let textToTranslate = item.english;

                // Only translate if English text exists
                if (!textToTranslate || textToTranslate.trim() === "") {
                    // Ensure empty string
                    item[langKey] = "";
                    continue;
                }
                
                itemsToTranslate.push({ item, textToTranslate, sourceLang: 'en' });
            }
        }

        console.log(`Found ${itemsToTranslate.length} items to translate to ${langKey}.`);

        if (itemsToTranslate.length === 0) continue;

        const BATCH_SIZE = 50;
        let langCount = 0;
        
        for (let i = 0; i < itemsToTranslate.length; i += BATCH_SIZE) {
            const batch = itemsToTranslate.slice(i, i + BATCH_SIZE);
            const contents = batch.map(e => e.textToTranslate);
            
            const request = {
                parent: `projects/${projectId}/locations/${location}`,
                contents: contents,
                mimeType: 'text/plain',
                sourceLanguageCode: 'en',
                targetLanguageCode: targetLangCode,
            };

            try {
                const [response] = await translationClient.translateText(request);
                for (let j = 0; j < batch.length; j++) {
                    batch[j].item[langKey] = response.translations[j].translatedText;
                }
                langCount += batch.length;
                count += batch.length;
                console.log(`Progress for ${langKey}: ${langCount} / ${itemsToTranslate.length}`);
                
                // Sleep for 5 seconds to avoid hitting the strict characters-per-minute quota
                await new Promise(r => setTimeout(r, 5000));
            } catch (err) {
                console.error(`Batch translation failed for ${langKey}:`, err);
                break;
            }
        }
    }

    const output = `const kidaseData = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(kidaseFilePath, output, 'utf8');
    console.log(`\nFinished translating ${count} items total. File written successfully.`);
}

main().catch(console.error);
