
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { QuizTerm, MatchingUserResult } from '../types';
import AudioButton from './AudioButton';
import { useTranslation } from '../hooks/useTranslation';

interface MatchingScreenProps {
  terms: QuizTerm[];
  onComplete: (result: MatchingUserResult) => void;
}

type Connection = { x1: number; y1: number; x2: number; y2: number; key: string };

const MatchingScreen: React.FC<MatchingScreenProps> = ({ terms, onComplete }) => {
  const [shuffledDefs, setShuffledDefs] = useState<QuizTerm[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<QuizTerm | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [flashingPair, setFlashingPair] = useState<string | null>(null);

  const termRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const defRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    setShuffledDefs(shuffled);
  }, [terms]);

  const updateConnections = useCallback(() => {
    if (!containerRef.current) return;
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

  const handleTermClick = (term: QuizTerm) => {
    if (matchedPairs[term.term]) return;
    setSelectedTerm(term);
  };

  const handleDefClick = (def: QuizTerm) => {
    if (!selectedTerm || Object.values(matchedPairs).includes(def.term)) return;
    
    if (selectedTerm.term === def.term) { // Correct match
      setMatchedPairs(prev => ({ ...prev, [selectedTerm.term]: def.term }));
    } else { // Incorrect match
      setIncorrectAttempts(prev => prev + 1);
      const flashKey = `${selectedTerm.term}-${def.term}`;
      setFlashingPair(flashKey);
      setTimeout(() => setFlashingPair(null), 500);
    }
    setSelectedTerm(null);
  };

  useEffect(() => {
    if (Object.keys(matchedPairs).length === terms.length) {
      setTimeout(() => {
        onComplete({ incorrectAttempts });
      }, 500);
    }
  }, [matchedPairs, terms.length, incorrectAttempts, onComplete]);
  
  const getDynamicLine = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTerm || !containerRef.current) return null;
    const termEl = termRefs.current[selectedTerm.term];
    if (!termEl) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const termRect = termEl.getBoundingClientRect();

    const x1 = termRect.right - containerRect.left;
    const y1 = termRect.top + termRect.height / 2 - containerRect.top;
    const x2 = e.clientX - containerRect.left;
    const y2 = e.clientY - containerRect.top;

    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4f46e5" strokeWidth="3" />;
  };
  
  const [dynamicLine, setDynamicLine] = useState<React.ReactElement | null>(null);

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-400">{t('matchingScreen.title')}</h1>
      <p className="text-slate-300 mt-1 mb-4">{t('matchingScreen.description')}</p>
      <p className="text-lg text-slate-200 mb-6">{t('matchingScreen.incorrectAttempts')} <span className="font-bold text-yellow-400">{incorrectAttempts}</span></p>
      
      <div 
        ref={containerRef}
        className="relative w-full flex justify-between items-center" 
        onMouseMove={(e) => setDynamicLine(getDynamicLine(e))}
        onMouseLeave={() => setDynamicLine(null)}
      >
        <div className="w-2/5 flex flex-col gap-3">
          {terms.map(term => {
            const isSelected = selectedTerm?.term === term.term;
            const isMatched = !!matchedPairs[term.term];
            return (
              <div 
                key={term.term}
                ref={el => { termRefs.current[term.term] = el; }}
                onClick={() => handleTermClick(term)}
                className={`p-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  isMatched ? 'bg-green-800/50 text-slate-400' : 
                  isSelected ? 'bg-indigo-600 ring-2 ring-indigo-400 shadow-lg' : 
                  'bg-slate-700 hover:bg-slate-600 cursor-pointer'
                }`}
              >
                <span className="flex-grow">{term.term}</span>
                <AudioButton textToSpeak={term.term} lang="en-US" />
              </div>
            );
          })}
        </div>
        
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {connections.map(c => (
            <line key={c.key} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="#10B981" strokeWidth="3" />
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
                stroke="#EF4444"
                strokeWidth="3"
                className="animate-ping-once"
              />
            );
          })()}
        </svg>

        <div className="w-2/5 flex flex-col gap-3">
          {shuffledDefs.map(def => {
            const isMatched = Object.values(matchedPairs).includes(def.term);
            return (
              <div 
                key={def.term}
                ref={el => { defRefs.current[def.term] = el; }}
                onClick={() => handleDefClick(def)}
                className={`p-3 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  isMatched ? 'bg-green-800/50 text-slate-400' :
                  selectedTerm ? 'bg-slate-700 hover:bg-indigo-500 cursor-pointer' :
                  'bg-slate-700'
                }`}
              >
                <span className="flex-grow">{def.definition}</span>
                <AudioButton textToSpeak={def.definition} lang="uk-UA" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchingScreen;
