// FIX: Import GenerateContentResponse to correctly type API responses.
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QuizTerm, Question, GapFillQuestion, CEFRLevel, TranslationQuestion, FeedbackItem, VocabularyChallenge, GrammarChallenge } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * A utility function to retry an async API call with exponential backoff.
 * @param apiCall The async function to call.
 * @param maxRetries The maximum number of retries.
 * @param initialDelay The initial delay in milliseconds.
 * @returns The result of the successful API call.
 * @throws The error from the last failed attempt.
 */
const withRetry = async <T>(
  apiCall: () => Promise<T>, 
  maxRetries = 3, 
  initialDelay = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`API call failed after ${maxRetries} attempts.`, error);
        throw error; // Re-throw the error on the last attempt
      }
      const delay = initialDelay * Math.pow(2, attempt - 1);
      console.warn(`API call failed. Attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  // This part is unreachable if maxRetries > 0, but required for type safety
  throw new Error('This should not be reached');
};


const getDifficultyInstruction = (
    vocab: VocabularyChallenge,
    grammar: GrammarChallenge,
    type: 'mcq' | 'gap_fill' | 'translate_uk_en' | 'discussion' | 'text_translation'
): string => {
    
    let vocabInstruction = '';
    switch (vocab) {
        case 'Basic':
            vocabInstruction = "Use only basic, high-frequency vocabulary in the surrounding text/distractors.";
            break;
        case 'Standard':
            vocabInstruction = "Use standard, on-level vocabulary appropriate for the CEFR level.";
            break;
        case 'Advanced':
            vocabInstruction = "Incorporate some more advanced or less common (but still on-level) vocabulary to challenge the user.";
            break;
    }

    let grammarInstruction = '';
    switch (grammar) {
        case 'Simple':
            grammarInstruction = "Construct sentences using simple grammar (e.g., single clauses, basic tenses).";
            break;
        case 'Standard':
            grammarInstruction = "Use standard sentence structures with a mix of simple and compound sentences appropriate for the CEFR level.";
            break;
        case 'Complex':
            grammarInstruction = "Employ more complex grammatical structures (e.g., multiple clauses, advanced tenses, passive voice) to challenge the user.";
            break;
    }

    switch (type) {
        case 'mcq':
            return `
CRITICAL VOCABULARY INSTRUCTION: ${vocabInstruction} This is especially important for the incorrect options (distractors). For an 'Advanced' vocabulary challenge, distractors should be very close synonyms. For a 'Basic' challenge, they should be clearly wrong.
CRITICAL GRAMMAR INSTRUCTION: ${grammarInstruction} This applies to the question sentence itself.
`;
        case 'gap_fill':
        case 'translate_uk_en':
        case 'text_translation':
            return `
CRITICAL VOCABULARY INSTRUCTION: ${vocabInstruction}
CRITICAL GRAMMAR INSTRUCTION: ${grammarInstruction} The sentence structure must adhere to this.
`;
        case 'discussion':
             if (vocab === 'Advanced' || grammar === 'Complex') {
                 return "CRITICAL: The prompts should be more abstract, hypothetical, or philosophical, requiring deeper critical thinking and justification.";
             } else if (vocab === 'Basic' || grammar === 'Simple') {
                 return "CRITICAL: The prompts should be personal and direct, asking for simple opinions or experiences.";
             } else {
                 return "CRITICAL: The prompts should ask for opinions on familiar topics, requiring some explanation or justification.";
             }
    }
    return ""; // Default case
};

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

export const generateMcqQuiz = async (terms: QuizTerm[], cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge): Promise<Omit<Question, 'id'>[]> => {
    const isUkr = cefrLevel === 'A1 ukr';
    const effectiveCefrLevel = isUkr ? 'A1' : cefrLevel;
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'mcq');

    const prompt = isUkr 
    ? `
You are an expert quiz creator specializing in English vocabulary for Ukrainian learners.
Your task is to generate a multiple-choice quiz from a list of English words and their Ukrainian translations.
The CEFR level for the quiz is A1.
${difficultyInstruction}
SPECIAL INSTRUCTION: The questions must be in UKRAINIAN, testing the user's understanding of the English word. However, all four multiple-choice options and the 'correctAnswer' field MUST be in ENGLISH.
The Ukrainian translation in the input is provided for context and can be used to formulate the Ukrainian question.
For each word in the provided list, create one question. Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.
The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object.
`
    : `
You are an expert quiz creator specializing in English vocabulary for language learners.
Your task is to generate a multiple-choice quiz from a list of English words and their Ukrainian translations.
The Ukrainian translation is provided ONLY to give you context for the intended meaning of the English word, especially for words with multiple meanings. The entire quiz (questions, options, and answers) must be in ENGLISH.
The difficulty of the vocabulary used in questions and incorrect options should be appropriate for a CEFR ${effectiveCefrLevel} learner.
${difficultyInstruction}
For each word in the provided list, create one question that tests its meaning. The question could be a definition, a synonym, an antonym, or a fill-in-the-blank sentence.
Generate four options for each question: one correct answer and three plausible but incorrect distractors. Crucially, all four options (the correct answer and the three distractors) should be of similar length and grammatical structure to prevent the correct answer from being obvious. Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.
The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: mcqQuizSchema,
                temperature: 0.7,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.questions) {
            return result.questions as Omit<Question, 'id'>[];
        } else {
            throw new Error("Invalid response format from API.");
        }
    } catch (error) {
        console.error("Error generating MCQ quiz with Gemini:", error);
        throw new Error("Could not generate MCQ quiz. The API returned an error.");
    }
};

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

