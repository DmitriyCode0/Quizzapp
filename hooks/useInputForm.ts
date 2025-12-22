
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GenerationType, CEFRLevel, VocabularyChallenge, GrammarChallenge, TeacherPersona } from '../types';
import { grammarPools } from '../data/grammarData';
import { parseRawInput } from '../services/geminiService';
import { saveList } from '../services/storageService';
import { getSampleForLevel } from '../data/sampleData';

interface UseInputFormProps {
    onGenerate: (data: string, type: GenerationType, cefrLevel: CEFRLevel, studentLevel: CEFRLevel, vocabChallenge: VocabularyChallenge, gramChallenge: GrammarChallenge, teacherPersona: TeacherPersona, isTimed: boolean, customGrammarTopics?: string[], customTopic?: string) => void;
}

export const useInputForm = ({ onGenerate }: UseInputFormProps) => {
    const location = useLocation();
    
    // --- State Initialization with Persistence ---
    // Note: cefrLevel determines the GRAMMAR TOPIC POOL
    const [cefrLevel, setCefrLevel] = useState<CEFRLevel>(() => 
        (localStorage.getItem('input_cefrLevel') as CEFRLevel) || 'B1'
    );

    // Note: studentLevel determines the general COMPLEXITY of sentences
    const [studentLevel, setStudentLevel] = useState<CEFRLevel>(() => 
        (localStorage.getItem('input_studentLevel') as CEFRLevel) || 'B1'
    );
    
    const [vocabChallenge, setVocabChallenge] = useState<VocabularyChallenge>(() => 
        (localStorage.getItem('input_vocabChallenge') as VocabularyChallenge) || 'Standard'
    );
    
    const [gramChallenge, setGramChallenge] = useState<GrammarChallenge>(() => 
        (localStorage.getItem('input_gramChallenge') as GrammarChallenge) || 'Standard'
    );

    const [teacherPersona, setTeacherPersona] = useState<TeacherPersona>(() => {
        const saved = localStorage.getItem('input_teacherPersona');
        // Handle legacy 'supportive' string by defaulting to 'learning'
        if (saved === 'supportive') return 'learning';
        return (saved as TeacherPersona) || 'standard';
    });
    
    const [isTimed, setIsTimed] = useState(() => 
        localStorage.getItem('input_isTimed') === 'true'
    );
    
    const [customTopic, setCustomTopic] = useState(() => 
        localStorage.getItem('input_customTopic') || ''
    );
    
    const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('input_selectedGrammarTopics');
            if (saved) return JSON.parse(saved);
            // Return sentinel to trigger auto-selection on fresh load
            return ['__INITIAL__']; 
        } catch (e) {
            return ['__INITIAL__'];
        }
    });

    const [quizletData, setQuizletData] = useState('');
    const [rawInput, setRawInput] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSavePrompt, setShowSavePrompt] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [isGrammarMobileOpen, setIsGrammarMobileOpen] = useState(false);

    // The pool of available topics depends on the selected GRAMMAR LEVEL (cefrLevel), not student proficiency
    const effectiveCefrLevel = cefrLevel === 'A1 ukr' ? 'A1' : cefrLevel;
    const availableGrammarTopics = grammarPools[effectiveCefrLevel] || [];
    
    // Track previous level to detect changes
    const prevCefrLevelRef = useRef(cefrLevel);

    // --- Persistence Effects ---
    useEffect(() => localStorage.setItem('input_cefrLevel', cefrLevel), [cefrLevel]);
    useEffect(() => localStorage.setItem('input_studentLevel', studentLevel), [studentLevel]);
    useEffect(() => localStorage.setItem('input_vocabChallenge', vocabChallenge), [vocabChallenge]);
    useEffect(() => localStorage.setItem('input_gramChallenge', gramChallenge), [gramChallenge]);
    useEffect(() => localStorage.setItem('input_teacherPersona', teacherPersona), [teacherPersona]);
    useEffect(() => localStorage.setItem('input_isTimed', String(isTimed)), [isTimed]);
    useEffect(() => localStorage.setItem('input_customTopic', customTopic), [customTopic]);
    useEffect(() => {
        // Don't save the sentinel value
        if (selectedGrammarTopics.length === 1 && selectedGrammarTopics[0] === '__INITIAL__') return;
        localStorage.setItem('input_selectedGrammarTopics', JSON.stringify(selectedGrammarTopics));
    }, [selectedGrammarTopics]);

    // Check if we navigated here with state (e.g. from Practice Loop or Loading List)
    useEffect(() => {
        const state = location.state as any;
        
        // Practice Loop from Library
        if (state?.practiceTopic && state?.practiceLevel) {
            setCefrLevel(state.practiceLevel);
            // Small timeout to ensure options are loaded before setting selection
            setTimeout(() => {
                setSelectedGrammarTopics([state.practiceTopic]);
                // Clear history state to prevent re-triggering on refresh
                window.history.replaceState({}, document.title);
            }, 100);
        }
        // Load List from Dashboard
        if (state?.loadListData) {
            setQuizletData(state.loadListData);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Intelligent Grammar Topic Handling
    useEffect(() => {
        const state = location.state as any;
        if (state?.practiceTopic) return;

        // Handle initial load (sentinel value)
        if (selectedGrammarTopics.length === 1 && selectedGrammarTopics[0] === '__INITIAL__') {
             const shuffled = [...availableGrammarTopics].sort(() => 0.5 - Math.random());
             setSelectedGrammarTopics(shuffled.slice(0, 1));
             return;
        }

        const levelChanged = prevCefrLevelRef.current !== cefrLevel;
        prevCefrLevelRef.current = cefrLevel;

        // Check if current selection is valid for the (potentially new) pool
        const isTopicValid = selectedGrammarTopics.length > 0 && availableGrammarTopics.includes(selectedGrammarTopics[0]);

        if (levelChanged) {
            // If level changed, pick 1 random topic from new pool
            const shuffled = [...availableGrammarTopics].sort(() => 0.5 - Math.random());
            setSelectedGrammarTopics(shuffled.slice(0, 1));
        } else {
            // If level didn't change, but selection is invalid (e.g. empty), fix it
            if (!isTopicValid) {
                 const shuffled = [...availableGrammarTopics].sort(() => 0.5 - Math.random());
                 setSelectedGrammarTopics(shuffled.slice(0, 1));
            }
        }
        
    }, [cefrLevel, availableGrammarTopics, selectedGrammarTopics]); 

    const handleTopicToggle = (topic: string) => {
        // Always set exactly one topic
        setSelectedGrammarTopics([topic]);
    };

    const handleGenerationTypeSelect = (type: GenerationType) => {
        setShowModal(false);
        const isQuiz = ['mcq', 'gap_fill', 'translate_uk_en'].includes(type);
        const isTranslationActivity = ['translate_uk_en', 'text_translation'].includes(type);
        
        // Clean sentinel before sending
        const finalTopics = (selectedGrammarTopics.length === 1 && selectedGrammarTopics[0] === '__INITIAL__') 
            ? [] 
            : selectedGrammarTopics;

        onGenerate(
            quizletData,
            type,
            cefrLevel, // Grammar Topic Level
            studentLevel, // Student Proficiency Level
            vocabChallenge,
            gramChallenge,
            teacherPersona,
            isQuiz && isTimed,
            isTranslationActivity ? finalTopics : undefined,
            customTopic
        );
    };

    const handleSaveList = () => {
        if (!newListName.trim()) return;
        saveList(newListName, quizletData);
        setShowSavePrompt(false);
        setNewListName('');
    };

    const handleParse = async () => {
        if (!rawInput.trim()) return;
        setIsParsing(true);
        try {
            const parsed = await parseRawInput(rawInput);
            setQuizletData(parsed);
        } catch (error) {
            console.error("Failed to parse notes", error);
        } finally {
            setIsParsing(false);
        }
    };

    const handleLoadSample = useCallback(() => {
        // Load sample based on Grammar Level as it dictates the topics usually
        const sampleText = getSampleForLevel(cefrLevel);
        setQuizletData(sampleText);
    }, [cefrLevel]);

    return {
        // Data
        quizletData, setQuizletData,
        rawInput, setRawInput,
        newListName, setNewListName,
        cefrLevel, setCefrLevel, // Grammar Level
        studentLevel, setStudentLevel, // Student Level
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
    };
};
