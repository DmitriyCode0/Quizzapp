
import React, { useState } from 'react';

interface InputScreenProps {
  onGenerateQuiz: (data: string) => void;
  error: string | null;
}

const InputScreen: React.FC<InputScreenProps> = ({ onGenerateQuiz, error }) => {
  const [quizletData, setQuizletData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizletData.trim()) {
      onGenerateQuiz(quizletData);
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl animate-fade-in text-center flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-indigo-400">Quizlet AI Quiz Generator</h1>
      <p className="text-slate-300">
        Transform your Quizlet sets into interactive multiple-choice quizzes!
      </p>
      
      <div className="text-left bg-slate-900 p-4 rounded-md border border-slate-700">
        <h2 className="font-semibold text-lg mb-2 text-slate-200">Instructions:</h2>
        <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1">
            <li>Go to your set on Quizlet.</li>
            <li>Click the "..." (More) button and select "Export".</li>
            <li>Under "Between term and definition", choose "Tab".</li>
            <li>Click "Copy text" and paste it into the box below.</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={quizletData}
          onChange={(e) => setQuizletData(e.target.value)}
          placeholder="Paste your Quizlet data here..."
          className="w-full h-48 p-4 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!quizletData.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          Generate Quiz
        </button>
      </form>
    </div>
  );
};

export default InputScreen;