export const generateGapFillQuiz = async (terms: QuizTerm[], cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge): Promise<Omit<GapFillQuestion, 'id'>[]> => {
    const isUkr = cefrLevel === 'A1 ukr';
    const effectiveCefrLevel = isUkr ? 'A1' : cefrLevel;
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'gap_fill');
    
    const prompt = isUkr
    ? `
You are an expert quiz creator specializing in English vocabulary for Ukrainian learners.
Your task is to generate a set of gap-fill (fill-in-the-blank) exercises. The CEFR level is A1.
${difficultyInstruction}
SPECIAL INSTRUCTION: For each word in the provided list, create one UKRAINIAN sentence that provides a clear context for the target English word. In this Ukrainian sentence, replace where the English word would fit with '____' to create a blank.
- The 'correctAnswer' field must be the original English word from the input list.
- The 'originalTerm' field MUST be the original English word from the input list, exactly as provided.
- The 'hint' must be the original Ukrainian translation from the input list.
The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object.
`
    : `
You are an expert quiz creator specializing in English vocabulary for language learners.
Your task is to generate a set of gap-fill (fill-in-the-blank) exercises from a list of English words and their Ukrainian translations.
The difficulty of the sentence structure and vocabulary should be appropriate for a CEFR ${effectiveCefrLevel} learner.
${difficultyInstruction}
For each word in the provided list, create one ENGLISH sentence that uses the word in a natural context. In the sentence, replace the target English word with '____' to create a blank.
- The 'correctAnswer' field should be the exact word that fits in the blank. This might be a conjugated form of the original term (e.g., 'goes' instead of 'go').
- The 'originalTerm' field MUST be the original English word from the input list, exactly as provided.
- The 'hint' field must be the original Ukrainian translation from the input list.
The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: gapFillQuizSchema,
                temperature: 0.8,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.questions) {
            return result.questions as Omit<GapFillQuestion, 'id'>[];
        } else {
            throw new Error("Invalid response format from API for gap-fill quiz.");
        }
    } catch (error) {
        console.error("Error generating gap-fill quiz with Gemini:", error);
        throw new Error("Could not generate gap-fill quiz. The API returned an error.");
    }
};


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

const getGrammarInstruction = (
    level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
    grammarChallenge?: GrammarChallenge,
    activityType?: 'translation_list'
): string => {
    const grammarPools: Record<typeof level, string[]> = {
        'A1': [
            "Present simple forms of ‘to be’: am/is/are", "Present simple: I do, I don’t, Do I?", "Present continuous: I’m doing, I’m not doing, Are you doing?", "Present simple or present continuous?", "Have got",
            "Was/were: Past simple of ‘be’", "Past simple: Regular/irregular verbs", "Past simple: Negatives and questions",
            "‘Will’ and ‘shall’: Future", "Be going to: Plans and predictions",
            "Can, can’t: ability, possibility, permission", "The imperative: Sit down! Don’t talk!", "Would you like…? I’d like…",
            "Verbs + to + infinitive and verbs + -ing",
            "A/an, plurals: Singular and plural forms", "A/an, the, no article: The use of articles in English", "This, that, these, those", "Possessive adjectives and subject pronouns (I/my, you/your, etc.)", "Object pronouns vs subject pronouns: Me or I, she or her?", "A, some, any: Countable and uncountable nouns", "Much, many, a lot of, a little, a few", "Whose, possessive ‘s: Whose is this? It’s Mike’s",
            "There is, there are / There was, there were", "There or it", "The difference between ‘this’ and ‘it’",
            "Adjectives: old, interesting, expensive, etc.", "Adverbs of manner (slowly) or adjectives (slow)?", "Comparative adjectives: Older than, more important than, etc.", "Superlative adjectives: The oldest, the most important, etc.",
            "Conjunctions: And, but, or, so, because",
            "At, in, on: Prepositions of time", "At, in, on: Prepositions of place", "Next to, under, between, in front of, behind, over, etc.",
            "Questions: Word order and question words",
            "Adverbs of frequency with present simple", "Basic word order in English."
        ],
        'A2': [
            "Present simple vs present continuous", "Present perfect: Form and use", "Present perfect or past simple?",
            "Past simple: Form and use", "Past continuous and past simple", "Past perfect",
            "Will vs be going to: Future", "Present continuous for future arrangements",
            "Review of all verb tenses A2",
            "Have to, don’t have to, must, mustn’t", "Should, shouldn’t", "Might, might not: Possibility", "May and might: What’s the difference?", "Used to, didn’t use to: Past habits and states",
            "The different uses of the verb ‘get’", "‘Do’ vs ‘Make’: What’s the difference?", "Verbs with two objects", "Stative vs dynamic verbs", "Phrasal verbs: Transitive and intransitive",
            "First conditional and future time clauses", "Second conditional",
            "Present and past simple passive: be + past participle",
            "Reported speech / Indirect speech",
            "Expressing purpose with ‘to’ and ‘for’", "Infinitives and gerunds: Verb patterns",
            "Subject pronouns, object pronouns, possessive pronouns", "Something, anything, nothing, etc.", "Much, many, little, few, some, any: Quantifiers", "Too, too much, too many, enough", "Most, most of, the most",
            "Defining relative clauses: Who, which, that, where",
            "So, neither: so am I, neither do I, etc.",
            "Comparative and superlative adjectives and adverbs", "No longer, any longer, anymore",
            "However, although, because, so, and time connectors",
            "Prepositions of movement: Along, across, over, etc.", "On time vs In time, At the end vs In the end.",
            "Asking questions in English: Question forms", "Subject questions, questions with preposition"
        ],
        'B1': [
            "Past simple or present perfect?", "Present perfect simple and present perfect continuous",
            "Past simple, past continuous, past perfect",
            "Future forms: Will, be going to, present continuous",
            "Have to, must, should: Obligation, prohibition, advice", "Can, could, be able to: Ability and possibility", "Modal verbs of deduction: Must, might, could, can’t", "Usually, used to, be used to, get used to", "Had better… it’s time", "Would rather & Would sooner", "B1 Phrasal verbs",
            "First conditional, future time clauses", "Second conditional: Unreal situations", "Third conditional: Past unreal situations",
            "Passive verb forms", "Active and passive voice",
            "Indirect speech / Reported speech",
            "Gerund or infinitive: Do, to do, doing",
            "A(n), the, no article", "Reflexive pronouns: Myself, yourself", "All, both, either, neither: Quantifiers", "Any, no, none: Quantifiers", "Another, other, others, the other, the others",
            "Defining and non-defining relative clauses",
            "Question tags: Aren’t you? don’t you?",
            "Comparative and superlative adjectives and adverbs", "-Ed/-ing adjectives: Adjectives from verbs", "So, such, such a, so much, so many", "Compound adjectives with numbers: ‘A two-day trip’",
            "Clauses of contrast, purpose and reason",
            "Verb + preposition", "Adjective + preposition", "During, for, while", "For, since, from: What’s the difference?"
        ],
        'B2': [
            "Narrative tenses: All past tenses",
            "Future continuous and future perfect",
            "Needn’t, don’t need to, didn’t need to, needn’t have", "Past modal verbs of deduction", "Likely, unlikely, bound, definitely, probably: Probability", "Would and used to: Past habits", "Verbs of the senses: Look, sound, feel, etc.",
            "Zero and first conditional and future time clauses", "Second and third conditionals: Unreal conditionals", "Wishes and regrets: I wish / if only",
            "The passive voice: All tenses", "The passive with reporting verbs: It is said that…", "Have something done",
            "Gerund or infinitive: Verb patterns", "Would rather, would prefer: Expressing preference", "Reporting verbs: Admit doing, refuse to do, etc.",
            "Quantifiers: All, most, both, either, neither, any, no, none",
            "Whatever, whenever, wherever, whoever, however",
            "The … the … comparatives", "Participles as adjectives: -ed / -ing adjectives", "Adjective order", "Already, still, yet: What’s the difference?", "Pretty, rather, quite, fairly",
            "Clauses of contrast and purpose",
            "Indirect questions", "Position of adverbs and adverb phrases"
        ],
        'C1': [
            "Future in the past",
            "Speculation and deduction: Modal verbs and expressions",
            "All conditionals: mixed conditionals, alternatives to if, inversion", "Mixed conditionals", "Wish, rather, if only, it’s time: unreal uses of past tenses", "Unless, even if, provided, as long as, etc.",
            "Distancing: Expressions and passive of reporting verbs", "Passive verbs with two objects",
            "Verb + object + infinitive/gerund: Verb patterns", "Gerunds and infinitives: Complex forms",
            "Reflexive and reciprocal pronouns", "Compound nouns and possessive forms", "Possessive ’s with time expressions: Two hours’ walk",
            "Relative clauses: Defining and non-defining",
            "‘There’ and ‘it’: Preparatory subjects",
            "Ellipsis and substitution",
            "Modifying comparatives", "Compound adjectives in English", "Inversion with negative adverbials",
            "Noun + Preposition collocations",
            "Clauses of contrast, purpose, reason and result", "Discourse markers: Linking words", "Participle clauses",
            "Cleft sentences: Adding emphasis"
        ],
        'C2': [
            "Advanced conditional forms (e.g., with inversion without 'if')",
            "Advanced passive structures (e.g., double passives)",
            "Participle clauses (e.g., fronted participles for stylistic effect)",
            "Complex noun phrases with multiple modifiers",
            "Subtle modal verb usage (e.g., 'might have been doing')",
            "Highly idiomatic phrasing and collocations",
            "Use of rhetorical devices like inversion for emphasis",
            "Nuanced use of aspect (perfect vs. continuous)",
            "Prepositional phrases with abstract nouns",
            "Advanced discourse markers for cohesion and flow"
        ]
    };

    const pool = grammarPools[level];
    if (!pool || pool.length === 0) {
        return "The difficulty of the sentence structure and vocabulary should be appropriate for a CEFR B1 learner.";
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    let selectionCount;

    if (activityType === 'translation_list' && grammarChallenge) {
        switch (grammarChallenge) {
            case 'Simple':
                selectionCount = 3;
                break;
            case 'Standard':
                selectionCount = 4;
                break;
            case 'Complex':
                selectionCount = 5;
                break;
            default:
                // Fallback for translation list if something is wrong
                selectionCount = 4;
                break;
        }
    } else {
        // Default logic for all other activities
        selectionCount = Math.random() < 0.5 ? 2 : 3;
    }

    const finalSelectionCount = Math.min(shuffled.length, selectionCount);
    const selectedPoints = shuffled.slice(0, finalSelectionCount);
    
    if (selectedPoints.length === 0) {
        return "The sentences should use grammar appropriate for the CEFR level.";
    }

    const instruction = `The sentences must specifically test some of the following grammatical structures:\n- ${selectedPoints.join('\n- ')}`;
    return instruction;
};


const getNextCefrLevel = (level: CEFRLevel): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (level === 'A1 ukr') level = 'A1';
    const currentIndex = levels.indexOf(level);
    if (currentIndex >= 0 && currentIndex < levels.length - 1) {
        return levels[currentIndex + 1] as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    }
    return 'C2'; // If already at C2, the next level is still C2
};

export const generateTranslationQuiz = async (terms: QuizTerm[], cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge): Promise<Omit<TranslationQuestion, 'id'>[]> => {
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    
    const shuffledTerms = [...terms].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffledTerms.slice(0, 5);

    const focusedGrammarInstruction = getGrammarInstruction(effectiveCefrLevel);
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'translate_uk_en');

    const prompt = `
