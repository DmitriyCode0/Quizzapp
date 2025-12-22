import { useState, useEffect, useCallback } from 'react';
import { QuizTerm, MatchingUserResult } from '../types';

interface UseMatchingGameProps {
    terms: QuizTerm[];
    onComplete: (result: MatchingUserResult) => void;
}

export const useMatchingGame = ({ terms, onComplete }: UseMatchingGameProps) => {
    const [shuffledDefs, setShuffledDefs] = useState<QuizTerm[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<QuizTerm | null>(null);
    const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
    const [incorrectAttempts, setIncorrectAttempts] = useState(0);
    const [flashingPair, setFlashingPair] = useState<string | null>(null);

    // Initialize game
    useEffect(() => {
        const shuffled = [...terms].sort(() => Math.random() - 0.5);
        setShuffledDefs(shuffled);
        setMatchedPairs({});
        setIncorrectAttempts(0);
        setSelectedTerm(null);
    }, [terms]);

    // Check completion
    useEffect(() => {
        if (terms.length > 0 && Object.keys(matchedPairs).length === terms.length) {
            const timer = setTimeout(() => {
                onComplete({ incorrectAttempts });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [matchedPairs, terms.length, incorrectAttempts, onComplete]);

    const handleTermClick = useCallback((term: QuizTerm) => {
        if (matchedPairs[term.term]) return;
        if (navigator.vibrate) navigator.vibrate(10);
        setSelectedTerm(term);
    }, [matchedPairs]);

    const handleDefClick = useCallback((def: QuizTerm) => {
        if (!selectedTerm || Object.values(matchedPairs).includes(def.term)) return;

        if (selectedTerm.term === def.term) {
            // Correct match
            if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
            setMatchedPairs(prev => ({ ...prev, [selectedTerm.term]: def.term }));
        } else {
            // Incorrect match
            if (navigator.vibrate) navigator.vibrate(50);
            setIncorrectAttempts(prev => prev + 1);
            const flashKey = `${selectedTerm.term}-${def.term}`;
            setFlashingPair(flashKey);
            setTimeout(() => setFlashingPair(null), 500);
        }
        setSelectedTerm(null);
    }, [selectedTerm, matchedPairs]);

    return {
        shuffledDefs,
        selectedTerm,
        matchedPairs,
        incorrectAttempts,
        flashingPair,
        handleTermClick,
        handleDefClick
    };
};
