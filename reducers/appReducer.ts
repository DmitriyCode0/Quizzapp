
import { 
    AppState, 
    QuizTerm, 
    CEFRLevel, 
    VocabularyChallenge, 
    GrammarChallenge, 
    Question, 
    UserAnswer, 
    GapFillQuestion, 
    GapFillUserAnswer, 
    TranslationQuestion, 
    TranslationUserAnswer, 
    TextTranslationQuestion, 
    TextTranslationUserAnswer, 
    MatchingUserResult,
    GenerationType,
    TeacherPersona
} from '../types';

export interface GlobalState {
    appState: AppState;
    error: string | null;
    loadingMessage: string;
    
    // Input Configuration (Persisted)
    quizTerms: QuizTerm[];
    inputData: string; // Holds the raw text for InputScreen
    cefrLevel: CEFRLevel; // This is actually Grammar Level
    studentLevel: CEFRLevel; // New: Student's general proficiency
    vocabChallenge: VocabularyChallenge;
    gramChallenge: GrammarChallenge;
    teacherPersona: TeacherPersona;
    isTimedMode: boolean;
    customTopic: string;
    selectedGrammarTopics: string[];
    
    // Activity Data Containers
    mcq: { questions: Question[]; userAnswers: UserAnswer[] };
    gapFill: { questions: GapFillQuestion[]; userAnswers: GapFillUserAnswer[] };
    translation: { questions: TranslationQuestion[]; userAnswers: TranslationUserAnswer[] };
    textTranslation: { question: TextTranslationQuestion | null; userAnswer: TextTranslationUserAnswer | null };
    discussion: { prompts: string[]; title: string };
    translationList: { sentences: string[] };
    matching: { pairs: QuizTerm[]; result: MatchingUserResult | null };
    flashcards: { terms: QuizTerm[] };
}

export const initialState: GlobalState = {
    appState: 'input',
    error: null,
    loadingMessage: '',
    
    quizTerms: [],
    inputData: '',
    cefrLevel: 'B1',
    studentLevel: 'B1',
    vocabChallenge: 'Standard',
    gramChallenge: 'Standard',
    teacherPersona: 'learning',
    isTimedMode: false,
    customTopic: '',
    selectedGrammarTopics: [],
    
    mcq: { questions: [], userAnswers: [] },
    gapFill: { questions: [], userAnswers: [] },
    translation: { questions: [], userAnswers: [] },
    textTranslation: { question: null, userAnswer: null },
    discussion: { prompts: [], title: '' },
    translationList: { sentences: [] },
    matching: { pairs: [], result: null },
    flashcards: { terms: [] }
};

export type AppAction = 
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'RESET_APP' }
    | { type: 'LOAD_LIST'; payload: string } // Payload is rawText
    | { type: 'START_GENERATION'; payload: { message: string; type: GenerationType; terms: QuizTerm[]; cefr: CEFRLevel; studentLevel: CEFRLevel; vocab: VocabularyChallenge; gram: GrammarChallenge; teacherPersona: TeacherPersona; isTimed: boolean; customTopic?: string; customGrammarTopics?: string[] } }
    | { type: 'GENERATION_SUCCESS_MCQ'; payload: Question[] }
    | { type: 'GENERATION_SUCCESS_GAP_FILL'; payload: GapFillQuestion[] }
    | { type: 'GENERATION_SUCCESS_TRANSLATION'; payload: TranslationQuestion[] }
    | { type: 'GENERATION_SUCCESS_TEXT_TRANSLATION'; payload: TextTranslationQuestion }
    | { type: 'GENERATION_SUCCESS_DISCUSSION'; payload: { prompts: string[]; title: string } }
    | { type: 'GENERATION_SUCCESS_TRANSLATION_LIST'; payload: string[] }
    | { type: 'GENERATION_SUCCESS_MATCHING'; payload: QuizTerm[] }
    | { type: 'GENERATION_SUCCESS_FLASHCARDS'; payload: QuizTerm[] }
    | { type: 'COMPLETE_MCQ'; payload: UserAnswer[] }
    | { type: 'COMPLETE_GAP_FILL'; payload: GapFillUserAnswer[] }
    | { type: 'COMPLETE_TRANSLATION'; payload: TranslationUserAnswer[] }
    | { type: 'COMPLETE_TEXT_TRANSLATION'; payload: TextTranslationUserAnswer }
    | { type: 'COMPLETE_MATCHING'; payload: MatchingUserResult };

