
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { LiquidGlassTabBar } from '../LiquidGlassTabBar';


export function NutritionCard({
  icon,
  label,
  value,
  unit,
  color,
  isDark,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <View style={[styles.nutritionCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : color }]}>
      <View style={styles.nutritionHeader}>
        <Ionicons name={icon} size={20} color={isDark ? '#FFF' : 'rgba(0,0,0,0.6)'} />
      </View>
      <Text style={[styles.nutritionValue, { color: isDark ? '#FFF' : 'rgba(0,0,0,0.9)' }]}>
        {value}
      </Text>
      <Text style={[styles.nutritionUnit, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)' }]}>
        {unit}
      </Text>
      <Text style={[styles.nutritionLabel, { color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({ 

   nutritionCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  nutritionHeader: {
    alignItems: 'flex-end',
  },
  nutritionValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  nutritionUnit: {
    fontSize: 13,
    fontWeight: '500',
  },
  nutritionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
})