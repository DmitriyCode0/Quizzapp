
import { CEFRLevel, VocabularyChallenge, GrammarChallenge, QuizTerm, Language, GrammarTopicConfig, TeacherPersona } from '../types';

export const getTopicInstruction = (topic?: string): string => {
    if (!topic || !topic.trim()) return "";
    return `
CRITICAL CONTEXT INSTRUCTION: The generated content MUST relate to the specific topic: "${topic.trim()}". 
While you must use the provided vocabulary list, try to frame the sentences, questions, or scenarios within this topic/context as much as possible.
`;
};

// Helper to extract specific AI rules from configuration objects based on difficulty
const getGrammarRules = (topics: GrammarTopicConfig[], difficulty: GrammarChallenge): string => {
    if (!topics || topics.length === 0) return "";

    const rules = topics.map(topic => {
        // Fallback for legacy topics without specific AI config
        if (!topic.aiConfig) {
            return `- ${topic.title}`;
        }

        const config = topic.aiConfig;
        let difficultyRule = "";
        
        // Map UI GrammarChallenge ('Simple', 'Standard', 'Complex') to Data AiDifficultyConfig ('Basic', 'Standard', 'Advanced')
        switch (difficulty) {
            case 'Simple': difficultyRule = config.difficultyConfig.Basic; break;
            case 'Standard': difficultyRule = config.difficultyConfig.Standard; break;
            case 'Complex': difficultyRule = config.difficultyConfig.Advanced; break;
            default: difficultyRule = config.difficultyConfig.Standard;
        }

        return `
- TOPIC: ${topic.title}
  * Core Rule: ${config.systemRule}
  * Constraint: ${difficultyRule}`;
    });

    return `
The content must specifically test the following grammatical structures. Follow the constraints precisely:
${rules.join('\n')}
`;
};

export const getDifficultyInstruction = (
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
            vocabInstruction = "Use standard, on-level vocabulary appropriate for the Student's Proficiency level.";
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
            grammarInstruction = "Use standard sentence structures with a mix of simple and compound sentences appropriate for the Student's Proficiency level.";
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
    return "";
};

export const getTeacherPersonaInstruction = (persona: TeacherPersona): string => {
    switch (persona) {
        case 'learning':
            return `
**TEACHER PERSONA: The Mentor (Learning Mode)**
OVERRIDE INSTRUCTION: You are a patient guide focused purely on improvement.
1.  **Constructive Feedback:** Provide highly detailed, educational explanations for any mistakes.
2.  **Encouraging Tone:** Use positive language. Even if the answer is wrong, find something good to say if possible.
3.  **No Grading Pressure:** While you must technically calculate a score for internal logic, your feedback should sound like a helpful peer review, not an exam result.
4.  **Forgive Mechanics:** Focus on the core meaning and grammar. Ignore minor punctuation slips.
`;
        case 'strict':
            return `
**TEACHER PERSONA: The Examiner (Precision-Focused)**
OVERRIDE INSTRUCTION: You are a strict, perfectionist editor. Apply **NATIVE-LEVEL STANDARDS** regardless of the content difficulty.
1.  **Zero Tolerance:** Deduct points for ANY error in punctuation (missing periods/commas), capitalization, spelling, or articles.
2.  **Style Penalty:** If the grammar is correct but the phrasing is unnatural or "clunky", deduct points.
3.  **Accuracy is King:** Communication is not enough. The form must be perfect.
4.  **Feedback Tone:** Direct, clinical, and exhaustive. List every single flaw.
`;
        case 'standard':
        default:
            return `
**TEACHER PERSONA: The Expert Tutor (20+ years experience)**
You are an expert English-Ukrainian teacher with 20+ years of experience.
**SCORING ALGORITHM (Start at 100%, Max 110%):**
OVERRIDE any generic rubrics below with this specific scoring system:
1. **Grammar/Topic Compliance:** Deduct 25% IMMEDIATELY if the requested grammar topic rules (passed in context) are violated, even minor violations.
2. **Mechanics (Capitalization):** Deduct 5% if the sentence start or the word "I" is not capitalized.
3. **Spelling & Lexis:** 
   - Analyze words for spelling errors (missing letter, wrong letter, swapped adjacent letters). Deduct 5% PER error found.
   - Deduct an EXTRA 5% for each contextually incorrect word (wrong vocabulary choice).
4. **Bonuses (Max Score 110%):**
   - Add 5% for completely correct punctuation (excluding the final period) IF internal commas are used correctly. (Do not give points if no internal punctuation is needed).
   - Add 5% for using a valid vocabulary word from a higher CEFR level than the target.

**FEEDBACK FORMAT:**
- Keep explanations short and direct.
- For grammar/spelling errors, strictly use this format: "[Where the mistake is] -> [What should be there]. Correct: [Correct phrase]"
- Always provide the suggested full answer at the end.
`;
    }
};

