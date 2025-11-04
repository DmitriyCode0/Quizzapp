import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';


interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  isTimedMode: boolean;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete, isTimedMode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onComplete(userAnswers);
    }
  }, [currentQuestionIndex, questions.length, onComplete, userAnswers]);

  // Timer countdown effect
  useEffect(() => {
    if (!isTimedMode || isPaused || isAnswered) return;

    if (timeLeft <= 0) {
      handleAnswerClick('__TIME_UP__');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isTimedMode, isPaused, isAnswered]);


  // Question change effect
  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setIsPaused(false);
  }, [currentQuestionIndex]);
  
  // Enter key press effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isAnswered && !isPaused) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnswered, isPaused, handleNext]);


  const handleAnswerClick = (option: string) => {
    if (isAnswered) return;

    const isTimeUp = option === '__TIME_UP__';
    const isCorrect = !isTimeUp && option === currentQuestion.correctAnswer;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: isTimeUp ? "Time's Up" : option,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    }]);
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
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in relative">
        {isTimedMode && (
            <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
                <div className={`text-xl font-bold px-4 py-2 rounded-lg ${timeLeft <= 5 ? 'bg-red-600 animate-pulse' : 'bg-slate-700'}`}>
                    {timeLeft}
                </div>
                <button 
                    onClick={() => setIsPaused(!isPaused)} 
                    className="bg-slate-600 hover:bg-slate-500 p-3 rounded-full text-white transition-colors"
                    aria-label={isPaused ? "Resume quiz" : "Pause quiz"}
                >
                    {isPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
            </div>
        )}

        {isPaused && isTimedMode && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
                <h2 className="text-4xl font-bold mb-6 text-slate-100">Paused</h2>
                <button onClick={() => setIsPaused(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
                    Resume
                </button>
            </div>
        )}

        <div className={isPaused ? 'blur-sm' : ''}>
            <div className="mb-6">
                <p className="text-indigo-400 font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-slate-100 min-h-[3.5rem]">{currentQuestion.question}</h2>

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
                <div className="flex flex-col items-center">
                    {selectedAnswer === '__TIME_UP__' && <p className="text-red-400 font-bold mb-4">Time's up!</p>}
                    <button
                        onClick={handleNext}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default QuizScreen;