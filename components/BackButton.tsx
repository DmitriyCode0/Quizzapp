
import React from 'react';
import ArrowIcon from './icons/ArrowIcon';
import { useTranslation } from '../hooks/useTranslation';

interface BackButtonProps {
    onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
    const { t } = useTranslation();
    return (
        <button 
            onClick={onClick} 
            className="absolute top-0 left-0 md:fixed md:top-6 md:left-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold py-2.5 px-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all hover:shadow-md text-sm z-40 flex items-center gap-2"
            aria-label={t('common.backToMenu')}
        >
            <ArrowIcon className="transform rotate-180 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <span>{t('common.backToMenu')}</span>
        </button>
    );
};

export default BackButton;
