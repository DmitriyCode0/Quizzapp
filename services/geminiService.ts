
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { QuizTerm, Question, GapFillQuestion, CEFRLevel, TranslationQuestion, FeedbackItem, VocabularyChallenge, GrammarChallenge, Language, GrammarTopicConfig, TeacherPersona } from '../types';
import { grammarPools } from '../data/grammarData';
import { grammarLibrary } from '../data/grammarLibrary';
import {
    isValidMcqResponse,
    isValidGapFillResponse,
    isValidTranslationQuizResponse,
    isValidTextTranslationResponse,
    isValidTranslationListResponse,
    isValidDiscussionPromptsResponse,
    isValidEvaluationResponse,
    isValidParserResponse,
    McqResponse,
    GapFillResponse,
    TranslationQuizResponse,
    TextTranslationResponse,
    TranslationListResponse,
    DiscussionPromptsResponse,
    EvaluationResponse,
    ParserResponse
} from './validation';
import {
    getTopicInstruction,
    getDifficultyInstruction,
    constructParserPrompt,
    constructMcqPrompt,
    constructGapFillPrompt,
    constructTranslationQuizPrompt,
    constructEvaluationPrompt,
    constructDiscussionPrompt,
    constructTranslationListPrompt,
    constructTextTranslationPrompt,
    constructTextEvaluationPrompt,
    getEvaluationRubric,
    getHolisticEvaluationRubric
} from './prompts';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A utility function to retry an async API call with exponential backoff.
 */
const withRetry = async <T>(
  apiCall: () => Promise<T>, 
  maxRetries = 3, 
  initialDelay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      if (attempt === maxRetries) {
        console.error(`API call failed after ${maxRetries} attempts.`, error);
        throw error;
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.warn(`API call failed (Status: ${error.status || 'Unknown'}). Attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('This should not be reached');
};

/**
 * Generic function to generate content, parse JSON, and validate the structure.
 */
const generateFromGemini = async <T>(
    prompt: string,
    schema: any,
    validator: (data: any) => data is T,
    errorMessage: string,
    temperature: number = 0.5
): Promise<T> => {
    try {
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: temperature,
            },
        }));
        
        const jsonText = response.text.trim();
        let result: any;
        
        try {
            result = JSON.parse(jsonText);
        } catch (error) {
            console.error("JSON Parse Error:", error, "\nJSON:", jsonText);
            throw new Error(`Invalid JSON received from API for ${errorMessage}`);
        }

        if (validator(result)) {
            return result;
        } else {
            console.error("Validation Error. Data:", result);
            throw new Error(`Invalid data structure received for ${errorMessage}`);
        }
    } catch (error) {
        console.error(`Error in ${errorMessage}:`, error);
        throw new Error(`Could not generate ${errorMessage}. The API returned an error.`);
    }
};

const shuffleAndSlice = <T>(array: T[], limit: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
};

// Helper to resolve string IDs/Keys into full GrammarTopicConfig objects
const resolveGrammarTopics = (topicIdsOrKeys: string[] | undefined): GrammarTopicConfig[] => {
    if (!topicIdsOrKeys || topicIdsOrKeys.length === 0) return [];
    
    return topicIdsOrKeys.map(key => {
        // Try finding by searchKey (legacy) or ID
        const topic = grammarLibrary.find(t => t.searchKey === key || t.id === key);
        if (topic) return topic;
        
        // Fallback: Create a temporary config if not found in library (shouldn't happen often)
        return {
            id: 'temp',
            title: key,
            level: 'B1',
            description: '',
            example: '',
            tags: [],
            searchKey: key
        } as GrammarTopicConfig;
    });
};

// --- Speech Generation (TTS) ---

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data returned from Gemini");
        }
        return base64Audio;
    } catch (error) {
        console.error("Speech generation failed:", error);
        throw error;
    }
};

// --- Parser Service ---
const parserSchema = {
    type: Type.OBJECT,
    properties: {
        terms: {
            type: Type.ARRAY,
            description: "An array of extracted English terms and their Ukrainian translations.",
            items: {
                type: Type.OBJECT,
                properties: {
                    term: { type: Type.STRING, description: "The English word or phrase." },
                    definition: { type: Type.STRING, description: "The Ukrainian translation based on context." }
                },
                required: ["term", "definition"]
            }
        }
    },
    required: ["terms"]
};

export const parseRawInput = async (rawInput: string): Promise<string> => {
    const prompt = constructParserPrompt(rawInput);

    try {
        const result = await generateFromGemini<ParserResponse>(
            prompt,
            parserSchema,
            isValidParserResponse,
            "Vocabulary Parser",
            0.3
        );
        return result.terms.map(t => `${t.term}\t${t.definition}`).join('\n');
    } catch (error) {
        console.error("Parsing failed", error);
        throw error;
    }
};


// --- MCQ Quiz ---

const mcqQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        question: {
            type: Type.STRING,
            description: "The question text, testing the meaning of a specific English word.",
        },
        options: {
            type: Type.ARRAY,
            description: "An array of four potential answers (strings). One is correct, three are incorrect.",
            items: { type: Type.STRING },
        },
        correctAnswer: {
            type: Type.STRING,
            description: "The correct answer, which must be one of the strings from the 'options' array.",
        },
        originalTerm: {
            type: Type.STRING,
            description: "The original English word this question is for."
        }
    },
    required: ["question", "options", "correctAnswer", "originalTerm"],
};

const mcqQuizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of quiz questions.",
            items: mcqQuestionSchema,
        },
    },
    required: ["questions"],
};

export const generateMcqQuiz = async (
    terms: QuizTerm[], 
    studentLevel: CEFRLevel, // Use Student Level for vocab difficulty
    vocabChallenge: VocabularyChallenge, 
    gramChallenge: GrammarChallenge,
    customTopic?: string
): Promise<Omit<Question, 'id'>[]> => {
    // For MCQ, we don't really care about the Grammar Topic Level ("cefrLevel"), only student proficiency
    const isUkr = studentLevel === 'A1 ukr';
    const effectiveLevel = isUkr ? 'A1' : studentLevel;
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'mcq');
    const topicInstruction = getTopicInstruction(customTopic);
    
    // Limit to 20 questions max
    const selectedTerms = terms.length > 20 ? shuffleAndSlice(terms, 20) : terms;

    const prompt = constructMcqPrompt(
        selectedTerms,
        isUkr,
        effectiveLevel,
        difficultyInstruction,
        topicInstruction
    );

    const result = await generateFromGemini<McqResponse>(
        prompt, 
        mcqQuizSchema, 
        isValidMcqResponse, 
        "MCQ Quiz", 
        0.5
    );
    return result.questions;
};

// --- Gap Fill Quiz ---

const gapFillQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        sentence: {
            type: Type.STRING,
            description: "A sentence with a blank represented by '____' where the English word should go.",
        },
        correctAnswer: {
            type: Type.STRING,
            description: "The correct English word that fills the blank. This may be a different form of the original term (e.g., conjugated verb, plural noun).",
        },
        hint: {
            type: Type.STRING,
            description: "The Ukrainian translation of the correct answer, to be used as a hint.",
        },
        originalTerm: {
            type: Type.STRING,
            description: "The original English word from the input list that this question is based on."
        }
    },
    required: ["sentence", "correctAnswer", "hint", "originalTerm"],
};

const gapFillQuizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of gap-fill quiz questions.",
            items: gapFillQuestionSchema,
        },
    },
    required: ["questions"],
};

export const generateGapFillQuiz = async (
    terms: QuizTerm[], 
    studentLevel: CEFRLevel, // Use Student Level for sentence complexity
    vocabChallenge: VocabularyChallenge, 
    gramChallenge: GrammarChallenge,
    customTopic?: string
): Promise<Omit<GapFillQuestion, 'id'>[]> => {
    const isUkr = studentLevel === 'A1 ukr';
    const effectiveLevel = isUkr ? 'A1' : studentLevel;
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'gap_fill');
    const topicInstruction = getTopicInstruction(customTopic);
    
    const selectedTerms = terms.length > 20 ? shuffleAndSlice(terms, 20) : terms;

    const prompt = constructGapFillPrompt(
        selectedTerms,
        isUkr,
        effectiveLevel,
        difficultyInstruction,
        topicInstruction
    );

    const result = await generateFromGemini<GapFillResponse>(
        prompt, 
        gapFillQuizSchema, 
        isValidGapFillResponse, 
        "Gap-fill Quiz", 
        0.5
    );
    return result.questions;
};

// --- Translation Quiz ---

const translationQuestionSchema = {
    type: Type.OBJECT,
    properties: {
        ukrainianSentence: {
            type: Type.STRING,
            description: "A sentence in Ukrainian that incorporates one of the vocabulary words.",
        },
        englishAnswer: {
            type: Type.STRING,
            description: "The correct and natural-sounding English translation of the Ukrainian sentence.",
        },
        originalTerm: {
            type: Type.STRING,
            description: "The original English word this question is based on."
        }
    },
    required: ["ukrainianSentence", "englishAnswer", "originalTerm"],
};

const translationQuizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of 5 translation quiz questions.",
            items: translationQuestionSchema,
        },
    },
    required: ["questions"],
};

const getNextCefrLevel = (level: Exclude<CEFRLevel, 'A1 ukr'>): Exclude<CEFRLevel, 'A1 ukr'> => {
    const levels: Exclude<CEFRLevel, 'A1 ukr'>[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(level);
    if (currentIndex >= 0 && currentIndex < levels.length - 1) {
        return levels[currentIndex + 1];
    }
    return 'C2';
};

export const generateTranslationQuiz = async (
    terms: QuizTerm[], 
    cefrLevel: CEFRLevel, // Grammar Topic Level
    studentLevel: CEFRLevel, // Student Proficiency Level
    vocabChallenge: VocabularyChallenge, 
    gramChallenge: GrammarChallenge, 
    customTopics?: string[],
    customTopic?: string
): Promise<Omit<TranslationQuestion, 'id'>[]> => {
    const effectiveGrammarLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
    const effectiveStudentLevel = studentLevel === 'A1 ukr' ? 'A1' : studentLevel;
    
    const selectedTerms = shuffleAndSlice(terms, 5);

    let resolvedGrammarTopics: GrammarTopicConfig[] = [];

    if (customTopics && customTopics.length > 0) {
        resolvedGrammarTopics = resolveGrammarTopics(customTopics);
    } else {
        const pool = grammarPools[effectiveGrammarLevel];
        if (pool && pool.length > 0) {
            const shuffled = [...pool].sort(() => 0.5 - Math.random());
            const selectionCount = Math.random() < 0.5 ? 2 : 3;
            const selectedPoints = shuffled.slice(0, Math.min(pool.length, selectionCount));
            resolvedGrammarTopics = resolveGrammarTopics(selectedPoints);
        }
    }

    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'translate_uk_en');
    const topicInstruction = getTopicInstruction(customTopic);

    const prompt = constructTranslationQuizPrompt(
        selectedTerms,
        effectiveGrammarLevel, // Target Grammar Level
        effectiveStudentLevel, // Student Proficiency Level
        difficultyInstruction,
        resolvedGrammarTopics,
        topicInstruction,
        gramChallenge
    );

    const result = await generateFromGemini<TranslationQuizResponse>(
        prompt, 
        translationQuizSchema, 
        isValidTranslationQuizResponse, 
        "Translation Quiz", 
        0.5
    );
    return result.questions;
};

// --- Evaluation ---

const feedbackItemSchema = {
    type: Type.OBJECT,
    properties: {
        type: { 
            type: Type.STRING,
            description: "The category of the feedback.",
            enum: ['grammar', 'bonus']
        },
        topic: {
            type: Type.STRING,
            description: "A specific topic for the feedback, e.g., 'Article Usage', 'Verb Tense', 'Advanced Vocabulary'."
        },
        message: {
            type: Type.STRING,
            description: "The detailed feedback message for the student."
        }
    },
    required: ["type", "topic", "message"]
};

const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "The final integer percentage score. It's the sum of the base score and any bonus points, so it can exceed 100.",
        },
        feedback: {
            type: Type.ARRAY,
            description: "A list of structured feedback items.",
            items: feedbackItemSchema,
        },
    },
    required: ["score", "feedback"],
};

export const evaluateTranslationAnswer = async (
    userAnswer: string, 
    modelAnswer: string, 
    ukrainianSentence: string,
    originalTerm: string,
    cefrLevel: CEFRLevel, // This should technically be studentLevel for grading standard, but grammar rules from context
    language: Language,
    selectedGrammarTopics?: string[],
    teacherPersona: TeacherPersona = 'standard'
): Promise<{ score: number; feedback: FeedbackItem[] }> => {
    
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
    // Note: For evaluation, we use the student's level to determine leniency, 
    // but the 'nextLevel' bonus is calculated relative to where they are.
    const nextLevel = getNextCefrLevel(effectiveCefrLevel);
    
    // We fetch a bonus pool from the next level up to encourage growth
    const grammarForBonusPool = grammarPools[nextLevel];
    const grammarForBonus = `The sentences must specifically test some of the following grammatical structures:\n- ${[...grammarForBonusPool].sort(() => 0.5 - Math.random()).slice(0, 5).join('\n- ')}`;

    const { personality, rubric, specialInstructions } = getEvaluationRubric(effectiveCefrLevel);
    const translationInstruction = language === 'uk'
        ? `**Step 5: Translate Feedback**
CRITICAL: Before returning the JSON, translate the 'topic' and 'message' for every feedback item into fluent, natural-sounding Ukrainian.`
        : "";

    // Resolve strings to config objects for the evaluation prompt
    const resolvedGrammarTopics = resolveGrammarTopics(selectedGrammarTopics);

    const prompt = constructEvaluationPrompt(
        personality,
        rubric,
        specialInstructions,
        effectiveCefrLevel,
        ukrainianSentence,
        originalTerm,
        modelAnswer,
        userAnswer,
        nextLevel,
        grammarForBonus,
        translationInstruction,
        resolvedGrammarTopics,
        teacherPersona
    );

    try {
        const result = await generateFromGemini<EvaluationResponse>(
            prompt, 
            evaluationSchema, 
            isValidEvaluationResponse, 
            "Translation Evaluation", 
            0.3
        );
        return result;
    } catch (error) {
         console.error("Error evaluating translation with Gemini:", error);
        const errorMessage = language === 'uk'
            ? "Вибачте, сталася помилка під час оцінювання відповіді. Будь ласка, спробуйте ще раз."
            : "Sorry, an error occurred while evaluating the answer. Please try again.";
        return { 
            score: 0, 
            feedback: [{ type: 'error', topic: language === 'uk' ? 'Помилка API' : 'API Error', message: errorMessage }] 
        };
    }
};

// --- Discussion Prompts ---

const discussionPromptsSchema = {
    type: Type.OBJECT,
    properties: {
        prompts: {
            type: Type.ARRAY,
            description: "An array of text prompts (strings).",
            items: { type: Type.STRING },
        },
    },
    required: ["prompts"],
};

export const generateDiscussionPrompts = async (
    terms: QuizTerm[], 
    type: 'discussion' | 'agree_disagree', 
    studentLevel: CEFRLevel, // Student Level for complexity
    vocabChallenge: VocabularyChallenge, 
    gramChallenge: GrammarChallenge,
    customTopic?: string
): Promise<string[]> => {
    const isUkr = studentLevel === 'A1 ukr';
    const effectiveLevel = isUkr ? 'A1' : studentLevel;
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'discussion');
    const topicInstruction = getTopicInstruction(customTopic);
    const selectedTerms = terms.length > 10 ? shuffleAndSlice(terms, 10) : terms;

    const promptTypeInstruction = type === 'discussion'
        ? "Create an open-ended discussion question for each term that encourages critical thinking or sharing personal experiences related to the term."
        : "Create a provocative 'Agree or Disagree?' statement for each term. The statement should be debatable and encourage users to take a stance.";

    const prompt = constructDiscussionPrompt(
        selectedTerms,
        isUkr,
        effectiveLevel,
        difficultyInstruction,
        topicInstruction,
        promptTypeInstruction
    );

    const result = await generateFromGemini<DiscussionPromptsResponse>(
        prompt, 
        discussionPromptsSchema, 
        isValidDiscussionPromptsResponse, 
        `${type} Prompts`, 
        0.5
    );
    return result.prompts;
};

// --- Translation List ---

const translationListSchema = {
    type: Type.OBJECT,
    properties: {
        sentences: {
            type: Type.ARRAY,
            description: "An array of 15 unique Ukrainian sentences for translation.",
            items: { type: Type.STRING },
        },
    },
    required: ["sentences"],
};

export const generateTranslationList = async (
    terms: QuizTerm[], 
    cefrLevel: CEFRLevel, // Grammar Level
    studentLevel: CEFRLevel, // Student Level
    vocabChallenge: VocabularyChallenge, 
    gramChallenge: GrammarChallenge,
    customTopic?: string
): Promise<string[]> => {
    const effectiveGrammarLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
    const effectiveStudentLevel = studentLevel === 'A1 ukr' ? 'A1' : studentLevel;
    
    const selectedTerms = shuffleAndSlice(terms, 15);

    const pool = grammarPools[effectiveGrammarLevel];
    let resolvedGrammarTopics: GrammarTopicConfig[] = [];

    if (pool && pool.length > 0) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        let selectionCount;
        switch (gramChallenge) {
            case 'Simple': selectionCount = 3; break;
            case 'Standard': selectionCount = 4; break;
            case 'Complex': selectionCount = 5; break;
            default: selectionCount = 4; break;
        }
        const selectedPoints = shuffled.slice(0, Math.min(pool.length, selectionCount));
        resolvedGrammarTopics = resolveGrammarTopics(selectedPoints);
    }

    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'translate_uk_en');
    const topicInstruction = getTopicInstruction(customTopic);

    const prompt = constructTranslationListPrompt(
        selectedTerms,
        effectiveGrammarLevel, // Target Grammar
        effectiveStudentLevel, // Student Proficiency
        difficultyInstruction,
        resolvedGrammarTopics,
        topicInstruction,
        gramChallenge
    );

    const result = await generateFromGemini<TranslationListResponse>(
        prompt, 
        translationListSchema, 
        isValidTranslationListResponse, 
        "Translation List", 
        0.5
    );
    return result.sentences;
};

// --- Text Translation Activity ---

const textTranslationSchema = {
    type: Type.OBJECT,
    properties: {
        ukrainianText: {
            type: Type.STRING,
            description: "A cohesive Ukrainian text of about 5 sentences.",
        },
        englishAnswer: {
            type: Type.STRING,
            description: "The correct and natural-sounding English translation of the entire Ukrainian text.",
        },
    },
    required: ["ukrainianText", "englishAnswer"],
};

export const generateTextTranslationActivity = async (
    terms: QuizTerm[], 
    cefrLevel: CEFRLevel, // Grammar Level
    studentLevel: CEFRLevel, // Student Level
    vocabChallenge: VocabularyChallenge, 
    gramChallenge: GrammarChallenge, 
    customTopics?: string[],
    customTopic?: string
): Promise<{ ukrainianText: string; englishAnswer: string; }> => {
    const effectiveGrammarLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
    const effectiveStudentLevel = studentLevel === 'A1 ukr' ? 'A1' : studentLevel;
    
    let resolvedGrammarTopics: GrammarTopicConfig[] = [];

    if (customTopics && customTopics.length > 0) {
        resolvedGrammarTopics = resolveGrammarTopics(customTopics);
    } else {
        const pool = grammarPools[effectiveGrammarLevel];
        if (pool && pool.length > 0) {
            const shuffled = [...pool].sort(() => 0.5 - Math.random());
            const selectionCount = Math.random() < 0.5 ? 2 : 3;
            const selectedPoints = shuffled.slice(0, Math.min(pool.length, selectionCount));
            resolvedGrammarTopics = resolveGrammarTopics(selectedPoints);
        }
    }

    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'text_translation');
    const topicInstruction = getTopicInstruction(customTopic);

    const prompt = constructTextTranslationPrompt(
        terms,
        effectiveGrammarLevel, // Target Grammar
        effectiveStudentLevel, // Student Proficiency
        difficultyInstruction,
        resolvedGrammarTopics,
        topicInstruction,
        gramChallenge
    );

    const result = await generateFromGemini<TextTranslationResponse>(
        prompt, 
        textTranslationSchema, 
        isValidTextTranslationResponse, 
        "Text Translation", 
        0.5
    );
    return result;
};

export const evaluateTextTranslationAnswer = async (
    userAnswer: string, 
    modelAnswer: string, 
    ukrainianText: string,
    cefrLevel: CEFRLevel, // Use Student Level for overall grading standards
    language: Language,
    selectedGrammarTopics?: string[],
    teacherPersona: TeacherPersona = 'standard'
): Promise<{ score: number; feedback: FeedbackItem[] }> => {
    
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
    const { personality, rubric, specialInstructions } = getHolisticEvaluationRubric(effectiveCefrLevel);

    const translationInstruction = language === 'uk'
        ? `**3. Translate Feedback:**
CRITICAL: Before returning the JSON, translate the 'topic' and 'message' for every feedback item into fluent, natural-sounding Ukrainian.`
        : "";

    const resolvedGrammarTopics = resolveGrammarTopics(selectedGrammarTopics);

    const prompt = constructTextEvaluationPrompt(
        personality,
        rubric,
        specialInstructions,
        effectiveCefrLevel,
        ukrainianText,
        modelAnswer,
        userAnswer,
        translationInstruction,
        resolvedGrammarTopics,
        teacherPersona
    );

    try {
        const result = await generateFromGemini<EvaluationResponse>(
            prompt, 
            evaluationSchema, 
            isValidEvaluationResponse, 
            "Text Evaluation", 
            0.3
        );
        return result;
    } catch (error) {
         console.error("Error evaluating text translation with Gemini:", error);
        const errorMessage = language === 'uk'
            ? "Вибачте, сталася помилка під час оцінювання відповіді. Будь ласка, спробуйте ще раз."
            : "Sorry, an error occurred while evaluating the answer. Please try again.";
        return { 
            score: 0, 
            feedback: [{ type: 'error', topic: language === 'uk' ? 'Помилка API' : 'API Error', message: errorMessage }] 
        };
    }
};
