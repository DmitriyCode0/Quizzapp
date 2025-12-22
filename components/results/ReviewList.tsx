
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
    Question, UserAnswer, 
    GapFillQuestion, GapFillUserAnswer, 
    TranslationQuestion, TranslationUserAnswer, 
    TextTranslationQuestion, TextTranslationUserAnswer,
    CEFRLevel 
} from '../../types';

import McqReviewItem from './review-items/McqReviewItem';
import GapFillReviewItem from './review-items/GapFillReviewItem';
import TranslationReviewItem from './review-items/TranslationReviewItem';
import TextTranslationReviewItem from './review-items/TextTranslationReviewItem';

interface ReviewListProps {
    cefrLevel: CEFRLevel;
    mcqData?: { questions: Question[]; answers: UserAnswer[] };
    gapFillData?: { questions: GapFillQuestion[]; answers: GapFillUserAnswer[] };
    translationData?: { questions: TranslationQuestion[]; answers: TranslationUserAnswer[] };
    textTranslationData?: { question: TextTranslationQuestion | null; answer: TextTranslationUserAnswer | null };
}

const ReviewList: React.FC<ReviewListProps> = ({ 
    cefrLevel,
    mcqData, 
    gapFillData, 
    translationData,
    textTranslationData 
}) => {
    const { t } = useTranslation();
    const isUkr = cefrLevel === 'A1 ukr';
    const questionLang = isUkr ? 'uk-UA' : 'en-US';

    if (!mcqData && !gapFillData && !translationData && !textTranslationData?.answer) {
        return null;
    }

    return (
        <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-4 text-center text-slate-900 dark:text-white">{t('common.reviewAnswers')}</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                
                {/* MCQ Review */}
                {mcqData && mcqData.questions.map((question, index) => {
                    const answer = mcqData.answers.find(a => a.questionId === question.id);
                    if (!answer) return null;
                    return (
                        <McqReviewItem 
                            key={question.id} 
                            question={question} 
                            answer={answer} 
                            index={index} 
                            questionLang={questionLang} 
                        />
                    );
                })}

                {/* Gap Fill Review */}
                {gapFillData && gapFillData.questions.map((question, index) => {
                    const answer = gapFillData.answers.find(a => a.questionId === question.id);
                    if (!answer) return null;
                    return (
                        <GapFillReviewItem
                            key={question.id}
                            question={question}
                            answer={answer}
                            index={index}
                            questionLang={questionLang}
                        />
                    );
                })}

                {/* Translation Review */}
                {translationData && translationData.questions.map((question, index) => {
                    const answer = translationData.answers.find(a => a.questionId === question.id);
                    if (!answer) return null;
                    return (
                        <TranslationReviewItem
                            key={question.id}
                            question={question}
                            answer={answer}
                            index={index}
                        />
                    );
                })}

                {/* Text Translation Review */}
                {textTranslationData && textTranslationData.question && textTranslationData.answer && (
                    <TextTranslationReviewItem
                        question={textTranslationData.question}
                        answer={textTranslationData.answer}
                    />
                )}
            </div>
        </div>
    );
};

export default ReviewList;
