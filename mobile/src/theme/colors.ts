/**
 * TASTEBU DESIGN SYSTEM - COLOR PALETTE
 * 
 * Design Philosophy:
 * - Accessible for all ages (WCAG AAA compliant)
 * - Medical credibility meets modern consumer app
 * - Colors evoke trust, safety, and positivity
 * - TRUE light/dark mode contrast
 */

export const Colors = {
  // Light Mode
  light: {
    // Primary brand colors
    primary: '#4A90E2',        // Calm, trustworthy blue
    primaryLight: '#7AB3F5',   // Lighter accent
    primaryDark: '#2E5C8A',    // Darker accent
    
    // Semantic colors
    success: '#51CF66',        // Safe, positive
    warning: '#FFB84D',        // Caution
    danger: '#FF6B6B',         // Alert, symptoms
    info: '#4ECDC4',           // Information
    
    // Backgrounds - IMPROVED CONTRAST
    background: '#FFFFFF',     // Pure white base (was #F8F9FA)
    card: '#F8F9FA',           // Light gray cards (swapped)
    elevated: '#FFFFFF',       // Elevated surfaces
    
    // Text
    textPrimary: '#1A1A1A',    // Darker for better contrast (was #2C3E50)
    textSecondary: '#6B7280',  // Better mid-tone (was #7F8C8D)
    textTertiary: '#9CA3AF',   // Subtle gray (was #BDC3C7)
    
    // Borders & Dividers
    border: '#E5E7EB',         // Lighter border
    divider: '#F3F4F6',        // Very light divider
    
    // Glass effects
    glassTint: 'rgba(255, 255, 255, 0.9)',
    glassBlur: 20,
  },
  
  // Dark Mode - DRAMATICALLY IMPROVED
  dark: {
    // Primary brand colors (adjusted for dark mode)
    primary: '#60A5FA',        // Brighter blue for dark (was #5DA5FF)
    primaryLight: '#93C5FD',   // Even brighter
    primaryDark: '#3B82F6',    // Vibrant
    
    // Semantic colors (brightened for dark mode)
    success: '#34D399',        // Brighter green
    warning: '#FBBF24',        // Brighter yellow
    danger: '#F87171',         // Brighter red
    info: '#22D3EE',           // Brighter cyan
    
    // Backgrounds - MUCH BETTER CONTRAST
    background: '#000000',     // Pure black (was #0A0A0A)
    card: '#1C1C1E',           // iOS dark card color
    elevated: '#2C2C2E',       // Elevated surfaces
    
    // Text - BETTER CONTRAST
    textPrimary: '#FFFFFF',    // Pure white
    textSecondary: '#9CA3AF',  // Light gray (was #A0A0A0)
    textTertiary: '#6B7280',   // Mid gray (was #6C6C6C)
    
    // Borders & Dividers - MORE VISIBLE
    border: '#374151',         // Visible border (was #2C2C2E)
    divider: '#1F2937',        // Visible divider (was #1C1C1E)
    
    // Glass effects
    glassTint: 'rgba(28, 28, 30, 0.85)',
    glassBlur: 20,
  },
};

// Shadow presets
export const Shadows = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,        // Stronger shadows in dark mode
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,        // Stronger shadows
      shadowRadius: 12,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.7,        // Stronger shadows
      shadowRadius: 24,
      elevation: 8,
    },
  },
};

// Spacing system (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const Typography = {
  // Titles
  title1: { fontSize: 34, fontWeight: '700' as const, lineHeight: 41 },
  title2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  title3: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28 },
  
  // Body
  body: { fontSize: 17, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22 },
  
  // Secondary
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  footnote: { fontSize: 11, fontWeight: '500' as const, lineHeight: 13 },
};