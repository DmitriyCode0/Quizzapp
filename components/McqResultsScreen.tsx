
import React from 'react';
import { Question, UserAnswer } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface McqResultsScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  onContinue: () => void;
  onRestart: () => void;
}

const McqResultsScreen: React.FC<McqResultsScreenProps> = ({ userAnswers, questions, onContinue, onRestart }) => {
  const { t } = useTranslation();
  const score = userAnswers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getFeedbackMessage = () => {
    if (percentage === 100) return t('common.correct');
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 60) return "Good job!";
    return t('common.notQuite');
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl animate-fade-in flex flex-col items-center gap-6 mx-auto">
      <div className="p-3 bg-indigo-50 rounded-full mb-2">
        <span className="text-4xl">🎉</span>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Level 1 Complete!</h1>
      
      <div className="text-center space-y-2">
        <p className="text-slate-500 font-medium uppercase text-xs tracking-wider">Your Score</p>
        <div className="flex flex-col items-center">
            <span className="text-6xl font-extrabold text-slate-900">{score} <span className="text-3xl text-slate-300 font-normal">/ {total}</span></span>
            <span className="text-indigo-600 font-bold text-xl bg-indigo-50 px-3 py-1 rounded-lg mt-2">{percentage}%</span>
        </div>
      </div>

      <p className="text-slate-600 text-lg text-center font-medium">{getFeedbackMessage()}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
        <button
            onClick={onContinue}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-transform transform hover:scale-[1.02]"
        >
            Continue to Level 2
        </button>
        <button
            onClick={onRestart}
            className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-4 rounded-xl shadow-sm transition-colors"
        >
            {t('common.createSomethingNew')}
        </button>
      </div>
    </div>
  );
};

export default McqResultsScreen;
