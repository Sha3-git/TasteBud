import React, { useState, useEffect, useRef } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/ThemeContext";

import { DayLogCard } from "../../components/cards/DayLogCard";
import { AddMealForm } from "../../components/forms/AddMealForm";

import { getMealLogData } from "../../hooks/useMealLogDailyStats";

interface SelectorProps {
  goToPreviousMonth: any;
  goToNextMonth: any
  theme: any;
  setShowMonthPicker: any;
  selectedMonth: any;
  selectedYear: any;
}

export function MonthYearSelector({
  goToPreviousMonth,
  goToNextMonth,
  theme,
  setShowMonthPicker,
  selectedMonth,
  selectedYear,
}: SelectorProps) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <View style={styles.monthSelector}>
      <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
        <Ionicons name="chevron-back" size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.monthDisplay}
        onPress={() => setShowMonthPicker(true)}
      >
        <Text style={[styles.monthText, { color: theme.textPrimary }]}>
          {months[selectedMonth]}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.textPrimary} />
        <Text style={[styles.yearText, { color: theme.textSecondary }]}>
          {selectedYear}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
        <Ionicons name="chevron-forward" size={24} color={theme.textPrimary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  monthButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  monthDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "700",
  },
  yearText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
