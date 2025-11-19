
import React from 'react';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';

interface LoadingScreenProps {
    message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 bg-slate-800 rounded-lg shadow-2xl">
      <Logo isSpinning={true} />
      <h2 className="text-2xl font-semibold text-slate-200">{message || t('loadingScreen.generating')}</h2>
      <p className="text-slate-400">{t('loadingScreen.craftingMessage')}</p>
    </div>
  );
};

export default LoadingScreen;
