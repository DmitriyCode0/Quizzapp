
import React, { useState } from 'react';
import Logo from './Logo';
import AudioButton from './AudioButton';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';

interface TranslationListScreenProps {
  sentences: string[];
  title: string;
  onRestart: () => void;
}

const TranslationListScreen: React.FC<TranslationListScreenProps> = ({ sentences, title, onRestart }) => {
  const { t } = useTranslation();
  const [copyButtonText, setCopyButtonText] = useState(t('translationListScreen.copyToClipboard'));
  
  const handleCopy = () => {
    const textToCopy = sentences.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText(t('common.copied'));
      setTimeout(() => setCopyButtonText(t('translationListScreen.copyToClipboard')), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('Failed to copy');
       setTimeout(() => setCopyButtonText(t('translationListScreen.copyToClipboard')), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl animate-fade-in flex flex-col items-center gap-6 relative mx-auto min-h-[80vh] transition-colors duration-300">
        <BackButton onClick={onRestart} />
        
        <div className="flex flex-col items-center gap-4 mt-4">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                <Logo className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center tracking-tight">{title}</h1>
        </div>
        
        <div className="w-full mt-4 flex-grow">
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <ol className="list-decimal list-inside space-y-4 text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-serif">
              {sentences.map((sentence, index) => (
                <li key={index} className="flex items-start gap-3 py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <span className="flex-grow">{sentence}</span>
                  <div className="mt-1">
                    <AudioButton textToSpeak={sentence} lang="uk-UA" />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mt-6">
          <button
            onClick={handleCopy}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 px-6 rounded-xl shadow-sm transition-all"
          >
            {copyButtonText}
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-transform transform hover:scale-[1.02]"
          >
            {t('common.createSomethingNew')}
          </button>
        </div>
    </div>
  );
};

export default TranslationListScreen;
