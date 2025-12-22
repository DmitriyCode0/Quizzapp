
import React from 'react';
import { HistoryItem } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface HistoryViewProps {
    history: HistoryItem[];
    onClearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, onClearHistory }) => {
    const { t } = useTranslation();

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getScoreColorClass = (score: number) => {
        if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
        if (score >= 60) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
    };

    if (history.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-sm font-medium">{t('dashboard.noHistory')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-end mb-2">
                <button onClick={onClearHistory} className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                    {t('dashboard.clearHistory')}
                </button>
            </div>
            {history.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 hover:shadow-md transition-shadow">
                    <div className="flex-grow w-full md:w-auto">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-base">{t(`inputScreen.${item.type === 'translate_uk_en' ? 'translateSentencesTitle' : item.type === 'mcq' ? 'mcqTitle' : item.type === 'gap_fill' ? 'gapFillTitle' : item.type === 'text_translation' ? 'textTranslationTitle' : item.type === 'matching' ? 'matchingTitle' : 'discussionTitle'}`)}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 items-center">
                            <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {formatDate(item.date)}
                            </span>
                            {item.details && <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">{item.details}</span>}
                        </div>
                        {item.grammarTopics && item.grammarTopics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {item.grammarTopics.map(t => (
                                    <span key={t} className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end md:text-right md:flex-shrink-0 md:ml-4 border-t md:border-0 border-slate-100 dark:border-slate-700 pt-2 md:pt-0 mt-1 md:mt-0">
                        <span className="md:hidden text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">{t('common.yourResult')}</span>
                        {item.score !== undefined && item.total !== undefined ? (
                            <div className={`font-bold text-sm px-3 py-1 rounded-full border ${getScoreColorClass(Math.round((item.score / item.total) * 100))}`}>
                                {item.score}/{item.total}
                            </div>
                        ) : item.score !== undefined ? (
                            <div className={`font-bold text-sm px-3 py-1 rounded-full border ${getScoreColorClass(item.score)}`}>
                                {item.score}%
                            </div>
                        ) : (
                            <div className="text-slate-500 dark:text-slate-400 text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">{t('common.completed')}</div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HistoryView;
