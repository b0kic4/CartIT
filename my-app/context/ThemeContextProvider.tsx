// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme, lightTheme, darkTheme } from "../assets/themes/themes";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedThemePreference = await AsyncStorage.getItem(
          "themePreference"
        );
        if (storedThemePreference) {
          setIsDarkMode(storedThemePreference === "dark");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(
          "themePreference",
          isDarkMode ? "dark" : "light"
        );
      } catch (error) {
        console.error("Error saving theme preference:", error);
      }
    };

    saveThemePreference();
  }, [isDarkMode]);

  const theme: Theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
