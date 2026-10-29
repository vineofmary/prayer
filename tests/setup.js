import fs from 'fs';
import path from 'path';

// Mock Firebase Compat globally
globalThis.firebase = {
  initializeApp: () => ({}),
  auth: () => ({
    onAuthStateChanged: (cb) => {
      if (typeof cb === 'function') cb(null);
      return () => {};
    },
    currentUser: null,
  }),
  firestore: () => ({
    collection: () => ({
      where: () => ({
        onSnapshot: () => () => {},
      }),
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => ({}) }),
        set: () => Promise.resolve(),
      }),
      onSnapshot: () => () => {},
    }),
  }),
  analytics: () => ({
    logEvent: () => {},
  }),
};

// Mock Audio & Notification
globalThis.Audio = class {
  play() { return Promise.resolve(); }
  pause() {}
  load() {}
};

if (typeof window !== 'undefined') {
  window.firebase = globalThis.firebase;

  // Mock Notification API
  window.Notification = {
    permission: 'granted',
    requestPermission: () => Promise.resolve('granted'),
  };

  // Mock Scroll methods
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};

  // Mock matchMedia
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () { return true; },
    };
  };

  // Populate Document Body from index.html if available, stripping <script> tags to avoid network loads
  try {
    const htmlPath = path.resolve(process.cwd(), 'app/src/main/assets/index.html');
    if (fs.existsSync(htmlPath)) {
      const rawHtml = fs.readFileSync(htmlPath, 'utf8');
      const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (bodyMatch) {
        const cleanHtml = bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        document.body.innerHTML = cleanHtml;
      }
    }
  } catch (err) {
    console.warn('Could not load index.html into happy-dom:', err);
  }
}
