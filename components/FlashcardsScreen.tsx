
import React, { useState, useEffect, useCallback } from 'react';
import { QuizTerm } from '../types';
import AudioButton from './AudioButton';
import BackButton from './BackButton';
import ArrowIcon from './icons/ArrowIcon';
import FlipIcon from './icons/FlipIcon';
import { useTranslation } from '../hooks/useTranslation';
import { useSwipeGestures } from '../hooks/useSwipeGestures';

interface FlashcardsScreenProps {
  terms: QuizTerm[];
  onRestart: () => void;
}

type SwipeState = 'idle' | 'out-left' | 'out-right' | 'in-left' | 'in-right';

const FlashcardsScreen: React.FC<FlashcardsScreenProps> = ({ terms, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [swipeState, setSwipeState] = useState<SwipeState>('idle');
  const { t } = useTranslation();

  const currentTerm = terms[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < terms.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setIsFlipped(false); // Reset flip
      setSwipeState('out-left'); // Animate out to the left

      // Wait for exit animation (300ms matches duration-300)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSwipeState('in-right'); // Snap to right side (invisible)
        
        // Small delay to allow DOM to update position before sliding in
        setTimeout(() => {
             setSwipeState('idle'); // Animate in to center
             setTimeout(() => setIsTransitioning(false), 300); // Clear transition lock
        }, 50);
      }, 300);
    }
  }, [currentIndex, terms.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setIsFlipped(false);
      setSwipeState('out-right'); // Animate out to the right

      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setSwipeState('in-left'); // Snap to left side (invisible)
        
        setTimeout(() => {
             setSwipeState('idle');
             setTimeout(() => setIsTransitioning(false), 300);
        }, 50);
      }, 300);
    }
  }, [currentIndex, isTransitioning]);

  const swipeHandlers = useSwipeGestures({
      onSwipeLeft: () => {
          if (currentIndex < terms.length - 1) handleNext();
      },
      onSwipeRight: () => {
          if (currentIndex > 0) handlePrev();
      }
  });
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (isTransitioning) return; // Block input during transition

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
            if (!isTransitioning) {
                setIsFlipped(prev => !prev);
            }
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, terms.length, onRestart, handleNext, handlePrev, isTransitioning]);

  const getSwipeClass = () => {
      switch (swipeState) {
          case 'out-left': return '-translate-x-1/2 opacity-0';
          case 'out-right': return 'translate-x-1/2 opacity-0';
          case 'in-left': return '-translate-x-1/2 opacity-0'; // Starting pos for entering from left
          case 'in-right': return 'translate-x-1/2 opacity-0'; // Starting pos for entering from right
          default: return 'translate-x-0 opacity-100';
      }
  };

  if (terms.length === 0 || !currentTerm) {
      return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl flex flex-col items-center gap-4 relative mx-auto transition-colors duration-300">
            <BackButton onClick={onRestart} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('flashcardsScreen.noTerms')}</h2>
            <button onClick={onRestart} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
                {t('flashcardsScreen.goBack')}
            </button>
        </div>
      )
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl animate-fade-in flex flex-col items-center relative overflow-hidden mx-auto min-h-[80vh] justify-center transition-colors duration-300">
      <BackButton onClick={onRestart} />
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{t('flashcardsScreen.title')}</h1>
      <p className="md:hidden text-xs text-slate-400 dark:text-slate-500 mb-4 animate-pulse">{t('flashcardsScreen.mobileHint')}</p>
      
      <div 
        className="w-full h-80 mb-6 relative" 
        style={{ perspective: '1000px' }}
        {...swipeHandlers}
      >
        {/* Swipe Wrapper */}
        <div className={`w-full h-full transition-all duration-300 ease-out transform ${getSwipeClass()}`}>
            {/* Flip Card */}
            <div 
                className={`relative w-full h-full cursor-pointer transition-transform duration-500 group`} 
                style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}
            >
                {/* Front of the Card (English) */}
                <div className="absolute w-full h-full bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-6 select-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-colors duration-300" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                    <div className="absolute top-4 right-4">
                        <AudioButton textToSpeak={currentTerm.term} lang="en-US" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white text-center break-words max-w-full px-2 tracking-tight">{currentTerm.term}</h2>
                    <div className="absolute bottom-6 flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-medium bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                        <FlipIcon className="text-indigo-400" />
                        <span>{t('flashcardsScreen.clickToFlip')}</span>
                    </div>
                </div>
                {/* Back of the Card (Ukrainian) */}
                <div className="absolute w-full h-full bg-indigo-50 dark:bg-indigo-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border-2 border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center p-6 select-none transition-colors duration-300" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="absolute top-4 right-4">
                        <AudioButton textToSpeak={currentTerm.definition} lang="uk-UA" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-indigo-900 dark:text-indigo-100 text-center break-words max-w-full px-2 leading-tight">{currentTerm.definition}</h2>
                    <div className="absolute bottom-6 flex items-center gap-2 text-indigo-400 text-sm font-medium bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full shadow-sm">
                        <FlipIcon />
                        <span>{t('flashcardsScreen.clickToFlip')}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full flex justify-between items-center px-4">
        <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0 || isTransitioning}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Previous card"
        >
            <ArrowIcon className="transform rotate-180" />
        </button>
        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
            {t('flashcardsScreen.card_x_of_y', { current: currentIndex + 1, total: terms.length })}
        </p>
        {currentIndex === terms.length - 1 ? (
            <button
                onClick={onRestart}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                aria-label={t('common.finish')}
            >
                {t('common.finish')}
            </button>
        ) : (
            <button 
                onClick={handleNext} 
                disabled={isTransitioning}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
                aria-label={t('common.nextQuestion')}
            >
                <ArrowIcon />
            </button>
        )}
      </div>
      
      <div className="mt-8 w-full flex justify-center">
        <button
            onClick={onRestart}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium text-sm hover:underline transition-colors"
        >
            {t('common.finishReview')}
        </button>
      </div>

    </div>
  );
};

export default FlashcardsScreen;
