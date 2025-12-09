import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: {
    backgroundColor: string;
    textColor: string;
    cardBackground: string;
    cardColor: string;
    buttonBackground: string;
    buttonColor: string;
    borderColor: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme preference from storage on initial load
  useEffect(() => {
    const loadThemePreference = async () => {
      // For now, we'll default to light mode, but in a full implementation
      // we would load from AsyncStorage
      const savedTheme = 'light'; // localStorage equivalent would go here
      setIsDarkMode(savedTheme === 'dark');
    };

    loadThemePreference();
  }, []);

  // Toggle theme and save preference
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      // In a full implementation, we would save to AsyncStorage
      // await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  // Define theme colors
  const theme = {
    backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
    textColor: isDarkMode ? '#ffffff' : '#333333',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    cardColor: isDarkMode ? '#ffffff' : '#333333',
    buttonBackground: isDarkMode ? '#4a4a4a' : '#007AFF',
    buttonColor: isDarkMode ? '#ffffff' : '#ffffff',
    borderColor: isDarkMode ? '#444444' : '#dddddd',
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};