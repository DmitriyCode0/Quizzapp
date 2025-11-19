
import React from 'react';
import CloseIcon from './icons/CloseIcon';
import { useTranslation } from '../hooks/useTranslation';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
    const version = "1.6.0";
    const { t } = useTranslation();

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-lg w-full flex flex-col gap-4 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full transition-colors"
                    aria-label={t('common.close')}
                >
                    <CloseIcon />
                </button>
                <h2 className="text-3xl font-bold text-center text-indigo-400 mb-2">{t('infoModal.title')}</h2>
                <div className="text-center bg-slate-900/50 p-3 rounded-md">
                    <p className="font-semibold text-lg text-slate-200">{t('infoModal.version')} <span className="font-bold text-indigo-300">{version}</span></p>
                </div>
                <div className="mt-4 text-left">
                    <h3 className="font-semibold text-xl text-slate-100 mb-3">{t('infoModal.recentChanges', { version })}</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-300">
                        <li>{t('infoModal.changeGrammarFocus')}</li>
                        <li>{t('infoModal.changeFlashcards')}</li>
                        <li>{t('infoModal.changeTTS')}</li>
                        <li>{t('infoModal.changeInfo')}</li>
                        <li>{t('infoModal.changeLogo')}</li>
                        <li>{t('infoModal.changeSkip')}</li>
                        <li>{t('infoModal.changeExport')}</li>
                    </ul>
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    {t('common.close')}
                </button>
            </div>
        </div>
    );
};

export default InfoModal;