import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const COLORS = {
  background: '#ffffff',   
  surface: '#ffffff',      
  primary: '#000000',      
  secondary: '#5e5e5e',    
  containerLow: '#f3f3f4', 
  containerHigh: '#e8e8e8',
  border: '#000000',       
  borderLight: '#e0e0e0',  
  danger: '#ff2222',       
  success: '#2e7d32',      
  textPrimary: '#000000',
  textSecondary: '#666666',
  textMuted: '#8c8c8c'
};

export const HIGH_CONTRAST_COLORS = {
  background: '#ffffff',
  surface: '#ffffff',
  primary: '#000000',
  secondary: '#000000',
  containerLow: '#ffffff',
  containerHigh: '#f0f0f0',
  border: '#000000',
  borderLight: '#000000',
  danger: '#cc0000',
  success: '#006600',
  textPrimary: '#000000',
  textSecondary: '#000000',
  textMuted: '#333333'
};

export const THEME_PRESETS = {
  DEFAULT: { id: 'DEFAULT', name: 'Architectural Wireframe', primary: '#000000', border: '#000000', surface: '#ffffff' },
  SLATE: { id: 'SLATE', name: 'Blueprint Slate', primary: '#1e293b', border: '#334155', surface: '#ffffff' },
  OBSIDIAN: { id: 'OBSIDIAN', name: 'Obsidian Minimal', primary: '#0f172a', border: '#0f172a', surface: '#f8fafc' },
  CRIMSON: { id: 'CRIMSON', name: 'Crimson Accent', primary: '#881337', border: '#4c0519', surface: '#ffffff' },
};

const ThemeContext = createContext({
  theme: COLORS,
  highContrast: false,
  activePreset: 'DEFAULT',
  setPreset: () => {},
  toggleHighContrast: () => {},
  resetToDefault: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(COLORS);
  const [highContrast, setHighContrast] = useState(false);
  const [activePreset, setActivePreset] = useState('DEFAULT');

  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const [savedPreset, savedContrast] = await Promise.all([
          AsyncStorage.getItem('rankcine_theme_preset'),
          AsyncStorage.getItem('rankcine_high_contrast')
        ]);

        const isContrast = savedContrast === 'true';
        setHighContrast(isContrast);

        if (isContrast) {
          setTheme(HIGH_CONTRAST_COLORS);
        } else if (savedPreset && THEME_PRESETS[savedPreset]) {
          setActivePreset(savedPreset);
          const p = THEME_PRESETS[savedPreset];
          setTheme({ ...COLORS, primary: p.primary, border: p.border });
        }
      } catch (err) {
        console.warn('Failed to load theme preferences:', err);
      }
    };

    loadThemePreferences();
  }, []);

  const setPreset = async (presetKey) => {
    if (!THEME_PRESETS[presetKey]) return;
    try {
      setActivePreset(presetKey);
      await AsyncStorage.setItem('rankcine_theme_preset', presetKey);
      if (!highContrast) {
        const p = THEME_PRESETS[presetKey];
        setTheme({ ...COLORS, primary: p.primary, border: p.border });
      }
    } catch (err) {
      console.warn('Failed to save preset:', err);
    }
  };

  const toggleHighContrast = async () => {
    try {
      const nextVal = !highContrast;
      setHighContrast(nextVal);
      await AsyncStorage.setItem('rankcine_high_contrast', String(nextVal));

      if (nextVal) {
        setTheme(HIGH_CONTRAST_COLORS);
      } else {
        const p = THEME_PRESETS[activePreset] || THEME_PRESETS.DEFAULT;
        setTheme({ ...COLORS, primary: p.primary, border: p.border });
      }
    } catch (err) {
      console.warn('Failed to toggle high contrast:', err);
    }
  };

  const resetToDefault = async () => {
    try {
      setHighContrast(false);
      setActivePreset('DEFAULT');
      setTheme(COLORS);
      await Promise.all([
        AsyncStorage.removeItem('rankcine_theme_preset'),
        AsyncStorage.removeItem('rankcine_high_contrast')
      ]);
    } catch (err) {
      console.warn('Failed to reset theme:', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, highContrast, activePreset, setPreset, toggleHighContrast, resetToDefault }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);