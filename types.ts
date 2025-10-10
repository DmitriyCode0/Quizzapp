
export type AppState = 'input' | 'generating' | 'quiz' | 'results';

export interface QuizTerm {
  term: string;
  definition: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  originalTerm: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}