export const constructParserPrompt = (rawInput: string): string => {
    return `
You are an expert linguist and vocabulary extractor. 
Your task is to process the provided text (which may be a list of words, a raw article, messy notes, or a mix of text) and extract a clean list of English vocabulary.

Step 1: Extract key English words and phrases from the input.
Step 2: Account for the context of the input (assume all words belong to the same lesson or topic).
Step 3: Provide a precise Ukrainian translation for each term, ensuring the translation matches the specific context of the source text.

Input Text:
"""
${rawInput.slice(0, 5000)} 
"""
(Note: Input truncated to 5000 chars if longer)

Return the result as a JSON object containing an array of objects with 'term' (English) and 'definition' (Ukrainian).
`;
};

export const constructMcqPrompt = (
    selectedTerms: QuizTerm[],
    isUkr: boolean,
    studentLevel: string,
    difficultyInstruction: string,
    topicInstruction: string
): string => {
    if (isUkr) {
        return `
You are an expert quiz creator specializing in English vocabulary for Ukrainian learners.
Your task is to generate a multiple-choice quiz from a list of English words and their Ukrainian translations.
The Student's Proficiency Level is A1 (Basic).
${difficultyInstruction}
${topicInstruction}
SPECIAL INSTRUCTION: The questions must be in UKRAINIAN, testing the user's understanding of the English word. However, all four multiple-choice options and the 'correctAnswer' field MUST be in ENGLISH.
The Ukrainian translation in the input is provided for context and can be used to formulate the Ukrainian question.
For each word in the provided list, create one question. Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.
The list of words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema.
`;
    }
    return `
You are an expert quiz creator specializing in English vocabulary for language learners.
Your task is to generate a multiple-choice quiz from a list of English words and their Ukrainian translations.
The Ukrainian translation is provided ONLY to give you context for the intended meaning of the English word, especially for words with multiple meanings. The entire quiz (questions, options, and answers) must be in ENGLISH.
The difficulty of the vocabulary used in questions and incorrect options should be appropriate for a Student at CEFR ${studentLevel} proficiency.
${difficultyInstruction}
${topicInstruction}
For each word in the provided list, create one question that tests its meaning. The question could be a definition, a synonym, an antonym, or a fill-in-the-blank sentence.
Generate four options for each question: one correct answer and three plausible but incorrect distractors. Crucially, all four options (the correct answer and the three distractors) should be of similar length and grammatical structure to prevent the correct answer from being obvious. Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.
The list of words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema.
`;
};

export const constructGapFillPrompt = (
    selectedTerms: QuizTerm[],
    isUkr: boolean,
    studentLevel: string,
    difficultyInstruction: string,
    topicInstruction: string
): string => {
    if (isUkr) {
        return `
You are an expert quiz creator specializing in English vocabulary for Ukrainian learners.
Your task is to generate a set of gap-fill (fill-in-the-blank) exercises. The Student Level is A1.
${difficultyInstruction}
${topicInstruction}
SPECIAL INSTRUCTION: For each word in the provided list, create one UKRAINIAN sentence that provides a clear context for the target English word. In this Ukrainian sentence, replace where the English word would fit with '____' to create a blank.
- The 'correctAnswer' field must be the original English word from the input list.
- The 'originalTerm' field MUST be the original English word from the input list, exactly as provided.
- The 'hint' must be the original Ukrainian translation from the input list.
The list of words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema.
`;
    }
    return `
You are an expert quiz creator specializing in English vocabulary for language learners.
Your task is to generate a set of gap-fill (fill-in-the-blank) exercises from a list of English words and their Ukrainian translations.
The difficulty of the sentence structure and vocabulary should be appropriate for a Student at CEFR ${studentLevel} proficiency.
${difficultyInstruction}
${topicInstruction}
For each word in the provided list, create one ENGLISH sentence that uses the word in a natural context. In the sentence, replace the target English word with '____' to create a blank.
- The 'correctAnswer' field should be the exact word that fits in the blank. This might be a conjugated form of the original term (e.g., 'goes' instead of 'go').
- The 'originalTerm' field MUST be the original English word from the input list, exactly as provided.
- The 'hint' field must be the original Ukrainian translation from the input list.
The list of words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a single JSON object that strictly adheres to the provided schema.
`;
};

