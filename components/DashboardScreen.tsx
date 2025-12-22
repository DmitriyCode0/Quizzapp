
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedList, HistoryItem } from '../types';
import { getSavedLists, deleteList, getHistory, clearHistory } from '../services/storageService';
import Logo from './Logo';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';
import SavedListsView from './dashboard/SavedListsView';
import HistoryView from './dashboard/HistoryView';

interface DashboardScreenProps {
  onLoadList: (rawText: string) => void;
  onBack?: () => void; // Kept as optional for backward compatibility if needed
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onLoadList }) => {
  const [activeTab, setActiveTab] = useState<'lists' | 'history'>('lists');
  const [lists, setLists] = useState<SavedList[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setLists(getSavedLists());
    setHistory(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm(t('dashboard.confirmDelete'))) {
      const updated = deleteList(id);
      setLists(updated);
    }
  };

  const handleClearHistory = () => {
    if (confirm(t('dashboard.confirmClearHistory'))) {
        clearHistory();
        setHistory([]);
    }
  };

  const handleLoad = (text: string) => {
      onLoadList(text);
      navigate('/', { state: { loadListData: text } });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl animate-fade-in min-h-[80vh] flex flex-col mx-auto transition-colors duration-300">
      <BackButton onClick={() => navigate('/')} />
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-4">
            <Logo className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard.title')}</h1>
      </div>

      <div className="flex gap-2 mb-6 justify-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-center">
        <button
          onClick={() => setActiveTab('lists')}
          className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === 'lists' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          }`}
        >
          {t('dashboard.myLists')}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            activeTab === 'history' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          }`}
        >
          {t('dashboard.history')}
        </button>
      </div>

      <div className="flex-grow bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 overflow-y-auto max-h-[60vh] custom-scrollbar">
        {activeTab === 'lists' ? (
            <SavedListsView 
                lists={lists} 
                onLoadList={handleLoad} 
                onDelete={handleDelete} 
                onBack={() => navigate('/')} 
            />
        ) : (
            <HistoryView 
                history={history} 
                onClearHistory={handleClearHistory} 
            />
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
