import React, { useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { MainContent } from './components/MainContent';
import { Modals } from './components/Modals';

declare global {
  interface Window {
    initMountOfMercyEngine?: () => Promise<void>;
  }
}

export const App: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.initMountOfMercyEngine) {
      window.initMountOfMercyEngine();
    }
  }, []);

  return (
    <>
      <SplashScreen />
      <div id="app-container" className="app-container">
        <Header />
        <div className="container">
          <LeftSidebar />
          <RightSidebar />
          <MainContent />
        </div>
        <nav id="bottom-nav-bar" className="bottom-nav-bar" aria-label="Primary Navigation">
          <button type="button" id="bottom-nav-pray" className="bottom-nav-item primary-nav-tab active" data-nav-tab="pray" aria-label="Pray">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
              <path d="M4.5 10.5c-.83 0-1.5.67-1.5 1.5v4.5c0 2.21 1.79 4 4 4h3.5v-5.5l-2.35-2.35a1.25 1.25 0 0 0-1.77 1.77L7.5 15.5H6c-.83 0-1.5-.67-1.5-1.5v-2c0-.83-.67-1.5-1.5-1.5zm15 0c-.83 0-1.5.67-1.5 1.5v2c0 .83-.67 1.5-1.5 1.5h-1.5l1.12-1.12a1.25 1.25 0 0 0-1.77-1.77L12.5 15v5.5H16c2.21 0 4-1.79 4-4V12c0-.83-.67-1.5-1.5-1.5zM11.25 3v2.25H9v1.5h2.25V10h1.5V6.75H15v-1.5h-2.25V3h-1.5z" />
            </svg>
            <span className="bottom-nav-label">Pray</span>
          </button>

          <button type="button" id="bottom-nav-liturgy" className="bottom-nav-item primary-nav-tab" data-nav-tab="liturgy" aria-label="Liturgy">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
              <path d="M11.25 1.5v1.75H9.5v1.5h1.75V6.5h1.5V4.75h1.75v-1.5h-1.75V1.5h-1.5zM6 8h12c0 3.72-2.26 6.91-5.5 8.15V19h2c.83 0 1.5.67 1.5 1.5V22H8v-1.5c0-.83.67-1.5 1.5-1.5h2v-2.85C8.26 14.91 6 11.72 6 8z" />
            </svg>
            <span className="bottom-nav-label">Liturgy</span>
          </button>

          <button type="button" id="bottom-nav-learn" className="bottom-nav-item primary-nav-tab" data-nav-tab="learn" aria-label="Learn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
              <path d="M18 12.22V9l-5-2.5V5h2V3h-2V1h-2v2H9v2h2v1.5L6 9v3.22L2 14v8h8v-5h4v5h8v-8l-4-1.78zM12 13.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
            <span className="bottom-nav-label">Learn</span>
          </button>

          <button type="button" id="bottom-nav-targuma" className="bottom-nav-item primary-nav-tab" data-nav-tab="targuma" aria-label="Targuma">
            <span className="nav-icon-with-badge">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
                <path d="M17 20c-.29 0-.56-.06-.76-.15-.71-.37-1.21-.88-1.71-2.38-.51-1.56-1.47-2.29-2.39-3-.79-.61-1.61-1.24-2.32-2.53C9.29 10.98 9 9.93 9 9c0-2.8 2.2-5 5-5s5 2.2 5 5h2c0-3.93-3.07-7-7-7S7 5.07 7 9c0 1.26.38 2.65 1.07 3.9.91 1.65 1.98 2.48 2.85 3.15.81.62 1.39 1.07 1.71 2.05.6 1.82 1.37 2.84 2.73 3.55.51.23 1.07.35 1.64.35 2.21 0 4-1.79 4-4h-2c0 1.1-.9 2-2 2zM7.64 2.64L6.22 1.22C4.23 3.21 3 5.96 3 9s1.23 5.79 3.22 7.78l1.41-1.41C6.01 13.74 5 11.49 5 9s1.01-4.74 2.64-6.36zM11.5 9c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5-2.5 1.12-2.5 2.5z" />
              </svg>
              <span className="nav-beta-badge">BETA</span>
            </span>
            <span className="bottom-nav-label">Targuma</span>
          </button>

          <button type="button" id="bottom-nav-search" className="bottom-nav-item primary-nav-tab" data-nav-tab="search" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <span className="bottom-nav-label">Search</span>
          </button>
        </nav>
        <Modals />
      </div>
    </>
  );
};

export default App;
