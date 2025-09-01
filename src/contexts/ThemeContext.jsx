import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the ThemeContext
export const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Return true if saved theme is 'dark' or if no theme is saved and user prefers dark mode
      return savedTheme 
        ? savedTheme === 'dark' 
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Effect to update the HTML class and localStorage when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Update the HTML class
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save the theme preference to localStorage
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }
  }, [isDarkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Function to set specific theme
  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  // Context value
  const value = {
    isDarkMode,
    toggleDarkMode,
    setTheme,
    theme: isDarkMode ? 'dark' : 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;