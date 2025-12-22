import { useState, useEffect, useCallback } from 'react';
import { useAudio } from './useAudio';

interface UseQuizLogicProps<T> {
    totalQuestions: number;
    isTimedMode: boolean;
    onComplete: (answers: T[]) => void;
    onTimeUp?: () => void;
    externalStopTimer?: boolean;
}

export const useQuizLogic = <T,>({
    totalQuestions,
    isTimedMode,
    onComplete,
    onTimeUp,
    externalStopTimer = false
}: UseQuizLogicProps<T>) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPaused, setIsPaused] = useState(false);
    const [isAnswered, setIsAnswered] = useState(false);
    const [userAnswers, setUserAnswers] = useState<T[]>([]);
    
    const { cancel } = useAudio();

    const handleNext = useCallback(() => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onComplete(userAnswers);
        }
    }, [currentIndex, totalQuestions, onComplete, userAnswers]);

    const addAnswer = useCallback((answer: T) => {
        setUserAnswers(prev => [...prev, answer]);
        setIsAnswered(true);
    }, []);

    // Reset state on question change
    useEffect(() => {
        cancel(); // Stop any audio playing from the previous question
        setTimeLeft(30);
        setIsPaused(false);
        setIsAnswered(false);
    }, [currentIndex, cancel]);

    // Timer Logic
    useEffect(() => {
        if (!isTimedMode || isPaused || isAnswered || externalStopTimer) return;

        if (timeLeft <= 0) {
            if (onTimeUp) onTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, isTimedMode, isPaused, isAnswered, externalStopTimer, onTimeUp]);

    return {
        currentIndex,
        timeLeft,
        isPaused,
        setIsPaused,
        isAnswered,
        handleNext,
        addAnswer,
        userAnswers
    };
};
