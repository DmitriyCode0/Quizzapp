import React from 'react';
import Tooltip from '../Tooltip';
import { useTranslation } from '../../hooks/useTranslation';

interface SmartParserPanelProps {
    rawInput: string;
    onRawInputChange: (value: string) => void;
    onParse: () => void;
    isParsing: boolean;
}

const SmartParserPanel: React.FC<SmartParserPanelProps> = ({ rawInput, onRawInputChange, onParse, isParsing }) => {
    const { t } = useTranslation();

    return (
        <div className="text-left bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    {t('inputScreen.parserTitle')}
                </h2>
                <Tooltip text={t('inputScreen.parserTooltip')} position="top" />
            </div>
            
            <div className="flex flex-col gap-3">
                <textarea
                    value={rawInput}
                    onChange={(e) => onRawInputChange(e.target.value)}
                    placeholder={t('inputScreen.parserPlaceholder')}
                    className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all duration-200 resize-none text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-600"
                />
                <button
                    type="button"
                    onClick={onParse}
                    disabled={isParsing || !rawInput.trim()}
                    className="self-start bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                    {isParsing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                            {t('inputScreen.parsing')}
                        </>
                    ) : (
                        <>
                            <span>✨</span> {t('inputScreen.parseButton')}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SmartParserPanel;