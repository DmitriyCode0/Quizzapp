
import React, { useState, useEffect } from 'react';
import { Question, UserAnswer, CEFRLevel } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';
import { useQuizLogic } from '../hooks/useQuizLogic';
import QuizLayout from './QuizLayout';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  isTimedMode: boolean;
  cefrLevel: CEFRLevel;
  onBack: () => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete, isTimedMode, cefrLevel, onBack }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { t } = useTranslation();

  const {
    currentIndex,
    timeLeft,
    isPaused,
    setIsPaused,
    isAnswered,
    handleNext,
    addAnswer
  } = useQuizLogic<UserAnswer>({
    totalQuestions: questions.length,
    isTimedMode,
    onComplete,
    onTimeUp: () => handleAnswerClick('__TIME_UP__')
  });

  const currentQuestion = questions[currentIndex];
  const isUkr = cefrLevel === 'A1 ukr';
  const questionLang = isUkr ? 'uk-UA' : 'en-US';

  // Reset local state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentIndex]);
  
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
    addAnswer({
      questionId: currentQuestion.id,
      selectedAnswer: displayedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    });
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
        return "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500";
    }
    if (option === currentQuestion.correctAnswer) {
        return "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300";
    }
    if (option === selectedAnswer) {
        return "bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 text-rose-800 dark:text-rose-300";
    }
    return "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 opacity-70";
  }

  return (
    <QuizLayout
        title={t('common.question_x_of_y', { current: currentIndex + 1, total: questions.length })}
        progress={((currentIndex + 1) / questions.length) * 100}
        isTimedMode={isTimedMode}
        timeLeft={timeLeft}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onBack={onBack}
    >
        <div className="flex items-start gap-4 justify-between mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white min-h-[3.5rem] flex-grow leading-snug">{currentQuestion.question}</h2>
            <div className="mt-1">
                <AudioButton textToSpeak={currentQuestion.question} lang={questionLang} />
            </div>
        </div>

        <div className="flex flex-col gap-3 mb-8">
            {currentQuestion.options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleAnswerClick(option)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex justify-between items-center group ${getButtonClass(option)}`}
                >
                    <span className="font-medium text-lg">{option}</span>
                    <div className="flex items-center gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                            <AudioButton textToSpeak={option} lang="en-US" />
                        </div>
                        {isAnswered && option === currentQuestion.correctAnswer && <CheckIcon />}
                        {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XIcon />}
                    </div>
                </button>
            ))}
        </div>

        {isAnswered ? (
            <div className="flex flex-col items-center animate-fade-in">
                {selectedAnswer === '__TIME_UP__' && <p className="text-rose-600 dark:text-rose-400 font-bold mb-4">{t('common.timesUp')}</p>}
                {selectedAnswer === '__SKIPPED__' && <p className="text-amber-600 dark:text-amber-400 font-bold mb-4">{t('quizScreen.questionSkipped')}</p>}
                <button
                    onClick={handleNext}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                    {currentIndex < questions.length - 1 ? t('common.nextQuestion') : t('common.finishQuiz')}
                </button>
            </div>
        ) : (
            <div className="text-center">
                <button
                    onClick={() => handleAnswerClick('__SKIPPED__')}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm transition-colors hover:underline"
                >
                    {t('common.skipQuestion')}
                </button>
            </div>
        )}
    </QuizLayout>
  );
};

export default QuizScreen;
