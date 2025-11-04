
import React from 'react';
import { Question, UserAnswer } from '../types';

interface McqResultsScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  onContinue: () => void;
  onRestart: () => void;
}

const McqResultsScreen: React.FC<McqResultsScreenProps> = ({ userAnswers, questions, onContinue, onRestart }) => {
  const score = userAnswers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getFeedbackMessage = () => {
    if (percentage === 100) return "Perfect Score! Ready for a new challenge?";
    if (percentage >= 80) return "Excellent work! Let's test your skills further.";
    if (percentage >= 60) return "Good job! Try the next level to solidify your knowledge.";
    return "Nice try! The next level is a great way to practice the words you missed.";
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-indigo-400">Level 1 Complete!</h1>
      
      <div className="text-center">
        <p className="text-slate-300 text-lg">Your Multiple Choice Score</p>
        <p className="text-6xl font-bold my-2">{score} / {total}</p>
        <p className="text-2xl text-indigo-400 font-semibold">{percentage}%</p>
      </div>

      <p className="text-slate-300 text-lg text-center">{getFeedbackMessage()}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm mt-4">
        <button
            onClick={onContinue}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
            Continue to Level 2 (Gap-fill)
        </button>
        <button
            onClick={onRestart}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
            Start a New Quiz
        </button>
      </div>
    </div>
  );
};

export default McqResultsScreen;
