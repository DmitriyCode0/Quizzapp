import React, { useState } from 'react';

interface TranslationListScreenProps {
  sentences: string[];
  title: string;
  onRestart: () => void;
}

const ExportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const TranslationListScreen: React.FC<TranslationListScreenProps> = ({ sentences, title, onRestart }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copy to Clipboard');
  const [showExportModal, setShowExportModal] = useState(false);

  const handleCopy = () => {
    const textToCopy = sentences.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyButtonText('Copied!');
      setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('Failed to copy');
       setTimeout(() => setCopyButtonText('Copy to Clipboard'), 2000);
    });
  };
  
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTxt = () => {
    const content = sentences.join('\n\n');
    downloadFile(content, 'translation_sentences.txt', 'text/plain');
    setShowExportModal(false);
  };

  const handleExportCsv = () => {
    const header = 'Ukrainian Sentence';
    const rows = sentences.map(s => `"${s.replace(/"/g, '""')}"`);
    const content = `${header}\n${rows.join('\n')}`;
    downloadFile(content, 'translation_sentences.csv', 'text/csv');
    setShowExportModal(false);
  };

  return (
    <>
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-indigo-400">{title}</h1>
        
        <div className="w-full mt-4 pt-4 border-t border-slate-700">
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 bg-slate-900 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-3 text-slate-200 text-lg">
              {sentences.map((sentence, index) => (
                <li key={index}>{sentence}</li>
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
                onClick={() => setShowExportModal(true)}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
                <ExportIcon />
                Export Sentences
            </button>
          <button
            onClick={onRestart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            Create Something New
          </button>
        </div>
      </div>
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowExportModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-sm w-full flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center text-indigo-400 mb-2">Export Sentences</h2>
            <button onClick={handleExportTxt} className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Download as .txt</button>
            <button onClick={handleExportCsv} className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Download as .csv</button>
          </div>
        </div>
      )}
    </>
  );
};

export default TranslationListScreen;
