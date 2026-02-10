import React from 'react';
import Tooltip from '../Tooltip';
import { useTranslation } from '../../hooks/useTranslation';

interface ManualInputPanelProps {
    quizletData: string;
    onDataChange: (value: string) => void;
    onLoadSample: () => void;
    onSavePrompt: () => void;
}

const ManualInputPanel: React.FC<ManualInputPanelProps> = ({ quizletData, onDataChange, onLoadSample, onSavePrompt }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                    <label className="text-left font-semibold text-slate-800 dark:text-slate-200 text-sm">{t('inputScreen.manualInputTitle')}</label>
                    <Tooltip text={t('inputScreen.manualInputTooltip')} position="top" />
                </div>
                <button
                    type="button"
                    onClick={onLoadSample}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-2 py-1 rounded-md transition-colors"
                >
                    {t('inputScreen.loadSample')}
                </button>
            </div>
            <div className="relative group">
                <textarea
                    value={quizletData}
                    onChange={(e) => onDataChange(e.target.value)}
                    placeholder={t('inputScreen.textareaPlaceholder')}
                    className="w-full h-64 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline transition-all duration-200 resize-none text-base font-sans text-slate-700 dark:text-slate-300 leading-relaxed"
                    spellCheck={false}
                />
                {/* Decorative paper lines hint */}
                <div className="absolute top-0 left-0 w-full h-4 pointer-events-none bg-gradient-to-b from-slate-50/50 dark:from-slate-800/30 to-transparent rounded-t-xl"></div>

                {quizletData.trim().length > 0 && (
                    <button
                        type="button"
                        onClick={onSavePrompt}
                        className="absolute bottom-4 right-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                        title={t('dashboard.saveList')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                        </svg>
                        {t('common.save')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ManualInputPanel;