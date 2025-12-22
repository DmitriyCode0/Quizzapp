
import React, { useState, useMemo } from 'react';
import { Question, UserAnswer, GapFillQuestion, GapFillUserAnswer, TranslationQuestion, TranslationUserAnswer, QuizTerm, MatchingUserResult, TextTranslationUserAnswer, CEFRLevel, TextTranslationQuestion, TeacherPersona } from '../types';
import ShareIcon from './icons/ShareIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';
import { getGrade } from '../utils/grading';
import ResultsScoreCard from './results/ResultsScoreCard';
import ReviewList from './results/ReviewList';

interface FinalResultsScreenProps {
  mcqUserAnswers: UserAnswer[];
  mcqQuestions: Question[];
  gapFillUserAnswers: GapFillUserAnswer[];
  gapFillQuestions: GapFillQuestion[];
  translationUserAnswers: TranslationUserAnswer[];
  translationQuestions: TranslationQuestion[];
  textTranslationUserAnswer: TextTranslationUserAnswer | null;
  textTranslationQuestion: TextTranslationQuestion | null;
  matchingResult: MatchingUserResult | null;
  matchingPairs: QuizTerm[];
  quizTerms: QuizTerm[];
  onRestart: () => void;
  cefrLevel: CEFRLevel;
  teacherPersona?: TeacherPersona;
}

