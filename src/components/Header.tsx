import React from 'react';

export const Header: React.FC = () => {
  return (
    <header>
      <div className="header-content">
        <button id="sidebar-toggle" title="Toggle Settings" aria-label="Toggle Settings">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22-.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
          </svg>
        </button>
        <h1 className="ethiopic-label">Mount of Mercy</h1>
      </div>

      <div id="search-container">
        <input type="search" id="search-input" placeholder="Search..." aria-label="Search prayer text" />
        <span id="search-count">0/0</span>
        <button id="search-prev" title="Previous Match" aria-label="Previous Match">▲</button>
        <button id="search-next" title="Next Match" aria-label="Next Match">▼</button>
      </div>

      <div className="header-actions">
        <button id="search-toggle" title="Search" aria-label="Open Search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </button>
        <button id="search-close" title="Close Search" aria-label="Close Search">×</button>

        <button id="presentation-mode-toggle-header" title="Toggle Presentation Mode" aria-label="Toggle Presentation Mode">
          <svg className="pres-mode-icon-slides" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
          </svg>
          <svg className="pres-mode-icon-scroll" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={{ display: 'none' }}>
            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
          </svg>
        </button>

        <button id="layout-toggle-header" title="Toggle Row/Column Layout" aria-label="Toggle Row/Column Layout">
          <svg className="layout-icon-column" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M4 18h17v-2H4v2zM4 13h17v-2H4v2zM4 6v2h17V6H4z" />
          </svg>
          <svg className="layout-icon-row" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" style={{ display: 'none' }}>
            <path d="M11 18h2v-2h-2v2zm-4 0h2v-2H7v2zm8 0h2v-2h-2v2zm-8-4h2v-2H7v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm-8-4h2V8H7v2zm4 0h2V8h-2v2zm4 0h2V8h-2v2zM7 6h2V4H7v2zm4 0h2V4h-2v2zm4 0h2V4h-2v2z" />
          </svg>
        </button>

        <button id="expand-collapse-all-button" title="Collapse All" aria-label="Collapse All Sections">
          <svg className="icon-collapse-all" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M7.41 18.59L12 14l4.59 4.59L18 17.17l-6-6-6 6zM7.41 6.59L12 2l4.59 4.59L18 5.17l-6-6-6 6z" />
          </svg>
          <svg className="icon-expand-all" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" style={{ display: 'none' }}>
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
          </svg>
        </button>

        <button id="theme-toggle" title="Toggle Dark Mode" aria-label="Toggle Theme"></button>
        <button id="help-button" title="Help" aria-label="Help">?</button>

        <button id="prayers-panel-toggle" title="Select Prayers" aria-label="Open Liturgy and Prayers Menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
            <path d="M10.5 2v6H5v3h5.5v11h3V11H19V8h-5.5V2z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
