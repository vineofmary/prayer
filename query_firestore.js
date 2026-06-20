const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('prayers').where('reference', '==', 'Thursday Praise of Mary').get();
  console.log(`Found ${snapshot.size} documents.`);
  
  const docs = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    docs.push({ id: doc.id, stanza: data.stanza, english: data.english, geez: data.geez_script });
  });
  
  // count by stanza
  const counts = {};
  docs.forEach(d => {
    counts[d.stanza] = (counts[d.stanza] || 0) + 1;
  });
  console.log(counts);
}
check().catch(console.error);
