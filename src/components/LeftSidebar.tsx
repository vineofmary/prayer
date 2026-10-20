import React from 'react';

export const LeftSidebar: React.FC = () => {
  return (
    <aside id="left-sidebar" className="sidebar sidebar-left">
      <div className="settings-panel">
        <div className="setting-group">
          <h3>Customize Fonts</h3>
          <h4 className="settings-subtitle">Font Preview</h4>
          <div id="font-preview">
            <p className="preview-english">I seal my face</p>
            <p className="preview-geez ethiopic-label">አአትብ ገጽየ</p>
            <p className="preview-phonetic">a'atib getsye</p>
          </div>
          <h4 className="settings-subtitle">Ge'ez Font Size</h4>
          <input type="range" id="geez-font-size-slider" min="12" max="48" defaultValue="16" aria-label="Ge'ez Font Size" />

          <h4 className="settings-subtitle">English Font Size</h4>
          <input type="range" id="english-font-size-slider" min="12" max="48" defaultValue="16" aria-label="English Font Size" />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <label><input type="checkbox" id="lock-font-sizes" /> <span>Lock Font Sizes</span></label>
            <label><input type="checkbox" id="bold-text-toggle" /> <span>Bold Text</span></label>
          </div>

          <h4 className="settings-subtitle" style={{ marginTop: '1.5rem' }}>Ge'ez Font</h4>
          <select id="ethiopic-font-select" defaultValue="'Noto Sans Ethiopic', sans-serif" aria-label="Ge'ez Font Family">
            <option value="'Noto Sans Ethiopic', sans-serif">Modern</option>
            <option value="'Abyssinica SIL', serif">Ancient</option>
            <option value="serif">Standard</option>
          </select>

          <h4 className="settings-subtitle">English Font</h4>
          <select id="english-font-select" defaultValue="'Merriweather', serif" aria-label="English Font Family">
            <option value="serif">Elegant</option>
            <option value="'Lato', sans-serif">Modern</option>
            <option value="'Merriweather', serif">Classic</option>
            <option value="'Roboto', sans-serif">Basic</option>
          </select>
        </div>

        <div className="setting-group">
          <h3>Select Languages</h3>
          <div id="language-toggles">
            {/* Populated dynamically from LANGUAGE_REGISTRY */}
          </div>
        </div>

        <div className="setting-group">
          <h4 className="settings-subtitle">Language Order</h4>
          <ul id="language-order-list"></ul>
          <label style={{ marginTop: '1rem', display: 'block' }}>
            <input type="checkbox" id="show-language-labels" /> <span>Language Labels</span>
          </label>
        </div>

        <div className="setting-group">
          <h3>Pick Theme</h3>
          <select id="palette-selector" defaultValue="traditional" aria-label="Theme Palette">
            <option value="traditional">Traditional</option>
            <option value="sepia">Brown</option>
            <option value="oceanic">Ocean</option>
            <option value="legacy">Legacy</option>
            <option value="high-contrast">Simple</option>
          </select>

          <h4 className="settings-subtitle" style={{ marginTop: '1.5rem' }}>Language Color-Coding</h4>
          <select id="language-color-coding-select" defaultValue="off" aria-label="Language Color Coding">
            <option value="off">Off</option>
            <option value="pastel">Soft</option>
            <option value="vibrant">Bright</option>
            <option value="greyscale">Grey</option>
          </select>

          <label style={{ marginTop: '1rem', display: 'block' }}>
            <input type="checkbox" id="show-rubrication" /> <span>Colored Holy Names (Beta)</span>
          </label>
          <label style={{ marginTop: '0.5rem', display: 'block' }}>
            <input type="checkbox" id="anglicize-names-toggle" /> <span>Anglicize Names (Beta)</span>
          </label>
        </div>

        <div className="setting-group">
          <h3>Customize Names</h3>
          <p className="settings-subtitle" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
            These names will be dynamically inserted into prayers which include parts to intercede and pray for others.
          </p>
          <h4 className="settings-subtitle">Servant's Name(s)</h4>
          <input type="text" id="servant-name-input" placeholder="e.g. John, Jane, etc." />
          <h4 className="settings-subtitle">Patriarch</h4>
          <input type="text" id="patriarch-name-input" placeholder="e.g. Abba Mathias I" />
          <h4 className="settings-subtitle">Bishop</h4>
          <input type="text" id="bishop-name-input" placeholder="e.g. Abba Theophilus" />
          <h4 className="settings-subtitle">Bishop(s) in Attendance</h4>
          <input type="text" id="attending-bishops-input" placeholder="e.g. Abba ..." />
          <h4 className="settings-subtitle">Church Name</h4>
          <input type="text" id="church-name-input" placeholder="e.g. St. Michael EOTC" />
          <h4 className="settings-subtitle">Country</h4>
          <input type="text" id="country-name-input" placeholder="e.g. Ethiopia, USA, etc." />
          <h4 className="settings-subtitle">Head of State</h4>
          <input type="text" id="head-of-state-input" placeholder="e.g. President, Emperor, etc." />
        </div>

        <div className="setting-group">
          <h3 className="settings-subtitle">Advanced Display Options</h3>
          <div id="display-options-toggles">
            <label><input type="checkbox" id="show-speaker-labels" /> <span>Speaker Labels (Beta)</span></label>
            <label><input type="checkbox" id="paragraph-mode" /> <span>Paragraph Mode (Single Language only)</span></label>
            <label id="dynamic-font-sizing-label" style={{ display: 'none' }}>
              <input type="checkbox" id="dynamic-font-sizing" /> <span>Dynamic Font Sizing (Slides Mode)</span>
            </label>
            <label id="force-uniform-font-size-label" style={{ display: 'none' }}>
              <input type="checkbox" id="force-uniform-font-size" /> <span>Force Uniform Font Sizes (Slides Mode)</span>
            </label>
            <label title="Show original Greek/Coptic forms in Ge'ez loanwords.">
              <input type="checkbox" id="show-loanword-origins" /> <span>Show Loanword Origins (Beta)</span>
            </label>
            <div className="bible-translations-container" style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
              <div className="title-with-info" style={{ marginBottom: '0.5rem' }}>
                <h4 className="settings-subtitle" style={{ margin: 0, fontWeight: 600 }}>Bible Translations &amp; Editions</h4>
                <button id="bible-translations-info-btn" className="info-toggle-btn" title="About Bible Translations & Editions" aria-label="About Bible Translations and Editions">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </button>
              </div>
              <label id="external-bible-api-label" style={{ display: 'none' }}>
                <input type="checkbox" id="use-external-bible-api" defaultChecked /> <span>EOTCOpenSource Bible Translations</span>
              </label>

              <div className="bible-setting-row" style={{ marginBottom: '0.6rem' }}>
                <label htmlFor="global-english-translation-select" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '0.2rem' }}>English</label>
                <select id="global-english-translation-select" className="settings-select" defaultValue="nkjv" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <option value="nkjv">NKJV1982 | New King James Version</option>
                  <option value="kjv">KJV1611 | King James Version</option>
                </select>
              </div>

              <div className="bible-setting-row" style={{ marginBottom: '0.6rem' }}>
                <label htmlFor="global-amharic-translation-select" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '0.2rem' }}>Amharic | አማርኛ</label>
                <select id="global-amharic-translation-select" className="settings-select" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <option value="am-2000">አም2000 | ሰማንያ አሐዱ (2000 ዓ.ም.)</option>
                  <option value="am54">አም1954 | ቀዳማዊ ኃይለ ሥላሴ (1954 ዓ.ም.)</option>
                </select>
              </div>

              <div className="bible-setting-row" style={{ marginBottom: '0.6rem' }}>
                <label htmlFor="global-geez-translation-select" style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: '0.2rem' }}>Ge&apos;ez | ግእዝ</label>
                <select id="global-geez-translation-select" className="settings-select" style={{ width: '100%', fontSize: '0.85rem' }}>
                  <option value="gez-1980">ግእዝ1980 | መጽሐፍ ቅዱስ በግእዝ (1980 ዓ.ም.)</option>
                  <option value="gez-2014">ግእዝ2014 | ሐዲስ ኪዳን በግእዝ (2014 ዓ.ም.)</option>
                </select>
              </div>
            </div>
          </div>
          <h4 className="settings-subtitle">Slide Transition</h4>
          <select id="slide-transition-select" defaultValue="slide" aria-label="Slide Transition">
            <option value="slide">Slide</option>
            <option value="fade">Fade</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="setting-group" id="unofficial-languages-section" style={{ display: 'none' }}>
          <h3>Translations*</h3>
          <div id="unofficial-language-toggles"></div>
        </div>

        <div className="setting-group" id="translations-notes-section">
          <p className="settings-subtitle" style={{ fontSize: '0.7rem', marginTop: 0, opacity: 0.8, fontWeight: 'normal', fontStyle: 'italic', lineHeight: 1.4 }}>
            *Includes unofficial translations (generated from English) via Google Translate APIs which require thorough review for theological accuracy, but is an important first step towards future officially approved translations of liturgical prayers.
          </p>
        </div>

        <div className="setting-group feedback-section">
          <button id="share-link-button" className="settings-button share-button">
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" />
            </svg>
            <span>Share Link</span>
          </button>
          <p className="share-hint"><i>Shares all your current settings and filters.</i></p>

          <button id="share-scriptures-button" className="settings-button share-button" style={{ marginTop: '10px' }}>
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span>Share Link with Scriptures</span>
          </button>
          <p className="share-hint"><i>Copies link along with all selected Liturgy mode Bible readings to clipboard.</i></p>
          <hr className="settings-divider" />
          <button id="feedback-button">Share Feedback</button>
          <div className="scribe-entry-point">
            <button id="scribe-login-link">Scribe Login</button>
          </div>
        </div>

        <div className="bible-verse-sidebar">
          <p>“Pray without ceasing”</p>
          <p className="ethiopic-label">“ወጸልዩ ወትረ”</p>
          <p className="citation">(1 Thessalonians 5:17 ፨ <span className="ethiopic-label">፩ ተሰሎንቄ ፭፡፲፯</span>)</p>
        </div>

        <div className="setting-group app-version-section">
          <button id="hard-refresh-button" className="hard-refresh-btn" title="Check for updates and force reload the latest app version">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
            <span>Check for Updates</span>
          </button>
          <div id="app-version-container">v0.8.5-beta</div>
        </div>
      </div>
    </aside>
  );
};
