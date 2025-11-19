import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useTranslation();

  return (
    <div 
      className="fixed top-4 right-4 flex items-center p-1 bg-slate-700 rounded-full shadow-lg z-50 cursor-pointer"
      onClick={toggleLanguage}
      role="radiogroup"
      aria-label="Language selection"
    >
      <div className="relative flex items-center">
        <span 
          className={`absolute bg-indigo-600 h-7 w-10 rounded-full transition-transform duration-300 ease-in-out`}
          style={{ transform: language === 'en' ? 'translateX(0px)' : 'translateX(40px)' }}
        ></span>
        <span 
          className="relative z-10 w-10 h-7 text-sm font-bold text-white flex items-center justify-center"
          aria-label="English"
        >
          EN
        </span>
        <span 
          className="relative z-10 w-10 h-7 text-sm font-bold text-white flex items-center justify-center"
          aria-label="Ukrainian"
        >
          УКР
        </span>
      </div>
    </div>
  );
};
export default LanguageToggle;
