import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language || 'en';

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${
          currentLang.startsWith('en')
            ? 'bg-black text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('hi')}
        className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${
          currentLang.startsWith('hi')
            ? 'bg-black text-white'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        हि
      </button>
    </div>
  );
};