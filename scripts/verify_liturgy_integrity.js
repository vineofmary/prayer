#!/usr/bin/env node

/**
 * Liturgy & Scripture Integrity Verification Script
 *
 * Verifies that all core liturgical texts, anaphoras, daily prayers, and scripture
 * translations match their pinned SHA-256 cryptographic hashes.
 *
 * Exits with status 0 on success, or 1 if any discrepancy or missing file is found.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHECKSUMS_PATH = path.resolve(__dirname, '../docs/liturgy_checksums.json');

if (!fs.existsSync(CHECKSUMS_PATH)) {
  console.error(`[ERROR] Checksums file not found at: ${CHECKSUMS_PATH}`);
  process.exit(1);
}

const pinnedData = JSON.parse(fs.readFileSync(CHECKSUMS_PATH, 'utf8'));
let failureCount = 0;
let successCount = 0;

console.log('='.repeat(70));
console.log('Mount of Mercy — Liturgy & Scripture Dataset Integrity Verification');
console.log('='.repeat(70));

for (const [relPath, info] of Object.entries(pinnedData)) {
  const fullPath = path.resolve(__dirname, '..', relPath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ MISSING: ${relPath}`);
    failureCount++;
    continue;
  }

  const content = fs.readFileSync(fullPath);
  const actualHash = crypto.createHash('sha256').update(content).digest('hex');

  if (actualHash !== info.sha256) {
    console.error(`❌ MISMATCH in ${relPath}:`);
    console.error(`   Expected: ${info.sha256}`);
    console.error(`   Actual:   ${actualHash}`);
    failureCount++;
  } else {
    console.log(`✅ VERIFIED: ${relPath} (${info.sizeBytes.toLocaleString()} bytes)`);
    successCount++;
  }
}

console.log('-'.repeat(70));
if (failureCount > 0) {
  console.error(`\nFAILED: ${failureCount} dataset integrity error(s) detected!`);
  process.exit(1);
} else {
  console.log(`\nSUCCESS: All ${successCount} liturgical and scripture datasets verified identical to main.`);
  process.exit(0);
}
