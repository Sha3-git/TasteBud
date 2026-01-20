import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

import { MealDetailCard } from './MealDetailCard';

interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: string[];
  symptoms: { id: string, name: string; severity: number; time: string }[];
  unsafeIngredients: string[];
  color: string;
}

interface DayLog {
  date: Date;
  dayName: string;
  dayNumber: number;
  meals: Meal[];
  isExpanded: boolean;
}

export function DayLogCard({
  dayLog,
  dayIndex,
  onToggle,
  onEditMeal,
  onDeleteMeal,
  theme,
  isDark,
}: {
  dayLog: DayLog;
  dayIndex: number;
  onToggle: () => void;
  onEditMeal: (dayIndex: number, meal: Meal) => void;
  onDeleteMeal: (dayIndex: number, mealId: string) => void;
  theme: any;
  isDark: boolean;
}) {
  const rotateAnim = useRef(new Animated.Value(dayLog.isExpanded ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: dayLog.isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [dayLog.isExpanded]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  return (
    <View style={[styles.dayCard, { backgroundColor: theme.card }]}>
      <TouchableOpacity
        onPress={onToggle}
        style={styles.dayHeader}
        activeOpacity={0.7}
      >
        <View style={styles.dayInfo}>
          <Text style={[styles.dayNumber, { color: theme.textPrimary }]}>
            {dayLog.dayNumber}
          </Text>
          <Text style={[styles.dayName, { color: theme.textSecondary }]}>
            {dayLog.dayName}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={24} color={theme.textSecondary} />
        </Animated.View>
      </TouchableOpacity>
      
      {dayLog.isExpanded && dayLog.meals.length > 0 && (
        <View style={styles.mealsContainer}>
          {dayLog.meals.map((meal) => (
            <MealDetailCard
              key={meal.id}
              meal={meal}
              dayIndex={dayIndex}
              onEdit={() => onEditMeal(dayIndex, meal)}
              onDelete={() => onDeleteMeal(dayIndex, meal.id)}
              theme={theme}
              isDark={isDark}
            />
          ))}
        </View>
      )}
      
      {dayLog.isExpanded && dayLog.meals.length === 0 && (
        <View style={styles.noMeals}>
          <Text style={[styles.noMealsText, { color: theme.textSecondary }]}>
            No meals logged for this day
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ 
    dayCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dayNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mealsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  noMeals: {
    padding: 20,
    alignItems: 'center',
  },
  noMealsText: {
    fontSize: 14,
  },
})