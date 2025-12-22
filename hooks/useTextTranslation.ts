
import { useState, useRef } from 'react';
import { TextTranslationQuestion, TextTranslationUserAnswer, FeedbackItem, CEFRLevel, Language, TeacherPersona } from '../types';
import { evaluateTextTranslationAnswer } from '../services/geminiService';

interface UseTextTranslationProps {
    question: TextTranslationQuestion;
    onComplete: (answer: TextTranslationUserAnswer) => void;
    cefrLevel: CEFRLevel;
    language: Language;
    selectedGrammarTopics?: string[];
    teacherPersona?: TeacherPersona;
}

export const useTextTranslation = ({ question, onComplete, cefrLevel, language, selectedGrammarTopics, teacherPersona = 'standard' }: UseTextTranslationProps) => {
    const [inputValue, setInputValue] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<{ score: number, feedback: FeedbackItem[] } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const handleCheckAnswer = async () => {
        if (isAnswered || isEvaluating) return;

        if (typeof window.speechSynthesis !== 'undefined') {
            window.speechSynthesis.cancel();
        }
        setIsEvaluating(true);
        const userAnswer = inputValue.trim();
        const evalResult = await evaluateTextTranslationAnswer(
            userAnswer,
            question.englishAnswer,
            question.ukrainianText,
            cefrLevel,
            language,
            selectedGrammarTopics,
            teacherPersona
        );
        
        setIsEvaluating(false);
        setIsAnswered(true);
        setEvaluation(evalResult);
    };

    const handleFinish = () => {
        if (!evaluation) return;
        onComplete({
            questionId: question.id,
            userAnswer: inputValue.trim(),
            correctAnswer: question.englishAnswer,
            score: evaluation.score,
            feedback: evaluation.feedback
        });
    };

    return {
        inputValue, 
        setInputValue,
        isAnswered,
        isEvaluating,
        evaluation,
        formRef,
        handleCheckAnswer,
        handleFinish
    };
};
