
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { GenerationType } from '../../types';

interface ActivitySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: GenerationType) => void;
    isTimed: boolean;
    setIsTimed: (val: boolean) => void;
}

const ActivitySelectionModal: React.FC<ActivitySelectionModalProps> = ({ isOpen, onClose, onSelect, isTimed, setIsTimed }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full flex flex-col gap-5 max-h-[90vh] border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">{t('inputScreen.modalTitle')}</h2>

                <div className="flex items-center justify-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{t('inputScreen.timedMode')}</span>
                    <span className="text-[10px] md:text-xs text-slate-400 font-medium">{t('inputScreen.timedModeDesc')}</span>
                    <button
                        type="button"
                        onClick={() => setIsTimed(!isTimed)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 focus:ring-indigo-500 ${isTimed ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                        aria-pressed={isTimed}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm ${isTimed ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                        { type: 'flashcards', title: t('inputScreen.flashcardsTitle'), desc: t('inputScreen.flashcardsDesc'), icon: "🗂️" },
                        { type: 'mcq', title: t('inputScreen.mcqTitle'), desc: '', icon: "✅" },
                        { type: 'gap_fill', title: t('inputScreen.gapFillTitle'), desc: '', icon: "📝" },
                        { type: 'translate_uk_en', title: t('inputScreen.translateSentencesTitle'), desc: '', icon: "🔄" },
                        { type: 'text_translation', title: t('inputScreen.textTranslationTitle'), desc: '', icon: "📄" },
                        { type: 'translation_list', title: t('inputScreen.translationListTitle'), desc: t('inputScreen.translationListDesc'), icon: "📋" },
                        { type: 'discussion', title: t('inputScreen.discussionTitle'), desc: t('inputScreen.discussionDesc'), icon: "💬" },
                        { type: 'agree_disagree', title: t('inputScreen.agreeDisagreeTitle'), desc: t('inputScreen.agreeDisagreeDesc'), icon: "⚖️" },
                        { type: 'matching', title: t('inputScreen.matchingTitle'), desc: t('inputScreen.matchingDesc'), icon: "🔗" }
                    ].map((item) => (
                        <button
                            key={item.type}
                            onClick={() => onSelect(item.type as GenerationType)}
                            className="text-left w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500/50 rounded-xl transition-all duration-200 touch-manipulation group shadow-sm hover:shadow-md flex items-start gap-4"
                        >
                            <div className="text-2xl bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                {item.desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ActivitySelectionModal;
