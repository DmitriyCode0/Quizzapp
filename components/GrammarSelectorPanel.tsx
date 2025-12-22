
import React, { useMemo, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface GrammarSelectorPanelProps {
  availableTopics: string[];
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
  isRelevant: boolean;
  className?: string;
}

// Helper to shorten topic names for the sidebar
const formatTopicName = (topic: string) => {
    // For A1/A2 topics, they are already short. For older verbose topics, cut them.
    if (topic.length <= 35) return topic;
    const cut = topic.split(':')[0]; // Take part before colon
    return cut.length > 35 ? cut.substring(0, 35) + '...' : cut;
};

// Helper to group topics roughly by keyword
const groupTopics = (topics: string[]) => {
    const groups: Record<string, string[]> = {
        'Tenses': [], // Renamed from Present/Past to generic Tenses where possible, or keep separate
        'Present': [], // A1 specific
        'Past & Perfect': [], // A2/B1
        'Future': [],
        'Conditionals': [],
        'Modals & Verbs': [],
        'Nouns & Articles': [],
        'Adjectives & Adverbs': [],
        'Prepositions': [],
        'Sentence Structure': [],
        'Other': []
    };

    topics.forEach(topic => {
        const lower = topic.toLowerCase();
        
        // Special case for Causative (Have something done) - contains 'have', but isn't Present Tense
        if (lower.includes('causative') || lower.includes('have something done')) {
            groups['Modals & Verbs'].push(topic);
            return;
        }

        // Modals & Verbs (Modified to catch A2 verb topics AND 'used to' habits)
        // CHECK THIS FIRST to capture "Used to" before it hits "Past" logic
        if (lower.includes('can') || lower.includes('must') || lower.includes('should') || lower.includes('modal') || lower.includes('would') || lower.includes('imperative') || lower.includes('verb') || lower.includes('make') || lower.includes('get') || lower.includes('used to') || lower.includes('ought to') || lower.includes('had better') || lower.includes('passive') || lower.includes('subjunctive')) {
            groups['Modals & Verbs'].push(topic);
        }
        
        // Present
        else if (lower.includes('present') || lower.includes('have got') || lower.includes("verb 'to be'")) groups['Present'].push(topic);
        
        // Past
        else if (lower.includes('past') || lower.includes('was / were') || lower.includes('did') || lower.includes('narrative')) groups['Past & Perfect'].push(topic);
        
        // Future
        else if (lower.includes('future') || lower.includes('going to') || lower.includes('will')) groups['Future'].push(topic);
        
        // Conditionals
        else if (lower.includes('conditional') || lower.includes('if ') || lower.includes('wish')) groups['Conditionals'].push(topic);
        
        // Nouns & Articles
        else if (lower.includes('noun') || lower.includes('article') || lower.includes('plural') || lower.includes('pronoun') || lower.includes('possessive') || lower.includes('this / that') || lower.includes('quantifier') || lower.includes('there is')) groups['Nouns & Articles'].push(topic);
        
        // Adjectives & Adverbs
        else if (lower.includes('adjective') || lower.includes('adverb') || lower.includes('comparative') || lower.includes('superlative')) groups['Adjectives & Adverbs'].push(topic);
        
        // Prepositions
        else if (lower.includes('preposition')) groups['Prepositions'].push(topic);
        
        // Structure
        else if (lower.includes('question') || lower.includes('word order') || lower.includes('conjunction') || lower.includes('connector') || lower.includes('clause') || lower.includes('inversion') || lower.includes('cleft') || lower.includes('ellipsis') || lower.includes('marker')) groups['Sentence Structure'].push(topic);
        
        // Other
        else groups['Other'].push(topic);
    });

    // Merge Present and Past into "Tenses" to clean up grouping
    
    const consolidatedGroups: Record<string, string[]> = {
        'Tenses': [...groups['Present'], ...groups['Past & Perfect']],
        'Future': groups['Future'],
        'Modals & Verbs': groups['Modals & Verbs'],
        'Conditionals': groups['Conditionals'],
        'Nouns & Articles': groups['Nouns & Articles'],
        'Adjectives & Adverbs': groups['Adjectives & Adverbs'],
        'Prepositions': groups['Prepositions'],
        'Sentence Structure': groups['Sentence Structure'],
        'Other': groups['Other']
    };

    // Remove empty groups
    return Object.entries(consolidatedGroups).filter(([_, items]) => items.length > 0);
};

const GrammarSelectorPanel: React.FC<GrammarSelectorPanelProps> = ({
  availableTopics,
  selectedTopics,
  onTopicToggle,
  isRelevant,
  className = ""
}) => {
  const { t } = useTranslation();
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{top: number, left: number} | null>(null);
  
  const groupedTopics = useMemo(() => groupTopics(availableTopics), [availableTopics]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, topic: string) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPos({
          top: rect.top - 10, // Position above the button with slight gap
          left: rect.left + (rect.width / 2) // Center horizontally
      });
      setHoveredTopic(topic);
  };

  const handleMouseLeave = () => {
      setHoveredTopic(null);
      setTooltipPos(null);
  };

  return (
    <div className={`flex-shrink-0 flex flex-col gap-4 transition-opacity duration-300 ${isRelevant ? 'opacity-100' : 'opacity-40 pointer-events-none'} ${className}`}>
      <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-slate-700 pb-2">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            {t('grammarSelector.title')}
            </h3>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">BETA</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
        {t('grammarSelector.description')}
      </p>

      <div className="h-full min-h-[200px] md:max-h-[500px] overflow-y-auto custom-scrollbar pr-2 space-y-6">
        {groupedTopics.map(([groupName, topics]) => (
            <div key={groupName}>
                <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 pl-2">{groupName}</h4>
                <div className="flex flex-col space-y-0.5">
                    {topics.map(topic => {
                        const isSelected = selectedTopics.includes(topic);
                        return (
                            <button
                                key={topic}
                                type="button"
                                onClick={() => onTopicToggle(topic)}
                                onMouseEnter={(e) => handleMouseEnter(e, topic)}
                                onMouseLeave={handleMouseLeave}
                                aria-label={topic}
                                className={`text-left text-sm py-2 px-3 rounded-md transition-all duration-200 flex items-start gap-2 group ${
                                    isSelected
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium border-l-2 border-indigo-500 dark:border-indigo-400'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border-l-2 border-transparent'
                                }`}
                            >
                                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400 dark:group-hover:bg-slate-500'}`}></span>
                                <span className="leading-tight">{formatTopicName(topic)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        ))}
      </div>
       {!isRelevant && (
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-2 italic">
                {t('grammarSelector.notApplicable')}
            </p>
        )}

      {/* Custom Tooltip */}
      {hoveredTopic && tooltipPos && (
          <div 
              className="fixed z-[100] px-3 py-2 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-700 dark:border-slate-600 pointer-events-none transform -translate-x-1/2 -translate-y-full w-max max-w-[280px] leading-relaxed tracking-wide animate-fade-in"
              style={{ top: tooltipPos.top, left: tooltipPos.left }}
          >
              {hoveredTopic}
              {/* Tooltip Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800 dark:border-t-slate-700"></div>
          </div>
      )}
    </div>
  );
};

export default GrammarSelectorPanel;
