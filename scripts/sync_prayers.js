import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
let serviceAccount = null;
const localServiceAccountPath = path.resolve(__dirname, '../service-account.json');

if (fs.existsSync(localServiceAccountPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(localServiceAccountPath, 'utf8'));
  } catch (error) {
    console.error('Error reading local service-account.json:', error);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT secret:', error);
  }
}

if (!serviceAccount) {
  console.warn('⚠️  No valid Firebase Service Account credentials found.');
  console.warn('   Ensure FIREBASE_SERVICE_ACCOUNT is set in GitHub Repository Secrets,');
  console.warn('   or place service-account.json in the repository root for local execution.');
  if (process.env.CI) {
    console.log('Skipping sync in CI environment gracefully to prevent false-alarm workflow failures.');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

const EXTRA_LANGUAGES = [
  'french', 'arabic', 'greek', 'hebrew', 'malayalam', 'oromoo', 'syriac', 'armenian', 'coptic'
];

const STANDARD_FIELDS = [
  'instruction', 'reference', 'chapter', 'stanza', 'english',
  'geez_script', 'geez_phonetic', 'amharic_script', 'amharic_phonetic',
  'tigrinya_script', 'tigrinya_phonetic', 'spanish'
];

function getUniqueKey(p) {
  const chapter = (p.chapter || '').trim();
  const stanza = String(p.stanza || '').trim();
  const ref = (p.reference || '').trim();
  const text = (p.english || p.geez_script || p.geez_phonetic || '').trim();
  return `${chapter}||${stanza}||${ref}||${text}`;
}

async function syncPrayers() {
  try {
    const outputPath = path.resolve(__dirname, '../app/src/main/assets/js/prayers.js');
    const publicOutputPath = path.resolve(__dirname, '../public/js/prayers.js');
    const checksumsPath = path.resolve(__dirname, '../docs/liturgy_checksums.json');

    console.log('Reading local prayers.js...');
    const fileContent = fs.readFileSync(outputPath, 'utf8');
    const arrayContent = fileContent.replace(/^[\s\S]*?const prayers = /, '').replace(/;\s*$/, '');

    let localPrayers = [];
    try {
      localPrayers = eval('(' + arrayContent + ')');
    } catch (e) {
      console.error('Could not parse local prayers.js', e);
      process.exit(1);
    }

    console.log(`Parsed ${localPrayers.length} local prayers.`);

    // Reorder Thurs to come between Wed and Fri if it's currently at the end
    const wedIndex = localPrayers.findLastIndex(p => p.chapter === 'Wed');
    const thursIndex = localPrayers.findIndex(p => p.chapter === 'Thurs');
    if (wedIndex !== -1 && thursIndex !== -1 && thursIndex > wedIndex) {
      console.log('Reordering Thursday Praise of Mary to sit between Wednesday and Friday...');
      const thursPrayers = localPrayers.filter(p => p.chapter === 'Thurs');
      const withoutThurs = localPrayers.filter(p => p.chapter !== 'Thurs');
      const newWedIndex = withoutThurs.findLastIndex(p => p.chapter === 'Wed');

      withoutThurs.splice(newWedIndex + 1, 0, ...thursPrayers);
      localPrayers = withoutThurs;
    }

    console.log('Fetching published prayers from Firestore...');
    const snapshot = await db.collection('prayers').where('status', '==', 'published').get();

    if (snapshot.empty) {
      console.log('No published prayers found. No changes made.');
      process.exit(0);
    }

    console.log(`Found ${snapshot.size} published prayers in Firestore.`);

    // Build lookup map using exact unique content key
    const firestoreByContent = new Map();
    snapshot.forEach(doc => {
      const data = doc.data();
      const key = getUniqueKey(data);
      if (!firestoreByContent.has(key)) {
        firestoreByContent.set(key, data);
      }
    });

    let updatedCount = 0;
    localPrayers.forEach(prayer => {
      const key = getUniqueKey(prayer);
      const fsData = firestoreByContent.get(key);

      if (!fsData) return;

      let changed = false;

      // Only update standard fields if Firestore has non-empty content
      STANDARD_FIELDS.forEach(field => {
        if (field === 'reference' || field === 'chapter' || field === 'stanza' || field === 'english') return;

        const fsVal = (fsData[field] || '').trim();
        const localVal = (prayer[field] || '').trim();

        // Never overwrite a non-empty local value with an empty Firestore value
        if (fsVal && fsVal !== localVal) {
          // Safeguard: do not overwrite geez_phonetic or geez_script if FS value is significantly shorter/incomplete
          if ((field === 'geez_phonetic' || field === 'geez_script') && localVal && fsVal.length < localVal.length * 0.7) {
            console.log(`Skipping ${field} update for ${prayer.chapter} ${prayer.stanza} - FS value appears incomplete.`);
            return;
          }

          prayer[field] = fsData[field];
          changed = true;
        }
      });

      // Handle extra languages ONLY for Trinitarian Invocation
      const isTrinitarian = prayer.reference && prayer.reference.includes('Trinitarian Invocation');
      if (isTrinitarian) {
        EXTRA_LANGUAGES.forEach(field => {
          const fsVal = (fsData[field] || '').trim();
          if (fsVal && prayer[field] !== fsData[field]) {
            prayer[field] = fsData[field];
            changed = true;
          }
        });
      } else {
        // Strip any extra languages from non-Trinitarian prayers in prayers.js
        EXTRA_LANGUAGES.forEach(field => {
          if (prayer.hasOwnProperty(field)) {
            delete prayer[field];
            changed = true;
          }
        });
      }

      // Merge _is_official flags
      Object.keys(fsData).forEach(k => {
        if (k.endsWith('_is_official')) {
          const lang = k.replace('_is_official', '');
          if (STANDARD_FIELDS.includes(lang) || (isTrinitarian && EXTRA_LANGUAGES.includes(lang))) {
            if (prayer[k] !== fsData[k]) {
              prayer[k] = fsData[k];
              changed = true;
            }
          }
        }
      });

      if (changed) updatedCount++;
    });

    if (updatedCount === 0) {
      console.log('All local prayers are already up-to-date with Firestore published prayers. No changes needed.');
      process.exit(0);
    }

    console.log(`Updated ${updatedCount} prayers from Firestore.`);

    let newFileContent = `// The source of truth for all these prayers is the open-source Orthodox Liturgy Liturgy database:\n`;
    newFileContent += `// https://docs.google.com/spreadsheets/d/1rkagFuBr3T6wtZ6muVhcN18VW9laFTJwBfi5cS3vnUk/edit?usp=sharing\n`;
    newFileContent += `const prayers = [\n`;

    const prayerStrings = localPrayers.map(p => {
      const isTrinitarian = p.reference && p.reference.includes('Trinitarian Invocation');
      const allowedFields = isTrinitarian ? [...STANDARD_FIELDS, ...EXTRA_LANGUAGES] : STANDARD_FIELDS;

      const entries = [];
      allowedFields.forEach(field => {
        if (p.hasOwnProperty(field)) {
          const val = String(p[field] || '').replace(/`/g, '\\`');
          entries.push(`    "${field}": \`${val}\``);
        }
      });

      // Include relevant _is_official flags
      Object.keys(p).forEach(key => {
        if (key.endsWith('_is_official')) {
          const lang = key.replace('_is_official', '');
          if (allowedFields.includes(lang)) {
            entries.push(`    "${key}": ${p[key]}`);
          }
        }
      });

      return `  {\n${entries.join(',\n')}\n  }`;
    });

    newFileContent += prayerStrings.join(',\n');
    newFileContent += `\n];\n`;

    fs.writeFileSync(outputPath, newFileContent, 'utf8');
    console.log(`Successfully wrote ${localPrayers.length} prayers to ${outputPath}.`);

    if (fs.existsSync(publicOutputPath)) {
      fs.writeFileSync(publicOutputPath, newFileContent, 'utf8');
      console.log(`Successfully synced ${publicOutputPath}.`);
    }

    // Update pinned sha256 checksum in docs/liturgy_checksums.json so integrity verification passes
    if (fs.existsSync(checksumsPath)) {
      try {
        const checksums = JSON.parse(fs.readFileSync(checksumsPath, 'utf8'));
        const fileBuffer = fs.readFileSync(outputPath);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const sizeBytes = fileBuffer.length;

        if (checksums['app/src/main/assets/js/prayers.js']) {
          checksums['app/src/main/assets/js/prayers.js'] = {
            sha256: hash,
            sizeBytes: sizeBytes
          };
          fs.writeFileSync(checksumsPath, JSON.stringify(checksums, null, 2) + '\n', 'utf8');
          console.log(`Updated liturgy checksum for prayers.js: ${hash} (${sizeBytes} bytes)`);
        }
      } catch (checksumErr) {
        console.warn('Warning: Could not update liturgy_checksums.json:', checksumErr);
      }
    }

  } catch (error) {
    console.error('Error syncing prayers:', error);
    process.exit(1);
  }
}

syncPrayers();
