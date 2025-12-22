
import React from 'react';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';

interface QuizLayoutProps {
    children: React.ReactNode;
    title: string;
    progress: number; // 0 to 100
    isTimedMode: boolean;
    timeLeft: number;
    isPaused: boolean;
    onPauseToggle: () => void;
    onBack: () => void;
}

const QuizLayout: React.FC<QuizLayoutProps> = ({
    children,
    title,
    progress,
    isTimedMode,
    timeLeft,
    isPaused,
    onPauseToggle,
    onBack
}) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl animate-fade-in relative mx-auto transition-colors duration-300 text-slate-900 dark:text-slate-100">
            <BackButton onClick={onBack} />
            
            {isTimedMode && (
                <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
                    <div className={`text-xl font-bold px-4 py-2 rounded-lg shadow-sm border transition-colors ${timeLeft <= 5 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 animate-pulse' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>
                        {timeLeft}
                    </div>
                    <button
                        onClick={onPauseToggle}
                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-3 rounded-full text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
                        aria-label={isPaused ? t('common.resume') : t('common.paused')}
                    >
                        {isPaused ? <PlayIcon /> : <PauseIcon />}
                    </button>
                </div>
            )}

            {isPaused && isTimedMode && (
                <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-2xl transition-colors">
                    <h2 className="text-4xl font-bold mb-6 text-slate-800 dark:text-white">{t('common.paused')}</h2>
                    <button onClick={onPauseToggle} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg transition-colors">
                        {t('common.resume')}
                    </button>
                </div>
            )}

            <div className={isPaused ? 'blur-sm pointer-events-none select-none' : ''}>
                <div className="mb-8">
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wide text-center sm:text-left sm:ml-12 mb-3">{title}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
                
                {children}
            </div>
        </div>
    );
};

export default QuizLayout;
