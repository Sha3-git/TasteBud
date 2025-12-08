/**
 * FoodLibraryCard - Full width food library card
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

export function FoodLibraryCard({
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
          colors={isDark ? ["#10B981", "#059669"] : ["#D4F4DD", "#A7F3D0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.foodLibraryCard}
        >
          <View style={styles.foodLibraryContent}>
            <View>
              <Text
                style={[
                  styles.foodLibraryTitle,
                  { color: isDark ? "#FFF" : "#065F46" },
                ]}
              >
                Food Library
              </Text>
              <Text
                style={[
                  styles.foodLibrarySubtitle,
                  { color: isDark ? "rgba(255,255,255,0.8)" : "#047857" },
                ]}
              >
                {unsafeFoodsCount > 0
                  ? `${unsafeFoodsCount} unsafe foods identified`
                  : "Browse safe & unsafe foods"}
              </Text>
            </View>
            <View
              style={[
                styles.foodLibraryIcon,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(6,95,70,0.1)",
                },
              ]}
            >
              <Ionicons
                name="book"
                size={28}
                color={isDark ? "#FFF" : "#065F46"}
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  foodLibraryCard: {
    borderRadius: 24,
    padding: 24,
    minHeight: 100,
  },
  foodLibraryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodLibraryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  foodLibrarySubtitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  foodLibraryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
