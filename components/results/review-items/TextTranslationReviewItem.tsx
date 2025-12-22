
import React from 'react';
import { TextTranslationQuestion, TextTranslationUserAnswer, FeedbackType } from '../../../types';
import StarIcon from '../../icons/StarIcon';
import InfoIcon from '../../icons/InfoIcon';
import AudioButton from '../../AudioButton';
import { useTranslation } from '../../../hooks/useTranslation';
import DiffViewer from '../../DiffViewer';

interface TextTranslationReviewItemProps {
    question: TextTranslationQuestion;
    answer: TextTranslationUserAnswer;
}

const FeedbackIcon: React.FC<{type: FeedbackType}> = ({ type }) => {
    switch(type) {
        case 'bonus': return <StarIcon />;
        case 'grammar':
        case 'error': return <InfoIcon />;
        default: return null;
    }
};

const TextTranslationReviewItem: React.FC<TextTranslationReviewItemProps> = ({ question, answer }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm space-y-8">
            {/* Original Text */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">{t('textTranslationScreen.originalUkrainianText')}</h3>
                <div className="flex items-start gap-4 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="flex-grow leading-relaxed whitespace-pre-wrap font-serif text-lg">"{question.ukrainianText}"</p>
                    <div className="flex-shrink-0">
                        <AudioButton textToSpeak={question.ukrainianText} lang="uk-UA" />
                    </div>
                </div>
            </div>

            {/* User Translation */}
            <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">{t('textTranslationScreen.yourTranslation')}</h3>
                <div className="flex items-start gap-4 text-slate-800 dark:text-slate-200 bg-indigo-50/30 dark:bg-indigo-900/10 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <p className="flex-grow leading-relaxed whitespace-pre-wrap text-lg">
                        <DiffViewer 
                            userAnswer={answer.userAnswer} 
                            correctAnswer={answer.correctAnswer} 
                            isCorrectOverride={answer.score >= 100}
                            mode="words"
                            hideMissing={true}
                        />
                    </p>
                    <div className="flex-shrink-0">
                        <AudioButton textToSpeak={answer.userAnswer} lang="en-US" />
                    </div>
                </div>
            </div>

            {/* Suggested Translation */}
            <div>
                <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">{t('textTranslationScreen.suggestedTranslation')}</h3>
                <div className="flex items-start gap-4 text-emerald-900 dark:text-emerald-100 bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800">
                    <p className="flex-grow leading-relaxed whitespace-pre-wrap text-lg">"{answer.correctAnswer}"</p>
                    <div className="flex-shrink-0">
                        <AudioButton textToSpeak={answer.correctAnswer} lang="en-US" />
                    </div>
                </div>
            </div>

            {/* Feedback */}
            {answer.feedback.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2">{t('common.feedback')}</h3>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4">
                        {answer.feedback.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm">
                                <div className="flex-shrink-0 mt-0.5"><FeedbackIcon type={item.type} /></div>
                                <div className="text-slate-600 dark:text-slate-400">
                                    <span className="font-bold text-slate-900 dark:text-slate-200 block mb-0.5">{item.topic}</span>
                                    {item.message}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TextTranslationReviewItem;