You are an expert in creating language translation exercises for English learners whose native language is Ukrainian.
Your task is to generate a set of exactly 5 translation challenges from a list of English words and their Ukrainian translations.

CRITICAL INSTRUCTION: The generated sentences must not only use the provided vocabulary but also test specific grammatical structures appropriate for the target CEFR level.
The target level is CEFR ${effectiveCefrLevel}.
${difficultyInstruction}
${focusedGrammarInstruction}

For each of the 5 words in the provided list, create one complete UKRAINIAN sentence that uses the Ukrainian translation in a natural context and implicitly requires the specified grammar for its English translation.
Then, provide a correct and natural-sounding ENGLISH translation for that entire Ukrainian sentence. This English translation must demonstrate the target grammar.
Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.

The list of 5 words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationQuizSchema,
                temperature: 0.8,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.questions) {
            return result.questions as Omit<TranslationQuestion, 'id'>[];
        } else {
            throw new Error("Invalid response format from API for translation quiz.");
        }
    } catch (error) {
        console.error("Error generating translation quiz with Gemini:", error);
        throw new Error("Could not generate translation quiz. The API returned an error.");
    }
};

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

const getEvaluationRubric = (level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'): { personality: string, rubric: string, specialInstructions: string } => {
    let personality: string;
    let rubric: string;
    const specialInstructions = `**CRITICAL SCORING RULE:** The provided model answer is just one correct example. If the student's translation is grammatically correct and accurately conveys the same meaning, it MUST receive a high score, even if it uses different words or sentence structures. Do not penalize valid alternative phrasings.`;

    switch (level) {
        case 'A1':
        case 'A2':
            personality = `You are an encouraging and friendly English teacher for beginners. Your primary goal is to build confidence by focusing on communicative success.`;
            rubric = `
- **Communicative Success & Meaning (75 pts):** Focus on whether the core message was successfully conveyed. Be very lenient with minor grammatical errors (e.g., missing articles, simple prepositions) that do not prevent understanding.
  - 75 pts: Core meaning is perfectly clear.
  - 50-70 pts: Core meaning is understandable despite some errors.
  - 25-49 pts: The meaning is difficult to understand.
  - 0-24 pts: The meaning is completely wrong.
- **Grammar & Syntax (15 pts):** Evaluate grammar very leniently. Only deduct points for major errors that obscure the meaning.
  - 15 pts: No major errors that obscure meaning.
  - 5-14 pts: Contains some errors, but meaning is still clear.
  - 0-4 pts: Grammatically incoherent.
- **Vocabulary Usage (10 pts):**
  - 10 pts: The target vocabulary is used appropriately.
  - 5-9 pts: An understandable but not ideal word is used.
  - 0-4 pts: An incorrect word is used.`;
            break;
        case 'B1':
        case 'B2':
            personality = `You are a helpful and precise English tutor for intermediate learners. Your goal is to improve accuracy and fluency.`;
            rubric = `
- **Meaning & Accuracy (60 pts):** The translation must accurately capture the meaning and nuance of the original.
  - 60 pts: Perfectly captures the full meaning.
  - 45-55 pts: Core meaning is correct, but a minor detail is lost.
  - 20-40 pts: A key part of the meaning is missed.
  - 0-19 pts: Completely misrepresents the meaning.
- **Grammar & Syntax (30 pts):** The sentence must be grammatically sound for the level.
  - 30 pts: Grammatically flawless.
  - 20-29 pts: 1-2 minor errors that don't obscure meaning.
  - 10-19 pts: Significant errors that make the sentence awkward.
  - 0-9 pts: Grammatically incoherent.
- **Vocabulary Usage (10 pts):** Word choice should be correct and natural.
  - 10 pts: Target word (or close synonym) is used correctly and naturally.
  - 5-9 pts: Word choice is understandable but slightly unnatural.
  - 0-4 pts: Incorrect word is used.`;
            break;
        case 'C1':
        case 'C2':
            personality = `You are a meticulous and expert English examiner for advanced learners. Your goal is to assess precision, nuance, and style.`;
            rubric = `
- **Meaning, Nuance & Register (50 pts):** The translation must perfectly capture not just the meaning, but also the tone, register, and subtle nuances of the original sentence.
  - 50 pts: Flawless representation of meaning and tone.
  - 35-49 pts: Captures meaning but misses some nuance or register.
  - 15-34 pts: Major details of meaning are lost.
  - 0-14 pts: Incorrect meaning.
- **Grammar & Syntax (40 pts):** Expect a high degree of grammatical accuracy and sophisticated sentence structures.
  - 40 pts: Grammatically perfect, uses complex structures naturally.
  - 30-39 pts: A single, minor slip in grammar.
  - 15-29 pts: Noticeable grammatical errors.
  - 0-14 pts: Pervasive grammatical errors.
- **Vocabulary & Idiomatic Usage (10 pts):** Word choice must be precise, idiomatic, and stylistically appropriate.
  - 10 pts: Perfect and idiomatic word choice.
  - 5-9 pts: Correct but slightly un-idiomatic word choice.
  - 0-4 pts: Incorrect or inappropriate word choice.`;
            break;
    }
    return { personality, rubric, specialInstructions };
};


