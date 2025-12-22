
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../hooks/useTheme';
import { useAudio } from '../hooks/useAudio';
import CloseIcon from './icons/CloseIcon';
import SettingsIcon from './icons/SettingsIcon';

interface MobileHeaderProps {
  onOpenInfo: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenInfo, onOpenHelp, onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, toggleLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { audioSource, toggleAudioSource } = useAudio();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Fixed Header Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <Logo className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">VocabCrafter</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Spacer to push content down */}
      <div className="md:hidden h-16 w-full flex-shrink-0" />

      {/* Side Drawer */}
      <div 
        className={`md:hidden fixed inset-0 z-[60] bg-slate-900/20 dark:bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 w-72 h-full bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-out border-l border-slate-100 dark:border-slate-800 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <span className="font-bold text-lg text-slate-900 dark:text-white">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <CloseIcon />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <button 
              onClick={() => handleNav(() => navigate('/'))}
              className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${isActive('/') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive('/') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('common.backToMenu')}
            </button>

            <button 
              onClick={() => handleNav(() => navigate('/dashboard'))}
              className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${isActive('/dashboard') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive('/dashboard') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {t('dashboard.myLibrary')}
            </button>

            <button 
              onClick={() => handleNav(() => navigate('/grammar'))}
              className={`w-full text-left p-3 rounded-xl font-medium flex items-center gap-3 transition-all ${isActive('/grammar') ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive('/grammar') ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t('grammarLibrary.menuTitle')}
              <span className="ml-auto text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">{t('common.new')}</span>
            </button>

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />

            <button 
              onClick={() => handleNav(onOpenHelp)}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium flex items-center gap-3 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('common.howItWorks')}
            </button>

             <button 
              onClick={() => handleNav(onOpenInfo)}
              className="w-full text-left p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium flex items-center gap-3 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('common.info')}
            </button>
            
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2" />

            <div className="px-3 py-2 flex flex-col gap-4">
                {/* Audio Source Toggle */}
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 ml-1">{t('settings.audioSource')}</span>
                    <button 
                        onClick={toggleAudioSource}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                            {audioSource === 'gemini' ? 'Gemini AI' : 'Browser'}
                        </span>
                        <div className={`w-9 h-5 rounded-full relative transition-colors ${audioSource === 'gemini' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${audioSource === 'gemini' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                </div>

                {/* Theme Toggle */}
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 ml-1">Theme</span>
                    <button 
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                        <div className="text-slate-500">
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            )}
                        </div>
                    </button>
                </div>

                {/* Language Toggle */}
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3 ml-1">Language</span>
                    <div 
                        onClick={toggleLanguage}
                        className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <div className="relative w-12 h-7 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors duration-200">
                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-slate-400 rounded-full shadow-sm transition-transform duration-200 ${language === 'uk' ? 'translate-x-5' : ''}`}></div>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{language === 'en' ? 'English' : 'Українська'}</span>
                    </div>
                </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
