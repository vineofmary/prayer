const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const filesToMigrate = [
    { path: 'app/src/main/assets/js/prayers.js', varName: 'prayers' },
    { path: 'app/src/main/assets/js/songs.js', varName: 'songs' },
    { path: 'app/src/main/assets/js/servants.js', varName: 'servantsPrayers' }
];

async function migrate() {
    for (const fileInfo of filesToMigrate) {
        console.log(`Reading ${fileInfo.path}...`);
        const filePath = path.join(__dirname, fileInfo.path);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${fileInfo.path}. Skipping...`);
            continue;
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Improved extraction: Find the first '[' and the last ']'
        const startIndex = fileContent.indexOf('[');
        const endIndex = fileContent.lastIndexOf(']');
        
        if (startIndex === -1 || endIndex === -1) {
            console.error(`Could not find the array in ${fileInfo.path}. Skipping...`);
            continue;
        }

        const jsonString = fileContent.substring(startIndex, endIndex + 1);
        let data;
        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.log(`Failed to parse JSON from ${fileInfo.path}. Attempting eval fallback...`);
            try {
                // Use a safe evaluation by wrapping in parentheses
                data = eval('(' + jsonString + ')');
            } catch (evalErr) {
                console.error(`Eval fallback failed for ${fileInfo.path}:`, evalErr);
                continue;
            }
        }

        if (!Array.isArray(data)) {
            console.error(`Data in ${fileInfo.path} is not an array. Skipping...`);
            continue;
        }

        console.log(`Found ${data.length} stanzas in ${fileInfo.path}. Migrating...`);

        const batchSize = 400;
        for (let i = 0; i < data.length; i += batchSize) {
            const batch = db.batch();
            const chunk = data.slice(i, i + batchSize);

            chunk.forEach(item => {
                const chapter = item.chapter || 'Servant';
                const stanza = item.stanza || item.title || 'stanza';
                const ref = item.reference || 'ref';
                const english = item.english || '';
                
                // Create a content hash to ensure uniqueness even if metadata is identical
                const contentHash = Buffer.from(english).toString('base64').substring(0, 10);
                
                const docId = `${chapter}_${stanza}_${ref}_${contentHash}`.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
                const docRef = db.collection('prayers').doc(docId);
                
                batch.set(docRef, {
                    ...item,
                    status: 'published',
                    lastMigratedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            });

            await batch.commit();
            console.log(`  Progress: ${i + chunk.length} / ${data.length}`);
        }
    }

    console.log('All Migrations Complete!');
}

migrate().catch(console.error);
