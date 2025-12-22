
import React, { useEffect } from 'react';
import { TextTranslationQuestion, TextTranslationUserAnswer, CEFRLevel, Language, TeacherPersona } from '../types';
import AudioButton from './AudioButton';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';
import { useTextTranslation } from '../hooks/useTextTranslation';
import DiffViewer from './DiffViewer';

interface TextTranslationScreenProps {
  question: TextTranslationQuestion;
  onComplete: (answer: TextTranslationUserAnswer) => void;
  cefrLevel: CEFRLevel;
  language: Language;
  onBack: () => void;
  selectedGrammarTopics?: string[];
  teacherPersona?: TeacherPersona;
}

const TextTranslationScreen: React.FC<TextTranslationScreenProps> = ({ 
    question, 
    onComplete, 
    cefrLevel, 
    language, 
    onBack,
    selectedGrammarTopics = [],
    teacherPersona = 'standard' as TeacherPersona
}) => {
  const { t } = useTranslation();
  
  const {
      inputValue,
      setInputValue,
      isAnswered,
      isEvaluating,
      evaluation,
      formRef,
      handleCheckAnswer,
      handleFinish
  } = useTextTranslation({ question, onComplete, cefrLevel, language, selectedGrammarTopics, teacherPersona });

  useEffect(() => {
    document.getElementById('text-translation-input')?.focus();
  }, []);

  const formSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered) {
      handleFinish();
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
      if (teacherPersona === 'learning') return 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'; // Neutral color
      if (evaluation.score >= 90) return 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
      if (evaluation.score >= 70) return 'border-amber-500 ring-1 ring-amber-500 bg-amber-50 dark:bg-amber-900/20';
      return 'border-rose-500 ring-1 ring-rose-500 bg-rose-50 dark:bg-rose-900/20';
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl animate-fade-in relative mx-auto flex flex-col min-h-[80vh] transition-colors duration-300">
        <BackButton onClick={onBack} />
        <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('textTranslationScreen.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{t('textTranslationScreen.subtitle')}</p>
        </div>

        <form ref={formRef} onSubmit={formSubmitHandler} className="flex flex-col items-center flex-grow">
            {selectedGrammarTopics.length > 0 && (
                <div className="w-full mb-6 flex flex-wrap gap-2 justify-center bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider self-center">{t('common.grammarFocus')}:</span>
                    {selectedGrammarTopics.map(topic => (
                        <span key={topic} className="text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded border border-indigo-100 dark:border-slate-600 shadow-sm">
                            {topic}
                        </span>
                    ))}
                </div>
            )}

            <div className="w-full text-left mb-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-4">
                <div className="flex-grow">
                    <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('textTranslationScreen.originalUkrainianText')}</label>
                    <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-serif">
                        {question.ukrainianText}
                    </p>
                </div>
                <div className="mt-6">
                    <AudioButton textToSpeak={question.ukrainianText} lang="uk-UA" />
                </div>
            </div>
            
            {isAnswered && evaluation ? (
                <div className={`w-full min-h-[12rem] p-5 border rounded-xl shadow-sm mb-8 text-lg leading-relaxed whitespace-pre-wrap ${getInputBorderColor()}`}>
                    <DiffViewer 
                        userAnswer={inputValue} 
                        correctAnswer={question.englishAnswer} 
                        isCorrectOverride={evaluation.score >= 100}
                        mode="words"
                        hideMissing={true}
                    />
                </div>
            ) : (
                <textarea
                    id="text-translation-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    disabled={isAnswered || isEvaluating}
                    placeholder={t('textTranslationScreen.textareaPlaceholder')}
                    className={`w-full h-48 p-5 bg-white dark:bg-slate-900 border rounded-xl shadow-sm focus:ring-4 focus:outline-none transition-all duration-200 resize-y mb-8 text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 leading-relaxed ${getInputBorderColor()}`}
                    autoFocus
                />
            )}

            {isEvaluating && (
                <div className="flex items-center gap-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full animate-pulse">
                    <div className="w-4 h-4 border-2 border-t-indigo-600 dark:border-t-indigo-400 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin"></div>
                    <span>{t('textTranslationScreen.evaluating')}</span>
                </div>
            )}

            {isAnswered && evaluation && (
                <div className="text-center mb-8 animate-fade-in w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-sm">
                    {teacherPersona !== 'learning' && (
                        <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-4xl font-bold text-slate-900 dark:text-white">
                                {t('translationQuizScreen.score')} <span className={evaluation.score >= 90 ? 'text-emerald-600 dark:text-emerald-400' : evaluation.score >= 70 ? 'text-amber-500 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>{evaluation.score}%</span>
                            </p>
                        </div>
                    )}
                    
                    <div className="text-left grid grid-cols-1 gap-6">
                        <div>
                            <p className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide mb-3">{t('common.feedback')}</p>
                             <div className="space-y-3">
                                {evaluation.feedback.map((item, index) => (
                                    <div key={index} className="flex gap-3 text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <span className={`font-bold shrink-0 ${item.type === 'bonus' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>{item.topic}:</span>
                                        <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {(evaluation.score < 100 || teacherPersona === 'learning') && (
                            <div>
                                <p className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide mb-2">{t('translationQuizScreen.suggestedAnswer')}</p>
                                <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-xl">
                                    <p className="text-emerald-800 dark:text-emerald-300 flex-grow leading-relaxed">{question.englishAnswer}</p>
                                    <AudioButton textToSpeak={question.englishAnswer} lang="en-US" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={(!isAnswered && !inputValue.trim()) || isEvaluating}
                className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {isAnswered ? t('textTranslationScreen.finishAndSeeResults') : t('common.checkAnswer')}
            </button>
        </form>
    </div>
  );
};

export default TextTranslationScreen;
