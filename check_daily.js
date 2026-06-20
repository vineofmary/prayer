const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('prayers').where('reference', '==', 'Daily Prayer').get();
  console.log(`Found ${snapshot.size} documents for Daily Prayer.`);
  const counts = {};
  snapshot.forEach(doc => {
    const s = doc.data().stanza;
    counts[s] = (counts[s] || 0) + 1;
  });
  console.log(counts);
}
check().catch(console.error);
