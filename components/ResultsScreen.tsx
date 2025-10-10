
import React from 'react';
import { Question, UserAnswer } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface ResultsScreenProps {
  userAnswers: UserAnswer[];
  questions: Question[];
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userAnswers, questions, onRestart }) => {
  const score = userAnswers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getFeedbackMessage = () => {
    if (percentage === 100) return "Perfect Score! You're a vocabulary master!";
    if (percentage >= 80) return "Excellent work! You really know your stuff.";
    if (percentage >= 60) return "Good job! A little more practice and you'll be an expert.";
    return "Nice try! Keep practicing to improve your score.";
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in flex flex-col items-center gap-6">
      <h1 className="text-4xl font-bold text-indigo-400">Quiz Complete!</h1>
      
      <div className="text-center">
        <p className="text-slate-300 text-lg">Your Score</p>
        <p className="text-6xl font-bold my-2">{score} / {total}</p>
        <p className="text-2xl text-indigo-400 font-semibold">{percentage}%</p>
      </div>

      <p className="text-slate-300 text-lg text-center">{getFeedbackMessage()}</p>
      
      <button
        onClick={onRestart}
        className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 mt-4"
      >
        Try Another Quiz
      </button>

      <div className="w-full mt-6 pt-6 border-t border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-center">Review Your Answers</h2>
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {questions.map((question, index) => {
            const answer = userAnswers.find(a => a.questionId === question.id);
            if (!answer) return null;
            return (
              <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                <p className="font-semibold text-slate-200 mb-2">Q{index + 1}: {question.question}</p>
                <p className={`flex items-center gap-2 font-medium ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {answer.isCorrect ? <CheckIcon /> : <XIcon />}
                  Your answer: {answer.selectedAnswer}
                </p>
                {!answer.isCorrect && (
                  <p className="flex items-center gap-2 font-medium text-green-400 mt-1">
                    <CheckIcon />
                    Correct answer: {answer.correctAnswer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
