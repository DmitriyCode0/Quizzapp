
import React from 'react';
import CloseIcon from './icons/CloseIcon';
import { useTranslation } from '../hooks/useTranslation';
import { APP_VERSION } from '../constants';

interface InfoModalProps {
  onClose: () => void;
}

const versionHistory = [
    {
        version: '1.25.1',
        changes: ['uiTweaks']
    },
    {
        version: '1.25.0',
        changes: ['changeGrammarSingleSelect']
    },
    {
        version: '1.24.0',
        changes: ['changeLevelSplit']
    },
    {
        version: '1.23.4',
        changes: ['changeBetterHighlighting']
    },
    {
        version: '1.23.3',
        changes: ['changeRemoveTip']
    },
    {
        version: '1.23.2',
        changes: ['changeCleanHighlighting']
    },
    {
        version: '1.23.1',
        changes: ['changeScoringTweak']
    },
    {
        version: '1.23.0',
        changes: ['changeScoringRefinement']
    },
    {
        version: '1.22.0',
        changes: ['featureMistakeHighlighting', 'featureSmartValidation']
    },
    {
        version: '1.21.0',
        changes: ['changeA1Demonstratives', 'fixDarkModeArticles']
    },
    {
        version: '1.20.0',
        changes: ['changeTeacherMode', 'changeB2C1Refactor']
    },
    {
        version: '1.19.0',
        changes: ['changeA1Refactor', 'changeGrammarUI']
    },
    {
        version: '1.18.1',
        changes: ['fixLibraryReset']
    },
    {
        version: '1.18.0',
        changes: ['changeGeminiTTS', 'changeAudioSettings', 'changeThemePersistence', 'changeLanguagePersistence']
    },
    {
        version: '1.17.0',
        changes: ['changeDarkMode', 'changeLogo']
    },
    {
        version: '1.16.1',
        changes: ['changeFirstConditional']
    },
    {
        version: '1.16.0',
        changes: ['changeRebranding']
    },
    {
        version: '1.15.1',
        changes: ['changeCheatsheet']
    },
    {
        version: '1.15.0',
        changes: ['changeGrammarLibrary', 'changeScoringLogic']
    },
    {
        version: '1.14.0',
        changes: ['changeRouter']
    },
    {
        version: '1.13.1',
        changes: ['changeMobileLayout']
    },
    {
        version: '1.13.0',
        changes: ['changeMobileSwipe', 'changeMobileMatching']
    },
    {
        version: '1.12.1',
        changes: ['fixMobileModal']
    },
    {
        version: '1.12.0',
        changes: ['changeHistoryBadges']
    },
    {
        version: '1.11.0',
        changes: ['changeFlashcardsAnim', 'changeLayout', 'changeOptimization']
    },
    {
        version: '1.10.0',
        changes: ['changeHelpGuide', 'changeScoringDocs', 'changeTooltips', 'changeSampleData']
    },
    {
        version: '1.9.0',
        changes: ['changeParser', 'changeTopicFocus']
    },
    {
        version: '1.8.0',
        changes: ['changeUserCabinet']
    },
    {
        version: '1.7.0',
        changes: ['changeGrammarFocus']
    },
    {
        version: '1.6.0',
        changes: ['changeFlashcards', 'changeTTS']
    }
];

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full flex flex-col gap-4 relative max-h-[90vh] border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={t('common.close')}
                >
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-1">{t('infoModal.title')}</h2>
                <div className="text-center bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex-shrink-0">
                    <p className="font-medium text-slate-600 dark:text-slate-300 text-sm">{t('infoModal.version')} <span className="font-bold text-indigo-600 dark:text-indigo-400">{APP_VERSION}</span></p>
                </div>
                
                <div className="mt-2 text-left flex-1 min-h-0 overflow-hidden flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4 flex-shrink-0">{t('infoModal.historyTitle')}</h3>
                    <div className="overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                        {versionHistory.map((item) => (
                            <div key={item.version} className="border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2 flex items-center gap-2">
                                    v{item.version}
                                    {item.version === APP_VERSION && (
                                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">{t('common.current')}</span>
                                    )}
                                </h4>
                                <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                                    {item.changes.map((changeKey) => (
                                        <li key={changeKey}>{t(`infoModal.${changeKey}`)}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-transform transform hover:scale-[1.02] flex-shrink-0"
                >
                    {t('common.close')}
                </button>
            </div>
        </div>
    );
};

export default InfoModal;