export function appReducer(state: GlobalState, action: AppAction): GlobalState {
    switch (action.type) {
        case 'SET_ERROR':
            return { ...state, error: action.payload, appState: 'input' };
        
        case 'RESET_APP':
            // Keep input settings and inputData but reset activity data
            return {
                ...initialState,
                inputData: state.inputData, // Persist the text
                quizTerms: [], 
                cefrLevel: state.cefrLevel, // Persist Grammar Level
                studentLevel: state.studentLevel, // Persist Student Level
                vocabChallenge: state.vocabChallenge,
                gramChallenge: state.gramChallenge,
                teacherPersona: state.teacherPersona,
                isTimedMode: state.isTimedMode,
                customTopic: state.customTopic,
                selectedGrammarTopics: state.selectedGrammarTopics,
            };

        case 'LOAD_LIST':
            return { ...state, appState: 'input', inputData: action.payload, error: null };

        case 'START_GENERATION':
            let nextState: AppState = 'input';
            switch (action.payload.type) {
                case 'mcq': nextState = 'generating_mcq'; break;
                case 'gap_fill': nextState = 'generating_gap_fill'; break;
                case 'translate_uk_en': nextState = 'generating_translation'; break;
                case 'text_translation': nextState = 'generating_text_translation'; break;
                case 'discussion': case 'agree_disagree': nextState = 'generating_discussion'; break;
                case 'translation_list': nextState = 'generating_translation_list'; break;
                case 'matching': nextState = 'generating_matching'; break;
                case 'flashcards': nextState = 'generating_flashcards'; break;
            }
            
            return {
                ...state,
                appState: nextState,
                loadingMessage: action.payload.message,
                error: null,
                quizTerms: action.payload.terms,
                cefrLevel: action.payload.cefr,
                studentLevel: action.payload.studentLevel,
                vocabChallenge: action.payload.vocab,
                gramChallenge: action.payload.gram,
                teacherPersona: action.payload.teacherPersona,
                isTimedMode: action.payload.isTimed,
                customTopic: action.payload.customTopic || '',
                selectedGrammarTopics: action.payload.customGrammarTopics || [],
                // Clear previous data to avoid stale state
                mcq: { questions: [], userAnswers: [] },
                gapFill: { questions: [], userAnswers: [] },
                translation: { questions: [], userAnswers: [] },
                textTranslation: { question: null, userAnswer: null },
                discussion: { prompts: [], title: '' },
                translationList: { sentences: [] },
                matching: { pairs: [], result: null },
                flashcards: { terms: [] }
            };

        case 'GENERATION_SUCCESS_MCQ':
            return {
                ...state,
                appState: 'mcq_quiz',
                mcq: { ...state.mcq, questions: action.payload }
            };

        case 'GENERATION_SUCCESS_GAP_FILL':
            return {
                ...state,
                appState: 'gap_fill_quiz',
                gapFill: { ...state.gapFill, questions: action.payload }
            };
            
        case 'GENERATION_SUCCESS_TRANSLATION':
            return {
                ...state,
                appState: 'translation_quiz',
                translation: { ...state.translation, questions: action.payload }
            };

        case 'GENERATION_SUCCESS_TEXT_TRANSLATION':
            return {
                ...state,
                appState: 'text_translation_quiz',
                textTranslation: { ...state.textTranslation, question: action.payload }
            };

        case 'GENERATION_SUCCESS_DISCUSSION':
            return {
                ...state,
                appState: 'discussion_results',
                discussion: action.payload
            };

        case 'GENERATION_SUCCESS_TRANSLATION_LIST':
            return {
                ...state,
                appState: 'translation_list_results',
                translationList: { sentences: action.payload }
            };
        
        case 'GENERATION_SUCCESS_MATCHING':
            return {
                ...state,
                appState: 'matching_quiz',
                matching: { ...state.matching, pairs: action.payload }
            };

        case 'GENERATION_SUCCESS_FLASHCARDS':
            return {
                ...state,
                appState: 'flashcards_activity',
                flashcards: { terms: action.payload }
            };

        case 'COMPLETE_MCQ':
            return {
                ...state,
                appState: 'final_results',
                mcq: { ...state.mcq, userAnswers: action.payload }
            };

        case 'COMPLETE_GAP_FILL':
            return {
                ...state,
                appState: 'final_results',
                gapFill: { ...state.gapFill, userAnswers: action.payload }
            };

        case 'COMPLETE_TRANSLATION':
            return {
                ...state,
                appState: 'final_results',
                translation: { ...state.translation, userAnswers: action.payload }
            };

        case 'COMPLETE_TEXT_TRANSLATION':
            return {
                ...state,
                appState: 'final_results',
                textTranslation: { ...state.textTranslation, userAnswer: action.payload }
            };

        case 'COMPLETE_MATCHING':
            return {
                ...state,
                appState: 'final_results',
                matching: { ...state.matching, result: action.payload }
            };

        default:
            return state;
    }
}
