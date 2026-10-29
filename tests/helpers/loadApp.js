import fs from 'fs';
import path from 'path';

let cachedExports = null;

export function loadApp() {
  if (cachedExports) return cachedExports;

  const scriptPath = path.resolve(process.cwd(), 'app/src/main/assets/js/script.js');
  const code = fs.readFileSync(scriptPath, 'utf8');

  // Ensure window is global context
  const fn = new Function('window', 'document', 'firebase', code);
  fn(window, document, window.firebase);

  cachedExports = window.__mountOfMercy;
  return cachedExports;
}
