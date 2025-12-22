import {
    Question,
    GapFillQuestion,
    TranslationQuestion,
    FeedbackItem
} from '../types';

// Helper to check if array of strings
const isStringArray = (arr: any): arr is string[] => {
    return Array.isArray(arr) && arr.every(item => typeof item === 'string');
};

// --- MCQ Validation ---
export interface McqResponse {
    questions: Omit<Question, 'id'>[];
}

export const isValidMcqResponse = (data: any): data is McqResponse => {
    if (!data || !Array.isArray(data.questions)) return false;
    return data.questions.every((q: any) =>
        typeof q.question === 'string' &&
        isStringArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctAnswer === 'string' &&
        typeof q.originalTerm === 'string'
    );
};

// --- Gap Fill Validation ---
export interface GapFillResponse {
    questions: Omit<GapFillQuestion, 'id'>[];
}

export const isValidGapFillResponse = (data: any): data is GapFillResponse => {
    if (!data || !Array.isArray(data.questions)) return false;
    return data.questions.every((q: any) =>
        typeof q.sentence === 'string' &&
        typeof q.correctAnswer === 'string' &&
        typeof q.hint === 'string' &&
        typeof q.originalTerm === 'string'
    );
};

// --- Translation Quiz Validation ---
export interface TranslationQuizResponse {
    questions: Omit<TranslationQuestion, 'id'>[];
}

export const isValidTranslationQuizResponse = (data: any): data is TranslationQuizResponse => {
    if (!data || !Array.isArray(data.questions)) return false;
    return data.questions.every((q: any) =>
        typeof q.ukrainianSentence === 'string' &&
        typeof q.englishAnswer === 'string' &&
        typeof q.originalTerm === 'string'
    );
};

// --- Text Translation Validation ---
export interface TextTranslationResponse {
    ukrainianText: string;
    englishAnswer: string;
}

export const isValidTextTranslationResponse = (data: any): data is TextTranslationResponse => {
    return (
        data &&
        typeof data.ukrainianText === 'string' &&
        typeof data.englishAnswer === 'string'
    );
};

// --- Translation List Validation ---
export interface TranslationListResponse {
    sentences: string[];
}

export const isValidTranslationListResponse = (data: any): data is TranslationListResponse => {
    return data && isStringArray(data.sentences);
};

// --- Discussion Prompts Validation ---
export interface DiscussionPromptsResponse {
    prompts: string[];
}

export const isValidDiscussionPromptsResponse = (data: any): data is DiscussionPromptsResponse => {
    return data && isStringArray(data.prompts);
};

// --- Evaluation Validation ---
export interface EvaluationResponse {
    score: number;
    feedback: FeedbackItem[];
}

export const isValidEvaluationResponse = (data: any): data is EvaluationResponse => {
    if (!data || typeof data.score !== 'number' || !Array.isArray(data.feedback)) return false;
    return data.feedback.every((f: any) =>
        typeof f.type === 'string' &&
        typeof f.topic === 'string' &&
        typeof f.message === 'string'
    );
};

// --- Parser Validation ---
export interface ParserResponse {
    terms: { term: string; definition: string }[];
}

export const isValidParserResponse = (data: any): data is ParserResponse => {
    if (!data || !Array.isArray(data.terms)) return false;
    return data.terms.every((t: any) =>
        typeof t.term === 'string' &&
        typeof t.definition === 'string'
    );
};