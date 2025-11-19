import React, { useState, useEffect, useRef } from 'react';
import { TranslationQuestion, TranslationUserAnswer, FeedbackItem, CEFRLevel, Language } from '../types';
import { evaluateTranslationAnswer } from '../services/geminiService';
import PauseIcon from './icons/PauseIcon';
import PlayIcon from './icons/PlayIcon';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';

interface TranslationQuizScreenProps {
  questions: TranslationQuestion[];
  onComplete: (answers: TranslationUserAnswer[]) => void;
  isTimedMode: boolean;
  cefrLevel: CEFRLevel;
  language: Language;
}

const TranslationQuizScreen: React.FC<TranslationQuizScreenProps> = ({ questions, onComplete, isTimedMode, cefrLevel, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number, feedback: FeedbackItem[] } | null>(null);
  const [userAnswers, setUserAnswers] = useState<TranslationUserAnswer[]>([]);
  const [isSkipped, setIsSkipped] = useState(false);

  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const currentQuestion = questions[currentIndex];

  // Timer countdown effect
  useEffect(() => {
    if (!isTimedMode || isPaused || isAnswered || isEvaluating) return;

    if (timeLeft <= 0) {
      handleCheckAnswer();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isTimedMode, isPaused, isAnswered, isEvaluating]);

  // Question change effect
  useEffect(() => {
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setInputValue('');
    setIsAnswered(false);
    setEvaluation(null);
    setIsEvaluating(false);
    setIsSkipped(false);
    setTimeLeft(30);
    setIsPaused(false);
    document.getElementById('translation-input')?.focus();
  }, [currentIndex]);

  const handleCheckAnswer = async () => {
    if (isAnswered || isEvaluating) return;
    
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setIsSkipped(false);
    setIsEvaluating(true);
    const userAnswer = inputValue.trim();
    const evalResult = await evaluateTranslationAnswer(
        userAnswer,
        currentQuestion.englishAnswer,
        currentQuestion.ukrainianSentence,
        currentQuestion.originalTerm,
        cefrLevel,
        language
    );
    
    setIsEvaluating(false);
    setIsAnswered(true);
    setEvaluation(evalResult);
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.englishAnswer,
      score: evalResult.score,
      feedback: evalResult.feedback,
    }]);
  };
  
  const handleSkip = () => {
    if (isAnswered || isEvaluating) return;
    
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setIsSkipped(true);
    const skippedAnswer = {
      questionId: currentQuestion.id,
      userAnswer: 'Skipped',
      correctAnswer: currentQuestion.englishAnswer,
      score: 0,
      feedback: [],
    };

    setIsAnswered(true);
    setEvaluation({ score: 0, feedback: [] });
    setUserAnswers(prev => [...prev, skippedAnswer]);
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

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        formRef.current?.requestSubmit();
    }
  };
  
  const getInputBorderColor = () => {
      if (!isAnswered || !evaluation) return 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500';
      if (evaluation.score >= 90) return 'border-green-500 ring-green-500';
      if (evaluation.score >= 70) return 'border-yellow-500 ring-yellow-500';
      return 'border-red-500 ring-red-500';
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
                <p className="text-indigo-400 font-semibold">{t('translationQuizScreen.translateQuestion_x_of_y', { current: currentIndex + 1, total: questions.length })}</p>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <form ref={formRef} onSubmit={formSubmitHandler} className="flex flex-col items-center">
                <div className="w-full text-center mb-6">
                    <label htmlFor="translation-input" className="block text-lg font-medium text-slate-300 mb-2">{t('translationQuizScreen.translateLabel')}</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-900 rounded-md">
                        <p className="text-2xl font-semibold text-slate-100 min-h-[5rem] flex-grow text-center">
                            {currentQuestion.ukrainianSentence}
                        </p>
                        <AudioButton textToSpeak={currentQuestion.ukrainianSentence} lang="uk-UA" />
                    </div>
                </div>
                
                <textarea
                    id="translation-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={isAnswered || isEvaluating}
                    placeholder={t('translationQuizScreen.textareaPlaceholder')}
                    className={`w-full h-32 p-4 bg-slate-700 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-300 resize-none mb-6 ${getInputBorderColor()}`}
                    autoFocus
                />

                {isEvaluating && (
                    <div className="flex items-center gap-3 text-lg text-slate-300 mb-6">
                        <div className="w-6 h-6 border-2 border-t-indigo-400 border-slate-600 rounded-full animate-spin"></div>
                        <span>{t('translationQuizScreen.evaluating')}</span>
                    </div>
                )}

                {isAnswered && evaluation && (
                    <div className="text-center mb-6 animate-fade-in w-full bg-slate-900/50 p-4 rounded-lg">
                        {timeLeft <= 0 && !isEvaluating && <p className="text-red-400 font-bold mb-2">{t('common.timesUp')}</p>}
                        
                        {isSkipped ? (
                             <p className="text-2xl font-bold text-yellow-400">{t('translationQuizScreen.questionSkipped')}</p>
                        ) : (
                            <p className="text-2xl font-bold">
                                {t('translationQuizScreen.score')} <span className={evaluation.score >= 90 ? 'text-green-400' : evaluation.score >= 70 ? 'text-yellow-400' : 'text-red-400'}>{evaluation.score}%</span>
                            </p>
                        )}

                        {!isSkipped && evaluation.feedback.length > 0 && (
                            <div className="mt-3 text-left">
                                <p className="font-semibold text-indigo-300">{t('common.feedback')}</p>
                                <div className="space-y-1 mt-1">
                                    {evaluation.feedback.map((item, index) => (
                                        <p key={index} className="text-slate-200">- <span className="font-semibold">{item.topic}:</span> {item.message}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {(evaluation.score < 100 || isSkipped) && (
                            <div className="mt-3 text-left border-t border-slate-700 pt-3">
                                <p className="text-slate-300 text-md">{t('translationQuizScreen.suggestedAnswer')}</p>
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold text-green-400 flex-grow">{currentQuestion.englishAnswer}</p>
                                    <AudioButton textToSpeak={currentQuestion.englishAnswer} lang="en-US" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="w-full max-w-sm flex flex-col items-center gap-3">
                    <button
                        type="submit"
                        disabled={(!isAnswered && !inputValue.trim()) || isEvaluating}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        {isAnswered ? (currentIndex < questions.length - 1 ? t('common.nextQuestion') : t('common.finishQuiz')) : (isEvaluating ? t('translationQuizScreen.evaluating') : t('common.checkAnswer'))}
                    </button>
                    {!isAnswered && !isEvaluating && (
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="bg-transparent hover:bg-slate-700 text-slate-400 font-semibold py-2 px-4 border border-slate-600 rounded-lg transition"
                        >
                            {t('common.skipQuestion')}
                        </button>
                    )}
                </div>
            </form>
        </div>
    </div>
  );
};

export default TranslationQuizScreen;