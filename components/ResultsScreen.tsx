import React, { useState, useMemo } from 'react';
import { Question, UserAnswer, GapFillQuestion, GapFillUserAnswer, TranslationQuestion, TranslationUserAnswer, QuizTerm, MatchingUserResult, TextTranslationUserAnswer, FeedbackItem, FeedbackType } from '../types';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import ShareIcon from './icons/ShareIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import StarIcon from './icons/StarIcon';
import InfoIcon from './icons/InfoIcon';

interface FinalResultsScreenProps {
  mcqUserAnswers: UserAnswer[];
  mcqQuestions: Question[];
  gapFillUserAnswers: GapFillUserAnswer[];
  gapFillQuestions: GapFillQuestion[];
  translationUserAnswers: TranslationUserAnswer[];
  translationQuestions: TranslationQuestion[];
  textTranslationUserAnswer: TextTranslationUserAnswer | null;
  matchingResult: MatchingUserResult | null;
  matchingPairs: QuizTerm[];
  quizTerms: QuizTerm[];
  onRestart: () => void;
}

const ExportIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

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
    textTranslationUserAnswer,
    matchingResult,
    matchingPairs,
    quizTerms,
    onRestart 
}) => {
  const [shareStatus, setShareStatus] = useState('Share Results');
  const [copyProblematicStatus, setCopyProblematicStatus] = useState('Copy Problematic');
  const [showExportModal, setShowExportModal] = useState(false);

  const isMcqResult = mcqUserAnswers.length > 0;
  const isGapFillResult = gapFillUserAnswers.length > 0;
  const isTranslationResult = translationUserAnswers.length > 0;
  const isTextTranslationResult = !!textTranslationUserAnswer;
  const isMatchingResult = !!matchingResult && matchingPairs.length > 0;

  let score = 0;
  let total = 0;
  let percentage = 0;
  let grade = '';
  let title = "Activity Complete!";
  let quizTypeLabel = "";

  if (isMcqResult) {
    score = mcqUserAnswers.filter(a => a.isCorrect).length;
    total = mcqQuestions.length;
    quizTypeLabel = "Multiple Choice Quiz";
    percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    grade = getGrade(percentage);
  } else if (isGapFillResult) {
    score = gapFillUserAnswers.filter(a => a.isCorrect).length;
    total = gapFillQuestions.length;
    quizTypeLabel = "Gap-fill Exercise";
    percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    grade = getGrade(percentage);
  } else if (isTranslationResult) {
    total = translationUserAnswers.length;
    const totalScore = translationUserAnswers.reduce((sum, ans) => sum + ans.score, 0);
    percentage = total > 0 ? Math.round(totalScore / total) : 0;
    grade = getGrade(percentage);
    quizTypeLabel = "Sentence Translation Exercise";
  } else if (isTextTranslationResult) {
    percentage = textTranslationUserAnswer.score;
    grade = getGrade(percentage);
    quizTypeLabel = "Text Translation Exercise";
  } else if (isMatchingResult) {
    title = "Matching Exercise Complete!";
    quizTypeLabel = "Matching Exercise";
  }
  
  if (!isMatchingResult) {
    title = `${quizTypeLabel} Results`;
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
              <p className="text-2xl font-semibold my-2">Pairs Matched: <span className="text-green-400 font-bold">{matchingPairs.length} / {matchingPairs.length}</span></p>
              <p className="text-xl text-slate-300 mt-2">Incorrect Attempts: <span className="font-bold text-yellow-400">{matchingResult.incorrectAttempts}</span></p>
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
        ? `I just completed a matching exercise with the Quizlet AI Activity Generator! 🧠 Try it yourself!`
        : `I just scored ${percentage}% (${grade}) on a ${quizTypeLabel} created with the Quizlet AI Activity Generator! 🧠 Try it yourself!`;

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
        setShareStatus('Copied!');
        setTimeout(() => setShareStatus('Share Results'), 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        setShareStatus('Failed to copy');
        setTimeout(() => setShareStatus('Share Results'), 2000);
      });
    }
  };

  const handleCopyProblematic = () => {
    if (!hasProblematicTerms) return;

    const textToCopy = problematicTerms.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        setCopyProblematicStatus('Copied!');
        setTimeout(() => setCopyProblematicStatus('Copy Problematic'), 2000);
    }).catch(err => {
        console.error('Failed to copy problematic terms:', err);
        setCopyProblematicStatus('Failed to copy');
        setTimeout(() => setCopyProblematicStatus('Copy Problematic'), 2000);
    });
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const escapeCsvCell = (cell: string | number | boolean | undefined | null): string => {
    const cellStr = String(cell ?? '');
    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
      return `"${cellStr.replace(/"/g, '""')}"`;
    }
    return cellStr;
  };

  const handleExport = (format: 'txt' | 'csv') => {
    let content = '';
    let filename = 'activity_results';
    
    if (isMcqResult) {
      filename = 'mcq_quiz_results';
      if (format === 'txt') {
        content = mcqQuestions.map((q, i) => {
          const answer = mcqUserAnswers.find(a => a.questionId === q.id);
          return `Question ${i + 1}: ${q.question}\nOptions:\n- ${q.options.join('\n- ')}\nCorrect Answer: ${q.correctAnswer}\nYour Answer: ${answer?.selectedAnswer} (${answer?.isCorrect ? 'Correct' : 'Incorrect'})\n---`;
        }).join('\n\n');
      } else {
        const header = ['Question Number', 'Question', ...Array.from({length: 4}, (_,i) => `Option ${i+1}`), 'Correct Answer', 'User Answer', 'Is Correct'].map(escapeCsvCell).join(',');
        const rows = mcqQuestions.map((q, i) => {
          const answer = mcqUserAnswers.find(a => a.questionId === q.id);
          const row = [i+1, q.question, ...q.options, q.correctAnswer, answer?.selectedAnswer, answer?.isCorrect];
          return row.map(cell => escapeCsvCell(cell)).join(',');
        });
        content = `${header}\n${rows.join('\n')}`;
      }
    } else if (isGapFillResult) {
      filename = 'gap_fill_results';
      if (format === 'txt') {
        content = gapFillQuestions.map((q, i) => {
          const answer = gapFillUserAnswers.find(a => a.questionId === q.id);
          return `Question ${i + 1}: ${q.sentence}\nCorrect Answer: ${q.correctAnswer}\nYour Answer: ${answer?.userAnswer} (${answer?.isCorrect ? 'Correct' : 'Incorrect'})\n---`;
        }).join('\n\n');
      } else {
        const header = ['Question Number', 'Sentence', 'Correct Answer', 'User Answer', 'Is Correct'].map(escapeCsvCell).join(',');
        const rows = gapFillQuestions.map((q, i) => {
          const answer = gapFillUserAnswers.find(a => a.questionId === q.id);
          const row = [i + 1, q.sentence, q.correctAnswer, answer?.userAnswer, answer?.isCorrect];
          return row.map(cell => escapeCsvCell(cell)).join(',');
        });
        content = `${header}\n${rows.join('\n')}`;
      }
    } else if (isTranslationResult) {
        filename = 'sentence_translation_results';
        if (format === 'txt') {
            content = translationQuestions.map((q, i) => {
                const answer = translationUserAnswers.find(a => a.questionId === q.id);
                const feedbackText = answer?.feedback.map(f => `- ${f.topic}: ${f.message}`).join('\n') || 'No feedback.';
                return `Question ${i + 1}: Translate the following:\n"${q.ukrainianSentence}"\n\nSuggested English Answer: ${q.englishAnswer}\nYour Answer: ${answer?.userAnswer}\nScore: ${answer?.score}%\nFeedback:\n${feedbackText}\n---`;
            }).join('\n\n');
        } else {
            const header = ['Question Number', 'Ukrainian Sentence', 'Suggested English Answer', 'User Answer', 'Score', 'Feedback'].map(escapeCsvCell).join(',');
            const rows = translationQuestions.map((q, i) => {
                const answer = translationUserAnswers.find(a => a.questionId === q.id);
                const feedbackText = answer?.feedback.map(f => `${f.topic}: ${f.message}`).join('; ');
                const row = [i + 1, q.ukrainianSentence, q.englishAnswer, answer?.userAnswer, answer?.score, feedbackText];
                return row.map(cell => escapeCsvCell(cell)).join(',');
            });
            content = `${header}\n${rows.join('\n')}`;
        }
    } else if (isTextTranslationResult) {
        filename = 'text_translation_results';
        const answer = textTranslationUserAnswer;
        const feedbackTextTxt = answer.feedback.map(f => `- ${f.topic}: ${f.message}`).join('\n');
        if (format === 'txt') {
            content = `Original Ukrainian Text:\n${answer.correctAnswer}\n\nSuggested English Translation:\n${answer.correctAnswer}\n\nYour Translation:\n${answer.userAnswer}\n\nScore: ${answer.score}%\nFeedback:\n${feedbackTextTxt}`;
        } else {
            const feedbackTextCsv = answer.feedback.map(f => `${f.topic}: ${f.message}`).join('; ');
            const header = ['Ukrainian Text', 'Suggested English Translation', 'User Translation', 'Score', 'Feedback'].map(escapeCsvCell).join(',');
            const row = [answer.correctAnswer, answer.correctAnswer, answer.userAnswer, answer.score, feedbackTextCsv];
            const rowText = row.map(cell => escapeCsvCell(cell)).join(',');
            content = `${header}\n${rowText}`;
        }
    } else if (isMatchingResult) {
        filename = 'matching_exercise_results';
        if (format === 'txt') {
            const pairsText = matchingPairs.map(p => `- ${p.term}\t->\t${p.definition}`).join('\n');
            content = `Matching Exercise Results\n\nIncorrect Attempts: ${matchingResult.incorrectAttempts}\n\nCorrect Pairs:\n${pairsText}`;
        } else {
            const header = ['Term', 'Definition'].map(escapeCsvCell).join(',');
            const rows = matchingPairs.map(p => [p.term, p.definition].map(escapeCsvCell).join(','));
            content = `${header}\n${rows.join('\n')}`;
        }
    }
    
    downloadFile(content, `${filename}.${format}`, format === 'txt' ? 'text/plain' : 'text/csv');
    setShowExportModal(false);
  };

  return (
    <>
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-indigo-400">{title}</h1>
        
        { (isMcqResult || isGapFillResult || isTranslationResult || isMatchingResult || isTextTranslationResult) && (
          <div className="bg-slate-900 p-6 rounded-lg text-center w-full max-w-sm">
              <p className="text-slate-300 text-lg">{isTranslationResult || isTextTranslationResult ? "Your Score" : isMatchingResult ? "Your Result" : "Your Score"}</p>
              {getScoreDisplay()}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl mt-4">
          <button
              onClick={onRestart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
              Create Something New
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
           <button
                onClick={() => setShowExportModal(true)}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
                <ExportIcon />
                Export Results
            </button>
        </div>


        {(!isMatchingResult && (isMcqResult || isGapFillResult || isTranslationResult || isTextTranslationResult)) && (
          <div className="w-full mt-6 pt-6 border-t border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-center">Review Your Answers</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {isMcqResult && mcqQuestions.map((question, index) => {
                      const answer = mcqUserAnswers.find(a => a.questionId === question.id);
                      if (!answer) return null;
                      return (
                      <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                          <p className="font-semibold text-slate-200 mb-2">Q{index + 1}: {question.question}</p>
                          <p className={`flex items-center gap-2 font-medium ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {answer.isCorrect ? <CheckIcon /> : <XIcon />}
                          Your answer: {answer.selectedAnswer}
                          </p>
                          {!answer.isCorrect && (
                          <p className="flex items-center gap-2 font-medium text-green-400 mt-1">
                              <CheckIcon />
                              Correct answer: {answer.correctAnswer}
                          </p>
                          )}
                      </div>
                      );
                  })}
                  {isGapFillResult && gapFillQuestions.map((question, index) => {
                      const answer = gapFillUserAnswers.find(a => a.questionId === question.id);
                      if (!answer) return null;
                      return (
                      <div key={question.id} className="bg-slate-700 p-4 rounded-lg">
                          <p className="font-semibold text-slate-200 mb-2">Q{index + 1}: {question.sentence.replace('____', `[${question.correctAnswer}]`)}</p>
                          <p className={`flex items-center gap-2 font-medium ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {answer.isCorrect ? <CheckIcon /> : <XIcon />}
                          Your answer: {answer.userAnswer}
                          </p>
                          {!answer.isCorrect && (
                          <p className="flex items-center gap-2 font-medium text-slate-400 mt-1">
                              Your answer was incorrect.
                          </p>
                          )}
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
                                  <p className="font-semibold text-slate-300 mb-2">Q{index + 1}: Translate the following:</p>
                                  <p className="italic text-slate-100 mb-3 ml-4 border-l-2 border-indigo-400 pl-4">"{question.ukrainianSentence}"</p>
                              </div>
                              <div className={`text-2xl font-bold ml-4 text-right ${scoreColor}`}>{answer.score}% <span className="text-xl">({grade})</span></div>
                          </div>

                          <div className="space-y-3 mt-2">
                               <p className="text-slate-300">Your answer: <span className="italic">"{answer.userAnswer}"</span></p>
                               {answer.feedback.length > 0 &&
                                 <div className="bg-slate-900/50 p-3 rounded-md space-y-2">
                                    <p className="font-semibold text-indigo-300 text-sm">Feedback:</p>
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
                  {isTextTranslationResult && textTranslationUserAnswer && (
                       <div className="bg-slate-700 p-4 rounded-lg">
                          <div className="space-y-4">
                              <div>
                                  <h3 className="font-semibold text-indigo-300">Your Translation:</h3>
                                  <p className="italic text-slate-200 bg-slate-900/50 p-3 rounded-md mt-1">"{textTranslationUserAnswer.userAnswer}"</p>
                              </div>
                               <div>
                                  <h3 className="font-semibold text-green-400">Suggested Translation:</h3>
                                  <p className="italic text-slate-200 bg-slate-900/50 p-3 rounded-md mt-1">"{textTranslationUserAnswer.correctAnswer}"</p>
                              </div>
                              {textTranslationUserAnswer.feedback.length > 0 &&
                                 <div>
                                    <h3 className="font-semibold text-yellow-400">Feedback:</h3>
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

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowExportModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-sm w-full flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-center text-indigo-400 mb-2">Export Results</h2>
            <button onClick={() => handleExport('txt')} className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Download as .txt</button>
            <button onClick={() => handleExport('csv')} className="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Download as .csv</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsScreen;