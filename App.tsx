
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import InfoModal from './components/InfoModal';
import HelpModal from './components/HelpModal';
import SettingsModal from './components/SettingsModal';
import LanguageToggle from './components/LanguageToggle';
import ThemeToggle from './components/ThemeToggle';
import MobileHeader from './components/MobileHeader';
import HomeScreen from './components/HomeScreen';
import DashboardScreen from './components/DashboardScreen';
import GrammarLibraryScreen from './components/GrammarLibraryScreen';
import GrammarTopicScreen from './components/GrammarTopicScreen';
import SettingsIcon from './components/icons/SettingsIcon';
import { useTranslation } from './hooks/useTranslation';
import { APP_VERSION } from './constants';

function App() {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { t } = useTranslation();

  // We need a way to pass data from Dashboard back to Home.
  // DashboardScreen navigates with state, HomeScreen/InputScreen reads it.
  const handleLoadListMock = (text: string) => {
      // This mock function is needed because DashboardScreen was designed with a callback prop.
      // In the router version, Dashboard navigates to '/' with state.
      console.log("Loading list via router state");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start font-sans relative transition-colors duration-300">
      <MobileHeader 
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      
      <ThemeToggle />
      <LanguageToggle />

      <div className="w-full max-w-6xl mx-auto mt-16 md:mt-8 px-4 md:px-8 pb-12">
        <Routes>
            <Route path="/" element={<HomeScreen onOpenHelp={() => setIsHelpModalOpen(true)} />} />
            <Route path="/dashboard" element={<DashboardScreen onLoadList={handleLoadListMock} />} />
            <Route path="/grammar" element={<GrammarLibraryScreen />} />
            <Route path="/grammar/:id" element={<GrammarTopicScreen />} />
        </Routes>
      </div>

      <div className="hidden md:flex fixed bottom-4 left-4 items-center gap-3 z-50">
        <button
            onClick={() => setIsInfoModalOpen(true)}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium py-2 px-4 rounded-full shadow-md border border-slate-200 dark:border-slate-700 transition-all text-sm flex items-center gap-2 hover:shadow-lg"
            aria-label="Show application info and changelog"
        >
            <span>{t('common.info')}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">v{APP_VERSION}</span>
        </button>
        <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-full shadow-md border border-slate-200 dark:border-slate-700 transition-all hover:shadow-lg"
            aria-label="Settings"
        >
            <SettingsIcon className="h-5 w-5" />
        </button>
      </div>

      {isInfoModalOpen && <InfoModal onClose={() => setIsInfoModalOpen(false)} />}
      {isHelpModalOpen && <HelpModal onClose={() => setIsHelpModalOpen(false)} />}
      {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />}
    </div>
  );
}

export default App;
