import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';

export type Language = 'en' | 'uk';

interface AllTranslations {
  en: Record<string, any>;
  uk: Record<string, any>;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  translations: Record<string, any>;
  fallbackTranslations: Record<string, any>;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [allTranslations, setAllTranslations] = useState<AllTranslations | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const [enResponse, ukResponse] = await Promise.all([
          fetch('/i18n/en.json'),
          fetch('/i18n/uk.json')
        ]);
        if (!enResponse.ok || !ukResponse.ok) {
            throw new Error('Failed to load translation files');
        }
        const enData = await enResponse.json();
        const ukData = await ukResponse.json();
        setAllTranslations({ en: enData, uk: ukData });
      } catch (error) {
        console.error("Error fetching translation data:", error);
        // Fallback to empty objects to prevent app crash
        setAllTranslations({ en: {}, uk: {} });
      }
    };
    fetchTranslations();
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prevLang => (prevLang === 'en' ? 'uk' : 'en'));
  }, []);

  if (!allTranslations) {
    // Render nothing until the translation files are loaded
    return null; 
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    translations: allTranslations[language],
    fallbackTranslations: allTranslations.en,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
