
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <div 
      className="hidden md:flex fixed top-6 right-6 items-center p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg transition-all z-50 cursor-pointer select-none"
      onClick={toggleLanguage}
      role="radiogroup"
      aria-label="Language selection"
    >
      <div className="relative flex items-center">
        <span 
          className={`absolute bg-indigo-600 dark:bg-indigo-500 h-7 w-11 rounded-full transition-transform duration-300 ease-out shadow-sm`}
          style={{ transform: language === 'en' ? 'translateX(0%)' : 'translateX(100%)' }}
        ></span>
        <span 
          className={`relative z-10 w-11 h-7 text-[10px] font-extrabold flex items-center justify-center transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
          aria-label="English"
        >
          EN
        </span>
        <span 
          className={`relative z-10 w-11 h-7 text-[10px] font-extrabold flex items-center justify-center transition-colors duration-300 ${language === 'uk' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}
          aria-label="Ukrainian"
        >
          UA
        </span>
      </div>
    </div>
  );
};
export default LanguageToggle;
