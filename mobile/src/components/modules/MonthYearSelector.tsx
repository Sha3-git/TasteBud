import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectorProps {
  theme: any;
  setShowMonthPicker: any;
  selectedMonth: number;
  selectedYear: number;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function MonthYearSelector({
  theme,
  setShowMonthPicker,
  selectedMonth,
  selectedYear,
}: SelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: theme.card }]}
        onPress={() => setShowMonthPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          {MONTHS[selectedMonth - 1]} {selectedYear}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
  },
});