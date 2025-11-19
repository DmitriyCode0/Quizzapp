import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { GenerationType, CEFRLevel, VocabularyChallenge, GrammarChallenge } from '../types';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';
import GrammarSelectorPanel from './GrammarSelectorPanel';
import { grammarPools } from '../data/grammarData';

interface InputScreenProps {
  onGenerate: (data: string, type: GenerationType, cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge, isTimed: boolean, customGrammarTopics?: string[]) => void;
  error: string | null;
}

const cefrOptions: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'A1 ukr'];
const vocabOptions: VocabularyChallenge[] = ['Basic', 'Standard', 'Advanced'];
const grammarOptions: GrammarChallenge[] = ['Simple', 'Standard', 'Complex'];

interface SettingsButtonProps<T extends string> {
  option: T;
  selected: T;
  onClick: Dispatch<SetStateAction<T>>;
  children: React.ReactNode;
}

const SettingsButton = <T extends string>({ option, selected, onClick, children }: SettingsButtonProps<T>) => {
  return (
    <button
        type="button"
        onClick={() => onClick(option)}
        className={`px-3 py-2 rounded-lg font-semibold transition-all text-sm flex-grow text-center shadow-sm ${
            selected === option
                ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-800'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
        }`}
    >
        {children}
    </button>
  );
}


