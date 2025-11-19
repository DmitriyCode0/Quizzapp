
import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, CEFRLevel } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';


interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  isTimedMode: boolean;
  cefrLevel: CEFRLevel;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete, isTimedMode, cefrLevel }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useTranslation();

  const currentQuestion = questions[currentQuestionIndex];
  const isUkr = cefrLevel === 'A1 ukr';
  const questionLang = isUkr ? 'uk-UA' : 'en-US';

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
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
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
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }

    const isTimeUp = option === '__TIME_UP__';
    const isSkipped = option === '__SKIPPED__';
    const isCorrect = !isTimeUp && !isSkipped && option === currentQuestion.correctAnswer;
    
    let displayedAnswer = option;
    if (isTimeUp) {
      displayedAnswer = t('common.timesUp');
    } else if (isSkipped) {
      displayedAnswer = t('common.skipped');
    }
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selectedAnswer: displayedAnswer,
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
                    aria-label={isPaused ? t('common.resume') : t('common.paused')}
                >
                    {isPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
            </div>
        )}

        {isPaused && isTimedMode && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
                <h2 className="text-4xl font-bold mb-6 text-slate-100">{t('common.paused')}</h2>
                <button onClick={() => setIsPaused(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
                    {t('common.resume')}
                </button>
            </div>
        )}

        <div className={isPaused ? 'blur-sm' : ''}>
            <div className="mb-6">
                <p className="text-indigo-400 font-semibold">{t('common.question_x_of_y', { current: currentQuestionIndex + 1, total: questions.length })}</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <div className="flex items-center gap-3 justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-100 min-h-[3.5rem] flex-grow">{currentQuestion.question}</h2>
              <AudioButton textToSpeak={currentQuestion.question} lang={questionLang} />
            </div>


            <div className="flex flex-col gap-4 mb-8">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerClick(option)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 flex justify-between items-center ${getButtonClass(option)}`}
                    >
                        <span className="font-medium">{option}</span>
                        <div className="flex items-center gap-2">
                            <AudioButton textToSpeak={option} lang="en-US" />
                            {isAnswered && option === currentQuestion.correctAnswer && <CheckIcon />}
                            {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XIcon />}
                        </div>
                    </button>
                ))}
            </div>

            {isAnswered ? (
                <div className="flex flex-col items-center">
                    {selectedAnswer === '__TIME_UP__' && <p className="text-red-400 font-bold mb-4">{t('common.timesUp')}</p>}
                    {selectedAnswer === '__SKIPPED__' && <p className="text-yellow-400 font-bold mb-4">{t('quizScreen.questionSkipped')}</p>}
                    <button
                        onClick={handleNext}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                    >
                        {currentQuestionIndex < questions.length - 1 ? t('common.nextQuestion') : t('common.finishQuiz')}
                    </button>
                </div>
            ) : (
                 <div className="text-center">
                    <button
                        onClick={() => handleAnswerClick('__SKIPPED__')}
                        className="bg-transparent hover:bg-slate-700 text-slate-400 font-semibold py-2 px-4 border border-slate-600 rounded-lg transition"
                    >
                        {t('common.skipQuestion')}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default QuizScreen;
