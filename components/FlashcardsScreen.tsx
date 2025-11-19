
import React, { useState, useEffect, useCallback } from 'react';
import { QuizTerm } from '../types';
import AudioButton from './AudioButton';
import ArrowIcon from './icons/ArrowIcon';
import FlipIcon from './icons/FlipIcon';
import { useTranslation } from '../hooks/useTranslation';

interface FlashcardsScreenProps {
  terms: QuizTerm[];
  onRestart: () => void;
}

const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ terms, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { t } = useTranslation();

  const currentTerm = terms[currentIndex];

  useEffect(() => {
    // Reset flip state when card changes
    setIsFlipped(false);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < terms.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, terms.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
            if (currentIndex === terms.length - 1) {
                onRestart();
            } else {
                handleNext();
            }
        } else if (event.key === 'ArrowLeft') {
            handlePrev();
        } else if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault(); // Prevent space from scrolling
            setIsFlipped(prev => !prev);
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, terms.length, onRestart, handleNext, handlePrev]);


  if (terms.length === 0 || !currentTerm) {
      return (
        <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-100">{t('flashcardsScreen.noTerms')}</h2>
            <button onClick={onRestart} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
                {t('flashcardsScreen.goBack')}
            </button>
        </div>
      )
  }

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-400 mb-6">{t('flashcardsScreen.title')}</h1>
      
      <div className="w-full h-80 mb-6" style={{ perspective: '1000px' }}>
        <div 
            className={`relative w-full h-full cursor-pointer transition-transform duration-500`} 
            style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front of the Card (English) */}
            <div className="absolute w-full h-full bg-slate-700 rounded-xl shadow-lg flex flex-col items-center justify-center p-4" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <div className="absolute top-4 right-4">
                    <AudioButton textToSpeak={currentTerm.term} lang="en-US" />
                </div>
                <h2 className="text-5xl font-bold text-white text-center">{currentTerm.term}</h2>
                <div className="absolute bottom-4 flex items-center gap-2 text-slate-400">
                    <FlipIcon />
                    <span>{t('flashcardsScreen.clickToFlip')}</span>
                </div>
            </div>
            {/* Back of the Card (Ukrainian) */}
            <div className="absolute w-full h-full bg-indigo-900/50 rounded-xl shadow-lg flex flex-col items-center justify-center p-4" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="absolute top-4 right-4">
                    <AudioButton textToSpeak={currentTerm.definition} lang="uk-UA" />
                </div>
                <h2 className="text-5xl font-bold text-white text-center">{currentTerm.definition}</h2>
                 <div className="absolute bottom-4 flex items-center gap-2 text-slate-400">
                    <FlipIcon />
                    <span>{t('flashcardsScreen.clickToFlip')}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full flex justify-between items-center">
        <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            className="p-3 bg-slate-600 hover:bg-slate-500 rounded-full text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous card"
        >
            <ArrowIcon className="transform rotate-180" />
        </button>
        <p className="text-lg font-semibold text-slate-300">
            {t('flashcardsScreen.card_x_of_y', { current: currentIndex + 1, total: terms.length })}
        </p>
        {currentIndex === terms.length - 1 ? (
            <button
                onClick={onRestart}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg text-md transition-colors"
                aria-label={t('common.finish')}
            >
                {t('common.finish')}
            </button>
        ) : (
            <button 
                onClick={handleNext} 
                className="p-3 bg-slate-600 hover:bg-slate-500 rounded-full text-white transition"
                aria-label={t('common.nextQuestion')}
            >
                <ArrowIcon />
            </button>
        )}
      </div>
      
      <div className="mt-8 w-full flex justify-center">
        <button
            onClick={onRestart}
            className="bg-transparent hover:bg-slate-700 text-slate-400 font-semibold py-2 px-4 border border-slate-600 rounded-lg transition"
        >
            {t('common.finishReview')}
        </button>
      </div>

    </div>
  );
};

export default FlashcardsScreen;
