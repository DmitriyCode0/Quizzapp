
import React from 'react';
import CloseIcon from './icons/CloseIcon';
import { useTranslation } from '../hooks/useTranslation';
import { useAudio } from '../hooks/useAudio';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { audioSource, toggleAudioSource } = useAudio();

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full flex flex-col gap-6 relative border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={t('common.close')}
                >
                    <CloseIcon />
                </button>
                
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{t('settings.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('settings.audioDesc')}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-3">{t('settings.audioSource')}</label>
                    <button 
                        onClick={toggleAudioSource}
                        className="w-full flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors shadow-sm"
                    >
                        <div className="flex flex-col text-left">
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                                {audioSource === 'gemini' ? t('settings.audioGemini') : t('settings.audioBrowser')}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                {audioSource === 'gemini' ? 'Gemini AI (High Quality)' : 'Web Speech API (Offline)'}
                            </span>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${audioSource === 'gemini' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${audioSource === 'gemini' ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl transition-colors"
                >
                    {t('common.done')}
                </button>
            </div>
        </div>
    );
};

export default SettingsModal;
