import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { QuizTerm, MatchingUserResult } from '../types';

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
  const [flashingPair, setFlashingPair] = useState<{ term: string, def: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const termRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const defRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    setShuffledDefs([...terms].sort(() => Math.random() - 0.5));
  }, [terms]);

  const updateConnections = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newConnections: Connection[] = [];

    Object.entries(matchedPairs).forEach(([term, definition]) => {
      const termEl = termRefs.current[term];
      const defEl = defRefs.current[definition];
      if (termEl && defEl) {
        const termRect = termEl.getBoundingClientRect();
        const defRect = defEl.getBoundingClientRect();
        newConnections.push({
          x1: termRect.left + termRect.width - containerRect.left,
          y1: termRect.top + termRect.height / 2 - containerRect.top,
          x2: defRect.left - containerRect.left,
          y2: defRect.top + defRect.height / 2 - containerRect.top,
          key: `${term}-${definition}`,
        });
      }
    });
    setConnections(newConnections);
  }, [matchedPairs]);

  useEffect(() => {
    updateConnections();
    const observer = new ResizeObserver(updateConnections);
    const container = containerRef.current;
    if (container) {
        observer.observe(container);
    }
    window.addEventListener('resize', updateConnections);
    return () => {
        if(container) observer.unobserve(container);
        window.removeEventListener('resize', updateConnections);
    };
  }, [updateConnections]);
  
  const handleTermClick = (term: QuizTerm) => {
    if (matchedPairs[term.term] || (selectedTerm && selectedTerm.term === term.term)) {
      setSelectedTerm(null);
    } else {
      setSelectedTerm(term);
    }
  };

  const handleDefClick = (def: QuizTerm) => {
    if (!selectedTerm || matchedPairs[selectedTerm.term]) return;

    const correctDefinition = terms.find(t => t.term === selectedTerm.term)?.definition;
    if (def.definition === correctDefinition) {
      setMatchedPairs(prev => ({ ...prev, [selectedTerm.term]: def.definition }));
      setSelectedTerm(null);
    } else {
      setIncorrectAttempts(prev => prev + 1);
      setFlashingPair({ term: selectedTerm.term, def: def.definition });
      setSelectedTerm(null);
    }
  };
  
  useEffect(() => {
    if (terms.length > 0 && Object.keys(matchedPairs).length === terms.length) {
      setTimeout(() => {
        onComplete({ incorrectAttempts });
      }, 500);
    }
  }, [matchedPairs, terms, onComplete, incorrectAttempts]);

  useEffect(() => {
    if (flashingPair) {
      const timer = setTimeout(() => setFlashingPair(null), 500);
      return () => clearTimeout(timer);
    }
  }, [flashingPair]);

  const getButtonClass = (item: QuizTerm, type: 'term' | 'def') => {
    const isMatched = type === 'term' 
      ? !!matchedPairs[item.term]
      : Object.values(matchedPairs).includes(item.definition);
    
    if (isMatched) {
      return 'bg-green-800/50 border-green-600 text-slate-300 cursor-default';
    }
    if (selectedTerm && type === 'term' && selectedTerm.term === item.term) {
      return 'bg-indigo-600/80 border-indigo-400 ring-2 ring-indigo-400';
    }
    if (flashingPair && 
        ((type === 'term' && flashingPair.term === item.term) || 
         (type === 'def' && flashingPair.def === item.definition))) {
        return 'bg-red-800/50 border-red-500 animate-shake';
    }
    return 'bg-slate-700 hover:bg-slate-600 border-slate-600';
  };

  return (
    <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in flex flex-col items-center">
      <h1 className="text-3xl font-bold text-indigo-400 mb-2">Matching Exercise</h1>
      <p className="text-slate-300 mb-6">Connect the English words to their Ukrainian translations.</p>
      
      <div className="w-full relative" ref={containerRef}>
        <div className="grid grid-cols-2 gap-x-8 md:gap-x-16 items-center">
          {/* Terms Column */}
          <div className="flex flex-col gap-4">
            {terms.map(term => (
              <button
                key={term.term}
// FIX: Changed the ref callback from a concise body to a block body to prevent an implicit return value that caused a type error.
                ref={el => { termRefs.current[term.term] = el; }}
                onClick={() => handleTermClick(term)}
                disabled={!!matchedPairs[term.term]}
                className={`w-full p-4 rounded-lg border text-lg font-semibold transition-all duration-200 text-left ${getButtonClass(term, 'term')}`}
              >
                {term.term}
              </button>
            ))}
          </div>
          {/* Definitions Column */}
          <div className="flex flex-col gap-4">
            {shuffledDefs.map(def => (
              <button
                key={def.definition}
// FIX: Changed the ref callback from a concise body to a block body to prevent an implicit return value that caused a type error.
                ref={el => { defRefs.current[def.definition] = el; }}
                onClick={() => handleDefClick(def)}
                disabled={Object.values(matchedPairs).includes(def.definition)}
                className={`w-full p-4 rounded-lg border text-lg font-semibold transition-all duration-200 text-right ${getButtonClass(def, 'def')}`}
              >
                {def.definition}
              </button>
            ))}
          </div>
        </div>
        
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {connections.map(conn => (
            <line
              key={conn.key}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke="rgba(74, 222, 128, 0.7)"
              strokeWidth="3"
              strokeDasharray="5, 5"
              className="animate-fade-in"
            />
          ))}
        </svg>
      </div>

      <div className="mt-8 text-lg text-slate-400">
        Incorrect Attempts: <span className="font-bold text-yellow-400">{incorrectAttempts}</span>
      </div>
    </div>
  );
};

export default MatchingScreen;