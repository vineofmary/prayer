const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. Path to your Service Account Key
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. Load the prayers from your JS file
// Note: Since prayers.js is a client-side file using 'const prayers = [...]', 
// we'll do a simple regex/string read to get the JSON data.
async function migrate() {
    console.log('Reading prayers.js...');
    const filePath = path.join(__dirname, 'app/src/main/assets/js/prayers.js');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extract the array from the JS file
    const jsonString = fileContent.replace('const prayers = ', '').replace(/;$/, '').trim();
    const prayers = JSON.parse(jsonString);

    console.log(`Found ${prayers.length} stanzas. Starting migration...`);

    const batchSize = 400;
    for (let i = 0; i < prayers.length; i += batchSize) {
        const batch = db.batch();
        const chunk = prayers.slice(i, i + batchSize);

        chunk.forEach(prayer => {
            // Create a unique ID for the document: chapter_stanza
            const docId = `${prayer.chapter}_${prayer.stanza}_${prayer.reference}`.replace(/[^a-zA-Z0-9]/g, '_');
            const docRef = db.collection('prayers').doc(docId);
            
            batch.set(docRef, {
                ...prayer,
                status: 'published',
                lastMigratedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });

        await batch.commit();
        console.log(`Migrated ${i + chunk.length} / ${prayers.length}`);
    }

    console.log('Migration Complete!');
}

migrate().catch(console.error);