export const constructTranslationQuizPrompt = (
    selectedTerms: QuizTerm[],
    targetGrammarLevel: string, // CEFR Level of the grammar topic (e.g., A2, B1)
    studentProficiencyLevel: string, // CEFR Level of the student (e.g., B2, C1)
    difficultyInstruction: string,
    grammarTopics: GrammarTopicConfig[],
    topicInstruction: string,
    gramChallenge: GrammarChallenge
): string => {
    const grammarRules = getGrammarRules(grammarTopics, gramChallenge);

    return `
You are an expert in creating language translation exercises for English learners whose native language is Ukrainian.
Your task is to generate a set of exactly 5 translation challenges from a list of English words and their Ukrainian translations.

CRITICAL LEVEL INSTRUCTION:
1. **Student Proficiency:** The student is at level **${studentProficiencyLevel}**. The complexity of vocabulary (outside the target words), sentence length, and context must match this level.
2. **Grammar Target:** However, the sentences MUST specifically test grammatical structures from **${targetGrammarLevel}** (specifically the rules listed below). 
   *Example:* If a B2 student is practicing an A2 topic (e.g., First Conditional), create a sophisticated B2-level sentence (e.g., business context) that happens to use the First Conditional structure.

${difficultyInstruction}
${grammarRules}
${topicInstruction}

For each of the 5 words in the provided list, create one complete UKRAINIAN sentence that uses the Ukrainian translation in a natural context and implicitly requires the specified grammar for its English translation.
Then, provide a correct and natural-sounding ENGLISH translation for that entire Ukrainian sentence. This English translation must demonstrate the target grammar.
Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.

The list of 5 words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a a single JSON object that strictly adheres to the provided schema.
`;
};

export const constructTranslationListPrompt = (
    selectedTerms: QuizTerm[],
    targetGrammarLevel: string,
    studentProficiencyLevel: string,
    difficultyInstruction: string,
    grammarTopics: GrammarTopicConfig[],
    topicInstruction: string,
    gramChallenge: GrammarChallenge
): string => {
    const grammarRules = getGrammarRules(grammarTopics, gramChallenge);

    return `
You are an expert in creating language translation exercises for English learners whose native language is Ukrainian.
Your task is to generate a list of exactly 15 Ukrainian sentences for translation practice.

CRITICAL LEVEL INSTRUCTION:
1. **Student Proficiency:** The student is at level **${studentProficiencyLevel}**. The complexity of vocabulary (outside the target words), sentence length, and context must match this level.
2. **Grammar Target:** However, the sentences MUST specifically test grammatical structures from **${targetGrammarLevel}** (specifically the rules listed below). 

${difficultyInstruction}
${grammarRules}
${topicInstruction}

For each of the 15 words in the provided list, create one complete UKRAINIAN sentence that uses the Ukrainian translation in a natural context and implicitly requires the specified grammar for its English translation.

The list of 15 words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a a single JSON object containing a list of 15 Ukrainian sentences. The JSON must strictly adhere to the provided schema.
`;
};

export const constructDiscussionPrompt = (
    selectedTerms: QuizTerm[],
    isUkr: boolean,
    studentLevel: string,
    difficultyInstruction: string,
    topicInstruction: string,
    promptTypeInstruction: string
): string => {
    if (isUkr) {
        return `
You are an expert in creating engaging educational materials for Ukrainian learners of English.
Your task is to generate a list of prompts based on a list of English words.
SPECIAL INSTRUCTION: All generated prompts must be in UKRAINIAN.
The complexity and subject matter of the prompts should be appropriate for a Student at CEFR A1 (Basic) level.
${difficultyInstruction}
${topicInstruction}
Based on the list of words provided, generate thought-provoking prompts.
${promptTypeInstruction}
The list of words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a a single JSON object that strictly adheres to the provided schema. Generate one prompt for each term provided.
`;
    }
    return `
You are an expert in creating engaging educational materials for English language learners.
Your task is to generate a list of prompts based on a list of English words and their Ukrainian translations. The Ukrainian translation is for context only. All output must be in ENGLISH.
The complexity and subject matter of the prompts should be appropriate for a Student at CEFR ${studentLevel} proficiency.
${difficultyInstruction}
${topicInstruction}
Based on the list of words provided, generate thought-provoking prompts.
${promptTypeInstruction}
The list of words is:
${selectedTerms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}
Please return the output as a a single JSON object that strictly adheres to the provided schema. Generate one prompt for each term provided.
`;
};

