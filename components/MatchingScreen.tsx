
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QuizTerm, MatchingUserResult } from '../types';
import AudioButton from './AudioButton';
import BackButton from './BackButton';
import { useTranslation } from '../hooks/useTranslation';
import { useMatchingGame } from '../hooks/useMatchingGame';

interface MatchingScreenProps {
  terms: QuizTerm[];
  onComplete: (result: MatchingUserResult) => void;
  onBack: () => void;
}

type Connection = { x1: number; y1: number; x2: number; y2: number; key: string };

const MatchingScreen: React.FC<MatchingScreenProps> = ({ terms, onComplete, onBack }) => {
  const { t } = useTranslation();
  
  // Game Logic
  const {
      shuffledDefs,
      selectedTerm,
      matchedPairs,
      incorrectAttempts,
      flashingPair,
      handleTermClick,
      handleDefClick
  } = useMatchingGame({ terms, onComplete });

  // Visual / Canvas Logic
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dynamicLine, setDynamicLine] = useState<React.ReactElement | null>(null);
  
  const termRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const defRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateConnections = useCallback(() => {
    // Only calculate connections on larger screens where SVG is visible
    if (window.innerWidth < 768 || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newConnections: Connection[] = [];

    Object.entries(matchedPairs).forEach(([termKey, defKey]) => {
      const termEl = termRefs.current[termKey];
      const defEl = defRefs.current[defKey];
      if (termEl && defEl) {
        const termRect = termEl.getBoundingClientRect();
        const defRect = defEl.getBoundingClientRect();
        newConnections.push({
          x1: termRect.right - containerRect.left,
          y1: termRect.top + termRect.height / 2 - containerRect.top,
          x2: defRect.left - containerRect.left,
          y2: defRect.top + defRect.height / 2 - containerRect.top,
          key: `${termKey}-${defKey}`
        });
      }
    });
    setConnections(newConnections);
  }, [matchedPairs]);

  useEffect(() => {
    updateConnections();
    const handleResize = () => updateConnections();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateConnections]);
  
  const getDynamicLine = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return null; // No lines on mobile
    if (!selectedTerm || !containerRef.current) return null;
    const termEl = termRefs.current[selectedTerm.term];
    if (!termEl) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const termRect = termEl.getBoundingClientRect();

    const x1 = termRect.right - containerRect.left;
    const y1 = termRect.top + termRect.height / 2 - containerRect.top;
    const x2 = e.clientX - containerRect.left;
    const y2 = e.clientY - containerRect.top;

    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366F1" strokeWidth="3" strokeDasharray="5,5" />;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl animate-fade-in flex flex-col items-center relative mx-auto min-h-[80vh] transition-colors duration-300">
      <BackButton onClick={onBack} />
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{t('matchingScreen.title')}</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4 text-sm md:text-base text-center">{t('matchingScreen.description')}</p>
      
      <div className="flex items-center gap-2 mb-8 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase">{t('matchingScreen.incorrectAttempts')}</span>
        <span className={`text-lg font-bold ${incorrectAttempts > 0 ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{incorrectAttempts}</span>
      </div>
      
      <div 
        ref={containerRef}
        className="relative w-full flex justify-between items-start gap-4 md:gap-12 flex-grow" 
        onMouseMove={(e) => setDynamicLine(getDynamicLine(e))}
        onMouseLeave={() => setDynamicLine(null)}
      >
        {/* Left Column (Terms) */}
        <div className="w-1/2 md:w-5/12 flex flex-col gap-3">
          {terms.map(term => {
            const isSelected = selectedTerm?.term === term.term;
            const isMatched = !!matchedPairs[term.term];
            return (
              <div 
                key={term.term}
                ref={el => { termRefs.current[term.term] = el; }}
                onClick={() => handleTermClick(term)}
                className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-200 min-h-[72px] relative z-10 ${
                  isMatched ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 
                  isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 ring-2 ring-indigo-500 shadow-md border border-indigo-200 dark:border-indigo-700' : 
                  'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 cursor-pointer text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span className={`flex-grow font-semibold text-sm md:text-base break-words ${isMatched ? 'opacity-70' : ''}`}>{term.term}</span>
                <div className="hidden md:block text-slate-400 dark:text-slate-500">
                  <AudioButton textToSpeak={term.term} lang="en-US" />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* SVG Overlay (Desktop Only) */}
        <svg className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {connections.map(c => (
            <line key={c.key} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#10B981" strokeWidth="3" opacity="0.6" />
          ))}
          {dynamicLine}
          {flashingPair && (() => {
            const [termKey, defKey] = flashingPair.split('-');
            const termEl = termRefs.current[termKey];
            const defEl = defRefs.current[defKey];
            if (!termEl || !defEl || !containerRef.current) return null;
            const containerRect = containerRef.current.getBoundingClientRect();
            const termRect = termEl.getBoundingClientRect();
            const defRect = defEl.getBoundingClientRect();
            return (
              <line
                x1={termRect.right - containerRect.left}
                y1={termRect.top + termRect.height / 2 - containerRect.top}
                x2={defRect.left - containerRect.left}
                y2={defRect.top + defRect.height / 2 - containerRect.top}
                stroke="#F43F5E"
                strokeWidth="3"
                className="animate-ping-once"
              />
            );
          })()}
        </svg>

        {/* Right Column (Definitions) */}
        <div className="w-1/2 md:w-5/12 flex flex-col gap-3">
          {shuffledDefs.map(def => {
            const isMatched = Object.values(matchedPairs).includes(def.term);
            const isTarget = flashingPair?.split('-')[1] === def.term;
            return (
              <div 
                key={def.term}
                ref={el => { defRefs.current[def.term] = el; }}
                onClick={() => handleDefClick(def)}
                className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-200 min-h-[72px] relative z-10 ${
                  isMatched ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                  isTarget ? 'bg-rose-50 dark:bg-rose-900/30 ring-2 ring-rose-500 border border-rose-200 dark:border-rose-800' :
                  selectedTerm ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500 cursor-pointer ring-2 ring-indigo-100 dark:ring-indigo-900/30 text-slate-700 dark:text-slate-200' :
                  'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className={`flex-grow text-xs md:text-sm font-medium break-words leading-relaxed ${isMatched ? 'opacity-70' : ''}`}>{def.definition}</span>
                <div className="md:hidden text-slate-400 dark:text-slate-500" onClick={(e) => e.stopPropagation()}>
                    <AudioButton textToSpeak={def.definition} lang="uk-UA" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingScreen;
