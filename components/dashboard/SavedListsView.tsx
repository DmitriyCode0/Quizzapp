
import React from 'react';
import { SavedList } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface SavedListsViewProps {
    lists: SavedList[];
    onLoadList: (rawText: string) => void;
    onDelete: (id: string) => void;
    onBack: () => void;
}

const SavedListsView: React.FC<SavedListsViewProps> = ({ lists, onLoadList, onDelete, onBack }) => {
    const { t } = useTranslation();

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (lists.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <p className="text-sm font-medium">{t('dashboard.noLists')}</p>
                <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium text-sm hover:underline">
                    {t('common.createSomethingNew')}
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lists.map(list => (
                <div key={list.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-700 transition-all flex flex-col gap-3 group">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{list.name}</h3>
                        <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded border border-slate-100 dark:border-slate-600">{formatDate(list.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <span className="w-2 h-2 bg-indigo-400 dark:bg-indigo-500 rounded-full"></span>
                        {t('dashboard.termCount', { count: list.termCount })}
                    </div>
                    <div className="mt-auto flex gap-3 pt-2">
                        <button
                            onClick={() => onLoadList(list.rawText)}
                            className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold py-2.5 rounded-lg transition-colors"
                        >
                            {t('dashboard.load')}
                        </button>
                        <button
                            onClick={() => onDelete(list.id)}
                            className="px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 text-slate-400 dark:text-slate-500 rounded-lg transition-all duration-200"
                            aria-label={t('common.delete')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SavedListsView;
