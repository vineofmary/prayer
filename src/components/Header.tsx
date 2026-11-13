import React from 'react';

export const Header: React.FC = () => {
  return (
    <header id="app-header">
      <div className="header-top-row">
        <div className="header-content">
          <button id="sidebar-toggle" title="Toggle Settings" aria-label="Toggle Settings">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
            </svg>
          </button>
          <div className="header-title-block">
            <div className="header-title-line">
              <h1 className="ethiopic-label">
                <button
                  type="button"
                  id="header-subtitle-attribution"
                  className="header-title-link"
                  title="View Auspices, Hierarchy & Disclaimer"
                  aria-label="Mount of Mercy — View Auspices and Disclaimer"
                >
                  Mount of Mercy
                </button>
              </h1>
            </div>
            <div id="liturgical-calendar-bar" className="liturgical-calendar-bar" aria-label="Liturgical Hour and Ethiopian Calendar">
              {/* Populated dynamically by script.js */}
            </div>
            <div id="header-feast-mobile-line" className="header-feast-mobile-line" hidden aria-label="Liturgical Feast Day"></div>
          </div>
        </div>

        <div id="search-container">
          <div className="search-bar-controls">
            <input type="search" id="search-input" placeholder="Search prayers, Psalms, Liturgy..." aria-label="Search prayer text" />
            <select id="search-scope-select" className="search-scope-select" defaultValue="current" aria-label="Search Scope" title="Search Scope">
              <option value="current">Current View</option>
              <option value="all">Entire App</option>
            </select>
            <span id="search-count">0/0</span>
            <button id="search-prev" title="Previous Match" aria-label="Previous Match">▲</button>
            <button id="search-next" title="Next Match" aria-label="Next Match">▼</button>
            <button id="search-close" className="search-close-btn" title="Exit Search" aria-label="Exit Search">× Close</button>
          </div>
          <div id="search-results-drawer" className="search-results-drawer hidden"></div>
        </div>

        <div className="header-actions">
          <button id="pray-tab-header" className="header-nav-tab primary-nav-tab active" data-nav-tab="pray" title="Pray (Daily Prayers)" aria-label="Pray Tab">
            <span className="header-nav-label">Pray</span>
          </button>

          <button id="liturgy-tab-header" className="header-nav-tab primary-nav-tab" data-nav-tab="liturgy" title="Divine Liturgy & Se'atat" aria-label="Liturgy Tab">
            <span className="header-nav-label">Liturgy</span>
          </button>

          <button id="learning-mode-toggle-header" className="header-nav-tab primary-nav-tab" data-nav-tab="learn" title="Learning Games & Ge'ez Reader" aria-label="Toggle Learning Games Mode">
            <span className="header-nav-label">Learn</span>
          </button>

          <button id="targuma-mode-toggle-header" className="header-nav-tab primary-nav-tab" data-nav-tab="targuma" title="Targuma Mode (Live Sermon & Announcement Captions)" aria-label="Toggle Targuma Live Captions Mode">
            <span className="header-nav-label">Targuma</span>
            <span className="nav-beta-badge">BETA</span>
          </button>

          <button id="search-toggle" className="header-nav-tab primary-nav-tab" data-nav-tab="search" title="Search" aria-label="Open Search">
            <span className="header-nav-label">Search</span>
          </button>

          <button id="prayers-panel-toggle" title="Select Prayers" aria-label="Open Liturgy and Prayers Menu">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