const ResultsScreen: React.FC<FinalResultsScreenProps> = ({ 
    mcqUserAnswers, mcqQuestions, 
    gapFillUserAnswers, gapFillQuestions,
    translationUserAnswers, translationQuestions,
    textTranslationUserAnswer, textTranslationQuestion,
    matchingResult,
    matchingPairs,
    quizTerms,
    onRestart,
    cefrLevel,
    teacherPersona
}) => {
  const { t } = useTranslation();
  const [shareStatus, setShareStatus] = useState(t('common.shareResults'));
  const [copyProblematicStatus, setCopyProblematicStatus] = useState(t('common.copyProblematic'));

  const isMcqResult = mcqUserAnswers.length > 0;
  const isGapFillResult = gapFillUserAnswers.length > 0;
  const isTranslationResult = translationUserAnswers.length > 0;
  const isTextTranslationResult = !!textTranslationUserAnswer;
  const isMatchingResult = !!matchingResult && matchingPairs.length > 0;
  const isLearningMode = teacherPersona === 'learning';

  // Grade Calculations
  let score = 0;
  let total = 0;
  let percentage = 0;
  let grade = '';
  let title = t('resultsScreen.activityComplete');
  let quizTypeLabel = "";

  if (isMcqResult) {
    score = mcqUserAnswers.filter(a => a.isCorrect).length;
    total = mcqQuestions.length;
    quizTypeLabel = t('resultsScreen.mcqLabel');
    percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    grade = getGrade(percentage);
  } else if (isGapFillResult) {
    score = gapFillUserAnswers.filter(a => a.isCorrect).length;
    total = gapFillQuestions.length;
    quizTypeLabel = t('resultsScreen.gapFillLabel');
    percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    grade = getGrade(percentage);
  } else if (isTranslationResult) {
    total = translationUserAnswers.length;
    const totalScore = translationUserAnswers.reduce((sum, ans) => sum + ans.score, 0);
    percentage = total > 0 ? Math.round(totalScore / total) : 0;
    grade = getGrade(percentage);
    quizTypeLabel = t('resultsScreen.sentenceTranslationLabel');
  } else if (isTextTranslationResult) {
    percentage = textTranslationUserAnswer!.score;
    grade = getGrade(percentage);
    quizTypeLabel = t('resultsScreen.textTranslationLabel');
  } else if (isMatchingResult) {
    title = t('resultsScreen.matchingComplete');
    quizTypeLabel = t('resultsScreen.matchingLabel');
  }
  
  if (!isMatchingResult) {
    title = t('resultsScreen.resultsTitle', { quizType: quizTypeLabel });
  }

  // Identify problematic terms logic
  const problematicTerms = useMemo(() => {
    const incorrectTermStrings = new Set<string>();

    if (isMcqResult) {
        mcqUserAnswers.forEach(answer => {
            if (!answer.isCorrect) {
                const question = mcqQuestions.find(q => q.id === answer.questionId);
                if (question) incorrectTermStrings.add(question.originalTerm);
            }
        });
    } else if (isGapFillResult) {
        gapFillUserAnswers.forEach(answer => {
            if (!answer.isCorrect) {
                const question = gapFillQuestions.find(q => q.id === answer.questionId);
                if (question) incorrectTermStrings.add(question.originalTerm);
            }
        });
    } else if (isTranslationResult) {
        translationUserAnswers.forEach(answer => {
            if (answer.score < 70) {
                const question = translationQuestions.find(q => q.id === answer.questionId);
                if (question) incorrectTermStrings.add(question.originalTerm);
            }
        });
    }

    const termsWithDefinitions: string[] = [];
    incorrectTermStrings.forEach(term => {
        const quizTerm = quizTerms.find(qt => qt.term.toLowerCase() === term.toLowerCase());
        if (quizTerm) {
            termsWithDefinitions.push(`${quizTerm.term}\t${quizTerm.definition}`);
        } else {
            termsWithDefinitions.push(term);
        }
    });

    return termsWithDefinitions;
  }, [isMcqResult, mcqUserAnswers, mcqQuestions, isGapFillResult, gapFillUserAnswers, gapFillQuestions, isTranslationResult, translationUserAnswers, translationQuestions, quizTerms]);

  const hasProblematicTerms = problematicTerms.length > 0;

  // Handlers
  const handleShare = async () => {
    const shareText = isMatchingResult 
        ? t('resultsScreen.shareTextMatching')
        : t('resultsScreen.shareTextScore', { percentage, grade, quizType: quizTypeLabel });

    const shareData = { title: 'Quiz Results', text: shareText };

    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.error("Error sharing:", err); }
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => { setShareStatus(t('common.copied')); setTimeout(() => setShareStatus(t('common.shareResults')), 2000); })
        .catch(err => { console.error('Failed to copy:', err); setShareStatus(t('resultsScreen.shareFailed')); });
    }
  };

  const handleCopyProblematic = () => {
    if (!hasProblematicTerms) return;
    const textToCopy = problematicTerms.join('\n');
    navigator.clipboard.writeText(textToCopy)
        .then(() => { setCopyProblematicStatus(t('resultsScreen.problematicCopied')); setTimeout(() => setCopyProblematicStatus(t('common.copyProblematic')), 2000); })
        .catch(err => { console.error('Failed to copy:', err); setCopyProblematicStatus(t('resultsScreen.problematicCopyFailed')); });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl flex flex-col items-center gap-8 mx-auto transition-colors duration-300">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-full">
            <Logo className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center">{title}</h1>
      </div>
      
      { (isMcqResult || isGapFillResult || isTranslationResult || isMatchingResult || isTextTranslationResult) && (
        <ResultsScoreCard 
            isMatchingResult={isMatchingResult}
            isTranslationResult={isTranslationResult}
            isTextTranslationResult={isTextTranslationResult}
            score={score}
            total={total}
            percentage={percentage}
            grade={grade}
            matchingResult={matchingResult}
            matchingTotal={matchingPairs.length}
            isLearningMode={isLearningMode}
        />
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
        <button
            onClick={onRestart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl transition-transform transform hover:scale-[1.02] shadow-md"
        >
            {t('common.createSomethingNew')}
        </button>
        <button
            onClick={handleShare}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
            <ShareIcon />
            {shareStatus}
        </button>
        {(!isMatchingResult && !isTextTranslationResult) && (
            <button
                onClick={handleCopyProblematic}
                disabled={!hasProblematicTerms}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 text-teal-700 dark:text-teal-400 font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ClipboardIcon />
                {copyProblematicStatus}
            </button>
        )}
      </div>

      {!isMatchingResult && (
          <ReviewList 
            cefrLevel={cefrLevel}
            mcqData={isMcqResult ? { questions: mcqQuestions, answers: mcqUserAnswers } : undefined}
            gapFillData={isGapFillResult ? { questions: gapFillQuestions, answers: gapFillUserAnswers } : undefined}
            translationData={isTranslationResult ? { questions: translationQuestions, answers: translationUserAnswers } : undefined}
            textTranslationData={isTextTranslationResult ? { question: textTranslationQuestion, answer: textTranslationUserAnswer } : undefined}
          />
      )}
    </div>
  );
};

export default ResultsScreen;