export const evaluateTranslationAnswer = async (
    userAnswer: string, 
    modelAnswer: string, 
    ukrainianSentence: string,
    originalTerm: string,
    cefrLevel: CEFRLevel
): Promise<{ score: number; feedback: FeedbackItem[] }> => {
    
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    const nextLevel = getNextCefrLevel(effectiveCefrLevel);
    const grammarForBonus = getGrammarInstruction(nextLevel);
    const { personality, rubric, specialInstructions } = getEvaluationRubric(effectiveCefrLevel);

    const prompt = `
${personality} Your task is to evaluate a student's translation from Ukrainian to English using a detailed rubric and provide structured feedback.
The target CEFR level for this exercise is ${effectiveCefrLevel}.
${specialInstructions}

**Context:**
- Original Ukrainian Sentence: "${ukrainianSentence}"
- Target English Vocabulary Word: "${originalTerm}"
- A correct English translation (for reference): "${modelAnswer}"

**Student's Answer to Evaluate:**
"${userAnswer}"

**EVALUATION INSTRUCTIONS (Follow these steps precisely):**

**Step 1: Calculate Base Score (0-100 points)**
Evaluate the translation strictly against the expectations for a ${effectiveCefrLevel} learner, using this level-specific rubric:
${rubric}

**Step 2: Identify and Award Bonus Points (0-10 points)**
Now, analyze the student's answer for any vocabulary or grammar that is correctly and naturally used but is clearly **ABOVE** the target ${effectiveCefrLevel} level (i.e., it belongs to ${nextLevel} or higher).
- For each instance of advanced vocabulary or grammar, award 2-5 bonus points.
- Use this list of ${nextLevel} grammar topics as a reference for what constitutes advanced grammar:
  ${grammarForBonus}

**Step 3: Determine Final Score**
The final score is \`Base Score + Bonus Points\`. It can exceed 100.

**Step 4: Generate Structured Feedback**
Provide a list of structured feedback items.
- Only include feedback for 'grammar' errors or 'bonus' points for advanced usage.
- DO NOT provide 'positive' feedback for things the student did correctly at their level.
- DO NOT provide 'lexis' (vocabulary choice) feedback.
- If there are no grammar errors and no bonus points to award, return an empty feedback array.
For each point:
- **type**: Must be 'grammar' or 'bonus'.
- **topic**: A specific, concise topic (e.g., "Verb Tense", "Advanced Vocabulary").
- **message**: The detailed feedback message explaining the error or the advanced usage.

**CRITICAL:** Your entire output must be a single JSON object that strictly adheres to the provided schema. Do not include any other text.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: evaluationSchema,
                temperature: 0.3,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && typeof result.score === 'number' && Array.isArray(result.feedback)) {
            return result as { score: number; feedback: FeedbackItem[] };
        } else {
            throw new Error("Invalid response format from evaluation API.");
        }
    } catch (error) {
        console.error("Error evaluating translation with Gemini:", error);
        return { 
            score: 0, 
            feedback: [{ type: 'error', topic: 'API Error', message: "Sorry, an error occurred while evaluating the answer. Please try again." }] 
        };
    }
};


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

export const generateDiscussionPrompts = async (terms: QuizTerm[], type: 'discussion' | 'agree_disagree', cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge): Promise<string[]> => {
    const isUkr = cefrLevel === 'A1 ukr';
    const effectiveCefrLevel = isUkr ? 'A1' : cefrLevel;
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'discussion');

    const promptTypeInstruction = type === 'discussion'
        ? "Create an open-ended discussion question for each term that encourages critical thinking or sharing personal experiences related to the term."
        : "Create a provocative 'Agree or Disagree?' statement for each term. The statement should be debatable and encourage users to take a stance.";

    const prompt = isUkr
    ? `
You are an expert in creating engaging educational materials for Ukrainian learners of English.
Your task is to generate a list of prompts based on a list of English words.
SPECIAL INSTRUCTION: All generated prompts must be in UKRAINIAN.
The complexity and subject matter of the prompts should be appropriate for a CEFR A1 learner.
${difficultyInstruction}
Based on the list of words provided, generate thought-provoking prompts.
${promptTypeInstruction}
The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object. Generate one prompt for each term provided.
`
    : `
You are an expert in creating engaging educational materials for English language learners.
Your task is to generate a list of prompts based on a list of English words and their Ukrainian translations. The Ukrainian translation is for context only. All output must be in ENGLISH.
The complexity and subject matter of the prompts should be appropriate for a CEFR ${effectiveCefrLevel} learner.
${difficultyInstruction}
Based on the list of words provided, generate thought-provoking prompts.
${promptTypeInstruction}
The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object. Generate one prompt for each term provided.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: discussionPromptsSchema,
                temperature: 0.9,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.prompts) {
            return result.prompts as string[];
        } else {
            throw new Error(`Invalid response format from API for ${type} prompts.`);
        }
    } catch (error) {
        console.error(`Error generating ${type} prompts with Gemini:`, error);
        throw new Error(`Could not generate ${type} prompts. The API returned an error.`);
    }
};

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

