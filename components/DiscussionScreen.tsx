
import React, { useState } from 'react';
import { CEFRLevel } from '../types';
import Logo from './Logo';
import AudioButton from './AudioButton';
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
    <>
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in flex flex-col items-center gap-6">
        <Logo className="h-16 w-16 text-indigo-400" />
        <h1 className="text-4xl font-bold text-indigo-400">{title}</h1>
        
        <div className="w-full mt-4 pt-4 border-t border-slate-700">
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 bg-slate-900 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-3 text-slate-200 text-lg">
              {prompts.map((prompt, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="flex-grow">{prompt}</span>
                  <AudioButton textToSpeak={prompt} lang={lang} />
                </li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mt-4">
          <button
            onClick={handleCopy}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {copyButtonText}
          </button>
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            {t('common.createSomethingNew')}
          </button>
        </div>
      </div>
    </>
  );
};

export default DiscussionScreen;
