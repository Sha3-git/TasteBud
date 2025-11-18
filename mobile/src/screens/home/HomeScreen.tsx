/**
 * HOME SCREEN - FINAL POLISHED VERSION
 * 
 * Priority Features:
 * 1. Meal & Symptom Logs (hero card)
 * 2. Symptom Analysis
 * 3. Cross Reactive Foods
 * 4. Food Library (unsafe foods)
 * 
 * Backend Integration Ready:
 * - All values default to 0 if no data
 * - Easy prop passing for backend team
 * - Clear TODO comments for API endpoints
 */

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
import { LiquidGlassTabBar } from '../../components/LiquidGlassTabBar';

interface HomeScreenProps {
  userName: string;
  onNavigate: (screen: string) => void;
}

const { width } = Dimensions.get('window');

export function HomeScreen({ userName, onNavigate }: HomeScreenProps) {
  const { theme, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  /**
   * TODO BACKEND: Replace these with API data
   * 
   * API Endpoint: GET /api/users/{userId}/stats?date={YYYY-MM-DD}
   * Response should include:
   * {
   *   mealCount: number,
   *   symptomCount: number,
   *   unsafeFoodsCount: number,
   *   crossReactiveCount: number,
   *   recentSymptoms: string[],
   *   proteinGrams: number,
   *   carbsGrams: number,
   *   caloriesKcal: number
   * }
   */
  const [stats, setStats] = useState({
    mealCount: 0,           // Default to 0 if no data
    symptomCount: 0,        // Default to 0 if no data
    unsafeFoodsCount: 0,    // Default to 0 if no data
    crossReactiveCount: 0,  // Default to 0 if no data
    proteinGrams: 0,        // Default to 0 if no data
    carbsGrams: 0,          // Default to 0 if no data
    caloriesKcal: 0,        // Default to 0 if no data
  });
  
  const tabs = [
    { id: 'home', icon: 'home-outline' as const, iconFilled: 'home' as const, label: 'Home' },
    { id: 'scan', icon: 'camera-outline' as const, iconFilled: 'camera' as const, label: 'Scan' },
    { id: 'library', icon: 'book-outline' as const, iconFilled: 'book' as const, label: 'Library' },
    { id: 'profile', icon: 'person-outline' as const, iconFilled: 'person' as const, label: 'You' },
  ];
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.profilePic, { backgroundColor: isDark ? '#4A90E2' : '#E0E7FF' }]}>
            <Text style={[styles.profileInitial, { color: isDark ? '#FFF' : '#6366F1' }]}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => onNavigate('notifications')}
            style={styles.notificationButton}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
        
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.name, { color: theme.textPrimary }]}>
            {userName}
          </Text>
        </View>
        
        {/* PRIORITY 1: Meal & Symptom Logs - Hero Card */}
        <View style={styles.heroSection}>
          <MealSymptomHeroCard
            mealCount={stats.mealCount}
            symptomCount={stats.symptomCount}
            onPress={() => onNavigate('mealLog')}
            isDark={isDark}
          />
        </View>
        
        {/* Week Calendar */}
        <View style={styles.weekSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            This week
          </Text>
          <WeekCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            theme={theme}
          />
        </View>
        
        {/* PRIORITY FEATURES GRID */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Track & Analyze
          </Text>
          
          {/* Row 1: Symptom Analysis + Cross Reactive */}
          <View style={styles.featuresRow}>
            <FeatureCard
              icon="pulse-outline"
              title="Symptom Analysis"
              value={stats.symptomCount > 0 ? `${stats.symptomCount} today` : 'No symptoms'}
              color="#C4B5FD"
              darkColor="#7C3AED"
              onPress={() => onNavigate('symptomAnalysis')}
              isDark={isDark}
            />
            <FeatureCard
              icon="git-network-outline"
              title="Cross Reactive"
              value={stats.crossReactiveCount > 0 ? `${stats.crossReactiveCount} foods` : 'Check foods'}
              color="#FED7AA"
              darkColor="#F97316"
              onPress={() => onNavigate('crossReactivity')}
              isDark={isDark}
            />
          </View>
          
          {/* Row 2: Food Library (full width) */}
          <FoodLibraryCard
            unsafeFoodsCount={stats.unsafeFoodsCount}
            onPress={() => onNavigate('foodLibrary')}
            isDark={isDark}
            theme={theme}
          />
        </View>
        
        {/* SECONDARY: Nutrition Stats (if available) */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Nutrition today
          </Text>
          <View style={styles.statsRow}>
            <NutritionCard
              icon="flame-outline"
              label="Protein"
              value={stats.proteinGrams.toString()}
              unit="g"
              color="#C4B5FD"
              isDark={isDark}
            />
            <NutritionCard
              icon="nutrition-outline"
              label="Carbs"
              value={stats.carbsGrams.toString()}
              unit="g"
              color="#FDE68A"
              isDark={isDark}
            />
          </View>
        </View>
     
        
        {/* Bottom padding for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
      
      {/* Polished Tab Bar */}
      <LiquidGlassTabBar
        tabs={tabs}
        selectedTab={selectedTab}
        onTabPress={(tabId) => {
          setSelectedTab(tabId);
          if (tabId !== 'home') {
            onNavigate(tabId);
          }
        }}
      />
    </SafeAreaView>
  );
  
}



// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * MealSymptomHeroCard - Main hero card for meals & symptoms
 */
function MealSymptomHeroCard({
  mealCount,
  symptomCount,
  onPress,
  isDark,
}: {
  mealCount: number;
  symptomCount: number;
  onPress: () => void;
  isDark: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
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
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={isDark ? ['#FCD34D', '#F59E0B'] : ['#FDE68A', '#FCD34D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>Meal & Symptom Logs</Text>
            <Ionicons name="restaurant" size={24} color="#92400E" />
          </View>
          
          {/* Big Radial Display */}
          <View style={styles.heroRadial}>
            <View style={styles.heroCircle}>
              <Text style={styles.heroValue}>{mealCount}</Text>
              <Text style={styles.heroSubtext}>meals today</Text>
            </View>
          </View>
          
          {/* Bottom Stats */}
          <View style={styles.heroBottom}>
            <View style={styles.heroStat}>
              <View style={[styles.heroDot, { backgroundColor: symptomCount > 0 ? '#EF4444' : '#22C55E' }]} />
              <Text style={styles.heroStatText}>
                <Text style={styles.heroStatBold}>{symptomCount}</Text> symptoms
              </Text>
            </View>
            <TouchableOpacity style={styles.heroAction}>
              <Text style={styles.heroActionText}>View details</Text>
              <Ionicons name="arrow-forward" size={16} color="#92400E" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * WeekCalendar - Week day selector
 */
function WeekCalendar({
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

/**
 * FeatureCard - Priority feature card
 */
function FeatureCard({
  icon,
  title,
  value,
  color,
  darkColor,
  onPress,
  isDark,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  color: string;
  darkColor: string;
  onPress: () => void;
  isDark: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
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
      style={styles.featureCardContainer}
    >
      <Animated.View
        style={[
          styles.featureCard,
          { backgroundColor: isDark ? darkColor : color, transform: [{ scale }] },
        ]}
      >
        <View style={styles.featureIcon}>
          <Ionicons name={icon} size={28} color={isDark ? '#FFF' : 'rgba(0,0,0,0.7)'} />
        </View>
        <Text style={[styles.featureTitle, { color: isDark ? '#FFF' : 'rgba(0,0,0,0.9)' }]}>
          {title}
        </Text>
        <Text style={[styles.featureValue, { color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)' }]}>
          {value}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * FoodLibraryCard - Full width food library card
 */
function FoodLibraryCard({
  unsafeFoodsCount,
  onPress,
  isDark,
  theme,
}: {
  unsafeFoodsCount: number;
  onPress: () => void;
  isDark: boolean;
  theme: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
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
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={isDark ? ['#10B981', '#059669'] : ['#D4F4DD', '#A7F3D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.foodLibraryCard}
        >
          <View style={styles.foodLibraryContent}>
            <View>
              <Text style={[styles.foodLibraryTitle, { color: isDark ? '#FFF' : '#065F46' }]}>
                Food Library
              </Text>
              <Text style={[styles.foodLibrarySubtitle, { color: isDark ? 'rgba(255,255,255,0.8)' : '#047857' }]}>
                {unsafeFoodsCount > 0 ? `${unsafeFoodsCount} unsafe foods identified` : 'Browse safe & unsafe foods'}
              </Text>
            </View>
            <View style={[styles.foodLibraryIcon, { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(6,95,70,0.1)' }]}>
              <Ionicons name="book" size={28} color={isDark ? '#FFF' : '#065F46'} />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * NutritionCard - Optional nutrition stat card
 */
function NutritionCard({
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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: '700',
  },
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // GREETING
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  name: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  
  // HERO CARD
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 32,
    padding: 24,
    minHeight: 260,
    justifyContent: 'space-between',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
  },
  heroRadial: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 8,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#92400E',
  },
  heroSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 4,
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroStatText: {
    fontSize: 14,
    color: '#92400E',
  },
  heroStatBold: {
    fontWeight: '700',
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  },
  
  // WEEK CALENDAR
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
  
  // FEATURES SECTION
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  featureCardContainer: {
    flex: 1,
  },
  featureCard: {
    borderRadius: 24,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  featureIcon: {
    alignSelf: 'flex-end',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  featureValue: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  
  // FOOD LIBRARY CARD
  foodLibraryCard: {
    borderRadius: 24,
    padding: 24,
    minHeight: 100,
  },
  foodLibraryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodLibraryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  foodLibrarySubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  foodLibraryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // NUTRITION STATS
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
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
});