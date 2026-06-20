const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('prayers').where('reference', '==', 'Thursday Praise of Mary').get();
  const docs = [];
  snapshot.forEach(doc => {
    docs.push({ id: doc.id, stanza: doc.data().stanza, english: doc.data().english });
  });
  
  docs.sort((a, b) => a.stanza.localeCompare(b.stanza));
  for (const d of docs) {
    if (d.stanza === '1' || d.stanza === 'Intro') {
       console.log(`[${d.stanza}] ID: ${d.id} | ENG: ${d.english.substring(0, 30)}...`);
    }
  }
}
check().catch(console.error);
