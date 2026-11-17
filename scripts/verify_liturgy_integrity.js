#!/usr/bin/env node

/**
 * Liturgy & Scripture Integrity Verification Script
 *
 * Modes:
 *   (default)        Runs structural + dual-asset parity checks AND verifies all SHA-256
 *                    hashes pinned in docs/liturgy_checksums.json.
 *   --structural     Runs syntax, non-empty dataset sanity, valid JSON, and Android/Web
 *                    asset parity checks without enforcing pinned SHA-256 hashes.
 *   --verify-locked  Runs structural checks AND strictly verifies SHA-256 hashes for
 *                    locked scripture Bibles and Bible service files (bible/*, bible_service.js).
 *   --update         Runs structural + parity checks first, then updates docs/liturgy_checksums.json
 *                    with current SHA-256 hashes and byte sizes.
 *   --json           Prints machine-readable mismatch details to stdout after summary (or use --list-mismatches).
 *   --list-mismatches Prints one mismatched relative path per line (for CI scripts).
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CHECKSUMS_PATH = path.resolve(ROOT, 'docs/liturgy_checksums.json');

const args = new Set(process.argv.slice(2));
const MODE_STRUCTURAL_ONLY = args.has('--structural');
const MODE_LOCKED_ONLY = args.has('--verify-locked');
const MODE_UPDATE = args.has('--update');
const MODE_LIST_MISMATCHES = args.has('--list-mismatches');

const LOCKED_DATASET_PATHS = new Set([
  'app/src/main/assets/js/bible_service.js',
]);

function isLockedDataset(relPath) {
  return relPath.startsWith('app/src/main/assets/bible/') || LOCKED_DATASET_PATHS.has(relPath);
}

// Required Android <-> Web parity pairs for liturgical & core UI files
const PARITY_PAIRS = [
  ['app/src/main/assets/js/kidase.js', 'public/js/kidase.js'],
  ['app/src/main/assets/js/prayers.js', 'public/js/prayers.js'],
  ['app/src/main/assets/js/miracles_of_mary.js', 'public/js/miracles_of_mary.js'],
  ['app/src/main/assets/js/songs.js', 'public/js/songs.js'],
  ['app/src/main/assets/js/typical_psalms.js', 'public/js/typical_psalms.js'],
  ['app/src/main/assets/js/st_athanasius_psalms.js', 'public/js/st_athanasius_psalms.js'],
  ['app/src/main/assets/js/teklil.js', 'public/js/teklil.js'],
  ['app/src/main/assets/js/servants.js', 'public/js/servants.js'],
  ['app/src/main/assets/js/bible_service.js', 'public/js/bible_service.js'],
  ['app/src/main/assets/js/script.js', 'public/js/script.js'],
  ['app/src/main/assets/css/style.css', 'public/css/style.css'],
];

// Structural sanity validators for each liturgical JS dataset
const JS_SANITY_VALIDATORS = {
  'app/src/main/assets/js/kidase.js': {
    expr: 'typeof kidaseData === "object" && Array.isArray(kidaseData.order) && kidaseData.order.length > 500 && Array.isArray(kidaseData.apostles) && kidaseData.apostles.length > 100 && Array.isArray(kidaseData.mary) && kidaseData.mary.length > 100',
    desc: 'kidaseData.{order,apostles,mary} non-empty arrays',
  },
  'app/src/main/assets/js/prayers.js': {
    expr: 'Array.isArray(prayers) && prayers.length > 100',
    desc: 'prayers array (>100 entries)',
  },
  'app/src/main/assets/js/miracles_of_mary.js': {
    expr: 'Array.isArray(MIRACLES_OF_MARY) && MIRACLES_OF_MARY.length > 20',
    desc: 'MIRACLES_OF_MARY array (>20 entries)',
  },
  'app/src/main/assets/js/songs.js': {
    expr: 'Array.isArray(songs) && songs.length > 5',
    desc: 'songs array (>5 entries)',
  },
  'app/src/main/assets/js/typical_psalms.js': {
    expr: 'Array.isArray(TYPICAL_PSALMS) && TYPICAL_PSALMS.length >= 300',
    desc: 'TYPICAL_PSALMS array (>=300 entries)',
  },
  'app/src/main/assets/js/st_athanasius_psalms.js': {
    expr: 'Array.isArray(ST_ATHANASIUS_CATEGORIES) && ST_ATHANASIUS_CATEGORIES.length > 0 && Array.isArray(ST_ATHANASIUS_PSALMS_GUIDE) && ST_ATHANASIUS_PSALMS_GUIDE.length > 10',
    desc: 'ST_ATHANASIUS_CATEGORIES and ST_ATHANASIUS_PSALMS_GUIDE arrays',
  },
  'app/src/main/assets/js/teklil.js': {
    expr: 'typeof teklilData === "object" && Array.isArray(teklilData.prayers) && teklilData.prayers.length > 10',
    desc: 'teklilData.prayers array (>10 entries)',
  },
  'app/src/main/assets/js/servants.js': {
    expr: 'Array.isArray(servantsPrayers) && servantsPrayers.length > 0',
    desc: 'servantsPrayers non-empty array',
  },
  'app/src/main/assets/js/bible_service.js': {
    expr: 'typeof WeahaduBibleService === "object" && typeof window.WeahaduBibleService === "object"',
    desc: 'WeahaduBibleService object',
  },
};

if (!fs.existsSync(CHECKSUMS_PATH)) {
  console.error(`[ERROR] Checksums file not found at: ${CHECKSUMS_PATH}`);
  process.exit(1);
}

const pinnedData = JSON.parse(fs.readFileSync(CHECKSUMS_PATH, 'utf8'));

function runStructuralAndParityChecks() {
  let errors = 0;

  for (const relPath of Object.keys(pinnedData)) {
    const fullPath = path.resolve(ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ MISSING: ${relPath}`);
      errors++;
      continue;
    }
    const stat = fs.statSync(fullPath);
    if (stat.size === 0) {
      console.error(`❌ EMPTY FILE: ${relPath}`);
      errors++;
      continue;
    }

    if (relPath.endsWith('.json')) {
      try {
        const rawJson = fs.readFileSync(fullPath, 'utf8').replace(/^(?:\s*\/\/[^\n]*\r?\n)+/, '');
        JSON.parse(rawJson);
      } catch (err) {
        console.error(`❌ INVALID JSON in ${relPath}: ${err.message}`);
        errors++;
      }
    } else if (relPath.endsWith('.js')) {
      const code = fs.readFileSync(fullPath, 'utf8');
      const validator = JS_SANITY_VALIDATORS[relPath];
      try {
        const ctx = vm.createContext({ window: {}, console });
        const wrapped = validator ? `${code}\n;(${validator.expr});` : code;
        const ok = vm.runInContext(wrapped, ctx, { filename: relPath });
        if (validator && !ok) {
          console.error(`❌ SANITY CHECK FAILED in ${relPath}: expected ${validator.desc}`);
          errors++;
        }
      } catch (err) {
        console.error(`❌ JS SYNTAX/EVAL ERROR in ${relPath}: ${err.message}`);
        errors++;
      }
    }
  }

  for (const [androidRel, publicRel] of PARITY_PAIRS) {
    const aPath = path.resolve(ROOT, androidRel);
    const pPath = path.resolve(ROOT, publicRel);
    if (!fs.existsSync(aPath)) {
      console.error(`❌ MISSING ANDROID ASSET: ${androidRel}`);
      errors++;
      continue;
    }
    if (!fs.existsSync(pPath)) {
      console.error(`❌ MISSING WEB ASSET: ${publicRel}`);
      errors++;
      continue;
    }
    const aBuf = fs.readFileSync(aPath);
    const pBuf = fs.readFileSync(pPath);
    if (!aBuf.equals(pBuf)) {
      console.error(`❌ PARITY MISMATCH: ${androidRel} !== ${publicRel}`);
      errors++;
    }
  }

  return errors;
}

if (MODE_LIST_MISMATCHES) {
  for (const [relPath, info] of Object.entries(pinnedData)) {
    const fullPath = path.resolve(ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      console.log(relPath);
      continue;
    }
    const actualHash = crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
    if (actualHash !== info.sha256) {
      console.log(relPath);
    }
  }
  process.exit(0);
}

console.log('='.repeat(70));
console.log('Mount of Mercy — Liturgy & Scripture Dataset Integrity Verification');
console.log('='.repeat(70));

const structuralErrors = runStructuralAndParityChecks();
if (structuralErrors > 0) {
  console.error(`\nFAILED: ${structuralErrors} structural/parity error(s) detected!`);
  process.exit(1);
}
console.log(`✅ STRUCTURAL & ASSET PARITY: All ${Object.keys(pinnedData).length} datasets and ${PARITY_PAIRS.length} Android/Web pairs valid.`);

if (MODE_STRUCTURAL_ONLY) {
  console.log('-'.repeat(70));
  console.log('\nSUCCESS: Structural & asset parity verification passed.');
  process.exit(0);
}

if (MODE_UPDATE) {
  const updated = {};
  for (const relPath of Object.keys(pinnedData)) {
    const fullPath = path.resolve(ROOT, relPath);
    const buf = fs.readFileSync(fullPath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    updated[relPath] = { sha256, sizeBytes: buf.length };
  }
  fs.writeFileSync(CHECKSUMS_PATH, JSON.stringify(updated, null, 2) + '\n', 'utf8');
  console.log(`✅ UPDATED: ${path.relative(ROOT, CHECKSUMS_PATH)} (${Object.keys(updated).length} entries).`);
  process.exit(0);
}

let failureCount = 0;
let successCount = 0;
const mismatchedPaths = [];

for (const [relPath, info] of Object.entries(pinnedData)) {
  if (MODE_LOCKED_ONLY && !isLockedDataset(relPath)) continue;

  const fullPath = path.resolve(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ MISSING: ${relPath}`);
    failureCount++;
    mismatchedPaths.push(relPath);
    continue;
  }

  const content = fs.readFileSync(fullPath);
  const actualHash = crypto.createHash('sha256').update(content).digest('hex');

  if (actualHash !== info.sha256) {
    console.error(`❌ MISMATCH in ${relPath}:`);
    console.error(`   Expected: ${info.sha256}`);
    console.error(`   Actual:   ${actualHash}`);
    failureCount++;
    mismatchedPaths.push(relPath);
  } else {
    console.log(`✅ VERIFIED: ${relPath} (${info.sizeBytes.toLocaleString()} bytes)`);
    successCount++;
  }
}

console.log('-'.repeat(70));
if (failureCount > 0) {
  console.error(`\nFAILED: ${failureCount} dataset integrity error(s) detected!`);
  const onlyPrayersMismatched = mismatchedPaths.every((p) => !isLockedDataset(p));
  if (onlyPrayersMismatched) {
    console.error('Hint: If you intentionally edited prayer datasets, run: npm run update:checksums');
  }
  process.exit(1);
} else {
  const label = MODE_LOCKED_ONLY ? 'locked scripture/engine' : 'liturgical and scripture';
  console.log(`\nSUCCESS: All ${successCount} ${label} datasets verified identical to main.`);
  process.exit(0);
}
