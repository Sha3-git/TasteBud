/**
 * LIQUID GLASS TAB BAR
 * Professional, subtle, accessible
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

interface Tab {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFilled: keyof typeof Ionicons.glyphMap;
  label: string;
}

interface LiquidGlassTabBarProps {
  tabs: Tab[];
  selectedTab: string;
  onTabPress: (tabId: string) => void;
}

const { width } = Dimensions.get('window');

export function LiquidGlassTabBar({ tabs, selectedTab, onTabPress }: LiquidGlassTabBarProps) {
  const { theme, shadows, isDark } = useTheme();
  const selectedIndex = tabs.findIndex(t => t.id === selectedTab);
  
  // Animated value for indicator position
  const indicatorPosition = useRef(new Animated.Value(selectedIndex)).current;
  
  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: selectedIndex,
      useNativeDriver: true,
      damping: 20,
      stiffness: 200,
    }).start();
  }, [selectedIndex]);
  
  const tabWidth = (width - 48) / tabs.length;
  
  return (
    <View style={[styles.container, shadows.large]}>
      {/* Glass background with blur */}
      <BlurView
        intensity={isDark ? 80 : 60}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <LinearGradient
          colors={isDark 
            ? ['rgba(28, 28, 30, 0.9)', 'rgba(44, 44, 46, 0.8)']
            : ['rgba(255, 255, 255, 0.95)', 'rgba(248, 249, 250, 0.9)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderColor: theme.border }]}
        >
          {/* Morphing indicator */}
          
          
          
          {/* Tab buttons */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                isSelected={tab.id === selectedTab}
                onPress={() => onTabPress(tab.id)}
              />
            ))}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

function TabButton({ 
  tab, 
  isSelected, 
  onPress 
}: { 
  tab: Tab; 
  isSelected: boolean; 
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };
  
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabContent, { transform: [{ scale }] }]}>
        <Ionicons
          name={isSelected ? tab.iconFilled : tab.icon}
          size={24}
          color={isSelected ? theme.primary : theme.textSecondary}
        />
        {!isSelected && (
          <Text style={[styles.tabLabel, { color: theme.textTertiary }]}>
            {tab.label}
          </Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    height: 72,
    borderRadius: 28,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 0.5,
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContent: {
    alignItems: 'center',
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});