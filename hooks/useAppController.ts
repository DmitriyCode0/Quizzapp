
import { useReducer, useCallback } from 'react';
import { 
  QuizTerm, 
  GenerationType, 
  CEFRLevel, 
  VocabularyChallenge, 
  GrammarChallenge, 
  UserAnswer,
  GapFillUserAnswer,
  TranslationUserAnswer,
  TextTranslationUserAnswer,
  MatchingUserResult,
  TeacherPersona
} from '../types';
import { 
  generateMcqQuiz, 
  generateGapFillQuiz, 
  generateDiscussionPrompts, 
  generateTranslationQuiz, 
  generateTranslationList, 
  generateTextTranslationActivity 
} from '../services/geminiService';
import { addToHistory } from '../services/storageService';
import { appReducer, initialState } from '../reducers/appReducer';
import { useTranslation } from './useTranslation';
import { useAudio } from './useAudio';

export const useAppController = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { language, t } = useTranslation();
  const { cancel: cancelAudio } = useAudio();

  // Helper functions
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

  // Actions
  const handleGenerate = useCallback(async (
      quizletData: string, 
      type: GenerationType, 
      cefrLevel: CEFRLevel, // Grammar Topic Level
      studentLevel: CEFRLevel, // Student Proficiency Level
      vocabChallenge: VocabularyChallenge, 
      gramChallenge: GrammarChallenge, 
      teacherPersona: TeacherPersona,
      isTimed: boolean,
      customGrammarTopics?: string[],
      customTopic?: string
    ) => {
    
    const terms = parseQuizletData(quizletData);

    if (terms.length === 0) {
      dispatch({ type: 'SET_ERROR', payload: "Invalid or empty data. Please paste the Quizlet data with tabs between terms and definitions." });
      return;
    }

    // Start Generation - this sets loading state and clears previous data
    let loadingMsg = 'Generating...';
    if (type === 'mcq') loadingMsg = 'Generating Multiple Choice Quiz...';
    else if (type === 'gap_fill') loadingMsg = 'Generating Gap-fill Exercise...';
    else if (type === 'translate_uk_en') loadingMsg = 'Generating Translation Exercise (5 questions)...';
    else if (type === 'text_translation') loadingMsg = 'Generating Text for Translation...';
    else if (type === 'translation_list') loadingMsg = 'Generating Translation List (15 sentences)...';
    else if (type === 'matching') loadingMsg = 'Creating Matching Exercise...';
    else if (type === 'flashcards') loadingMsg = 'Creating Flashcards...';
    else if (type === 'discussion') loadingMsg = 'Generating Discussion Questions...';
    else if (type === 'agree_disagree') loadingMsg = 'Generating Agree/Disagree Statements...';

    dispatch({ 
      type: 'START_GENERATION', 
      payload: { 
        message: loadingMsg, 
        type, 
        terms, 
        cefr: cefrLevel,
        studentLevel, 
        vocab: vocabChallenge, 
        gram: gramChallenge,
        teacherPersona, 
        isTimed,
        customTopic,
        customGrammarTopics 
      } 
    });

    try {
      if (type === 'mcq') {
        const generatedQuestions = await generateMcqQuiz(terms, studentLevel, vocabChallenge, gramChallenge, customTopic);
        const questionsWithShuffledOptions = generatedQuestions.map(q => ({
          ...q,
          id: crypto.randomUUID(),
          options: shuffleArray(q.options),
        }));
        dispatch({ type: 'GENERATION_SUCCESS_MCQ', payload: shuffleArray(questionsWithShuffledOptions) });
      } 
      else if (type === 'gap_fill') {
        const generatedQuestions = await generateGapFillQuiz(terms, studentLevel, vocabChallenge, gramChallenge, customTopic);
        const questionsWithIds = generatedQuestions.map(q => ({
            ...q,
            id: crypto.randomUUID(),
        }));
        dispatch({ type: 'GENERATION_SUCCESS_GAP_FILL', payload: shuffleArray(questionsWithIds) });
      } 
      else if (type === 'translate_uk_en') {
        if (terms.length < 5) {
             dispatch({ type: 'SET_ERROR', payload: "Please provide at least 5 terms for the translation exercise." });
             return;
        }
        const generatedQuestions = await generateTranslationQuiz(terms, cefrLevel, studentLevel, vocabChallenge, gramChallenge, customGrammarTopics, customTopic);
        const questionsWithIds = generatedQuestions.map(q => ({
            ...q,
            id: crypto.randomUUID(),
        }));
        dispatch({ type: 'GENERATION_SUCCESS_TRANSLATION', payload: shuffleArray(questionsWithIds) });
      } 
      else if (type === 'text_translation') {
        const generatedText = await generateTextTranslationActivity(terms, cefrLevel, studentLevel, vocabChallenge, gramChallenge, customGrammarTopics, customTopic);
        dispatch({ 
          type: 'GENERATION_SUCCESS_TEXT_TRANSLATION', 
          payload: { ...generatedText, id: crypto.randomUUID() } 
        });
      } 
      else if (type === 'translation_list') {
        if (terms.length < 15) {
            dispatch({ type: 'SET_ERROR', payload: "Please provide at least 15 terms for the translation list." });
            return;
        }
        const sentences = await generateTranslationList(terms, cefrLevel, studentLevel, vocabChallenge, gramChallenge, customTopic);
        dispatch({ type: 'GENERATION_SUCCESS_TRANSLATION_LIST', payload: sentences });
        
        addToHistory({
            type: 'translation_list',
            details: `${cefrLevel} (Grammar) / ${studentLevel} (Student) - ${sentences.length} items`
        });
      } 
      else if (type === 'matching') {
        if (terms.length < 6) {
            dispatch({ type: 'SET_ERROR', payload: "Please provide at least 6 terms for the matching exercise." });
            return;
        }
        setTimeout(() => {
            const shuffledTerms = shuffleArray(terms);
            const selectedTerms = shuffledTerms.slice(0, 6);
            dispatch({ type: 'GENERATION_SUCCESS_MATCHING', payload: selectedTerms });
        }, 100);
      } 
      else if (type === 'flashcards') {
        setTimeout(() => {
            dispatch({ type: 'GENERATION_SUCCESS_FLASHCARDS', payload: shuffleArray(terms) });
        }, 100);
      } 
      else { // discussion or agree_disagree
        const prompts = await generateDiscussionPrompts(terms, type, studentLevel, vocabChallenge, gramChallenge, customTopic);
        const title = type === 'discussion' ? 'Discussion Questions' : 'Agree/Disagree Statements';
        dispatch({ type: 'GENERATION_SUCCESS_DISCUSSION', payload: { prompts, title } });
        
        addToHistory({
            type,
            details: `${studentLevel} - ${prompts.length} prompts`
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_ERROR', payload: "Failed to generate the activity. Please check your API key and input data." });
    }
  }, [language]); 

  const handleRestart = useCallback(() => {
    cancelAudio();
    dispatch({ type: 'RESET_APP' });
  }, [cancelAudio]);

  const handleLoadList = useCallback((rawText: string) => {
    dispatch({ type: 'LOAD_LIST', payload: rawText });
  }, []);

  const handleMcqComplete = useCallback((answers: UserAnswer[]) => {
    const score = answers.filter(a => a.isCorrect).length;
    addToHistory({
        type: 'mcq',
        score,
        total: answers.length,
        details: `${state.studentLevel}`
    });
    dispatch({ type: 'COMPLETE_MCQ', payload: answers });
  }, [state.studentLevel]);

  const handleGapFillComplete = useCallback((answers: GapFillUserAnswer[]) => {
    const score = answers.filter(a => a.isCorrect).length;
    addToHistory({
        type: 'gap_fill',
        score,
        total: answers.length,
        details: `${state.studentLevel}`
    });
    dispatch({ type: 'COMPLETE_GAP_FILL', payload: answers });
  }, [state.studentLevel]);

  const handleTranslationComplete = useCallback((answers: TranslationUserAnswer[]) => {
    const totalScore = answers.reduce((sum, ans) => sum + ans.score, 0);
    const percentage = Math.round(totalScore / answers.length);
    addToHistory({
        type: 'translate_uk_en',
        score: percentage,
        total: 100,
        details: `${state.cefrLevel} (G) / ${state.studentLevel} (S)`,
        grammarTopics: state.selectedGrammarTopics
    });
    dispatch({ type: 'COMPLETE_TRANSLATION', payload: answers });
  }, [state.cefrLevel, state.studentLevel, state.selectedGrammarTopics]);

  const handleTextTranslationComplete = useCallback((answer: TextTranslationUserAnswer) => {
    addToHistory({
        type: 'text_translation',
        score: answer.score,
        total: 100,
        details: `${state.cefrLevel} (G) / ${state.studentLevel} (S)`,
        grammarTopics: state.selectedGrammarTopics
    });
    dispatch({ type: 'COMPLETE_TEXT_TRANSLATION', payload: answer });
  }, [state.cefrLevel, state.studentLevel, state.selectedGrammarTopics]);

  const handleMatchingComplete = useCallback((result: MatchingUserResult) => {
    addToHistory({
        type: 'matching',
        details: `Errors: ${result.incorrectAttempts}`
    });
    dispatch({ type: 'COMPLETE_MATCHING', payload: result });
  }, []);

  return {
    state,
    handleGenerate,
    handleRestart,
    handleLoadList,
    handleMcqComplete,
    handleGapFillComplete,
    handleTranslationComplete,
    handleTextTranslationComplete,
    handleMatchingComplete
  };
};
