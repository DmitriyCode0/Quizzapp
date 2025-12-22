
import React from 'react';
import { Question, UserAnswer } from '../../../types';
import CheckIcon from '../../icons/CheckIcon';
import XIcon from '../../icons/XIcon';
import AudioButton from '../../AudioButton';
import { useTranslation } from '../../../hooks/useTranslation';

interface McqReviewItemProps {
    question: Question;
    answer: UserAnswer;
    index: number;
    questionLang: 'en-US' | 'uk-UA';
}

const McqReviewItem: React.FC<McqReviewItemProps> = ({ question, answer, index, questionLang }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition-colors">
            <div className="flex items-start gap-4 justify-between font-semibold text-slate-800 dark:text-slate-200 mb-3">
                <div className="flex gap-2">
                    <span className="text-slate-400 dark:text-slate-500 text-sm font-bold mt-0.5">Q{index + 1}</span>
                    <p className="flex-grow leading-snug">{question.question}</p>
                </div>
                <div className="flex-shrink-0">
                    <AudioButton textToSpeak={question.question} lang={questionLang} />
                </div>
            </div>
            
            <div className={`flex flex-wrap items-center gap-3 font-medium p-3 rounded-lg border ${answer.isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800 text-rose-800 dark:text-rose-300'}`}>
                {answer.isCorrect ? <CheckIcon /> : <XIcon />}
                <span className="flex-grow break-words text-sm">{t('common.yourAnswer')} <span className="font-bold">{answer.selectedAnswer}</span></span>
                <AudioButton textToSpeak={answer.selectedAnswer} lang="en-US" />
            </div>
            
            {!answer.isCorrect && (
                <div className="flex flex-wrap items-center gap-3 font-medium text-emerald-700 dark:text-emerald-400 mt-2 pl-3 text-sm">
                    <div className="w-5 flex justify-center"><CheckIcon /></div>
                    <span className="flex-grow break-words">{t('common.correctAnswer')} <span className="font-bold">{answer.correctAnswer}</span></span>
                    <AudioButton textToSpeak={answer.correctAnswer} lang="en-US" />
                </div>
            )}
        </div>
    );
};

export default McqReviewItem;
