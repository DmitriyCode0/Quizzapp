import React from 'react';
import ContentRouter from './ContentRouter';
import { useAppController } from '../hooks/useAppController';

interface HomeScreenProps {
    onOpenHelp: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenHelp }) => {
  const { 
    state, 
    handleGenerate, 
    handleRestart, 
    handleMcqComplete, 
    handleGapFillComplete, 
    handleTranslationComplete, 
    handleTextTranslationComplete, 
    handleMatchingComplete 
  } = useAppController();

  // If router navigates here but state is still input, that's fine.
  // If state is quiz, we show quiz.
  
  return (
    <ContentRouter 
        state={state}
        onGenerate={handleGenerate}
        onRestart={handleRestart}
        onOpenHelp={onOpenHelp}
        onMcqComplete={handleMcqComplete}
        onGapFillComplete={handleGapFillComplete}
        onTranslationComplete={handleTranslationComplete}
        onTextTranslationComplete={handleTextTranslationComplete}
        onMatchingComplete={handleMatchingComplete}
    />
  );
};

export default HomeScreen;