import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.resolvedLanguage === 'hi' || i18n.language === 'hi';

  const handleToggle = () => {
    const nextLang = isHindi ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="flex items-center gap-1.5 select-none">
      {/* English Label */}
      <span className={`text-[11px] sm:text-xs font-bold transition-colors ${!isHindi ? 'text-[#0055A4]' : 'text-gray-400'}`}>
        EN
      </span>

      {/* SVG Path Toggle Switch */}
      <div className="lang-toggle-wrapper">
        <input 
          id="lang-check" 
          type="checkbox" 
          checked={isHindi} 
          onChange={handleToggle} 
        />
        <label className="switch" htmlFor="lang-check" aria-label="Toggle language">
          <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
            <path
              pathLength="360"
              fill="none"
              stroke="currentColor"
              d="M 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 A 42.24 42.24 90 0 0 84.4992 42.2496 A 42.24 42.24 90 0 0 42.2496 0 A 42.24 42.24 90 0 0 0 42.2496 A 42.24 42.24 90 0 0 42.2496 84.4688 L 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 A 42.24 42.24 90 0 0 128 42.2496 A 42.24 42.24 90 0 0 170.2496 84.4688 A 42.24 42.24 90 0 0 212.4992 42.2496 A 42.24 42.24 90 0 0 170.2496 0 L 42.2496 0"
            />
          </svg>
        </label>
      </div>

      {/* Hindi Label */}
      <span className={`text-[11px] sm:text-xs font-bold transition-colors ${isHindi ? 'text-[#E31837]' : 'text-gray-400'}`}>
        हि
      </span>
    </div>
  );
};

export default LanguageSwitcher;