
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { MatchingUserResult } from '../../types';

interface ResultsScoreCardProps {
    isMatchingResult: boolean;
    isTranslationResult: boolean;
    isTextTranslationResult: boolean;
    score: number;
    total: number;
    percentage: number;
    grade: string;
    matchingResult: MatchingUserResult | null;
    matchingTotal: number;
    isLearningMode?: boolean;
}

const ResultsScoreCard: React.FC<ResultsScoreCardProps> = ({
    isMatchingResult,
    isTranslationResult,
    isTextTranslationResult,
    score,
    total,
    percentage,
    grade,
    matchingResult,
    matchingTotal,
    isLearningMode = false
}) => {
    const { t } = useTranslation();

    if (isMatchingResult && matchingResult) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl text-center w-full max-w-sm shadow-lg shadow-slate-100/50 dark:shadow-none">
                <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{t('common.yourResult')}</p>
                <div className="animate-pop-in">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        {t('resultsScreen.pairsMatched')} <span className="text-emerald-600 dark:text-emerald-400">{matchingTotal} / {matchingTotal}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('resultsScreen.incorrectAttempts')}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-lg">{matchingResult.incorrectAttempts}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Grade Color Logic
    const getGradeColor = (grade: string) => {
        if (['A', 'B'].includes(grade)) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800';
        if (['C'].includes(grade)) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800';
        return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800';
    };

    if (isLearningMode && (isTranslationResult || isTextTranslationResult)) {
        return (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl text-center w-full max-w-sm shadow-lg shadow-slate-100/50 dark:shadow-none transition-colors">
                <div className="animate-pop-in flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
                        <span className="text-3xl">🎓</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Mode</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Review the detailed feedback below to improve your skills.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl text-center w-full max-w-sm shadow-lg shadow-slate-100/50 dark:shadow-none transition-colors">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-wider mb-4">
                {(isTranslationResult || isTextTranslationResult) ? t('common.yourScore') : t('common.yourScore')}
            </p>
            
            <div className="flex flex-col items-center animate-pop-in">
                <div className="relative inline-block">
                    <span className="text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">{percentage}%</span>
                    {/* Circular background decoration */}
                    <div className="absolute -inset-4 bg-slate-50 dark:bg-slate-900/50 rounded-full -z-10 scale-110"></div>
                </div>
                
                <div className={`mt-4 px-6 py-2 rounded-xl border font-bold text-xl shadow-sm ${getGradeColor(grade)}`}>
                    Grade {grade}
                </div>

                {!(isTranslationResult || isTextTranslationResult) && (
                    <p className="text-slate-400 dark:text-slate-500 font-medium mt-4 text-sm">
                        {score} out of {total} correct
                    </p>
                )}
            </div>
        </div>
    );
};

export default ResultsScoreCard;
