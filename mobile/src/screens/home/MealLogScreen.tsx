import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/ThemeContext";

import { DayLogCard } from "../../components/cards/DayLogCard";
import { AddMealForm } from "../../components/forms/AddMealForm";
import { MonthYearSelector } from "../../components/modules/MonthYearSelector";
import { MonthPicker } from "../../components/modals/MonthPicker";

import { getMealLogByDay } from "../../hooks/mealLogByDay";
import { useMealLogByMonth } from "../../hooks/useMealLogByMonth";
import { createMealLog } from "../../hooks/createMealLog";
interface MealLogScreenProps {
  onBack: () => void;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: string[];
  symptoms: { name: string; severity: number; time: string }[];
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

export function MealLogScreen({ onBack }: MealLogScreenProps) {
  const { theme, isDark } = useTheme();

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);

  const [mealName, setMealName] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientId, setIngredientId] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [severity, setSeverity] = useState(3);
  const [symptoms, setSymptoms] = useState<
    { name: string; severity: number; time: string }[]
  >([]);

  const today = new Date().toISOString().split("T")[0];
  const dateObj = new Date(today + "T00:00:00");

  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const {
    monthLogs: fetchedLogs,
    loading,
    error,
    refetch,
  } = useMealLogByMonth(year, month);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const [dayLogs, setDayLogs] = useState<DayLog[]>([]); //says day logs but is the meal log data for a month grouped by day
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (fetchedLogs) {
      setDayLogs(fetchedLogs);
    }
  }, [fetchedLogs]);

  const toggleDay = (index: number) => {
    setDayLogs(
      dayLogs.map((day, i) =>
        i === index ? { ...day, isExpanded: !day.isExpanded } : day,
      ),
    );
  };

  const addIngredient = (ingredient: string, id: string) => {
    const valueToAdd = ingredient?.trim() || ingredientInput.trim();
    if (valueToAdd && !ingredients.includes(valueToAdd)) {
      setIngredients([...ingredients, valueToAdd]);
      setIngredientId([...ingredientId, id]);
      setShowDropdown(false);
      setIngredientInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addSymptom = () => {
    if (symptomInput.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      setSymptoms([
        ...symptoms,
        {
          name: symptomInput.trim(),
          severity,
          time: timeString,
        },
      ]);
      setSymptomInput("");
      setSeverity(3);
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (!mealName.trim() || ingredients.length === 0) {
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      time: timeString,
      ingredients: ingredients,
      symptoms: symptoms,
      unsafeIngredients: [],
      color: symptoms.length > 0 ? "#FF9E80" : "#9ACD32",
    };

    const today = new Date();
    const todayIndex = dayLogs.findIndex(
      (day) => day.date.toDateString() === today.toDateString(),
    );

    if (todayIndex >= 0) {
      const updatedDayLogs = [...dayLogs];
      updatedDayLogs[todayIndex].meals.push(newMeal);
      updatedDayLogs[todayIndex].isExpanded = true;
      setDayLogs(updatedDayLogs);
    } else {
      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const newDayLog: DayLog = {
        date: today,
        dayName: dayNames[today.getDay()],
        dayNumber: today.getDate(),
        meals: [newMeal],
        isExpanded: true,
      };
      setDayLogs([newDayLog, ...dayLogs]);
    }

    setMealName("");
    setIngredients([]);
    setSymptoms([]);
    setIsAddingMeal(false);
    createMealLog(today, mealName, ingredientId);
    console.log("Meal added:", newMeal);
  };

  const handleDeleteMeal = (dayIndex: number, mealId: string) => {
    const updatedDayLogs = [...dayLogs];
    updatedDayLogs[dayIndex].meals = updatedDayLogs[dayIndex].meals.filter(
      (meal) => meal.id !== mealId,
    );
    setDayLogs(updatedDayLogs);
  };

  const handleEditMeal = (dayIndex: number, meal: Meal) => {
    setMealName(meal.name);
    setIngredients(meal.ingredients);
    setSymptoms(meal.symptoms);
    setEditingMealId(meal.id);
    setIsAddingMeal(true);

    handleDeleteMeal(dayIndex, meal.id);

    console.log("✏️ Editing meal:", meal.id);
  };

  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  if (isAddingMeal) {
    return (
      <AddMealForm
        theme={theme}
        isDark={isDark}
        onBack={() => {
          setIsAddingMeal(false);
          setEditingMealId(null);
          setMealName("");
          setIngredients([]);
          setSymptoms([]);
        }}
        mealName={mealName}
        setMealName={setMealName}
        ingredients={ingredients}
        ingredientInput={ingredientInput}
        setIngredientInput={setIngredientInput}
        addIngredient={addIngredient}
        removeIngredient={removeIngredient}
        symptoms={symptoms}
        symptomInput={symptomInput}
        setSymptomInput={setSymptomInput}
        severity={severity}
        setSeverity={setSeverity}
        addSymptom={addSymptom}
        removeSymptom={removeSymptom}
        handleComplete={handleComplete}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />
    );
  }
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
            Loading meals...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <Text
            style={{
              color: theme.danger,
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 8,
            }}
          >
            Oops!
          </Text>
          <Text
            style={{
              color: theme.textSecondary,
              fontSize: 14,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "600" }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Meal Log
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month/Year Selector - WORKING */}
        <MonthYearSelector
          goToPreviousMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
          theme={theme}
          setShowMonthPicker={setShowMonthPicker}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />

        {/* Past Meal Logs Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Past Meal Logs
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
          >
            View and edit your previous entries
          </Text>
        </View>

        {/* Collapsible Day Logs */}
        {dayLogs.map((dayLog, dayIndex) => (
          <DayLogCard
            key={dayIndex}
            dayLog={dayLog}
            dayIndex={dayIndex}
            onToggle={() => toggleDay(dayIndex)}
            onEditMeal={handleEditMeal}
            onDeleteMeal={handleDeleteMeal}
            theme={theme}
            isDark={isDark}
          />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setIsAddingMeal(true)}
        style={[styles.fab, { backgroundColor: theme.primary }]}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Month Picker Modal */}
      <MonthPicker
        showMonthPicker={showMonthPicker}
        setShowMonthPicker={setShowMonthPicker}
        theme={theme}
        setSelectedMonth={setSelectedMonth}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
  },

  fab: {
    position: "absolute",
    bottom: 110,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // MODAL
});