export const generateTranslationList = async (terms: QuizTerm[], cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge): Promise<string[]> => {
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    
    const shuffledTerms = [...terms].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffledTerms.slice(0, 15);

    const focusedGrammarInstruction = getGrammarInstruction(effectiveCefrLevel, gramChallenge, 'translation_list');
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'translate_uk_en');

    const prompt = `
You are an expert in creating language translation exercises for English learners whose native language is Ukrainian.
Your task is to generate a list of exactly 15 Ukrainian sentences for translation practice.

CRITICAL INSTRUCTION: The generated sentences must not only use the provided vocabulary but also test specific grammatical structures appropriate for the target CEFR level.
The target level is CEFR ${effectiveCefrLevel}.
${difficultyInstruction}
${focusedGrammarInstruction}

For each of the 15 words in the provided list, create one complete UKRAINIAN sentence that uses the Ukrainian translation in a natural context and implicitly requires the specified grammar for its English translation.

The list of 15 words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a a single JSON object containing a list of 15 Ukrainian sentences. The JSON must strictly adhere to the provided schema. Do not include any other text or explanations.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: translationListSchema,
                temperature: 0.8,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.sentences) {
            return result.sentences as string[];
        } else {
            throw new Error("Invalid response format from API for translation list.");
        }
    } catch (error) {
        console.error("Error generating translation list with Gemini:", error);
        throw new Error("Could not generate translation list. The API returned an error.");
    }
};

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

export const generateTextTranslationActivity = async (terms: QuizTerm[], cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge): Promise<{ ukrainianText: string; englishAnswer: string; }> => {
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    const focusedGrammarInstruction = getGrammarInstruction(effectiveCefrLevel);
    const difficultyInstruction = getDifficultyInstruction(vocabChallenge, gramChallenge, 'text_translation');

    const prompt = `
