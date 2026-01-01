
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { grammarLibrary } from '../data/grammarLibrary';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';
import B1_PastSimpleVsPresentPerfect from './grammar/B1_PastSimpleVsPresentPerfect';
import A2_FirstConditional from './grammar/A2_FirstConditional';
import A1_ThisThatTheseThose from './grammar/A1_ThisThatTheseThose';
import A1_PresentSimpleToDo from './grammar/A1_PresentSimpleToDo';

const GrammarTopicScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const topic = grammarLibrary.find(t => t.id === id);

    if (!topic) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 dark:text-slate-400">
                <p>Topic not found</p>
                <button onClick={() => navigate('/grammar')} className="text-indigo-600 dark:text-indigo-400 mt-2 hover:underline font-medium">Back to Library</button>
            </div>
        );
    }

    const handlePractice = () => {
        navigate('/', { 
            state: { 
                practiceTopic: topic.searchKey, 
                practiceLevel: topic.level 
            } 
        });
    };

    // Helper to render specific components for manual topics
    const renderTopicContent = () => {
        if (topic.id === 'b1-past-simple-or-present-perfect') {
            return <B1_PastSimpleVsPresentPerfect />;
        }
        if (topic.id === 'a2-first-conditional') {
            return <A2_FirstConditional />;
        }
        if (topic.id === 'a1-this-that-these-those') {
            return <A1_ThisThatTheseThose />;
        }
        if (topic.id === 'a1-present-simple') {
            return <A1_PresentSimpleToDo />;
        }

        // Default generic view
        return (
            <>
                <section>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{t('grammarLibrary.explanation')}</h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                        {topic.description}
                    </p>
                </section>

                <section className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t('grammarLibrary.examples')}
                    </h2>
                    <p className="text-xl text-slate-800 dark:text-slate-200 font-medium italic pl-4 border-l-4 border-indigo-400 dark:border-indigo-600">
                        "{topic.example}"
                    </p>
                </section>
            </>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 md:p-12 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl mx-auto min-h-[80vh] flex flex-col relative transition-colors duration-300">
            <BackButton onClick={() => navigate('/grammar')} />
            
            {/* Header */}
            <div className="mt-8 mb-10 border-b border-slate-100 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className={`text-sm font-bold px-3 py-1 rounded-lg shadow-sm border ${
                        topic.level.startsWith('A') ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                        topic.level.startsWith('B') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                        'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-800'
                    }`}>
                        {topic.level}
                    </span>
                    {topic.tags.map(tag => (
                        <span key={tag} className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">#{tag}</span>
                    ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{topic.title}</h1>
            </div>

            {/* Content */}
            <div className="flex-grow space-y-10">
                {renderTopicContent()}
            </div>

            {/* Footer Action */}
            <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur pb-6 -mx-6 px-6 md:-mx-12 md:px-12">
                <button
                    onClick={handlePractice}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                >
                    <span>{t('grammarLibrary.practiceButton')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default GrammarTopicScreen;
