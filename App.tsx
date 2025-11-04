import React, { useState, useCallback } from 'react';
import { AppState, Question, UserAnswer, QuizTerm, GapFillQuestion, GapFillUserAnswer, GenerationType, CEFRLevel, TranslationQuestion, TranslationUserAnswer, MatchingUserResult, TextTranslationQuestion, TextTranslationUserAnswer, VocabularyChallenge, GrammarChallenge } from './types';
import InputScreen from './components/InputScreen';
import LoadingScreen from './components/LoadingScreen';
import QuizScreen from './components/QuizScreen';
import GapFillQuizScreen from './components/GapFillQuizScreen';
import TranslationQuizScreen from './components/TranslationQuizScreen';
import ResultsScreen from './components/ResultsScreen';
import DiscussionScreen from './components/DiscussionScreen';
import TranslationListScreen from './components/TranslationListScreen';
import MatchingScreen from './components/MatchingScreen';
import TextTranslationScreen from './components/TextTranslationScreen';
import { generateMcqQuiz, generateGapFillQuiz, generateDiscussionPrompts, generateTranslationQuiz, generateTranslationList, generateTextTranslationActivity } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  
  const [quizTerms, setQuizTerms] = useState<QuizTerm[]>([]);
  const [isTimedMode, setIsTimedMode] = useState(false);
  const [currentCefrLevel, setCurrentCefrLevel] = useState<CEFRLevel>('B1');
  const [vocabularyChallenge, setVocabularyChallenge] = useState<VocabularyChallenge>('Standard');
  const [grammarChallenge, setGrammarChallenge] = useState<GrammarChallenge>('Standard');


  // MCQ State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  // Gap-fill State
  const [gapFillQuestions, setGapFillQuestions] = useState<GapFillQuestion[]>([]);
  const [gapFillUserAnswers, setGapFillUserAnswers] = useState<GapFillUserAnswer[]>([]);

  // Translation State
  const [translationQuestions, setTranslationQuestions] = useState<TranslationQuestion[]>([]);
  const [translationUserAnswers, setTranslationUserAnswers] = useState<TranslationUserAnswer[]>([]);

  // Text Translation State
  const [textTranslationQuestion, setTextTranslationQuestion] = useState<TextTranslationQuestion | null>(null);
  const [textTranslationUserAnswer, setTextTranslationUserAnswer] = useState<TextTranslationUserAnswer | null>(null);

  // Discussion State
  const [discussionPrompts, setDiscussionPrompts] = useState<string[]>([]);
  const [discussionTitle, setDiscussionTitle] = useState('');

  // Translation List State
  const [translationListSentences, setTranslationListSentences] = useState<string[]>([]);

  // Matching Game State
  const [matchingPairs, setMatchingPairs] = useState<QuizTerm[]>([]);
  const [matchingResult, setMatchingResult] = useState<MatchingUserResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Generating Your Quiz...');

  const parseQuizletData = (data: string): QuizTerm[] => {
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('\t') && line.length > 2)
      .map(line => {
        const parts = line.split('\t');
        return { term: parts[0].trim(), definition: parts[1].trim() };
      });
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleGenerate = useCallback(async (quizletData: string, type: GenerationType, cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge, isTimed: boolean) => {
    setError(null);
    const terms = parseQuizletData(quizletData);
    setIsTimedMode(isTimed);
    setCurrentCefrLevel(cefrLevel);
    setVocabularyChallenge(vocabChallenge);
    setGrammarChallenge(gramChallenge);


    if (terms.length === 0) {
      setError("Invalid or empty data. Please paste the Quizlet data with tabs between terms and definitions.");
      setAppState('input');
      return;
    }
    setQuizTerms(terms);

    if (type === 'mcq') {
      setLoadingMessage('Generating Multiple Choice Quiz...');
      setAppState('generating_mcq');
      try {
        const generatedQuestions = await generateMcqQuiz(terms, cefrLevel, vocabChallenge, gramChallenge);
        const questionsWithShuffledOptions = generatedQuestions.map(q => ({
          ...q,
          id: crypto.randomUUID(),
          options: shuffleArray(q.options),
        }));
        setQuestions(shuffleArray(questionsWithShuffledOptions));
        setAppState('mcq_quiz');
      } catch (err) {
        console.error(err);
        setError("Failed to generate the quiz. Please check your API key and try again.");
        setAppState('input');
      }
    } else if (type === 'gap_fill') {
        setLoadingMessage('Generating Gap-fill Exercise...');
        setAppState('generating_gap_fill');
        try {
            const generatedQuestions = await generateGapFillQuiz(terms, cefrLevel, vocabChallenge, gramChallenge);
            const questionsWithIds = generatedQuestions.map(q => ({
                ...q,
                id: crypto.randomUUID(),
            }));
            setGapFillQuestions(shuffleArray(questionsWithIds));
            setAppState('gap_fill_quiz');
        } catch (err) {
            console.error(err);
            setError("Failed to generate the gap-fill exercise. Please try again.");
            setAppState('input');
        }
    } else if (type === 'translate_uk_en') {
        if (terms.length < 5) {
            setError("Please provide at least 5 terms for the translation exercise.");
            setAppState('input');
            return;
        }
        setLoadingMessage('Generating Translation Exercise (5 questions)...');
        setAppState('generating_translation');
        try {
            const generatedQuestions = await generateTranslationQuiz(terms, cefrLevel, vocabChallenge, gramChallenge);
            const questionsWithIds = generatedQuestions.map(q => ({
                ...q,
                id: crypto.randomUUID(),
            }));
            setTranslationQuestions(shuffleArray(questionsWithIds));
            setAppState('translation_quiz');
        } catch (err) {
            console.error(err);
            setError("Failed to generate the translation exercise. Please try again.");
            setAppState('input');
        }
    } else if (type === 'text_translation') {
        setLoadingMessage('Generating Text for Translation...');
        setAppState('generating_text_translation');
        try {
            const generatedText = await generateTextTranslationActivity(terms, cefrLevel, vocabChallenge, gramChallenge);
            setTextTranslationQuestion({
                ...generatedText,
                id: crypto.randomUUID(),
            });
            setAppState('text_translation_quiz');
        } catch (err) {
            console.error(err);
            setError("Failed to generate the text translation. Please try again.");
            setAppState('input');
        }
    } else if (type === 'translation_list') {
        if (terms.length < 15) {
            setError("Please provide at least 15 terms for the translation list.");
            setAppState('input');
            return;
        }
        setLoadingMessage('Generating Translation List (15 sentences)...');
        setAppState('generating_translation_list');
        try {
            const sentences = await generateTranslationList(terms, cefrLevel, vocabChallenge, gramChallenge);
            setTranslationListSentences(sentences);
            setAppState('translation_list_results');
        } catch (err) {
            console.error(err);
            setError("Failed to generate the translation list. Please try again.");
            setAppState('input');
        }
    } else if (type === 'matching') {
        if (terms.length < 6) {
            setError("Please provide at least 6 terms for the matching exercise.");
            setAppState('input');
            return;
        }
        setLoadingMessage('Creating Matching Exercise...');
        setAppState('generating_matching');
        
        // This is instant, but we'll show loading for a consistent feel
        setTimeout(() => {
            const shuffledTerms = shuffleArray(terms);
            const selectedTerms = shuffledTerms.slice(0, 6);
            setMatchingPairs(selectedTerms);
            setAppState('matching_quiz');
        }, 100);

    } else { // discussion or agree_disagree
        const title = type === 'discussion' ? 'Discussion Questions' : 'Agree/Disagree Statements';
        setDiscussionTitle(title);
        setLoadingMessage(`Generating ${title}...`);
        setAppState('generating_discussion');
        try {
            const prompts = await generateDiscussionPrompts(terms, type, cefrLevel, vocabChallenge, gramChallenge);
            setDiscussionPrompts(prompts);
            setAppState('discussion_results');
        } catch (err) {
            console.error(err);
            setError(`Failed to generate ${title}. Please try again.`);
            setAppState('input');
        }
    }
  }, []);

  const handleMcqComplete = useCallback((answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setAppState('final_results');
  }, []);

  const handleGapFillComplete = useCallback((answers: GapFillUserAnswer[]) => {
    setGapFillUserAnswers(answers);
    setAppState('final_results');
  }, []);

  const handleTranslationComplete = useCallback((answers: TranslationUserAnswer[]) => {
    setTranslationUserAnswers(answers);
    setAppState('final_results');
  }, []);

  const handleTextTranslationComplete = useCallback((answer: TextTranslationUserAnswer) => {
    setTextTranslationUserAnswer(answer);
    setAppState('final_results');
  }, []);

  const handleMatchingComplete = useCallback((result: MatchingUserResult) => {
    setMatchingResult(result);
    setAppState('final_results');
  }, []);


  const handleRestart = useCallback(() => {
    setAppState('input');
    setQuestions([]);
    setUserAnswers([]);
    setQuizTerms([]);
    setGapFillQuestions([]);
    setGapFillUserAnswers([]);
    setTranslationQuestions([]);
    setTranslationUserAnswers([]);
    setTextTranslationQuestion(null);
    setTextTranslationUserAnswer(null);
    setDiscussionPrompts([]);
    setDiscussionTitle('');
    setTranslationListSentences([]);
    setMatchingPairs([]);
    setMatchingResult(null);
    setIsTimedMode(false);
    setCurrentCefrLevel('B1');
    setVocabularyChallenge('Standard');
    setGrammarChallenge('Standard');
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'input':
        return <InputScreen onGenerate={handleGenerate} error={error} />;
      case 'generating_mcq':
      case 'generating_gap_fill':
      case 'generating_translation':
      case 'generating_discussion':
      case 'generating_translation_list':
      case 'generating_matching':
      case 'generating_text_translation':
        return <LoadingScreen message={loadingMessage} />;
      case 'mcq_quiz':
        return <QuizScreen questions={questions} onComplete={handleMcqComplete} isTimedMode={isTimedMode} />;
      case 'gap_fill_quiz':
        return <GapFillQuizScreen questions={gapFillQuestions} onComplete={handleGapFillComplete} isTimedMode={isTimedMode} />;
      case 'translation_quiz':
        return <TranslationQuizScreen 
                    questions={translationQuestions} 
                    onComplete={handleTranslationComplete} 
                    isTimedMode={isTimedMode} 
                    cefrLevel={currentCefrLevel} 
                />;
      case 'text_translation_quiz':
        return <TextTranslationScreen 
                    question={textTranslationQuestion!} 
                    onComplete={handleTextTranslationComplete} 
                    cefrLevel={currentCefrLevel}
                />;
      case 'matching_quiz':
        return <MatchingScreen terms={matchingPairs} onComplete={handleMatchingComplete} />;
      case 'final_results':
        return <ResultsScreen 
                    mcqUserAnswers={userAnswers} 
                    mcqQuestions={questions} 
                    gapFillUserAnswers={gapFillUserAnswers}
                    gapFillQuestions={gapFillQuestions}
                    translationUserAnswers={translationUserAnswers}
                    translationQuestions={translationQuestions}
                    textTranslationUserAnswer={textTranslationUserAnswer}
                    matchingResult={matchingResult}
                    matchingPairs={matchingPairs}
                    quizTerms={quizTerms}
                    onRestart={handleRestart} 
                />;
      case 'discussion_results':
        return <DiscussionScreen prompts={discussionPrompts} title={discussionTitle} onRestart={handleRestart} />;
      case 'translation_list_results':
        return <TranslationListScreen sentences={translationListSentences} title="Sentences for Translation" onRestart={handleRestart} />;
      default:
        return <InputScreen onGenerate={handleGenerate} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;