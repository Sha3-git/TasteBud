import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Appearance, AppState, AppStateStatus } from 'react-native';
import { Colors, Shadows } from './colors';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: typeof Colors.light;
  shadows: typeof Shadows.light;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [currentColorScheme, setCurrentColorScheme] = useState(Appearance.getColorScheme());
  
  console.log('🎨 Initial Color Scheme:', Appearance.getColorScheme());
  
  // Listen to Appearance changes
  useEffect(() => {
    // Set initial value
    setCurrentColorScheme(Appearance.getColorScheme());
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('🔔 Appearance changed to:', colorScheme);
      setCurrentColorScheme(colorScheme);
    });
    
    return () => subscription.remove();
  }, []);
  
  // Also check when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const scheme = Appearance.getColorScheme();
        console.log('📱 App active, current scheme:', scheme);
        setCurrentColorScheme(scheme);
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, []);
  
  // Determine if dark mode
  const isDark = useMemo(() => {
    const dark = mode === 'auto' 
      ? currentColorScheme === 'dark'
      : mode === 'dark';
    console.log('🌓 isDark:', dark, '| currentColorScheme:', currentColorScheme);
    return dark;
  }, [mode, currentColorScheme]);
  
  const theme = useMemo(() => {
    const selectedTheme = isDark ? Colors.dark : Colors.light;
    console.log('🎨 Theme selected:', isDark ? 'DARK 🌙' : 'LIGHT ☀️');
    return selectedTheme;
  }, [isDark]);
  
  const shadows = useMemo(() => {
    return isDark ? Shadows.dark : Shadows.light;
  }, [isDark]);
  
  const value = useMemo(() => ({
    theme,
    shadows,
    mode,
    setMode,
    isDark,
  }), [theme, shadows, mode, isDark]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}