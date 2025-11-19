import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }

  const { translations, fallbackTranslations } = context;

  const t = (key: string, options?: Record<string, string | number>): string => {
    // Try to get translation from the current language
    let translation = key.split('.').reduce((acc, currentKey) => acc?.[currentKey], translations) as string | undefined;

    // Fallback to English if key is not found in the current language
    if (translation === undefined) {
        translation = key.split('.').reduce((acc, currentKey) => acc?.[currentKey], fallbackTranslations) as string | undefined;
    }

    // If still not found, return the key itself
    if (translation === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
    }
    
    // Replace placeholders like {{variable}}
    if (options) {
      Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`{{${optionKey}}}`, 'g');
        translation = (translation as string).replace(regex, String(options[optionKey]));
      });
    }

    return translation;
  };

  return { ...context, t };
};
