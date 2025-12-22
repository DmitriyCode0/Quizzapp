
import React, { useMemo } from 'react';
import { getDiff } from '../utils/diff';

interface DiffViewerProps {
    userAnswer: string;
    correctAnswer: string;
    isCorrectOverride?: boolean; // If true, show everything as green regardless of diff
    className?: string;
    mode?: 'chars' | 'words';
    hideMissing?: boolean; // If true, do not show "added" (missing from user) parts. Just highlight errors.
}

const DiffViewer: React.FC<DiffViewerProps> = ({ 
    userAnswer, 
    correctAnswer, 
    isCorrectOverride, 
    className = "",
    mode = 'chars',
    hideMissing = false
}) => {
    const diff = useMemo(() => getDiff(userAnswer, correctAnswer, mode as 'chars' | 'words'), [userAnswer, correctAnswer, mode]);

    if (isCorrectOverride) {
        return (
            <span className={`text-emerald-700 dark:text-emerald-300 font-medium ${className}`}>
                {userAnswer}
            </span>
        );
    }

    return (
        <span className={`font-medium tracking-wide ${className}`}>
            {diff.map((part, index) => {
                if (part.added) {
                    // Added means present in correct answer but not user answer (Missing)
                    if (hideMissing) return null;
                    
                    return (
                        <span key={index} className="bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-0.5 rounded mx-0.5" title="Missing">
                            {part.value}
                        </span>
                    );
                }
                if (part.removed) {
                    // Removed means present in user answer but not in correct answer (Incorrect)
                    if (hideMissing) {
                        // Highlighting style for "words" mode without dynamic correcting
                        return (
                            <span key={index} className="text-rose-600 dark:text-rose-400 font-bold decoration-rose-500 decoration-2 underline underline-offset-2" title="Incorrect">
                                {part.value}
                            </span>
                        );
                    }
                    // Traditional diff style
                    return (
                        <span key={index} className="bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 line-through decoration-rose-500 decoration-2 decoration-wavy px-0.5 rounded" title="Incorrect">
                            {part.value}
                        </span>
                    );
                }
                // Correct part
                return (
                    <span key={index} className="text-emerald-700 dark:text-emerald-400">
                        {part.value}
                    </span>
                );
            })}
        </span>
    );
};

export default DiffViewer;
