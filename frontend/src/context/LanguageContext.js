import React, { createContext, useState, useEffect } from 'react';
import en from '../i18n/locales/en.json';
import hi from '../i18n/locales/hi.json';
import te from '../i18n/locales/te.json';

export const LanguageContext = createContext();

const translations = { en, hi, te };

export const LanguageProvider = ({ children }) => {
  // Initialize from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && translations[savedLanguage] ? savedLanguage : 'en';
  });

  // Persist language preference to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function with fallback to English
  const t = (key) => {
    const translation = translations[language]?.[key];
    
    // Warn in development if translation is missing
    if (!translation && process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key: "${key}" in language: "${language}"`);
    }
    
    // Return: current language translation > English fallback > key itself
    return translation || translations.en?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};