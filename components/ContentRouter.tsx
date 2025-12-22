
import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { GlobalState } from '../reducers/appReducer';
import { 
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

import InputScreen from './InputScreen';
import LoadingScreen from './LoadingScreen';
import QuizScreen from './QuizScreen';
import GapFillQuizScreen from './GapFillQuizScreen';
import TranslationQuizScreen from './TranslationQuizScreen';
import ResultsScreen from './ResultsScreen';
import DiscussionScreen from './DiscussionScreen';
import TranslationListScreen from './TranslationListScreen';
import MatchingScreen from './MatchingScreen';
import TextTranslationScreen from './TextTranslationScreen';
import FlashcardsScreen from './FlashcardsScreen';

interface ContentRouterProps {
  state: GlobalState;
  onGenerate: (data: string, type: GenerationType, cefrLevel: CEFRLevel, studentLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge, teacherPersona: TeacherPersona, isTimed: boolean, customGrammarTopics?: string[], customTopic?: string) => void;
  onRestart: () => void;
  onOpenHelp: () => void;
  onMcqComplete: (answers: UserAnswer[]) => void;
  onGapFillComplete: (answers: GapFillUserAnswer[]) => void;
  onTranslationComplete: (answers: TranslationUserAnswer[]) => void;
  onTextTranslationComplete: (answer: TextTranslationUserAnswer) => void;
  onMatchingComplete: (result: MatchingUserResult) => void;
}

const ContentRouter: React.FC<ContentRouterProps> = ({
  state,
  onGenerate,
  onRestart,
  onOpenHelp,
  onMcqComplete,
  onGapFillComplete,
  onTranslationComplete,
  onTextTranslationComplete,
  onMatchingComplete
}) => {
  const { language, t } = useTranslation();

  switch (state.appState) {
    case 'input':
      return <InputScreen 
                  onGenerate={onGenerate} 
                  onOpenHelp={onOpenHelp}
                  initialData={state.inputData}
                  error={state.error} 
              />;
    
    case 'generating_mcq':
    case 'generating_gap_fill':
    case 'generating_translation':
    case 'generating_discussion':
    case 'generating_translation_list':
    case 'generating_matching':
    case 'generating_text_translation':
    case 'generating_flashcards':
      return <LoadingScreen message={state.loadingMessage} />;
    
    case 'mcq_quiz':
      return <QuizScreen 
                questions={state.mcq.questions} 
                onComplete={onMcqComplete} 
                isTimedMode={state.isTimedMode} 
                cefrLevel={state.studentLevel}
                onBack={onRestart}
             />;
    case 'gap_fill_quiz':
      return <GapFillQuizScreen 
                questions={state.gapFill.questions} 
                onComplete={onGapFillComplete} 
                isTimedMode={state.isTimedMode} 
                cefrLevel={state.studentLevel}
                onBack={onRestart}
             />;
    case 'translation_quiz':
      return <TranslationQuizScreen 
                questions={state.translation.questions} 
                onComplete={onTranslationComplete} 
                isTimedMode={state.isTimedMode} 
                cefrLevel={state.studentLevel} // Evaluation based on student level
                language={language}
                onBack={onRestart}
                selectedGrammarTopics={state.selectedGrammarTopics}
                teacherPersona={state.teacherPersona} 
              />;
    case 'text_translation_quiz':
      return <TextTranslationScreen 
                question={state.textTranslation.question!} 
                onComplete={onTextTranslationComplete} 
                cefrLevel={state.studentLevel} // Evaluation based on student level
                language={language}
                onBack={onRestart}
                selectedGrammarTopics={state.selectedGrammarTopics}
                teacherPersona={state.teacherPersona} 
              />;
    case 'matching_quiz':
      return <MatchingScreen 
                terms={state.matching.pairs} 
                onComplete={onMatchingComplete}
                onBack={onRestart}
             />;
    case 'flashcards_activity':
      return <FlashcardsScreen 
                terms={state.flashcards.terms} 
                onRestart={onRestart} 
             />;
    
    case 'discussion_results':
      return <DiscussionScreen 
                prompts={state.discussion.prompts} 
                title={state.discussion.title} 
                onRestart={onRestart} 
                cefrLevel={state.studentLevel} 
             />;
    case 'translation_list_results':
      return <TranslationListScreen 
                sentences={state.translationList.sentences} 
                title={t('translationListScreen.title')} 
                onRestart={onRestart} 
             />;
    
    case 'final_results':
      return <ResultsScreen 
                mcqUserAnswers={state.mcq.userAnswers} 
                mcqQuestions={state.mcq.questions} 
                gapFillUserAnswers={state.gapFill.userAnswers}
                gapFillQuestions={state.gapFill.questions}
                translationUserAnswers={state.translation.userAnswers}
                translationQuestions={state.translation.questions}
                textTranslationUserAnswer={state.textTranslation.userAnswer}
                textTranslationQuestion={state.textTranslation.question}
                matchingResult={state.matching.result}
                matchingPairs={state.matching.pairs}
                quizTerms={state.quizTerms}
                onRestart={onRestart}
                cefrLevel={state.studentLevel}
                teacherPersona={state.teacherPersona}
              />;
    
    default:
      return <InputScreen onGenerate={onGenerate} onOpenHelp={onOpenHelp} error={state.error} />;
  }
};

export default ContentRouter;