const InputScreen: React.FC<InputScreenProps> = ({ onGenerate, error }) => {
  const [quizletData, setQuizletData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [generationType, setGenerationType] = useState<GenerationType | null>(null);
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [vocabChallenge, setVocabChallenge] = useState<VocabularyChallenge>('Standard');
  const [gramChallenge, setGramChallenge] = useState<GrammarChallenge>('Standard');
  const [isTimed, setIsTimed] = useState(false);
  const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>([]);
  const { t } = useTranslation();

  const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
  const availableGrammarTopics = grammarPools[effectiveCefrLevel] || [];

  useEffect(() => {
    // Set default random grammar topics when CEFR level changes
    const shuffled = [...availableGrammarTopics].sort(() => 0.5 - Math.random());
    setSelectedGrammarTopics(shuffled.slice(0, 3));
  }, [cefrLevel]);

  const handleTopicToggle = (topic: string) => {
    setSelectedGrammarTopics(prev => {
      if (prev.includes(topic)) {
        // Remove topic, but only if more than 1 is selected
        return prev.length > 1 ? prev.filter(t => t !== topic) : prev;
      } else {
        // Add topic, but only if less than 5 are selected
        return prev.length < 5 ? [...prev, topic] : prev;
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedGrammarTopics([]);
  };

  const handleCreateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizletData.trim()) {
      setShowModal(true);
    }
  };
  
  const handleGenerationTypeSelect = (type: GenerationType) => {
    setShowModal(false);
    const isQuiz = ['mcq', 'gap_fill', 'translate_uk_en'].includes(type);
    const isTranslationActivity = ['translate_uk_en', 'text_translation'].includes(type);
    
    onGenerate(
        quizletData, 
        type, 
        cefrLevel, 
        vocabChallenge, 
        gramChallenge, 
        isQuiz && isTimed, 
        isTranslationActivity ? selectedGrammarTopics : undefined
    );
  }
  
  const isGrammarPanelRelevant = generationType ? ['translate_uk_en', 'text_translation'].includes(generationType) : true;

  return (
    <>
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl animate-fade-in flex flex-col md:flex-row gap-8">
        <GrammarSelectorPanel
          availableTopics={availableGrammarTopics}
          selectedTopics={selectedGrammarTopics}
          onTopicToggle={handleTopicToggle}
          onClearSelection={handleClearSelection}
          isRelevant={isGrammarPanelRelevant}
        />

        <div className="flex-grow flex flex-col gap-6 text-center">
            <Logo />
            <h1 className="text-4xl font-bold text-indigo-400">VocabCrafter AI</h1>
            <p className="text-slate-300">
            {t('inputScreen.subtitle')}
            </p>
            
            <div className="text-left bg-slate-900 p-4 rounded-md border border-slate-700">
            <h2 className="font-semibold text-lg mb-2 text-slate-200">{t('inputScreen.instructionsTitle')}</h2>
            <ol className="list-decimal list-inside text-sm text-slate-400 space-y-2">
                <li>
                    {t('inputScreen.instruction1')}{' '}
                    <a 
                        href="https://gemini.google.com/gem/1dc4RQWRgZ4N1KOj8USv3PMxk94yCz9Pw?usp=sharing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline font-semibold"
                    >
                        {t('inputScreen.instruction1Link')}
                    </a>.
                </li>
                <li>{t('inputScreen.instruction2')}</li>
                <li>{t('inputScreen.instruction3')}</li>
                <li>{t('inputScreen.instruction4')}</li>
            </ol>
            </div>

            <form onSubmit={handleCreateClick} className="flex flex-col gap-4">
            <textarea
                value={quizletData}
                onChange={(e) => setQuizletData(e.target.value)}
                placeholder={t('inputScreen.textareaPlaceholder')}
                className="w-full h-48 p-4 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none"
            />
            <div className="flex flex-col gap-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <div className="flex flex-col gap-3">
                    <label className="font-semibold text-slate-300 text-sm text-left">{t('inputScreen.cefrLevel')}</label>
                    <div className="flex flex-wrap gap-2">
                        {cefrOptions.map(option => (
                            <SettingsButton<CEFRLevel> key={option} option={option} selected={cefrLevel} onClick={setCefrLevel}>
                                {option === 'A1 ukr' ? t('inputScreen.a1ukr') : option}
                            </SettingsButton>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <label className="font-semibold text-slate-300 text-sm text-left">{t('inputScreen.vocabChallenge')}</label>
                    <div className="flex flex-wrap gap-2">
                        {vocabOptions.map(option => (
                            <SettingsButton<VocabularyChallenge> key={option} option={option} selected={vocabChallenge} onClick={setVocabChallenge}>
                            {t(`vocabChallenge.${option.toLowerCase()}`, { defaultValue: option })}
                            </SettingsButton>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <label className="font-semibold text-slate-300 text-sm text-left">{t('inputScreen.grammarChallenge')}</label>
                    <div className="flex flex-wrap gap-2">
                        {grammarOptions.map(option => (
                            <SettingsButton<GrammarChallenge> key={option} option={option} selected={gramChallenge} onClick={setGramChallenge}>
                                {t(`grammarChallenge.${option.toLowerCase()}`, { defaultValue: option })}
                            </SettingsButton>
                        ))}
                    </div>
                </div>
            </div>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
                type="submit"
                disabled={!quizletData.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
                {t('common.create')}
            </button>
            </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-lg w-full flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-center text-indigo-400 mb-2">{t('inputScreen.modalTitle')}</h2>
            
            <div className="flex items-center justify-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700 mb-2">
                <span className="font-semibold text-slate-300">{t('inputScreen.timedMode')}</span>
                <span className="text-xs text-slate-400">{t('inputScreen.timedModeDesc')}</span>
                <button
                    type="button"
                    onClick={() => setIsTimed(!isTimed)}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 ${isTimed ? 'bg-indigo-600' : 'bg-slate-600'}`}
                    aria-pressed={isTimed}
                >
                    <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isTimed ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            </div>

            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
                <button
                    onClick={() => handleGenerationTypeSelect('flashcards')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.flashcardsTitle')}</h3>
                    <p className="text-slate-400">{t('inputScreen.flashcardsDesc')}</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('mcq')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.mcqTitle')}</h3>
                    
                </button>
                
                <button
                    onClick={() => handleGenerationTypeSelect('gap_fill')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.gapFillTitle')}</h3>
                    
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('translate_uk_en')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.translateSentencesTitle')}</h3>
                   
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('text_translation')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.textTranslationTitle')}</h3>
                    
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('translation_list')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.translationListTitle')}</h3>
                    <p className="text-slate-400">{t('inputScreen.translationListDesc')}</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('discussion')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.discussionTitle')}</h3>
                    <p className="text-slate-400">{t('inputScreen.discussionDesc')}</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('agree_disagree')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.agreeDisagreeTitle')}</h3>
                    <p className="text-slate-400">{t('inputScreen.agreeDisagreeDesc')}</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('matching')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">{t('inputScreen.matchingTitle')}</h3>
                    <p className="text-slate-400">{t('inputScreen.matchingDesc')}</p>
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputScreen;