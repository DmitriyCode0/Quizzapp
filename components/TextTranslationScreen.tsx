import React, { useState, useEffect, useRef } from 'react';
import { TextTranslationQuestion, TextTranslationUserAnswer, FeedbackItem, CEFRLevel, Language } from '../types';
import { evaluateTextTranslationAnswer } from '../services/geminiService';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';

interface TextTranslationScreenProps {
  question: TextTranslationQuestion;
  onComplete: (answer: TextTranslationUserAnswer) => void;
  cefrLevel: CEFRLevel;
  language: Language;
}

const TextTranslationScreen: React.FC<TextTranslationScreenProps> = ({ question, onComplete, cefrLevel, language }) => {
  const [inputValue, setInputValue] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<{ score: number, feedback: FeedbackItem[] } | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    document.getElementById('text-translation-input')?.focus();
  }, []);

  const handleCheckAnswer = async () => {
    if (isAnswered || isEvaluating) return;

    if (typeof window.speechSynthesis !== 'undefined') {
        window.speechSynthesis.cancel();
    }
    setIsEvaluating(true);
    const userAnswer = inputValue.trim();
    const evalResult = await evaluateTextTranslationAnswer(
        userAnswer,
        question.englishAnswer,
        question.ukrainianText,
        cefrLevel,
        language
    );
    
    setIsEvaluating(false);
    setIsAnswered(true);
    setEvaluation(evalResult);
  };

  const handleFinish = () => {
    if (!evaluation) return;
    onComplete({
        questionId: question.id,
        userAnswer: inputValue.trim(),
        correctAnswer: question.englishAnswer,
        score: evaluation.score,
        feedback: evaluation.feedback
    });
  };

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
      if (!isAnswered || !evaluation) return 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500';
      if (evaluation.score >= 90) return 'border-green-500 ring-green-500';
      if (evaluation.score >= 70) return 'border-yellow-500 ring-yellow-500';
      return 'border-red-500 ring-red-500';
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in">
        <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-indigo-400">{t('textTranslationScreen.title')}</h1>
            <p className="text-slate-300 mt-1">{t('textTranslationScreen.subtitle')}</p>
        </div>

        <form ref={formRef} onSubmit={formSubmitHandler} className="flex flex-col items-center">
            <div className="w-full text-left mb-4 p-4 bg-slate-900 rounded-md border border-slate-700 flex items-start gap-3">
                <p className="text-lg text-slate-200 leading-relaxed whitespace-pre-wrap flex-grow">
                    {question.ukrainianText}
                </p>
                <AudioButton textToSpeak={question.ukrainianText} lang="uk-UA" />
            </div>
            
            <textarea
                id="text-translation-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                disabled={isAnswered || isEvaluating}
                placeholder={t('textTranslationScreen.textareaPlaceholder')}
                className={`w-full h-48 p-4 bg-slate-700 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-300 resize-y mb-6 ${getInputBorderColor()}`}
                autoFocus
            />

            {isEvaluating && (
                <div className="flex items-center gap-3 text-lg text-slate-300 mb-6">
                    <div className="w-6 h-6 border-2 border-t-indigo-400 border-slate-600 rounded-full animate-spin"></div>
                    <span>{t('textTranslationScreen.evaluating')}</span>
                </div>
            )}

            {isAnswered && evaluation && (
                <div className="text-center mb-6 animate-fade-in w-full bg-slate-900/50 p-4 rounded-lg">
                    <p className="text-3xl font-bold">
                        {t('translationQuizScreen.score')} <span className={evaluation.score >= 90 ? 'text-green-400' : evaluation.score >= 70 ? 'text-yellow-400' : 'text-red-400'}>{evaluation.score}%</span>
                    </p>
                    <div className="mt-4 text-left space-y-3">
                        <div>
                            <p className="font-semibold text-indigo-300">{t('common.feedback')}</p>
                             <div className="space-y-1 mt-1">
                                {evaluation.feedback.map((item, index) => (
                                    <p key={index} className="text-slate-200">- <span className="font-semibold">{item.topic}:</span> {item.message}</p>
                                ))}
                            </div>
                        </div>
                        {evaluation.score < 100 && (
                            <div className="border-t border-slate-700 pt-3">
                                <p className="text-slate-300 text-md font-semibold">{t('translationQuizScreen.suggestedAnswer')}</p>
                                <div className="flex items-center gap-3">
                                    <p className="italic text-green-300 flex-grow">{question.englishAnswer}</p>
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
                className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isAnswered ? t('textTranslationScreen.finishAndSeeResults') : t('common.checkAnswer')}
            </button>
        </form>
    </div>
  );
};

export default TextTranslationScreen;