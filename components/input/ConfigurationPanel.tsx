
import React from 'react';
import Tooltip from '../Tooltip';
import SettingsButton from '../SettingsButton';
import { useTranslation } from '../../hooks/useTranslation';
import { CEFRLevel, VocabularyChallenge, GrammarChallenge, TeacherPersona } from '../../types';

interface ConfigurationPanelProps {
    cefrLevel: CEFRLevel;
    setCefrLevel: React.Dispatch<React.SetStateAction<CEFRLevel>>;
    studentLevel: CEFRLevel;
    setStudentLevel: React.Dispatch<React.SetStateAction<CEFRLevel>>;
    vocabChallenge: VocabularyChallenge;
    setVocabChallenge: React.Dispatch<React.SetStateAction<VocabularyChallenge>>;
    gramChallenge: GrammarChallenge;
    setGramChallenge: React.Dispatch<React.SetStateAction<GrammarChallenge>>;
    teacherPersona: TeacherPersona;
    setTeacherPersona: React.Dispatch<React.SetStateAction<TeacherPersona>>;
}

const cefrOptions: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', /*'C2', 'A1 ukr'*/];
const studentOptions: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', /*'C2'*/];
const vocabOptions: VocabularyChallenge[] = ['Basic', 'Standard', 'Advanced'];
const grammarOptions: GrammarChallenge[] = ['Simple', 'Standard', 'Complex'];
const teacherOptions: TeacherPersona[] = ['learning', 'standard', 'strict'];

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    cefrLevel, setCefrLevel,
    studentLevel, setStudentLevel,
    vocabChallenge, setVocabChallenge,
    gramChallenge, setGramChallenge,
    teacherPersona, setTeacherPersona
}) => {
    const { t } = useTranslation();

    const getCefrVariant = (level: CEFRLevel) => {
        if (level.startsWith('A')) return 'emerald';
        if (level.startsWith('B')) return 'blue';
        if (level.startsWith('C')) return 'violet';
        return 'indigo';
    };

    const getDifficultyVariant = (option: string) => {
        if (['Basic', 'Simple', 'learning'].includes(option)) return 'emerald'; // Easy -> Green
        if (['Standard', 'standard'].includes(option)) return 'blue'; // Standard -> Blue
        if (['Advanced', 'Complex', 'strict'].includes(option)) return 'rose'; // Hard -> Red
        return 'indigo';
    };

    const getBorderColor = (variant: string) => {
        switch (variant) {
            case 'emerald': return 'border-emerald-200 dark:border-emerald-800';
            case 'blue': return 'border-blue-200 dark:border-blue-800';
            case 'rose': return 'border-rose-200 dark:border-rose-800';
            default: return 'border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Grammar Level Section */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{t('inputScreen.cefrLevel')}</label>
                    <Tooltip text={t('inputScreen.cefrTooltip')} position="top" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {cefrOptions.map(option => (
                        <React.Fragment key={option}>
                            <SettingsButton 
                                option={option} 
                                selected={cefrLevel} 
                                onClick={setCefrLevel}
                                variant={getCefrVariant(option)}
                                children={option === 'A1 ukr' ? t('inputScreen.a1ukr') : option}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Student Level Section */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{t('inputScreen.studentLevel')}</label>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">NEW</span>
                    <Tooltip text={t('inputScreen.studentLevelTooltip')} position="top" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {studentOptions.map(option => (
                        <React.Fragment key={option}>
                            <SettingsButton 
                                option={option} 
                                selected={studentLevel} 
                                onClick={setStudentLevel}
                                variant={getCefrVariant(option)}
                                children={option}
                            />
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Teacher Persona Section (New) */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{t('inputScreen.teacherPersona')}</label>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">BETA</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {teacherOptions.map(option => (
                        <React.Fragment key={option}>
                            <SettingsButton 
                                option={option} 
                                selected={teacherPersona} 
                                onClick={setTeacherPersona}
                                variant={getDifficultyVariant(option)}
                                children={t(`teacherPersona.${option}`)}
                            />
                        </React.Fragment>
                    ))}
                </div>
                <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-2 border-l-2 ${getBorderColor(getDifficultyVariant(teacherPersona))}`}>
                    {t(`teacherDescription.${teacherPersona}`)}
                </p>
            </div>

            {/* Vocab & Grammar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vocabulary Challenge Section */}
                <div className="flex flex-col gap-3">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{t('inputScreen.vocabChallenge')}</label>
                    <div className="flex flex-wrap gap-2">
                        {vocabOptions.map(option => (
                            <React.Fragment key={option}>
                                <SettingsButton 
                                    option={option} 
                                    selected={vocabChallenge} 
                                    onClick={setVocabChallenge}
                                    variant={getDifficultyVariant(option)}
                                    children={t(`vocabChallenge.${option.toLowerCase()}`, { defaultValue: option })}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-2 border-l-2 ${getBorderColor(getDifficultyVariant(vocabChallenge))}`}>
                        {t(`vocabDescription.${vocabChallenge.toLowerCase()}`)}
                    </p>
                </div>

                {/* Grammar Challenge Section */}
                <div className="flex flex-col gap-3">
                    <label className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{t('inputScreen.grammarChallenge')}</label>
                    <div className="flex flex-wrap gap-2">
                        {grammarOptions.map(option => (
                            <React.Fragment key={option}>
                                <SettingsButton 
                                    option={option} 
                                    selected={gramChallenge} 
                                    onClick={setGramChallenge}
                                    variant={getDifficultyVariant(option)}
                                    children={t(`grammarChallenge.${option.toLowerCase()}`, { defaultValue: option })}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <p className={`text-xs text-slate-500 dark:text-slate-400 leading-relaxed pl-2 border-l-2 ${getBorderColor(getDifficultyVariant(gramChallenge))}`}>
                        {t(`grammarDescription.${gramChallenge.toLowerCase()}`)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationPanel;