export const constructTextTranslationPrompt = (
    terms: QuizTerm[],
    targetGrammarLevel: string,
    studentProficiencyLevel: string,
    difficultyInstruction: string,
    grammarTopics: GrammarTopicConfig[],
    topicInstruction: string,
    gramChallenge: GrammarChallenge
): string => {
    const grammarRules = getGrammarRules(grammarTopics, gramChallenge);

    return `
You are an expert in creating language translation exercises for English learners whose native language is Ukrainian.
Your task is to generate a short, cohesive text for translation.

CRITICAL LEVEL INSTRUCTION:
1. **Student Proficiency:** The student is at level **${studentProficiencyLevel}**. The complexity of vocabulary (outside the target words), sentence length, and context must match this level.
2. **Grammar Target:** However, the sentences MUST specifically test grammatical structures from **${targetGrammarLevel}** (specifically the rules listed below). 

CRITICAL INSTRUCTION:
1.  Create a cohesive text in UKRAINIAN that is approximately 5 sentences long.
2.  The text should be on a single, clear topic.
3.  Naturally incorporate several words from the provided vocabulary list. You DO NOT need to use all the words; prioritize creating a text that reads naturally.
4.  ${difficultyInstruction}
5.  ${grammarRules}
6.  ${topicInstruction}
7.  After creating the Ukrainian text, provide a correct and natural-sounding ENGLISH translation for the entire text.

The vocabulary list is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a a single JSON object that strictly adheres to the provided schema.
`;
};

export const constructEvaluationPrompt = (
    personality: string,
    rubric: string,
    specialInstructions: string,
    targetGrammarLevel: string,
    ukrainianSentence: string,
    originalTerm: string,
    modelAnswer: string,
    userAnswer: string,
    nextLevel: string,
    grammarForBonus: string,
    translationInstruction: string,
    grammarTopics: GrammarTopicConfig[],
    teacherPersona: TeacherPersona
): string => {
    const personaInstruction = getTeacherPersonaInstruction(teacherPersona);
    const grammarConstraintCheck = grammarTopics.map(t => `"${t.title}" (${t.aiConfig?.systemRule})`).join(' AND ');
    
    // Explicit instructions to check for the grammar topic regardless of student level
    const grammarCheckInstruction = grammarTopics.length > 0 
        ? `CRITICAL GRAMMAR CHECK: The user MUST demonstrate usage of ${grammarConstraintCheck}. If they used a different structure (even if grammatically correct in general English), deduct 25 points as per the 'Grammar/Topic Compliance' rule.`
        : "";

    return `
${personality}
${personaInstruction}

**Task:** Evaluate the student's translation of a Ukrainian sentence into English.
**Student Proficiency Level:** ${targetGrammarLevel} (Expectations should align with this, unless 'Teacher Persona' overrides it).
**Target Grammar Topic:** ${grammarCheckInstruction}

**Input Data:**
- Ukrainian Sentence: "${ukrainianSentence}"
- Required Vocabulary Term: "${originalTerm}"
- Model Answer (Ideal): "${modelAnswer}"
- **Student Answer:** "${userAnswer}"

${rubric}

${specialInstructions}

**Bonus Challenge (for points > 100%):**
If the score is already 100%, check if the student used any advanced grammar from **${nextLevel}**.
${grammarForBonus}
If they did, add +5 bonus points (Max Score: 110).

**Output Format:**
Return a JSON object with:
- score: number (0-110)
- feedback: array of objects { type: 'grammar'|'bonus'|'error', topic: string, message: string }

${translationInstruction}
`;
};

export const constructTextEvaluationPrompt = (
    personality: string,
    rubric: string,
    specialInstructions: string,
    targetGrammarLevel: string,
    ukrainianText: string,
    modelAnswer: string,
    userAnswer: string,
    translationInstruction: string,
    grammarTopics: GrammarTopicConfig[],
    teacherPersona: TeacherPersona
): string => {
    const personaInstruction = getTeacherPersonaInstruction(teacherPersona);
    const grammarConstraintCheck = grammarTopics.map(t => `"${t.title}"`).join(', ');

    return `
${personality}
${personaInstruction}

**Task:** Evaluate the student's translation of a Ukrainian text into English.
**Student Proficiency Level:** ${targetGrammarLevel}
**Target Grammar Topics:** ${grammarConstraintCheck || "General coherence"}

**Input Data:**
- Original Ukrainian Text: "${ukrainianText}"
- Model Translation: "${modelAnswer}"
- **Student Translation:** "${userAnswer}"

${rubric}

${specialInstructions}

**Output Format:**
Return a JSON object with:
- score: number (0-100)
- feedback: array of objects { type: 'grammar'|'bonus'|'error', topic: string, message: string }

${translationInstruction}
`;
};