You are an expert in creating language translation exercises for English learners whose native language is Ukrainian.
Your task is to generate a short, cohesive text for translation.

CRITICAL INSTRUCTION:
1.  Create a cohesive text in UKRAINIAN that is approximately 5 sentences long.
2.  The text should be on a single, clear topic.
3.  Naturally incorporate several words from the provided vocabulary list. You DO NOT need to use all the words; prioritize creating a text that reads naturally.
4.  The grammatical structures and vocabulary used should be appropriate for the target CEFR level: ${effectiveCefrLevel}.
5.  ${difficultyInstruction}
6.  ${focusedGrammarInstruction}
7.  After creating the Ukrainian text, provide a correct and natural-sounding ENGLISH translation for the entire text.

The vocabulary list is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: textTranslationSchema,
                temperature: 0.85,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.ukrainianText && result.englishAnswer) {
            return result as { ukrainianText: string; englishAnswer: string; };
        } else {
            throw new Error("Invalid response format from API for text translation.");
        }
    } catch (error) {
        console.error("Error generating text translation with Gemini:", error);
        throw new Error("Could not generate text translation. The API returned an error.");
    }
};

const getHolisticEvaluationRubric = (level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'): { personality: string, rubric: string, specialInstructions: string } => {
    let personality: string;
    let rubric: string;
    const specialInstructions = `**CRITICAL SCORING RULE:** The provided model answer is just one correct example. If the student's translation is grammatically correct and accurately conveys the same meaning, it MUST receive a high score, even if it uses different words or sentence structures. Do not penalize valid alternative phrasings.`;

    switch (level) {
        case 'A1':
        case 'A2':
            personality = `You are an encouraging and friendly English teacher for beginners. Your primary goal is to assess if the main message was communicated, not to nitpick grammar.`;
            rubric = `
- **A (90-100%): Excellent for this level.** Communicates the main ideas clearly with very few errors.
- **B (80-89%): Good.** Successfully communicates the main ideas, but with some noticeable yet non-critical errors.
- **C (70-79%): Satisfactory.** The overall message is mostly understandable, but requires some effort from the reader due to errors.
- **D (60-69%): Needs Improvement.** Communication is frequently broken. Only parts of the message are clear.
- **F (0-59%): Unsatisfactory.** Fails to convey the basic meaning of the text.`;
            break;
        case 'B1':
        case 'B2':
            personality = `You are a helpful and precise English tutor for intermediate learners. Your goal is to assess accuracy, fluency, and overall text cohesion.`;
            rubric = `
- **A (90-100%): Excellent.** Highly accurate, fluent, and natural. Captures the tone and reads well.
- **B (80-89%): Good.** Successfully conveys the main ideas with good accuracy. May have a few minor slips that do not impede comprehension.
- **C (70-79%): Satisfactory.** The core message is understandable, but noticeable errors in grammar or vocabulary affect clarity and flow.
- **D (60-69%): Needs Improvement.** Comprehension is hindered by frequent errors. The text feels unnatural and is difficult to read.
- **F (0-59%): Unsatisfactory.** Fails to convey the meaning of the original text due to major errors.`;
            break;
        case 'C1':
        case 'C2':
            personality = `You are a meticulous and expert English examiner for advanced learners. Your goal is to assess precision, nuance, stylistic choices, and text flow.`;
            rubric = `
- **A (90-100%): Excellent.** Flawless translation that captures all nuances, register, and tone. Reads as if written by a native speaker.
- **B (80-89%): Good.** Very accurate and fluent, but may miss a subtle stylistic point or contain a rare, minor error.
- **C (70-79%): Satisfactory.** Conveys the meaning accurately, but lacks the stylistic sophistication or contains several noticeable errors that would not be expected at an advanced level.
- **D (60-69%): Needs Improvement.** Contains errors that an advanced learner should not be making, hindering fluency and clarity.
- **F (0-59%): Unsatisfactory.** Does not meet the standards of an advanced learner.`;
            break;
    }
    return { personality, rubric, specialInstructions };
};

