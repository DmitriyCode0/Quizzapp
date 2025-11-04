import React, { useState } from 'react';
import { GenerationType, CEFRLevel, VocabularyChallenge, GrammarChallenge } from '../types';

interface InputScreenProps {
  onGenerate: (data: string, type: GenerationType, cefrLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge, isTimed: boolean) => void;
  error: string | null;
}

const cefrOptions: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'A1 ukr'];
const vocabOptions: VocabularyChallenge[] = ['Basic', 'Standard', 'Advanced'];
const grammarOptions: GrammarChallenge[] = ['Simple', 'Standard', 'Complex'];

// FIX: Refactored SettingsButton to be a const with an arrow function.
// The function declaration syntax was causing issues with TypeScript's JSX type checking for the 'key' prop on generic components.
interface SettingsButtonProps<T extends string> {
  option: T;
  selected: T;
  onClick: (option: T) => void;
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
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('B1');
  const [vocabChallenge, setVocabChallenge] = useState<VocabularyChallenge>('Standard');
  const [gramChallenge, setGramChallenge] = useState<GrammarChallenge>('Standard');
  const [isTimed, setIsTimed] = useState(false);

  const handleCreateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizletData.trim()) {
      setShowModal(true);
    }
  };
  
  const handleGenerationTypeSelect = (type: GenerationType) => {
    setShowModal(false);
    // Timed mode is only applicable for rapid-fire quizzes, not for more thoughtful exercises like text translation.
    const isQuiz = ['mcq', 'gap_fill', 'translate_uk_en'].includes(type);
    onGenerate(quizletData, type, cefrLevel, vocabChallenge, gramChallenge, isQuiz && isTimed);
  }

  return (
    <>
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl animate-fade-in text-center flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-indigo-400">Quizlet AI Activity Generator</h1>
        <p className="text-slate-300">
          Transform your Quizlet sets into interactive quizzes, discussion prompts, and more!
        </p>
        
        <div className="text-left bg-slate-900 p-4 rounded-md border border-slate-700">
          <h2 className="font-semibold text-lg mb-2 text-slate-200">Instructions:</h2>
          <ol className="list-decimal list-inside text-sm text-slate-400 space-y-1">
              <li>Go to your set on Quizlet.</li>
              <li>Click the "..." (More) button and select "Export".</li>
              <li>Under "Between term and definition", choose "Tab".</li>
              <li>Click "Copy text" and paste it into the box below.</li>
          </ol>
        </div>

        <form onSubmit={handleCreateClick} className="flex flex-col gap-4">
          <textarea
              value={quizletData}
              onChange={(e) => setQuizletData(e.target.value)}
              placeholder="Paste your Quizlet data here..."
              className="w-full h-48 p-4 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-200 resize-none"
          />
          <div className="flex flex-col gap-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
             <div className="flex flex-col gap-3">
                 <label className="font-semibold text-slate-300 text-sm text-left">CEFR Level</label>
                 <div className="flex flex-wrap gap-2">
                    {cefrOptions.map(option => (
                        // FIX: Wrap state setter in an arrow function to ensure type compatibility with the onClick prop.
                        <SettingsButton key={option} option={option} selected={cefrLevel} onClick={(option) => setCefrLevel(option)}>
                            {option === 'A1 ukr' ? 'A1 (Ukr)' : option}
                        </SettingsButton>
                    ))}
                 </div>
             </div>
             <div className="flex flex-col gap-3">
                <label className="font-semibold text-slate-300 text-sm text-left">Vocabulary Challenge</label>
                 <div className="flex flex-wrap gap-2">
                    {vocabOptions.map(option => (
                        // FIX: Wrap state setter in an arrow function to ensure type compatibility with the onClick prop.
                        <SettingsButton key={option} option={option} selected={vocabChallenge} onClick={(option) => setVocabChallenge(option)}>
                           {option}
                        </SettingsButton>
                    ))}
                </div>
             </div>
             <div className="flex flex-col gap-3">
                <label className="font-semibold text-slate-300 text-sm text-left">Grammar Challenge</label>
                <div className="flex flex-wrap gap-2">
                    {grammarOptions.map(option => (
                        // FIX: Wrap state setter in an arrow function to ensure type compatibility with the onClick prop.
                        <SettingsButton key={option} option={option} selected={gramChallenge} onClick={(option) => setGramChallenge(option)}>
                            {option}
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
            Create
          </button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-slate-800 rounded-lg shadow-2xl p-8 max-w-lg w-full flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-center text-indigo-400 mb-2">What would you like to create?</h2>
            
            <div className="flex items-center justify-center gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700 mb-2">
                <span className="font-semibold text-slate-300">Timed Mode</span>
                <span className="text-xs text-slate-400">(for quizzes)</span>
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
                    onClick={() => handleGenerationTypeSelect('mcq')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Multiple Choice Quiz (Level 1)</h3>
                    
                </button>
                
                <button
                    onClick={() => handleGenerationTypeSelect('gap_fill')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Gap-fill Exercise (Level 2)</h3>
                    
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('translate_uk_en')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Translate Sentences Ukr {'>'} EN (Level 3)</h3>
                   
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('text_translation')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Text Translation Ukr {'>'} EN (Level 3)</h3>
                    
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('translation_list')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">List of Sentences for Translation (Homework)</h3>
                    <p className="text-slate-400">Generate 15 Ukrainian sentences to translate.</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('discussion')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Discussion Questions (Live)</h3>
                    <p className="text-slate-400">Generate open-ended questions to spark conversation.</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('agree_disagree')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Agree/Disagree Statements (Live)</h3>
                    <p className="text-slate-400">Create debatable statements to encourage critical thinking.</p>
                </button>
                <button
                    onClick={() => handleGenerationTypeSelect('matching')}
                    className="text-left w-full p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                >
                    <h3 className="text-xl font-bold text-slate-100">Matching Exercise</h3>
                    <p className="text-slate-400">Connect terms with their definitions (6 pairs).</p>
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputScreen;