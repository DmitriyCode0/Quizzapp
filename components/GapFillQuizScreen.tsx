import React, { useState, useEffect } from 'react';
import { GapFillQuestion, GapFillUserAnswer } from '../types';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';

interface GapFillQuizScreenProps {
  questions: GapFillQuestion[];
  onComplete: (answers: GapFillUserAnswer[]) => void;
  isTimedMode: boolean;
}

const GapFillQuizScreen: React.FC<GapFillQuizScreenProps> = ({ questions, onComplete, isTimedMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [userAnswers, setUserAnswers] = useState<GapFillUserAnswer[]>([]);
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  const currentQuestion = questions[currentIndex];
  const [start, end] = currentQuestion.sentence.split('____');

  // Timer countdown effect
  useEffect(() => {
    if (!isTimedMode || isPaused || isAnswered) return;

    if (timeLeft <= 0) {
      handleCheckAnswer();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isTimedMode, isPaused, isAnswered]);


  // Question change effect
  useEffect(() => {
    setInputValue('');
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setTimeLeft(30);
    setIsPaused(false);
    document.getElementById('gap-fill-input')?.focus();
  }, [currentIndex]);

  const handleCheckAnswer = () => {
    if (isAnswered) return;

    const userAnswer = inputValue.trim();
    const correctAnswer = currentQuestion.correctAnswer;
    const correct = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    setIsAnswered(true);
    setIsCorrect(correct);
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer,
      isCorrect: correct,
    }]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(userAnswers);
    }
  };

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) {
        handleNext();
    } else {
        handleCheckAnswer();
    }
  }
  
  const inputBorderColor = isAnswered 
    ? (isCorrect ? 'border-green-500' : 'border-red-500') 
    : 'border-slate-600 focus:border-indigo-500';

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
                <p className="text-indigo-400 font-semibold">Question {currentIndex + 1} of {questions.length}</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <form onSubmit={formSubmitHandler} className="flex flex-col items-center">
                <div className="text-2xl font-medium text-slate-100 mb-6 text-center leading-relaxed">
                    <span>{start}</span>
                    <div className="inline-block mx-2">
                        <input
                            id="gap-fill-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isAnswered}
                            className={`bg-slate-700 border-b-2 ${inputBorderColor} text-center text-2xl font-bold text-white w-48 focus:outline-none transition-colors duration-300 p-1`}
                            autoFocus
                            autoComplete="off"
                        />
                    </div>
                    <span>{end}</span>
                </div>

                <div className="flex flex-col items-center gap-4 mb-8">
                    <button 
                        type="button"
                        onClick={() => setShowHint(true)} 
                        disabled={showHint || isAnswered}
                        className="bg-transparent border border-slate-500 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
                        Show Hint
                    </button>
                    {showHint && <p className="text-slate-400">Hint (Ukrainian): {currentQuestion.hint}</p>}
                </div>

                {isAnswered && (
                    <div className="text-center mb-6 animate-fade-in">
                        {timeLeft <= 0 && <p className="text-red-400 font-bold">Time's up!</p>}
                        <p className={`text-xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {isCorrect ? 'Correct!' : 'Not quite!'}
                        </p>
                        {!isCorrect && (
                            <p className="text-slate-300 text-lg">
                                The correct answer is: <span className="font-bold text-green-400">{currentQuestion.correctAnswer}</span>
                            </p>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isAnswered && !inputValue.trim()}
                    className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    {isAnswered ? (currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz") : "Check Answer"}
                </button>
            </form>
        </div>
    </div>
  );
};

export default GapFillQuizScreen;