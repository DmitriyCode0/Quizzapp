
export type DiffPart = { value: string; added?: boolean; removed?: boolean };

// A simple implementation of the Longest Common Subsequence (LCS) based diff
export function getDiff(text1: string, text2: string, mode: 'chars' | 'words' = 'chars'): DiffPart[] {
    let s1: string[];
    let s2: string[];

    if (mode === 'words') {
        // Split by word boundaries to treat words and punctuation as tokens
        // Filtering empty strings is important as split(/\b/) can produce them
        s1 = text1.split(/\b/).filter(s => s.length > 0);
        s2 = text2.split(/\b/).filter(s => s.length > 0);
    } else {
        s1 = text1.split("");
        s2 = text2.split("");
    }

    const matrix: number[][] = [];

    // Initialize LCS Matrix
    for (let i = 0; i <= s1.length; i++) {
        matrix[i] = [0];
    }
    for (let j = 0; j <= s2.length; j++) {
        matrix[0][j] = 0;
    }

    // Fill Matrix
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }

    // Backtrack to find diff
    let i = s1.length;
    let j = s2.length;
    const parts: DiffPart[] = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
            parts.unshift({ value: s1[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
            parts.unshift({ value: s2[j - 1], added: true });
            j--;
        } else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
            parts.unshift({ value: s1[i - 1], removed: true });
            i--;
        }
    }

    // Merge consecutive parts of same type
    const merged: DiffPart[] = [];
    if (parts.length > 0) {
        let current = parts[0];
        for (let k = 1; k < parts.length; k++) {
            const next = parts[k];
            if (current.added === next.added && current.removed === next.removed) {
                current.value += next.value;
            } else {
                merged.push(current);
                current = next;
            }
        }
        merged.push(current);
    }

    return merged;
}
