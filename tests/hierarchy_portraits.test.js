import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeEach } from 'vitest';
import { loadApp } from './helpers/loadApp.js';

const EXPECTED_PORTRAITS = [
  {
    file: 'Abune-Mathias-I.png',
    title: 'His Holiness Abune Mathias I',
    roleSnippet: 'Patriarch of Ethiopia',
  },
  {
    file: 'Abune-Theophilus.png',
    title: 'His Grace Abune Theophilus',
    roleSnippet: 'Archbishop of the Diocese',
  },
  {
    file: 'Qomos-Abba-Tesfa-Maryam.png',
    title: 'Qomos Abba Tesfa-Maryam',
    roleSnippet: 'Oakland DMKM EOTC',
  },
];

describe('Church Hierarchy Portraits & Full-Photo Lightbox', () => {
  let app;

  beforeEach(() => {
    const htmlPath = path.resolve(process.cwd(), 'app/src/main/assets/index.html');
    const rawHtml = fs.readFileSync(htmlPath, 'utf8');
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const cleanHtml = bodyMatch[1].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      document.body.innerHTML = cleanHtml;
    }
    app = loadApp();
  });

  it('stores synchronized portrait files in both public/img and app/src/main/assets/img', () => {
    for (const { file } of EXPECTED_PORTRAITS) {
      const publicFile = path.resolve(process.cwd(), 'public/img', file);
      const androidAssetFile = path.resolve(process.cwd(), 'app/src/main/assets/img', file);

      expect(fs.existsSync(publicFile)).toBe(true);
      expect(fs.existsSync(androidAssetFile)).toBe(true);
      expect(fs.statSync(publicFile).size).toBeGreaterThan(0);
      expect(fs.statSync(androidAssetFile).size).toBe(fs.statSync(publicFile).size);
    }
  });

  it('renders all three clergy portraits in HTML and React Modals without placeholder badges', () => {
    const cards = Array.from(document.querySelectorAll('#help-auspices .hierarchy-card'));
    expect(cards).toHaveLength(3);
    expect(document.querySelectorAll('#help-auspices .hierarchy-photo-badge')).toHaveLength(0);

    EXPECTED_PORTRAITS.forEach((expected, idx) => {
      const card = cards[idx];
      const btn = card.querySelector('button.hierarchy-portrait-wrap');
      const img = card.querySelector('img.hierarchy-portrait-img');
      const titleEl = card.querySelector('.hierarchy-card-title');

      expect(btn).not.toBeNull();
      expect(img).not.toBeNull();
      expect(img.getAttribute('src').split('?')[0]).toBe(`img/${expected.file}`);
      expect(titleEl.textContent.trim()).toBe(expected.title);
    });

    const modalsTsx = fs.readFileSync(
      path.resolve(process.cwd(), 'src/components/Modals.tsx'),
      'utf8'
    );
    expect(modalsTsx).not.toContain('Photo coming soon');
    for (const { file } of EXPECTED_PORTRAITS) {
      expect(modalsTsx).toContain(`/img/${file}`);
    }
  });

  it('expands full portrait when clicking a circular portrait and closes cleanly via button, backdrop, or Escape without closing #help-modal', () => {
    expect(typeof app.openHierarchyPortraitLightbox).toBe('function');
    expect(typeof app.closeHierarchyPortraitLightbox).toBe('function');

    const helpModal = document.getElementById('help-modal');
    helpModal.style.display = 'block';

    const portraitButtons = Array.from(
      document.querySelectorAll('#help-auspices button.hierarchy-portrait-wrap')
    );
    const lightbox = document.getElementById('hierarchy-photo-lightbox');
    const lightboxImg = document.getElementById('hierarchy-lightbox-img');
    const lightboxTitle = document.getElementById('hierarchy-lightbox-title');
    const lightboxRole = document.getElementById('hierarchy-lightbox-role');
    const closeBtn = document.getElementById('close-hierarchy-lightbox');

    expect(lightbox.classList.contains('is-open')).toBe(false);

    // 1. Click Patriarch portrait -> opens lightbox, close via close button
    portraitButtons[0].click();
    expect(lightbox.classList.contains('is-open')).toBe(true);
    expect(lightbox.getAttribute('aria-hidden')).toBe('false');
    expect(lightboxImg.getAttribute('src')).toBe('img/Abune-Mathias-I.png');
    expect(lightboxTitle.textContent).toBe('His Holiness Abune Mathias I');
    expect(lightboxRole.textContent).toContain('Patriarch of Ethiopia');

    closeBtn.click();
    expect(lightbox.classList.contains('is-open')).toBe(false);
    expect(lightbox.getAttribute('aria-hidden')).toBe('true');
    expect(helpModal.style.display).toBe('block');

    // 2. Click Archbishop portrait -> opens lightbox, close via backdrop click
    portraitButtons[1].click();
    expect(lightbox.classList.contains('is-open')).toBe(true);
    expect(lightboxImg.getAttribute('src')).toBe('img/Abune-Theophilus.png');

    lightbox.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    expect(lightbox.classList.contains('is-open')).toBe(false);
    expect(helpModal.style.display).toBe('block');

    // 3. Click Qomos portrait -> opens lightbox, close via Escape key
    portraitButtons[2].click();
    expect(lightbox.classList.contains('is-open')).toBe(true);
    expect(lightboxImg.getAttribute('src').split('?')[0]).toBe('img/Qomos-Abba-Tesfa-Maryam.png');
    expect(lightboxTitle.textContent).toBe('Qomos Abba Tesfa-Maryam');

    document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(lightbox.classList.contains('is-open')).toBe(false);
    expect(helpModal.style.display).toBe('block');
  });
});
