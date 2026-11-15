import fs from 'fs';
import path from 'path';

let cachedExports = null;

export function loadApp() {
  if (cachedExports) return cachedExports;

  const auxModules = [
    'app/src/main/assets/js/zema_acoustic_model_data.js',
    'app/src/main/assets/js/zaima_notation_data.js',
    'app/src/main/assets/js/liturgy_guide_data.js',
    'app/src/main/assets/js/liturgy_tracker.js',
  ];
  for (const rel of auxModules) {
    const modPath = path.resolve(process.cwd(), rel);
    if (fs.existsSync(modPath)) {
      const modCode = fs.readFileSync(modPath, 'utf8');
      new Function('window', 'document', modCode)(window, document);
    }
  }

  const scriptPath = path.resolve(process.cwd(), 'app/src/main/assets/js/script.js');
  const code = fs.readFileSync(scriptPath, 'utf8');

  // Ensure window is global context
  const fn = new Function('window', 'document', 'firebase', code);
  fn(window, document, window.firebase);

  cachedExports = window.__mountOfMercy;
  return cachedExports;
}
