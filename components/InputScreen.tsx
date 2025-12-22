
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GenerationType, CEFRLevel, VocabularyChallenge, GrammarChallenge, TeacherPersona } from '../types';
import Logo from './Logo';
import { useTranslation } from '../hooks/useTranslation';
import GrammarSelectorPanel from './GrammarSelectorPanel';
import HelpIcon from './icons/HelpIcon';
import Tooltip from './Tooltip';
import CloseIcon from './icons/CloseIcon';
import { useInputForm } from '../hooks/useInputForm';

import SmartParserPanel from './input/SmartParserPanel';
import ManualInputPanel from './input/ManualInputPanel';
import ConfigurationPanel from './input/ConfigurationPanel';
import ActivitySelectionModal from './input/ActivitySelectionModal';

interface InputScreenProps {
  initialData?: string;
  onGenerate: (data: string, type: GenerationType, cefrLevel: CEFRLevel, studentLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge, teacherPersona: TeacherPersona, isTimed: boolean, customGrammarTopics?: string[], customTopic?: string) => void;
  onOpenHelp: () => void;
  error: string | null;
}

const InputScreen: React.FC<InputScreenProps> = ({ initialData, onGenerate, onOpenHelp, error }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const {
      // Data
      quizletData, setQuizletData,
      rawInput, setRawInput,
      newListName, setNewListName,
      cefrLevel, setCefrLevel, // Grammar Topic Level
      studentLevel, setStudentLevel, // Student Proficiency Level
      vocabChallenge, setVocabChallenge,
      gramChallenge, setGramChallenge,
      teacherPersona, setTeacherPersona,
      isTimed, setIsTimed,
      customTopic, setCustomTopic,
      selectedGrammarTopics,
      availableGrammarTopics,
      
      // UI State
      isParsing,
      showModal, setShowModal,
      showSavePrompt, setShowSavePrompt,
      isGrammarMobileOpen, setIsGrammarMobileOpen,

      // Handlers
      handleParse,
      handleLoadSample,
      handleSaveList,
      handleGenerationTypeSelect,
      handleTopicToggle
  } = useInputForm({ onGenerate });

  // Update data from props if provided
  useEffect(() => {
    if (initialData) {
        setQuizletData(initialData);
    }
  }, [initialData, setQuizletData]);

  const handleCreateClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizletData.trim()) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-10 animate-fade-in">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <Logo className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">VocabCrafter AI</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('inputScreen.subtitle')}</p>
                </div>
            </div>

            {/* Top Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
                <button 
                    onClick={onOpenHelp}
                    className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                >
                    <HelpIcon className="h-4 w-4" />
                    {t('common.howItWorks')}
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                <button 
                    onClick={() => navigate('/grammar')}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"
                >
                    <span>{t('grammarLibrary.menuTitle')}</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">{t('common.new')}</span>
                </button>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow flex items-center gap-2"
                >
                    <span>{t('dashboard.myLibrary')}</span>
                </button>
            </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR (Config) - Spans 3 columns */}
            <div className="hidden md:flex md:col-span-3 flex-col gap-8 sticky top-8">
                {/* Topic Selector */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                            {t('topicSelector.title')}
                        </label>
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">{t('topicSelector.betaLabel')}</span>
                    </div>
                    <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder={t('topicSelector.placeholder')}
                        className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition shadow-sm"
                    />
                </div>

                {/* Grammar Panel */}
                <GrammarSelectorPanel
                    availableTopics={availableGrammarTopics}
                    selectedTopics={selectedGrammarTopics}
                    onTopicToggle={handleTopicToggle}
                    isRelevant={true}
                />
            </div>

            {/* MAIN CONTENT (Input) - Spans 9 columns */}
            <div className="md:col-span-9 flex flex-col gap-8">
                
                {/* Mobile Topic & Grammar Trigger */}
                <div className="md:hidden flex gap-2">
                     <input
                        type="text"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        placeholder={t('topicSelector.placeholder')}
                        className="flex-grow p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
                    />
                     <button 
                        type="button"
                        onClick={() => setIsGrammarMobileOpen(true)}
                        className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm relative active:bg-slate-50 dark:active:bg-slate-700"
                     >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        {selectedGrammarTopics.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                                {selectedGrammarTopics.length}
                            </span>
                        )}
                     </button>
                </div>

                <SmartParserPanel 
                    rawInput={rawInput}
                    onRawInputChange={setRawInput}
                    onParse={handleParse}
                    isParsing={isParsing}
                />

                <form onSubmit={handleCreateClick} className="flex flex-col gap-8">
                    <ManualInputPanel 
                        quizletData={quizletData}
                        onDataChange={setQuizletData}
                        onLoadSample={handleLoadSample}
                        onSavePrompt={() => setShowSavePrompt(true)}
                    />

                    <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                        <ConfigurationPanel 
                            cefrLevel={cefrLevel}
                            setCefrLevel={setCefrLevel}
                            studentLevel={studentLevel}
                            setStudentLevel={setStudentLevel}
                            vocabChallenge={vocabChallenge}
                            setVocabChallenge={setVocabChallenge}
                            gramChallenge={gramChallenge}
                            setGramChallenge={setGramChallenge}
                            teacherPersona={teacherPersona}
                            setTeacherPersona={setTeacherPersona}
                        />
                    </div>

                    {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-3 rounded-lg text-sm">{error}</div>}
                    
                    {/* Desktop Create Button */}
                    <div className="hidden md:block pt-4">
                         <button
                            type="submit"
                            disabled={!quizletData.trim()}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-lg flex items-center justify-center gap-2"
                        >
                            <span>{t('common.create')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>

      {/* MOBILE STICKY FOOTER */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button
                onClick={handleCreateClick}
                disabled={!quizletData.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
            >
                {t('common.create')}
            </button>
      </div>

      {/* MOBILE GRAMMAR DRAWER */}
      {isGrammarMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={() => setIsGrammarMobileOpen(false)}></div>
            <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-2xl sm:rounded-xl p-6 pointer-events-auto animate-slide-up shadow-2xl max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('grammarSelector.title')}</h3>
                    <button onClick={() => setIsGrammarMobileOpen(false)} className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-colors">
                        <CloseIcon />
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow mb-4 -mx-2 px-2">
                    <GrammarSelectorPanel
                        availableTopics={availableGrammarTopics}
                        selectedTopics={selectedGrammarTopics}
                        onTopicToggle={handleTopicToggle}
                        isRelevant={true}
                        className="w-full"
                    />
                </div>
                <button 
                    onClick={() => setIsGrammarMobileOpen(false)}
                    className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-md"
                >
                    {t('common.done')}
                </button>
            </div>
        </div>
      )}

      {/* SAVE LIST PROMPT */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in px-4" onClick={() => setShowSavePrompt(false)}>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 max-w-sm w-full flex flex-col gap-4 border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('dashboard.saveListTitle')}</h3>
                <input 
                    type="text" 
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder={t('dashboard.listNamePlaceholder')}
                    className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900 dark:text-white"
                    autoFocus
                />
                <div className="flex gap-3 mt-2">
                    <button onClick={() => setShowSavePrompt(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg font-medium transition-colors">{t('common.cancel')}</button>
                    <button onClick={handleSaveList} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors">{t('common.save')}</button>
                </div>
            </div>
        </div>
      )}

      <ActivitySelectionModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleGenerationTypeSelect}
        isTimed={isTimed}
        setIsTimed={setIsTimed}
      />
    </>
  );
};

export default InputScreen;