export const evaluateTextTranslationAnswer = async (
    userAnswer: string, 
    modelAnswer: string, 
    ukrainianText: string,
    cefrLevel: CEFRLevel
): Promise<{ score: number; feedback: FeedbackItem[] }> => {
    
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    const { personality, rubric, specialInstructions } = getHolisticEvaluationRubric(effectiveCefrLevel);

    const prompt = `
${personality} Your task is to evaluate a student's translation of a Ukrainian text using a holistic rubric and provide structured, bullet-pointed feedback.
The target CEFR level for this exercise is ${effectiveCefrLevel}.
${specialInstructions}

**Context:**
- Original Ukrainian Text: "${ukrainianText}"
- A correct English translation (for reference): "${modelAnswer}"

**Student's Translation to Evaluate:**
"${userAnswer}"

**EVALUATION INSTRUCTIONS:**

**1. Holistic Score (Can exceed 100):**
Use this level-specific rubric to determine a score from the A-F scale:
${rubric}
- **Bonus Points (+2-10):** Award bonus points if the student correctly and naturally uses vocabulary or grammar structures that are clearly above the target ${effectiveCefrLevel} level.

**2. Structured Feedback:**
Provide your feedback as a list of bullet points.
- Only include feedback for 'grammar' errors or 'bonus' points for advanced usage.
- DO NOT provide 'positive' feedback for things done well.
- DO NOT provide 'lexis' (vocabulary choice) feedback. Focus only on grammatical correctness and above-level usage.
- If there are no grammar errors and no bonus points, return an empty feedback array.
For each point:
- **type**: Must be 'grammar' or 'bonus'.
- **topic**: A specific, concise topic (e.g., "Tense Consistency", "Idiomatic Phrasing", "Advanced Vocabulary").
- **message**: The detailed feedback message for the student.

**CRITICAL:** Your entire output must be a single JSON object that strictly adheres to the provided schema. Do not include any other text.
`;

    try {
        // FIX: Explicitly type the response from generateContent.
        const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: evaluationSchema,
                temperature: 0.3,
            },
        }));
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && typeof result.score === 'number' && Array.isArray(result.feedback)) {
            return result as { score: number; feedback: FeedbackItem[] };
        } else {
            throw new Error("Invalid response format from text evaluation API.");
        }
    } catch (error) {
        console.error("Error evaluating text translation with Gemini:", error);
        return { 
            score: 0, 
            feedback: [{ type: 'error', topic: 'API Error', message: "Sorry, an error occurred while evaluating the answer. Please try again." }] 
        };
    }
};