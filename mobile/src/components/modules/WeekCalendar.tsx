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
import { LiquidGlassTabBar } from './LiquidGlassTabBar';
import { MealSymptomHeroCard } from '../../components/cards/MealSymptomHeroCard';


export function WeekCalendar({
  selectedDate,
  onDateSelect,
  theme,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  theme: any;
}) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + i);
    dates.push(date);
  }
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  return (
    <View style={styles.calendar}>
      {dates.map((date, index) => {
        const today = isToday(date);
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onDateSelect(date)}
            style={[
              styles.calendarDay,
              { backgroundColor: today ? '#FF6B6B' : theme.card },
            ]}
          >
            <Text style={[
              styles.calendarDayText,
              { color: today ? '#FFF' : theme.textSecondary }
            ]}>
              {days[index]}
            </Text>
            <Text style={[
              styles.calendarDateText,
              { color: today ? '#FFF' : theme.textPrimary }
            ]}>
              {date.getDate()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({ 
    
  weekSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  calendar: {
    flexDirection: 'row',
    gap: 8,
  },
  calendarDay: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    gap: 4,
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  calendarDateText: {
    fontSize: 16,
    fontWeight: '700',
  },
})
