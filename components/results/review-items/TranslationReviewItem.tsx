
import React from 'react';
import { TranslationQuestion, TranslationUserAnswer, FeedbackType } from '../../../types';
import StarIcon from '../../icons/StarIcon';
import InfoIcon from '../../icons/InfoIcon';
import AudioButton from '../../AudioButton';
import DiffViewer from '../../DiffViewer';
import { useTranslation } from '../../../hooks/useTranslation';
import { getGrade } from '../../../utils/grading';

interface TranslationReviewItemProps {
    question: TranslationQuestion;
    answer: TranslationUserAnswer;
    index: number;
}

const FeedbackIcon: React.FC<{type: FeedbackType}> = ({ type }) => {
    switch(type) {
        case 'bonus': return <StarIcon />;
        case 'grammar':
        case 'error': return <InfoIcon />;
        default: return null;
    }
};

const TranslationReviewItem: React.FC<TranslationReviewItemProps> = ({ question, answer, index }) => {
    const { t } = useTranslation();
    const grade = getGrade(answer.score);
    // Override default score color for light/dark mode
    const getScoreColorClass = (score: number) => {
        if (score >= 90) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800';
        if (score >= 70) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800';
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800';
    };

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm flex flex-col gap-4">
             {/* Header: Question and Score */}
             <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1 w-full">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">Q{index + 1}: {t('translationQuizScreen.translateLabel')}</p>
                    <div className="flex items-center gap-3 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        <p className="flex-grow font-serif text-lg">"{question.ukrainianSentence}"</p>
                        <AudioButton textToSpeak={question.ukrainianSentence} lang="uk-UA" />
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-lg border font-bold flex items-center gap-2 ${getScoreColorClass(answer.score)}`}>
                    <span className="text-2xl">{answer.score}%</span>
                    <span className="text-sm opacity-80">({grade})</span>
                </div>
            </div>

            {/* User Answer with Diff */}
            <div className="flex items-start gap-3 flex-wrap pl-1 border-l-4 border-indigo-200 dark:border-indigo-800">
                <span className="font-bold text-sm text-slate-500 dark:text-slate-400 shrink-0 mt-1">{t('common.yourAnswer')}</span>
                <div className="flex items-center gap-2 flex-grow">
                    <span className="text-lg leading-snug">
                        <DiffViewer 
                            userAnswer={answer.userAnswer} 
                            correctAnswer={answer.correctAnswer} 
                            isCorrectOverride={answer.score >= 100}
                            mode="words"
                            hideMissing={true}
                        />
                    </span>
                    <AudioButton textToSpeak={answer.userAnswer} lang="en-US" />
                </div>
            </div>

            {/* Feedback */}
            {answer.feedback.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-3">
                    <p className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wide">{t('common.feedback')}</p>
                    {answer.feedback.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                            <div className="flex-shrink-0 mt-0.5"><FeedbackIcon type={item.type} /></div>
                            <div className="text-slate-600 dark:text-slate-400">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{item.topic}:</span> {item.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TranslationReviewItem;
