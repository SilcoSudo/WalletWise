import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const setTheme = (darkMode) => {
    setIsDarkMode(darkMode);
  };

  return {
    isDarkMode,
    toggleTheme,
    setTheme
  };
};
