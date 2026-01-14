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

import { getMealLogData } from "../../hooks/mealLogByDay";

interface MonthPickerProps {
  showMonthPicker: any;
  setShowMonthPicker: any;
  theme: any;
  setSelectedMonth: any;
  selectedMonth: any;
  selectedYear: any;
  setSelectedYear: any
}

export function MonthPicker({
  showMonthPicker,
  setShowMonthPicker,
  theme,
  setSelectedMonth,
  selectedMonth,
  selectedYear,
  setSelectedYear
}: MonthPickerProps) {
   const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i); 
  return (
    <Modal
      visible={showMonthPicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMonthPicker(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowMonthPicker(false)}
      >
        <View
          style={[styles.monthPickerContainer, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.pickerTitle, { color: theme.textPrimary }]}>
            Select Year
          </Text>
          <ScrollView style={styles.pickerScroll}>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                onPress={() => {
                  //setSelectedMonth(index);
                  setSelectedYear(year);
                  setShowMonthPicker(false);
                }}
                style={[
                  styles.pickerItem,
                  year === selectedYear && {
                    backgroundColor: theme.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    {
                      color:
                        year === selectedYear ? "#FFF" : theme.textPrimary,
                    },
                  ]}
                >
                   {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  monthPickerContainer: {
    width: "80%",
    maxHeight: "70%",
    borderRadius: 20,
    padding: 20,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  pickerScroll: {
    maxHeight: 400,
  },
  pickerItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
