
// FIX: Removed self-import of 'GenerationType' to resolve declaration conflict.

export type AppState =
  | 'input'
  | 'dashboard'
  | 'generating_mcq'
  | 'generating_gap_fill'
  | 'generating_translation'
  | 'generating_discussion'
  | 'generating_translation_list'
  | 'generating_matching'
  | 'generating_text_translation'
  | 'generating_flashcards'
  | 'mcq_quiz'
  | 'gap_fill_quiz'
  | 'translation_quiz'
  | 'matching_quiz'
  | 'text_translation_quiz'
  | 'flashcards_activity'
  | 'final_results'
  | 'discussion_results'
  | 'translation_list_results';

export type GenerationType = 'mcq' | 'gap_fill' | 'discussion' | 'agree_disagree' | 'translate_uk_en' | 'translation_list' | 'matching' | 'text_translation' | 'flashcards';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'A1 ukr';

export type VocabularyChallenge = 'Basic' | 'Standard' | 'Advanced';
export type GrammarChallenge = 'Simple' | 'Standard' | 'Complex';
export type TeacherPersona = 'learning' | 'standard' | 'strict';

export type Language = 'en' | 'uk';

export interface QuizTerm {
  term: string;
  definition: string;
}

export interface SavedList {
  id: string;
  name: string;
  date: number; // timestamp
  rawText: string;
  termCount: number;
}

export interface HistoryItem {
  id: string;
  date: number; // timestamp
  type: GenerationType;
  score?: number;
  total?: number;
  details?: string; // e.g., "A1 - Standard"
  grammarTopics?: string[]; // Added: List of selected grammar topics for this activity
}

// --- Grammar Architecture ---

export interface AiDifficultyConfig {
    Basic: string;    // Instructions for 'Simple'/'Basic' difficulty
    Standard: string; // Instructions for 'Standard' difficulty
    Advanced: string; // Instructions for 'Complex'/'Advanced' difficulty
}

export interface GrammarTopicConfig {
    id: string;          // Unique key (e.g., 'b1-pp-vs-ps')
    title: string;       // Display name
    level: Exclude<CEFRLevel, 'A1 ukr'>;
    
    // Content for the Library UI
    description: string; 
    example: string;
    tags: string[];
    searchKey: string;   // The legacy string used to match selection from grammarData.ts
    
    // New: Specific instructions for the AI Generator
    aiConfig?: {
        systemRule: string; 
        difficultyConfig: AiDifficultyConfig;
    };
}

// MCQ Quiz
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  originalTerm: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

// Gap-fill Quiz
export interface GapFillQuestion {
    id: string;
    sentence: string;
    correctAnswer: string;
    hint: string;
    originalTerm: string;
}

export interface GapFillUserAnswer {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
}

// New Structured Feedback Types
export type FeedbackType = 'grammar' | 'bonus' | 'error';

export interface FeedbackItem {
    type: FeedbackType;
    topic: string;
    message: string;
}

// Translation Quiz
export interface TranslationQuestion {
    id: string;
    ukrainianSentence: string;
    englishAnswer: string;
    originalTerm: string;
}

export interface TranslationUserAnswer {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    score: number; // Percentage score, can be > 100 with bonuses
    feedback: FeedbackItem[]; // AI-generated structured feedback
}

// Text Translation Activity
export interface TextTranslationQuestion {
    id: string;
    ukrainianText: string;
    englishAnswer: string;
}

export interface TextTranslationUserAnswer {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    score: number;
    feedback: FeedbackItem[];
}


// Matching Game
export interface MatchingUserResult {
    incorrectAttempts: number;
}
