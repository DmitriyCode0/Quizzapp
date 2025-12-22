
import React, { useState } from 'react';
import { CEFRLevel } from '../types';
import Logo from './Logo';
import AudioButton from './AudioButton';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';

interface DiscussionScreenProps {
  prompts: string[];
  title: string;
  onRestart: () => void;
  cefrLevel: CEFRLevel;
}

const DiscussionScreen: React.FC<DiscussionScreenProps> = ({ prompts, title, onRestart, cefrLevel }) => {
  const { t } = useTranslation();
  const [copyButtonText, setCopyButtonText] = useState(t('discussionScreen.copyToClipboard'));
  
  const isUkr = cefrLevel === 'A1 ukr';
  const lang = isUkr ? 'uk-UA' : 'en-US';

  const handleCopy = () => {
    const textToCopy = prompts.join('\n\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText(t('common.copied'));
      setTimeout(() => setCopyButtonText(t('discussionScreen.copyToClipboard')), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('Failed to copy');
       setTimeout(() => setCopyButtonText(t('discussionScreen.copyToClipboard')), 2000);
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
          <div className="space-y-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <ol className="list-decimal list-inside space-y-6 text-slate-800 dark:text-slate-200 text-lg leading-relaxed">
              {prompts.map((prompt, index) => (
                <li key={index} className="pl-2 border-l-4 border-indigo-200 dark:border-indigo-800 py-1">
                  <div className="flex items-start justify-between gap-4">
                      <span>{prompt}</span>
                      <div className="mt-1">
                        <AudioButton textToSpeak={prompt} lang={lang} />
                      </div>
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

export default DiscussionScreen;
