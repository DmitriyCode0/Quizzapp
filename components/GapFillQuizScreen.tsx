
import React, { useState, useEffect } from 'react';
import { GapFillQuestion, GapFillUserAnswer, CEFRLevel } from '../types';
import AudioButton from './AudioButton';
import { useQuizLogic } from '../hooks/useQuizLogic';
import QuizLayout from './QuizLayout';
import DiffViewer from './DiffViewer';

interface GapFillQuizScreenProps {
  questions: GapFillQuestion[];
  onComplete: (answers: GapFillUserAnswer[]) => void;
  isTimedMode: boolean;
  cefrLevel: CEFRLevel;
  onBack: () => void;
}

const GapFillQuizScreen: React.FC<GapFillQuizScreenProps> = ({ questions, onComplete, isTimedMode, cefrLevel, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  
  const {
    currentIndex,
    timeLeft,
    isPaused,
    setIsPaused,
    isAnswered,
    handleNext,
    addAnswer
  } = useQuizLogic<GapFillUserAnswer>({
    totalQuestions: questions.length,
    isTimedMode,
    onComplete,
    onTimeUp: () => handleCheckAnswer()
  });

  const currentQuestion = questions[currentIndex];
  const [start, end] = currentQuestion.sentence.split('____');
  const isUkr = cefrLevel === 'A1 ukr';
  const sentenceLang = isUkr ? 'uk-UA' : 'en-US';
  const fullSentence = currentQuestion.sentence.replace('____', currentQuestion.correctAnswer);

  // Reset local state
  useEffect(() => {
    setInputValue('');
    setIsCorrect(false);
    setShowHint(false);
    setIsSkipped(false);
    document.getElementById('gap-fill-input')?.focus();
  }, [currentIndex]);

  const handleCheckAnswer = () => {
    if (isAnswered) return;

    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    const userAnswer = inputValue.trim();
    const correctAnswer = currentQuestion.correctAnswer;
    const correct = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
    
    setIsSkipped(false);
    setIsCorrect(correct);
    
    addAnswer({
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer,
      isCorrect: correct,
    });
  };
  
  const handleSkip = () => {
    if (isAnswered) return;
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setIsSkipped(true);
    setIsCorrect(false);
    addAnswer({
      questionId: currentQuestion.id,
      userAnswer: 'Skipped',
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
    });
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
    ? (isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-600' : 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-600') 
    : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50';

  return (
    <QuizLayout
        title={`Question ${currentIndex + 1} of ${questions.length}`}
        progress={((currentIndex + 1) / questions.length) * 100}
        isTimedMode={isTimedMode}
        timeLeft={timeLeft}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onBack={onBack}
    >
            <form onSubmit={formSubmitHandler} className="flex flex-col items-center">
                <div className="w-full flex flex-wrap items-baseline justify-center gap-x-2 gap-y-4 mb-8 leading-relaxed">
                    <span className="text-2xl font-medium text-slate-800 dark:text-slate-200 text-right">{start}</span>
                    <div className="inline-block relative">
                        {!isAnswered ? (
                            <input
                                id="gap-fill-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isAnswered}
                                className={`border-b-2 ${inputBorderColor} text-center text-2xl font-bold w-48 focus:outline-none transition-all duration-200 p-1 rounded-t-md`}
                                autoFocus
                                autoComplete="off"
                            />
                        ) : (
                            <div className={`border-b-2 ${inputBorderColor} text-center text-2xl w-48 p-1 rounded-t-md overflow-hidden whitespace-nowrap`}>
                                <DiffViewer userAnswer={inputValue} correctAnswer={currentQuestion.correctAnswer} />
                            </div>
                        )}
                    </div>
                    <span className="text-2xl font-medium text-slate-800 dark:text-slate-200 text-left">{end}</span>
                    <div className="ml-2 self-center">
                        <AudioButton textToSpeak={fullSentence} lang={sentenceLang} />
                    </div>
                </div>


                <div className="flex flex-col items-center gap-3 mb-8 min-h-[3rem]">
                    {!isAnswered && (
                        <>
                            <button 
                                type="button"
                                onClick={() => setShowHint(true)} 
                                disabled={showHint}
                                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                Show Hint
                            </button>
                            {showHint && <p className="text-slate-500 dark:text-slate-400 text-sm font-medium bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded border border-slate-100 dark:border-slate-700">Hint: {currentQuestion.hint}</p>}
                        </>
                    )}
                </div>

                {isAnswered && (
                    <div className="text-center mb-8 animate-fade-in w-full">
                        {timeLeft <= 0 && <p className="text-rose-600 dark:text-rose-400 font-bold">Time's up!</p>}
                        {isSkipped ? (
                             <p className="text-xl font-bold text-amber-500 dark:text-amber-400 mb-2">Question Skipped.</p>
                        ) : (
                            <p className={`text-xl font-bold mb-2 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {isCorrect ? 'Correct!' : 'Not quite!'}
                            </p>
                        )}
                        {!isCorrect && (
                            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl inline-block">
                                <p className="text-slate-500 dark:text-slate-400 text-sm uppercase font-bold mb-1">Correct Answer</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{currentQuestion.correctAnswer}</p>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="w-full max-w-sm flex flex-col items-center gap-4">
                    <button
                        type="submit"
                        disabled={!isAnswered && !inputValue.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-transform transform hover:-translate-y-0.5 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isAnswered ? (currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz") : "Check Answer"}
                    </button>
                    {!isAnswered && (
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm transition-colors hover:underline"
                        >
                            Skip Question
                        </button>
                    )}
                </div>
            </form>
    </QuizLayout>
  );
};

export default GapFillQuizScreen;
