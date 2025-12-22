
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      className="hidden md:flex fixed bottom-4 right-4 items-center p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-md hover:shadow-lg transition-all z-50 cursor-pointer select-none"
      onClick={toggleTheme}
      role="button"
      aria-label="Toggle Dark Mode"
    >
      <div className="relative flex items-center">
        <span 
          className={`absolute bg-slate-100 dark:bg-slate-700 h-7 w-7 rounded-full transition-transform duration-300 ease-out shadow-sm`}
          style={{ transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0%)' }}
        ></span>
        
        <div className="relative z-10 w-7 h-7 flex items-center justify-center text-amber-500">
            {/* Sun Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        </div>
        
        <div className="relative z-10 w-7 h-7 flex items-center justify-center text-indigo-400">
            {/* Moon Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
