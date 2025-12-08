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

import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/ThemeContext";
import { LiquidGlassTabBar } from "../../components/LiquidGlassTabBar";

import { MealSymptomHeroCard } from "../../components/cards/MealSymptomHeroCard";
import { WeekCalendar } from "../../components/modules/WeekCalendar";
import { FeatureCard } from "../../components/cards/FeatureCard";
import { FoodLibraryCard } from "../../components/cards/FoodLibraryCard";

import { mealLogService } from "../../services/mealLogService";

import { getMealLogStats } from "../../hooks/mealLogHook";

interface HomeScreenProps {
  userName: string;
  onNavigate: (screen: string) => void;
}

const { width } = Dimensions.get("window");

export function HomeScreen({ userName, onNavigate }: HomeScreenProps) {
  const { theme, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState("home");
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * TODO BACKEND: Replace these with API data
   *
   * API Endpoint: GET /api/users/{userId}/stats?date={YYYY-MM-DD}
   * Response should include:
   * {
   *   mealCount: number,
   *   reacCount: number,
   *   unsafeFoodsCount: number,
   *   crossReactiveCount: number,
   *   recentSymptoms: string[],
   *   proteinGrams: number,
   *   carbsGrams: number,
   *   caloriesKcal: number
   * }
   */
   //const today = new Date().toISOString().split("T")[0];
  const today = "2025-12-07"
  const userId = "69173dd5a3866b85b59d9760";
  const stats = getMealLogStats(today, userId);

  const tabs = [
    {
      id: "home",
      icon: "home-outline" as const,
      iconFilled: "home" as const,
      label: "Home",
    },
    {
      id: "scan",
      icon: "camera-outline" as const,
      iconFilled: "camera" as const,
      label: "Scan",
    },
    {
      id: "library",
      icon: "book-outline" as const,
      iconFilled: "book" as const,
      label: "Library",
    },
    {
      id: "profile",
      icon: "person-outline" as const,
      iconFilled: "person" as const,
      label: "You",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.profilePic,
              { backgroundColor: isDark ? "#4A90E2" : "#E0E7FF" },
            ]}
          >
            <Text
              style={[
                styles.profileInitial,
                { color: isDark ? "#FFF" : "#6366F1" },
              ]}
            >
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onNavigate("notifications")}
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.textPrimary}
            />
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
            reacCount={stats.reacCount}
            onPress={() => onNavigate("mealLog")}
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
              value={
                stats.reacCount > 0
                  ? `${stats.reacCount} today`
                  : "No symptoms"
              }
              color="#C4B5FD"
              darkColor="#7C3AED"
              onPress={() => onNavigate("symptomAnalysis")}
              isDark={isDark}
            />
            <FeatureCard
              icon="git-network-outline"
              title="Cross Reactive"
              value={
                stats.crossReactiveCount > 0
                  ? `${stats.crossReactiveCount} foods`
                  : "Check foods"
              }
              color="#FED7AA"
              darkColor="#F97316"
              onPress={() => onNavigate("crossReactivity")}
              isDark={isDark}
            />
          </View>

          {/* Row 2: Food Library (full width) */}
          <FoodLibraryCard
            unsafeFoodsCount={stats.unsafeFoodsCount}
            onPress={() => onNavigate("foodLibrary")}
            isDark={isDark}
            theme={theme}
          />
        </View>

        {/* SECONDARY: Nutrition Stats (if available) 
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
        </View>*/}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Polished Tab Bar */}
      <LiquidGlassTabBar
        tabs={tabs}
        selectedTab={selectedTab}
        onTabPress={(tabId) => {
          setSelectedTab(tabId);
          if (tabId !== "home") {
            onNavigate(tabId);
          }
        }}
      />
    </SafeAreaView>
  );
}

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: "700",
  },
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  // GREETING
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  name: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -0.5,
  },

  // HERO CARD
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  // WEEK CALENDAR
  weekSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  // FEATURES SECTION
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  featuresRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  // NUTRITION STATS
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
});
