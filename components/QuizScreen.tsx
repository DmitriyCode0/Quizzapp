
import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] =useState<UserAnswer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleAnswerClick = (option: string) => {
    if (isAnswered) return;

    const isCorrect = option === currentQuestion.correctAnswer;
    setSelectedAnswer(option);
    setIsAnswered(true);
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: option,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(userAnswers);
    }
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
        return "bg-slate-700 hover:bg-slate-600";
    }
    if (option === currentQuestion.correctAnswer) {
        return "bg-green-600";
    }
    if (option === selectedAnswer) {
        return "bg-red-600";
    }
    return "bg-slate-700 opacity-60";
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in">
        <div className="mb-6">
            <p className="text-indigo-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-slate-100">{currentQuestion.question}</h2>

        <div className="flex flex-col gap-4 mb-8">
            {currentQuestion.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex justify-between items-center ${getButtonClass(option)}`}
                >
                    <span className="font-medium">{option}</span>
                    {isAnswered && option === currentQuestion.correctAnswer && <CheckIcon />}
                    {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XIcon />}
                </button>
            ))}
        </div>

        {isAnswered && (
            <button
                onClick={handleNext}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
        )}
    </div>
  );
};

export default QuizScreen;
