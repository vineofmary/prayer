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
        <Modals />
      </div>
    </>
  );
};

export default App;