// --- Evaluation Rubrics & Prompts ---

export const getEvaluationRubric = (studentLevel: Exclude<CEFRLevel, 'A1 ukr'>): { personality: string, rubric: string, specialInstructions: string } => {
    let personality: string;
    let rubric: string;
    let specialInstructions = `**CRITICAL SCORING RULE:** The provided model answer is just one correct example. If the student's translation is grammatically correct and accurately conveys the same meaning, it MUST receive a high score, even if it uses different words or sentence structures. Do not penalize valid alternative phrasings.`;

    switch (studentLevel) {
        case 'A1':
            personality = `You are a highly supportive and forgiving English coach for absolute beginners. Your philosophy is: "If the message is conveyed, it is a success."`;
            specialInstructions += `
**CRITICAL A1 RULES:**
1. **Focus on Keywords:** If the key nouns and verbs are translated correctly, the score should be high.
2. **Grammar Exception:** If the student was specifically asked to practice a grammar topic (e.g., "Present Continuous") and fails to use it, the score CANNOT exceed 50%.

`;
            rubric = `
- **Communicative Success (80 pts):** Did the student convey the main idea?
- **Grammar (10 pts):** No major blocking errors.
- **Vocabulary (10 pts):** Target word used correctly.`;
            break;

        case 'A2':
            personality = `You are a precise English teacher for elementary learners. You value communication, but you are STRICT about basic grammar rules (Present vs Past, S-V-O order).`;
            specialInstructions += `
**CRITICAL A2 RULES:**
1. **Grammar Priority:** Deduct points for basic grammar errors (e.g., "He go").
2. **Grammar Focus Enforcement:** If a specific grammar topic was requested and missed, cap score at 50%.
`;
            rubric = `
- **Grammar & Syntax (50 pts):** Grammar is correct for A2 level.
- **Communicative Success (40 pts):** Meaning is perfectly clear.
- **Vocabulary (10 pts):** Correct target vocabulary or synonym.`;
            break;

        case 'B1':
            personality = `You are a helpful English tutor for intermediate learners. You expect standard grammar to be correct.`;
            specialInstructions += `
**CRITICAL B1 RULES:**
1. **Grammar Focus Enforcement:** If specific grammar topics were requested, the student MUST use them.
2. **Structure:** Basic compound sentences should be correct.
`;
            rubric = `
- **Meaning & Accuracy (50 pts):** Meaning is fully conveyed.
- **Grammar & Syntax (40 pts):** Good control of B1 grammar.
- **Vocabulary (10 pts):** Correct word or valid synonym.`;
            break;

        case 'B2':
            personality = `You are a demanding English coach. At B2, you expect fluency and accuracy. Basic errors are no longer tolerated.`;
            specialInstructions += `
**CRITICAL B2 RULES:**
1. **Strict Grammar Focus:** Usage of requested grammar topics is MANDATORY.
2. **No Basic Errors:** Penalize strictly for A1/A2 errors.
`;
            rubric = `
- **Grammar & Accuracy (50 pts):** Complex structures are used correctly.
- **Vocabulary & Style (30 pts):** Natural collocation and phrasing.
- **Meaning (20 pts):** Precise translation of nuance.`;
            break;

        case 'C1':
        
            personality = `You are a professor of English Linguistics. You accept nothing less than native-like precision, nuance, and style.`;
            specialInstructions += `
**CRITICAL C1 RULES:**
1. **Style & Nuance:** Deduct points for "clunky" or "textbook" phrasing. It must sound natural.
2. **Grammar Perfection:** Zero tolerance for grammar errors.
`;
            rubric = `
- **Stylistic Precision (40 pts):** Idiomatic and natural flow.
- **Grammar Accuracy (40 pts):** Flawless structure.
- **Vocabulary Sophistication (20 pts):** Precise word choice.`;
            break;
            
        default:
             personality = `You are a helpful English tutor.`;
             rubric = `Standard scoring.`;
    }
    return { personality, rubric, specialInstructions };
};

export const getHolisticEvaluationRubric = (studentLevel: Exclude<CEFRLevel, 'A1 ukr'>) => {
    return getEvaluationRubric(studentLevel);
};
