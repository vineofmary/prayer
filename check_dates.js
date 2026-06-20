const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function check() {
  const snapshot = await db.collection('prayers').where('reference', '==', 'Thursday Praise of Mary').get();
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(doc.id, data.lastMigratedAt ? data.lastMigratedAt.toDate().toISOString() : 'No migrated at');
  });
}
check().catch(console.error);
