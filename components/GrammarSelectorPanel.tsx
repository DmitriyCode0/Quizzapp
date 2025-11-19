import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface GrammarSelectorPanelProps {
  availableTopics: string[];
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
  onClearSelection: () => void;
  isRelevant: boolean;
}

const GrammarSelectorPanel: React.FC<GrammarSelectorPanelProps> = ({
  availableTopics,
  selectedTopics,
  onTopicToggle,
  onClearSelection,
  isRelevant,
}) => {
  const { t } = useTranslation();

  return (
    <div className={`flex-shrink-0 w-full md:w-64 flex flex-col gap-3 transition-opacity duration-300 ${isRelevant ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-300 text-sm text-left">
          {t('grammarSelector.title')}
        </h3>
        <button
          type="button"
          onClick={onClearSelection}
          disabled={selectedTopics.length === 0}
          className="text-xs text-indigo-400 hover:underline disabled:text-slate-500 disabled:no-underline disabled:cursor-not-allowed"
        >
          {t('grammarSelector.clearSelection')}
        </button>
      </div>
      <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 h-full max-h-[460px] overflow-y-auto">
        <div className="flex flex-col gap-2">
          {availableTopics.map(topic => (
            <button
              key={topic}
              type="button"
              onClick={() => onTopicToggle(topic)}
              className={`p-2 rounded-md text-left text-xs font-medium transition-colors duration-200 ${
                selectedTopics.includes(topic)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
       {!isRelevant && (
            <p className="text-xs text-slate-400 mt-2">
                {t('grammarSelector.notApplicable')}
            </p>
        )}
    </div>
  );
};

export default GrammarSelectorPanel;