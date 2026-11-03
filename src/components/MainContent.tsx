import React from 'react';

export const MainContent: React.FC = () => {
  return (
    <main className="main-content">
      <div id="prayer-floating-controls" className="prayer-floating-controls" aria-label="Prayer View Controls">
        <button id="expand-collapse-all-button" className="floating-control-pill" title="Expand All Sections" aria-label="Expand or Collapse All Sections">
          <svg className="icon-collapse-all" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px" fill="currentColor" style={{ display: 'none' }}>
            <path d="M19 13H5v-2h14v2z" />
          </svg>
          <svg className="icon-expand-all" xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          <span id="expand-collapse-all-label" className="floating-pill-label">Expand All</span>
        </button>

        <button id="presentation-mode-toggle-header" className="floating-control-pill" title="Toggle Presentation (Slides) Mode" aria-label="Toggle Presentation Mode">
          <svg className="pres-mode-icon-slides" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z" />
          </svg>
          <svg className="pres-mode-icon-scroll" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ display: 'none' }}>
            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
          </svg>
          <span id="presentation-mode-label" className="floating-pill-label">Slides</span>
        </button>
      </div>

      <img src="/img/hareg-header-ornament1.svg" className="hareg-ornament hareg-header" alt="(Header Ornament)" />
      <section id="prayer-display"></section>
      <img src="/img/hareg-footer-ornament1.svg" className="hareg-ornament hareg-footer" alt="(Footer Ornament)" />
    </main>
  );
};
