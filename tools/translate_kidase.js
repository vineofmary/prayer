const fs = require('fs');
const { translate } = require('@vitalets/google-translate-api');
const path = require('path');

const kidaseFilePath = path.join(__dirname, '../app/src/main/assets/js/kidase.js');

async function main() {
    let content = fs.readFileSync(kidaseFilePath, 'utf8');
    const jsonStr = content.replace(/^const kidaseData = /, '').replace(/;?\s*$/, '');
    const data = JSON.parse(jsonStr);

    let count = 0;
    
    // Collect all items to translate
    const itemsToTranslate = [];
    
    for (const key of Object.keys(data)) {
        const arr = data[key];
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            
            // Skip if Spanish already exists and is non-empty
            if (item.spanish && item.spanish.trim() !== "") {
                continue;
            }

            let textToTranslate = item.english;
            let sourceLang = 'en';

            if (!textToTranslate || textToTranslate.trim() === "") {
                textToTranslate = item.amharic_script;
                sourceLang = 'am';
            }
            
            if (!textToTranslate || textToTranslate.trim() === "") {
                item.spanish = "";
                continue;
            }
            
            itemsToTranslate.push({ item, textToTranslate, sourceLang });
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

    const DELIMITER = "\n\n===###===\n\n";

    // Process in batches
    for (const lang of Object.keys(byLang)) {
        const entries = byLang[lang];
        if (entries.length === 0) continue;
        
        console.log(`Translating ${entries.length} items from ${lang}...`);
        
        const BATCH_SIZE = 15; // Safe batch size
        for (let i = 0; i < entries.length; i += BATCH_SIZE) {
            const batch = entries.slice(i, i + BATCH_SIZE);
            const combinedText = batch.map(e => e.textToTranslate.replace(/===###===/g, '')).join(DELIMITER);
            
            try {
                const res = await translate(combinedText, { from: lang, to: 'es' });
                // Note: The translate API sometimes messes with spacing around equals and hashes.
                // We use a regex that matches `===###===` with any possible spaces added by translation.
                const translatedParts = res.text.split(/\n*\s*=\s*=\s*=\s*#\s*#\s*#\s*=\s*=\s*=\s*\n*/).map(t => t.trim());
                
                for (let j = 0; j < batch.length; j++) {
                    if (translatedParts[j]) {
                        batch[j].item.spanish = translatedParts[j];
                    } else {
                        // Fallback
                        console.warn(`Missing part ${j} in batch! Using fallback for item.`);
                    }
                }
                count += batch.length;
                console.log(`Progress: ${count} / ${itemsToTranslate.length}`);
            } catch (err) {
                console.error(`Batch failed:`, err.message);
                // Fallback: individual translations for this batch
                console.log(`Falling back to individual translation for ${batch.length} items...`);
                for (let j = 0; j < batch.length; j++) {
                    try {
                        const indRes = await translate(batch[j].textToTranslate, { from: lang, to: 'es' });
                        batch[j].item.spanish = indRes.text;
                    } catch (e) {
                        console.error(`Individual translate failed: ${e.message}`);
                    }
                    await new Promise(r => setTimeout(r, 1000));
                }
                count += batch.length;
            }
            // Small delay to avoid rate limit
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    const output = `const kidaseData = ${JSON.stringify(data, null, 2)};\n`;
    fs.writeFileSync(kidaseFilePath, output, 'utf8');
    console.log(`Finished translating. File written successfully.`);
}

main().catch(console.error);
