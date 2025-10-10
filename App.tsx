
import React, { useState, useCallback } from 'react';
import { AppState, Question, UserAnswer, QuizTerm } from './types';
import InputScreen from './components/InputScreen';
import LoadingScreen from './components/LoadingScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import { generateQuiz } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseQuizletData = (data: string): QuizTerm[] => {
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.includes('\t') && line.length > 2)
      .map(line => {
        const parts = line.split('\t');
        return { term: parts[0].trim(), definition: parts[1].trim() };
      });
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleGenerateQuiz = useCallback(async (quizletData: string) => {
    setError(null);
    setAppState('generating');
    
    const terms = parseQuizletData(quizletData);

    if (terms.length === 0) {
      setError("Invalid or empty data. Please paste the Quizlet data with tabs between terms and definitions.");
      setAppState('input');
      return;
    }

    try {
      const generatedQuestions = await generateQuiz(terms);
      const questionsWithShuffledOptions = generatedQuestions.map(q => ({
        ...q,
        id: crypto.randomUUID(),
        options: shuffleArray(q.options),
      }));
      setQuestions(shuffleArray(questionsWithShuffledOptions));
      setAppState('quiz');
    } catch (err) {
      console.error(err);
      setError("Failed to generate the quiz. Please check your API key and try again.");
      setAppState('input');
    }
  }, []);

  const handleQuizComplete = useCallback((answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setAppState('results');
  }, []);

  const handleRestart = useCallback(() => {
    setAppState('input');
    setQuestions([]);
    setUserAnswers([]);
    setError(null);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'input':
        return <InputScreen onGenerateQuiz={handleGenerateQuiz} error={error} />;
      case 'generating':
        return <LoadingScreen />;
      case 'quiz':
        return <QuizScreen questions={questions} onComplete={handleQuizComplete} />;
      case 'results':
        return <ResultsScreen userAnswers={userAnswers} questions={questions} onRestart={handleRestart} />;
      default:
        return <InputScreen onGenerateQuiz={handleGenerateQuiz} error={error} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
