
import React, { useState, useMemo } from 'react';
import { Question, UserAnswer, GapFillQuestion, GapFillUserAnswer, TranslationQuestion, TranslationUserAnswer, QuizTerm, MatchingUserResult, TextTranslationUserAnswer, FeedbackItem, FeedbackType, CEFRLevel, TextTranslationQuestion } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import ShareIcon from './icons/ShareIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import StarIcon from './icons/StarIcon';
import InfoIcon from './icons/InfoIcon';
import Logo from './Logo';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';

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
}

const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
};

const FeedbackIcon: React.FC<{type: FeedbackType}> = ({ type }) => {
    switch(type) {
        case 'bonus':
            return <StarIcon />;
        case 'grammar':
        case 'error':
            return <InfoIcon />;
        default:
            return null;
    }
};

const ResultsScreen: React.FC<FinalResultsScreenProps> = ({ 
    mcqUserAnswers, mcqQuestions, 
    gapFillUserAnswers, gapFillQuestions,
    translationUserAnswers, translationQuestions,
    textTranslationUserAnswer, textTranslationQuestion,
    matchingResult,
    matchingPairs,
    quizTerms,
    onRestart,
    cefrLevel
}) => {
  const { t } = useTranslation();
  const [shareStatus, setShareStatus] = useState(t('common.shareResults'));
  const [copyProblematicStatus, setCopyProblematicStatus] = useState(t('common.copyProblematic'));

  const isMcqResult = mcqUserAnswers.length > 0;
  const isGapFillResult = gapFillUserAnswers.length > 0;
  const isTranslationResult = translationUserAnswers.length > 0;
  const isTextTranslationResult = !!textTranslationUserAnswer;
  const isMatchingResult = !!matchingResult && matchingPairs.length > 0;

  const isUkr = cefrLevel === 'A1 ukr';
  const questionLang = isUkr ? 'uk-UA' : 'en-US';

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
    percentage = textTranslationUserAnswer.score;
    grade = getGrade(percentage);
    quizTypeLabel = t('resultsScreen.textTranslationLabel');
  } else if (isMatchingResult) {
    title = t('resultsScreen.matchingComplete');
    quizTypeLabel = t('resultsScreen.matchingLabel');
  }
  
  if (!isMatchingResult) {
    title = t('resultsScreen.resultsTitle', { quizType: quizTypeLabel });
  }


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
            if (answer.score < 70) { // Defining "problematic" as a score below C
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
            termsWithDefinitions.push(term); // Fallback if definition not found
        }
    });

    return termsWithDefinitions;
  }, [isMcqResult, mcqUserAnswers, mcqQuestions, isGapFillResult, gapFillUserAnswers, gapFillQuestions, isTranslationResult, translationUserAnswers, translationQuestions, quizTerms]);

  const hasProblematicTerms = problematicTerms.length > 0;

  const getScoreDisplay = () => {
      if (isMatchingResult) {
          return (
            <div className="animate-pop-in">
              <p className="text-2xl font-semibold my-2">{t('resultsScreen.pairsMatched')} <span className="text-green-400 font-bold">{matchingPairs.length} / {matchingPairs.length}</span></p>
              <p className="text-xl text-slate-300 mt-2">{t('resultsScreen.incorrectAttempts')} <span className="font-bold text-yellow-400">{matchingResult.incorrectAttempts}</span></p>
            </div>
          )
      }
      if (isTranslationResult || isTextTranslationResult) {
          return <p className="text-6xl font-bold my-2 animate-pop-in">{percentage}% <span className="text-4xl text-indigo-400">({grade})</span></p>;
      }
      return (
          <>
            <p className="text-6xl font-bold my-2 animate-pop-in">{score} / {total}</p>
            <p className="text-2xl text-indigo-400 font-semibold">{percentage}% ({grade})</p>
          </>
      );
  }

  const handleShare = async () => {
    const shareText = isMatchingResult 
        ? t('resultsScreen.shareTextMatching')
        : t('resultsScreen.shareTextScore', { percentage, grade, quizType: quizTypeLabel });

    const shareData = {
      title: 'Quiz Results',
      text: shareText,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          console.error("Error sharing:", err);
        }
      }
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        setShareStatus(t('common.copied'));
        setTimeout(() => setShareStatus(t('common.shareResults')), 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        setShareStatus(t('resultsScreen.shareFailed'));
        setTimeout(() => setShareStatus(t('common.shareResults')), 2000);
      });
    }
  };

  const handleCopyProblematic = () => {
    if (!hasProblematicTerms) return;

    const textToCopy = problematicTerms.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopyProblematicStatus(t('resultsScreen.problematicCopied'));
        setTimeout(() => setCopyProblematicStatus(t('common.copyProblematic')), 2000);
    }).catch(err => {
        console.error('Failed to copy problematic terms:', err);
        setCopyProblematicStatus(t('resultsScreen.problematicCopyFailed'));
        setTimeout(() => setCopyProblematicStatus(t('common.copyProblematic')), 2000);
    });
  };

  return (
    <>
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col items-center gap-6">
        <Logo className="h-16 w-16 text-indigo-400" />
        <h1 className="text-4xl font-bold text-indigo-400">{title}</h1>
        
        { (isMcqResult || isGapFillResult || isTranslationResult || isMatchingResult || isTextTranslationResult) && (
          <div className="bg-slate-900 p-6 rounded-lg text-center w-full max-w-sm">
              <p className="text-slate-300 text-lg">{isTranslationResult || isTextTranslationResult ? t('common.yourScore') : isMatchingResult ? t('common.yourResult') : t('common.yourScore')}</p>
              {getScoreDisplay()}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mt-4">
          <button
              onClick={onRestart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
              {t('common.createSomethingNew')}
          </button>
          <button
              onClick={handleShare}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
              <ShareIcon />
              {shareStatus}
          </button>
          {(!isMatchingResult && !isTextTranslationResult) && (
              <button
                  onClick={handleCopyProblematic}
                  disabled={!hasProblematicTerms}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
              >
                  <ClipboardIcon />
                  {copyProblematicStatus}
              </button>
          )}
        </div>


        {(!isMatchingResult && (isMcqResult || isGapFillResult || isTranslationResult || isTextTranslationResult)) && (
          <div className="w-full mt-6 pt-6 border-t border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-center">{t('common.reviewAnswers')}</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {isMcqResult && mcqQuestions.map((question, index) => {
                      const answer = mcqUserAnswers.find(a => a.questionId === question.id);
                      if (!answer) return null;
                      return (
                      <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex items-center gap-3 justify-between font-semibold text-slate-200 mb-2">
                            <p className="flex-grow">Q{index + 1}: {question.question}</p>
                            <AudioButton textToSpeak={question.question} lang={questionLang} />
                          </div>
                          <div className={`flex items-center gap-2 font-medium ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {answer.isCorrect ? <CheckIcon /> : <XIcon />}
                            <span className="flex-grow">{t('common.yourAnswer')} {answer.selectedAnswer}</span>
                            <AudioButton textToSpeak={answer.selectedAnswer} lang="en-US" />
                          </div>
                          {!answer.isCorrect && (
                          <div className="flex items-center gap-2 font-medium text-green-400 mt-1">
                              <CheckIcon />
                              <span className="flex-grow">{t('common.correctAnswer')} {answer.correctAnswer}</span>
                              <AudioButton textToSpeak={answer.correctAnswer} lang="en-US" />
                          </div>
                          )}
                      </div>
                      );
                  })}
                  {isGapFillResult && gapFillQuestions.map((question, index) => {
                      const answer = gapFillUserAnswers.find(a => a.questionId === question.id);
                      const fullSentence = question.sentence.replace('____', `[${question.correctAnswer}]`);
                      if (!answer) return null;
                      return (
                      <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex items-center gap-3 justify-between font-semibold text-slate-200 mb-2">
                            <p className="flex-grow">Q{index + 1}: {fullSentence}</p>
                            <AudioButton textToSpeak={fullSentence} lang={questionLang} />
                          </div>
                          <div className={`flex items-center gap-2 font-medium ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            {answer.isCorrect ? <CheckIcon /> : <XIcon />}
                            <span className="flex-grow">{t('common.yourAnswer')} {answer.userAnswer}</span>
                            <AudioButton textToSpeak={answer.userAnswer} lang="en-US" />
                          </div>
                      </div>
                      );
                  })}
                  {isTranslationResult && translationQuestions.map((question, index) => {
                      const answer = translationUserAnswers.find(a => a.questionId === question.id);
                      if (!answer) return null;
                      const grade = getGrade(answer.score);
                      const scoreColor = answer.score >= 90 ? 'text-green-400' : answer.score >= 70 ? 'text-yellow-400' : 'text-red-400';
                      return (
                      <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                              <div className="flex-1">
                                  <p className="font-semibold text-slate-300 mb-2">Q{index + 1}: {t('translationQuizScreen.translateLabel')}</p>
                                  <div className="flex items-center gap-3 italic text-slate-100 mb-3 ml-4 border-l-2 border-indigo-400 pl-4">
                                    <p className="flex-grow">"{question.ukrainianSentence}"</p>
                                    <AudioButton textToSpeak={question.ukrainianSentence} lang="uk-UA" />
                                  </div>
                              </div>
                              <div className={`text-2xl font-bold ml-4 text-right ${scoreColor}`}>{answer.score}% <span className="text-xl">({grade})</span></div>
                          </div>

                          <div className="space-y-3 mt-2">
                               <div className="text-slate-300 flex items-center gap-3">{t('common.yourAnswer')} <span className="italic flex-grow">"{answer.userAnswer}"</span> <AudioButton textToSpeak={answer.userAnswer} lang="en-US" /></div>
                               {answer.feedback.length > 0 &&
                                 <div className="bg-slate-900/50 p-3 rounded-md space-y-2">
                                    <p className="font-semibold text-indigo-300 text-sm">{t('common.feedback')}</p>
                                    {answer.feedback.map((item, i) => (
                                        <div key={i} className="flex items-start gap-2 text-slate-200">
                                            <div className="flex-shrink-0 mt-1"><FeedbackIcon type={item.type} /></div>
                                            <div>
                                               <span className="font-semibold">{item.topic}:</span> {item.message}
                                            </div>
                                        </div>
                                    ))}
                                 </div>
                               }
                          </div>
                      </div>
                      );
                  })}
                  {isTextTranslationResult && textTranslationUserAnswer && textTranslationQuestion && (
                       <div className="bg-slate-700 p-4 rounded-lg">
                          <div className="space-y-4">
                              <div>
                                  <h3 className="font-semibold text-indigo-300">{t('textTranslationScreen.originalUkrainianText')}</h3>
                                  <div className="flex items-center gap-3 italic text-slate-200 bg-slate-900/50 p-3 rounded-md mt-1">
                                    <p className="flex-grow">"{textTranslationQuestion.ukrainianText}"</p>
                                    <AudioButton textToSpeak={textTranslationQuestion.ukrainianText} lang="uk-UA" />
                                  </div>
                              </div>
                              <div>
                                  <h3 className="font-semibold text-slate-300">{t('textTranslationScreen.yourTranslation')}</h3>
                                  <div className="flex items-center gap-3 italic text-slate-200 bg-slate-900/50 p-3 rounded-md mt-1">
                                    <p className="flex-grow">"{textTranslationUserAnswer.userAnswer}"</p>
                                    <AudioButton textToSpeak={textTranslationUserAnswer.userAnswer} lang="en-US" />
                                  </div>
                              </div>
                               <div>
                                  <h3 className="font-semibold text-green-400">{t('textTranslationScreen.suggestedTranslation')}</h3>
                                  <div className="flex items-center gap-3 italic text-slate-200 bg-slate-900/50 p-3 rounded-md mt-1">
                                    <p className="flex-grow">"{textTranslationUserAnswer.correctAnswer}"</p>
                                    <AudioButton textToSpeak={textTranslationUserAnswer.correctAnswer} lang="en-US" />
                                  </div>
                              </div>
                              {textTranslationUserAnswer.feedback.length > 0 &&
                                 <div>
                                    <h3 className="font-semibold text-yellow-400">{t('common.feedback')}</h3>
                                     <div className="bg-slate-900/50 p-3 rounded-md mt-1 space-y-2">
                                        {textTranslationUserAnswer.feedback.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2 text-slate-200">
                                                <div className="flex-shrink-0 mt-1"><FeedbackIcon type={item.type} /></div>
                                                <div>
                                                   <span className="font-semibold">{item.topic}:</span> {item.message}
                                                </div>
                                            </div>
                                        ))}
                                     </div>
                                 </div>
                               }
                          </div>
                      </div>
                  )}
              </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultsScreen;
