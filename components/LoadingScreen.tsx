
import React from 'react';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 mx-auto w-full max-w-md transition-colors duration-300">
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
        <Logo isSpinning={true} className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{message || t('loadingScreen.generating')}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{t('loadingScreen.craftingMessage')}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
