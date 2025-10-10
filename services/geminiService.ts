
import { GoogleGenAI, Type } from "@google/genai";
import { QuizTerm, Question } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
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

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of quiz questions.",
            items: questionSchema,
        },
    },
    required: ["questions"],
};

export const generateQuiz = async (terms: QuizTerm[]): Promise<Omit<Question, 'id'>[]> => {
    const prompt = `
You are an expert quiz creator specializing in English vocabulary for language learners.
Your task is to generate a multiple-choice quiz from a list of English words and their Ukrainian translations.

The Ukrainian translation is provided ONLY to give you context for the intended meaning of the English word, especially for words with multiple meanings. The entire quiz (questions, options, and answers) must be in ENGLISH.

For each word in the provided list, create one question that tests its meaning. The question could be a definition, a synonym, an antonym, or a fill-in-the-blank sentence.
Generate four options for each question: one correct answer and three plausible but incorrect distractors. Ensure the 'originalTerm' field in your response matches the English word from the input list exactly.

The list of words is:
${terms.map(t => `- ${t.term}: ${t.definition}`).join('\n')}

Please return the output as a single JSON object that strictly adheres to the provided schema. Do not include any other text or explanations in your response outside of the JSON object.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && result.questions) {
            return result.questions as Omit<Question, 'id'>[];
        } else {
            throw new Error("Invalid response format from API.");
        }
    } catch (error) {
        console.error("Error generating quiz with Gemini:", error);
        throw new Error("Could not generate quiz. The API returned an error.");
    }
};
