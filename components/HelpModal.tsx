
import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';
import { useTranslation } from '../hooks/useTranslation';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'general' | 'scoring' | 'cefr'>('general');
    const [activeScoringMode, setActiveScoringMode] = useState<'quizzes' | 'translation' | 'matching'>('quizzes');

    const steps = [
        {
            number: 1,
            title: t('helpModal.step1Title'),
            desc: t('helpModal.step1Desc'),
            icon: "📝"
        },
        {
            number: 2,
            title: t('helpModal.step2Title'),
            desc: t('helpModal.step2Desc'),
            icon: "⚙️"
        },
        {
            number: 3,
            title: t('helpModal.step3Title'),
            desc: t('helpModal.step3Desc'),
            icon: "🚀"
        }
    ];

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={t('common.close')}
                >
                    <CloseIcon />
                </button>

                <div className="text-center mt-2">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t('helpModal.title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{t('helpModal.subtitle')}</p>
                </div>

                {/* Tab Switcher */}
                <div className="flex justify-center gap-2 md:gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-4 py-2 font-semibold text-sm rounded-full transition-all ${activeTab === 'general' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-500 dark:ring-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        {t('helpModal.tabGeneral')}
                    </button>
                    <button
                        onClick={() => setActiveTab('scoring')}
                        className={`px-4 py-2 font-semibold text-sm rounded-full transition-all ${activeTab === 'scoring' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-500 dark:ring-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        {t('helpModal.tabScoring')}
                    </button>
                    <button
                        onClick={() => setActiveTab('cefr')}
                        className={`px-4 py-2 font-semibold text-sm rounded-full transition-all ${activeTab === 'cefr' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-500 dark:ring-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        {t('helpModal.tabCefr')}
                    </button>
                </div>

                {activeTab === 'general' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {steps.map((step) => (
                                <div key={step.number} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md transition-all hover:border-slate-200 dark:hover:border-slate-600">
                                    <div className="text-3xl mb-3">{step.icon}</div>
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs mb-3">
                                        {step.number}
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm">{step.title}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200 flex gap-3 items-start">
                            <span className="text-xl">💡</span>
                            <p><strong className="font-bold uppercase text-xs tracking-wide block mb-1">{t('common.tip')}</strong> {t('helpModal.proTip')}</p>
                        </div>
                    </>
                )} 
                
                {activeTab === 'scoring' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2 justify-center">
                             <button
                                onClick={() => setActiveScoringMode('quizzes')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${activeScoringMode === 'quizzes' ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                            >
                                {t('helpModal.scoringQuizzes')}
                            </button>
                             <button
                                onClick={() => setActiveScoringMode('translation')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${activeScoringMode === 'translation' ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                            >
                                {t('helpModal.scoringTranslation')}
                            </button>
                             <button
                                onClick={() => setActiveScoringMode('matching')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${activeScoringMode === 'matching' ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
                            >
                                {t('helpModal.scoringMatching')}
                            </button>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            {activeScoringMode === 'quizzes' && (
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">MCQ & Gap-Fill (Binary Scoring)</h4>
                                    <p className="mb-3">{t('helpModal.scoringQuizzesDesc')}</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                                        <li><strong>1 Point:</strong> Correct answer.</li>
                                        <li><strong>0 Points:</strong> Incorrect answer, skipped question, or time run out.</li>
                                    </ul>
                                </div>
                            )}
                            {activeScoringMode === 'translation' && (
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Translation (Expert Tutor)</h4>
                                    <p className="mb-3">{t('helpModal.scoringTranslationDesc')}</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                                        <li className="font-bold text-slate-800 dark:text-slate-200">{t('helpModal.scoringTransBase')}</li>
                                        <li>{t('helpModal.scoringTransDeductGrammar')}</li>
                                        <li>{t('helpModal.scoringTransDeductSpelling')}</li>
                                        <li>{t('helpModal.scoringTransDeductStyle')}</li>
                                        <li className="text-amber-600 dark:text-amber-400">{t('helpModal.scoringTransBonus')}</li>
                                    </ul>
                                </div>
                            )}
                            {activeScoringMode === 'matching' && (
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Matching (Error Counting)</h4>
                                    <p className="mb-3">{t('helpModal.scoringMatchingDesc')}</p>
                                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                                        <li><strong>Perfect:</strong> 0 incorrect attempts.</li>
                                        <li><strong>Goal:</strong> Match all 6 pairs with as few clicks as possible.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'cefr' && (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{t('helpModal.cefrIntro')}</p>
                        
                        <div className="grid grid-cols-1 gap-4">
                            {/* A1 */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border-l-4 border-l-emerald-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex justify-between items-center">
                                    A1: Beginner
                                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded uppercase font-extrabold tracking-wider border border-emerald-100 dark:border-emerald-800">{t('helpModal.cefrFocusSurvival')}</span>
                                </h4>
                                <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.goal')}:</strong> {t('helpModal.cefrA1Goal')}</li>
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.forgiven')}:</strong> {t('helpModal.cefrA1Forgiven')}</li>
                                </ul>
                            </div>

                            {/* A2 */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border-l-4 border-l-teal-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex justify-between items-center">
                                    A2: Elementary
                                    <span className="text-[10px] bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 px-2 py-1 rounded uppercase font-extrabold tracking-wider border border-teal-100 dark:border-teal-800">{t('helpModal.cefrFocusBasic')}</span>
                                </h4>
                                <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.goal')}:</strong> {t('helpModal.cefrA2Goal')}</li>
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.forgiven')}:</strong> {t('helpModal.cefrA2Forgiven')}</li>
                                </ul>
                            </div>

                            {/* B1 */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border-l-4 border-l-blue-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex justify-between items-center">
                                    B1: Intermediate
                                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded uppercase font-extrabold tracking-wider border border-blue-100 dark:border-blue-800">{t('helpModal.cefrFocusB1')}</span>
                                </h4>
                                <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.goal')}:</strong> {t('helpModal.cefrB1Goal')}</li>
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.forgiven')}:</strong> {t('helpModal.cefrB1Forgiven')}</li>
                                </ul>
                            </div>

                            {/* B2 */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex justify-between items-center">
                                    B2: Upper Intermediate
                                    <span className="text-[10px] bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded uppercase font-extrabold tracking-wider border border-indigo-100 dark:border-indigo-800">{t('helpModal.cefrFocusB2')}</span>
                                </h4>
                                <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.goal')}:</strong> {t('helpModal.cefrB2Goal')}</li>
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.forgiven')}:</strong> {t('helpModal.cefrB2Forgiven')}</li>
                                </ul>
                            </div>

                            {/* C1 */}
                            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border-l-4 border-l-violet-500 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex justify-between items-center">
                                    C1: Advanced
                                    <span className="text-[10px] bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-2 py-1 rounded uppercase font-extrabold tracking-wider border border-violet-100 dark:border-violet-800">{t('helpModal.cefrFocusC1')}</span>
                                </h4>
                                <ul className="mt-3 text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.goal')}:</strong> {t('helpModal.cefrC1Goal')}</li>
                                    <li><strong className="text-slate-900 dark:text-white">{t('helpModal.forgiven')}:</strong> {t('helpModal.cefrC1Forgiven')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                    {t('helpModal.getStarted')}
                </button>
            </div>
        </div>
    );
};

export default HelpModal;
