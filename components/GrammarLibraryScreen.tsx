
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CEFRLevel } from '../types';
import { grammarLibrary } from '../data/grammarLibrary';
import BackButton from './BackButton';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';

const levels: Exclude<CEFRLevel, 'A1 ukr'>[] = ['A1', 'A2', 'B1', 'B2', 'C1'/*, 'C2'*/];

const GrammarLibraryScreen: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<string>('A1');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTopics = useMemo(() => {
        return grammarLibrary.filter(topic => {
            const matchesLevel = selectedLevel === 'All' || topic.level === selectedLevel;
            const matchesSearch = 
                topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesLevel && matchesSearch;
        });
    }, [selectedLevel, searchQuery]);

    return (
        <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl mx-auto min-h-[80vh] flex flex-col transition-colors duration-300">
            <BackButton onClick={() => navigate('/')} />
            
            <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-4">
                    <Logo className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('grammarLibrary.title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-center max-w-lg">{t('grammarLibrary.subtitle')}</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm py-4 z-10 border-b border-slate-100 dark:border-slate-800 w-full transition-colors duration-300">
                {/* Level Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                    {levels.map(lvl => (
                        <button
                            key={lvl}
                            onClick={() => setSelectedLevel(lvl)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex-shrink-0 border ${
                                selectedLevel === lvl 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder={t('grammarLibrary.searchPlaceholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-2 pl-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-white shadow-sm placeholder-slate-400 dark:placeholder-slate-500"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Grid */}
            {filteredTopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTopics.map(topic => (
                        <div 
                            key={topic.id}
                            onClick={() => navigate(`/grammar/${topic.id}`)}
                            className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wide ${
                                    topic.level.startsWith('A') ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800' :
                                    topic.level.startsWith('B') ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800' :
                                    'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800'
                                }`}>
                                    {topic.level}
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">{topic.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{topic.description}</p>
                            
                            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
                                {topic.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{t('grammarLibrary.noResults')}</p>
                    <button onClick={() => { setSearchQuery(''); setSelectedLevel('All'); }} className="text-indigo-600 dark:text-indigo-400 mt-2 hover:underline font-medium">
                        {t('grammarLibrary.clearFilters')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default GrammarLibraryScreen;
