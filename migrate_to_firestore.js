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
        let data;
        try {
            // Flexible evaluation to handle JS variables
            const scriptToEval = fileContent.replace(`const ${fileInfo.varName}`, 'data') + '; data;';
            data = eval(scriptToEval);
        } catch (e) {
            console.error(`Failed to evaluate ${fileInfo.path}:`, e);
            continue;
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
                // Ensure every item has a chapter and stanza for the ID
                const chapter = item.chapter || 'Servant';
                const stanza = item.stanza || item.title || 'stanza';
                const ref = item.reference || 'ref';
                
                const docId = `${chapter}_${stanza}_${ref}`.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 100);
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
