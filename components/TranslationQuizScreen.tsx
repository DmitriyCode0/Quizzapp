
import React, { useState, useEffect, useRef } from 'react';
import { TranslationQuestion, TranslationUserAnswer, FeedbackItem, CEFRLevel, Language, TeacherPersona } from '../types';
import { evaluateTranslationAnswer } from '../services/geminiService';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';
import { useQuizLogic } from '../hooks/useQuizLogic';
import QuizLayout from './QuizLayout';
import DiffViewer from './DiffViewer';

interface TranslationQuizScreenProps {
  questions: TranslationQuestion[];
  onComplete: (answers: TranslationUserAnswer[]) => void;
  isTimedMode: boolean;
  cefrLevel: CEFRLevel;
  language: Language;
  onBack: () => void;
  selectedGrammarTopics?: string[];
  teacherPersona?: TeacherPersona;
}

const TranslationQuizScreen: React.FC<TranslationQuizScreenProps> = ({ 
    questions, 
    onComplete, 
    isTimedMode, 
    cefrLevel, 
    language, 
    onBack,
    selectedGrammarTopics = [],
    teacherPersona = 'standard' as TeacherPersona
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number, feedback: FeedbackItem[] } | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);
  
  const {
    currentIndex,
    timeLeft,
    isPaused,
    setIsPaused,
    isAnswered,
    handleNext,
    addAnswer
  } = useQuizLogic<TranslationUserAnswer>({
    totalQuestions: questions.length,
    isTimedMode,
    onComplete,
    onTimeUp: () => handleCheckAnswer(),
    externalStopTimer: isEvaluating // Pause timer while AI evaluates
  });
  
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const currentQuestion = questions[currentIndex];

  // Reset local state
  useEffect(() => {
    setInputValue('');
    setEvaluation(null);
    setIsEvaluating(false);
    setIsSkipped(false);
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
        language,
        selectedGrammarTopics,
        teacherPersona
    );
    
    setIsEvaluating(false);
    setEvaluation(evalResult);
    addAnswer({
      questionId: currentQuestion.id,
      userAnswer,
      correctAnswer: currentQuestion.englishAnswer,
      score: evalResult.score,
      feedback: evalResult.feedback,
    });
  };
  
  const handleSkip = () => {
    if (isAnswered || isEvaluating) return;
    
    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setIsSkipped(true);
    setEvaluation({ score: 0, feedback: [] });
    addAnswer({
      questionId: currentQuestion.id,
      userAnswer: 'Skipped',
      correctAnswer: currentQuestion.englishAnswer,
      score: 0,
      feedback: [],
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

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        formRef.current?.requestSubmit();
    }
  };
  
  const getInputBorderColor = () => {
      if (!isAnswered || !evaluation) return 'border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900/30';
      if (teacherPersona === 'learning') return 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20';
      if (evaluation.score >= 90) return 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      if (evaluation.score >= 70) return 'border-amber-500 ring-1 ring-amber-500 bg-amber-50 dark:bg-amber-900/20';
      return 'border-rose-500 ring-1 ring-rose-500 bg-rose-50 dark:bg-rose-900/20';
  }

  return (
    <QuizLayout
        title={t('translationQuizScreen.translateQuestion_x_of_y', { current: currentIndex + 1, total: questions.length })}
        progress={((currentIndex + 1) / questions.length) * 100}
        isTimedMode={isTimedMode}
        timeLeft={timeLeft}
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onBack={onBack}
    >
            <form ref={formRef} onSubmit={formSubmitHandler} className="flex flex-col items-center">
                {selectedGrammarTopics.length > 0 && (
                    <div className="w-full mb-6 flex flex-wrap gap-2 justify-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider self-center">{t('common.grammarFocus')}:</span>
                        {selectedGrammarTopics.map(topic => (
                            <span key={topic} className="text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-100 dark:border-slate-600 shadow-sm">
                                {topic}
                            </span>
                        ))}
                    </div>
                )}
                
                <div className="w-full text-center mb-6">
                    <label htmlFor="translation-input" className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('translationQuizScreen.translateLabel')}</label>
                    <div className="flex flex-col items-center justify-center gap-3 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[8rem]">
                        <p className="text-2xl font-serif font-medium text-slate-900 dark:text-slate-100 text-center leading-relaxed">
                            {currentQuestion.ukrainianSentence}
                        </p>
                        <AudioButton textToSpeak={currentQuestion.ukrainianSentence} lang="uk-UA" />
                    </div>
                </div>
                
                {!isAnswered ? (
                    <textarea
                        id="translation-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleTextareaKeyDown}
                        disabled={isEvaluating}
                        placeholder={t('translationQuizScreen.textareaPlaceholder')}
                        className={`w-full h-32 p-4 bg-white dark:bg-slate-900 border rounded-xl shadow-sm focus:ring-4 focus:outline-none transition-all duration-200 resize-none mb-6 text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 ${getInputBorderColor()}`}
                        autoFocus
                    />
                ) : (
                    <div className={`w-full min-h-[8rem] p-4 border rounded-xl shadow-sm mb-6 text-lg leading-relaxed ${getInputBorderColor()}`}>
                        {evaluation ? (
                            <DiffViewer 
                                userAnswer={inputValue} 
                                correctAnswer={currentQuestion.englishAnswer} 
                                isCorrectOverride={evaluation.score >= 100}
                                mode="words"
                                hideMissing={true}
                            />
                        ) : (
                            <span className="text-slate-800 dark:text-slate-200">{inputValue}</span>
                        )}
                    </div>
                )}

                {isEvaluating && (
                    <div className="flex items-center gap-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full animate-pulse">
                        <div className="w-4 h-4 border-2 border-t-indigo-600 dark:border-t-indigo-400 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
                        <span>{t('translationQuizScreen.evaluating')}</span>
                    </div>
                )}

                {isAnswered && evaluation && (
                    <div className="text-center mb-8 animate-fade-in w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
                        {timeLeft <= 0 && !isEvaluating && <p className="text-rose-600 dark:text-rose-400 font-bold mb-2">{t('common.timesUp')}</p>}
                        
                        {isSkipped ? (
                             <p className="text-xl font-bold text-amber-500 dark:text-amber-400">{t('translationQuizScreen.questionSkipped')}</p>
                        ) : (
                            teacherPersona !== 'learning' && (
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                    {t('translationQuizScreen.score')} <span className={evaluation.score >= 90 ? 'text-emerald-600 dark:text-emerald-400' : evaluation.score >= 70 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>{evaluation.score}%</span>
                                </p>
                            )
                        )}

                        {!isSkipped && evaluation.feedback.length > 0 && (
                            <div className="mt-4 text-left bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-2">{t('common.feedback')}</p>
                                <div className="space-y-2">
                                    {evaluation.feedback.map((item, index) => (
                                        <div key={index} className="flex gap-2 text-sm">
                                            <span className={`font-bold ${item.type === 'bonus' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.topic}:</span>
                                            <span className="text-slate-600 dark:text-slate-400">{item.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {(evaluation.score < 100 || isSkipped || teacherPersona === 'learning') && (
                            <div className="mt-4 text-left border-t border-slate-100 dark:border-slate-700 pt-4">
                                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wide mb-2">{t('translationQuizScreen.suggestedAnswer')}</p>
                                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-3 rounded-lg">
                                    <p className="font-medium text-emerald-800 dark:text-emerald-300 flex-grow">{currentQuestion.englishAnswer}</p>
                                    <AudioButton textToSpeak={currentQuestion.englishAnswer} lang="en-US" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="w-full max-w-sm flex flex-col items-center gap-4">
                    <button
                        type="submit"
                        disabled={(!isAnswered && !inputValue.trim()) || isEvaluating}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {isAnswered ? (currentIndex < questions.length - 1 ? t('common.nextQuestion') : t('common.finishQuiz')) : (isEvaluating ? t('translationQuizScreen.evaluating') : t('common.checkAnswer'))}
                    </button>
                    {!isAnswered && !isEvaluating && (
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm transition-colors hover:underline"
                        >
                            {t('common.skipQuestion')}
                        </button>
                    )}
                </div>
            </form>
    </QuizLayout>
  );
};

export default TranslationQuizScreen;
