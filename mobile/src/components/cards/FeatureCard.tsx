/**
 * FeatureCard - Priority feature card
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

export function FeatureCard({
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
          {
            backgroundColor: isDark ? darkColor : color,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.featureIcon}>
          <Ionicons
            name={icon}
            size={28}
            color={isDark ? "#FFF" : "rgba(0,0,0,0.7)"}
          />
        </View>
        <Text
          style={[
            styles.featureTitle,
            { color: isDark ? "#FFF" : "rgba(0,0,0,0.9)" },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.featureValue,
            { color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.6)" },
          ]}
        >
          {value}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  featureCardContainer: {
    flex: 1,
  },
  featureCard: {
    borderRadius: 24,
    padding: 20,
    minHeight: 140,
    justifyContent: "space-between",
  },
  featureIcon: {
    alignSelf: "flex-end",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
  },
  featureValue: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
});
