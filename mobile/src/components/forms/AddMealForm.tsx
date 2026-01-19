import React, { useState, useRef } from "react";
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
import { useSearchIngredients } from "../../hooks/useSearchIngredients";
import { FlatList } from "react-native";

export function AddMealForm({
  theme,
  isDark,
  onBack,
  mealName,
  setMealName,
  ingredients,
  ingredientInput,
  setIngredientInput,
  addIngredient,
  removeIngredient,
  symptoms,
  symptomInput,
  setSymptomInput,
  severity,
  setSeverity,
  addSymptom,
  removeSymptom,
  handleComplete,
  showDropdown,
  setShowDropdown,
}: any) {
  const results = useSearchIngredients(ingredientInput);
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
          New Log
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
              Name meal
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Name of meal"
              placeholderTextColor={theme.textTertiary}
              value={mealName}
              onChangeText={setMealName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
              Add ingredients
            </Text>

            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[styles.toggleButton, { backgroundColor: theme.card }]}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    { color: theme.textPrimary },
                  ]}
                >
                  Manual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#F3F4F6",
                  },
                ]}
              >
                <Ionicons name="camera" size={18} color={theme.textSecondary} />
                <Text
                  style={[
                    styles.toggleButtonText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Photo
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>
              Search for ingredients
            </Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: theme.card,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Search for ingredients (e.g wheat)"
                placeholderTextColor={theme.textTertiary}
                value={ingredientInput}
                onChangeText={(text) => {
                  setIngredientInput(text);
                  setShowDropdown(true);
                }}
                returnKeyType="done"
              />
            </View>
            {showDropdown && ingredientInput.length > 0 &&(
              <View style={[styles.dropdown, { backgroundColor: theme.card }]}>
                {results.length > 0  ? (
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={results}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setShowDropdown(false);
                          addIngredient(item.name, item._id);
                        }}
                      >
                        <Text style={{ color: theme.textPrimary }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <View style={styles.dropdownItem}>
                    <Text style={{ color: theme.textSecondary }}>
                      No ingredient found
                    </Text>
                  </View>
                )}
              </View>
            )}

            {ingredients.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text
                  style={[styles.miniLabel, { color: theme.textSecondary }]}
                >
                  Ingredients & products added
                </Text>
                <View style={styles.tags}>
                  {ingredients.map((ingredient: string, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.1)"
                            : "#F3F4F6",
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.tagText, { color: theme.textPrimary }]}
                      >
                        {ingredient}
                      </Text>
                      <TouchableOpacity onPress={() => removeIngredient(index)}>
                        <Ionicons
                          name="close"
                          size={16}
                          color={theme.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
              Add symptom
            </Text>

            <Text style={[styles.miniLabel, { color: theme.textSecondary }]}>
              Severity
            </Text>
            <View style={styles.severityContainer}>
              <View
                style={[styles.sliderTrack, { backgroundColor: theme.border }]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${(severity / 7) * 100}%`,
                      backgroundColor:
                        severity > 5
                          ? "#EF4444"
                          : severity > 3
                            ? "#F59E0B"
                            : "#22C55E",
                    },
                  ]}
                />
                <View style={styles.sliderTicks}>
                  {[1, 2, 3, 4, 5, 6, 7].map((tick) => (
                    <TouchableOpacity
                      key={tick}
                      onPress={() => setSeverity(tick)}
                      style={styles.sliderTick}
                    >
                      <View
                        style={[
                          styles.sliderDot,
                          {
                            backgroundColor:
                              tick <= severity ? "#FFF" : theme.border,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <Text
                style={[styles.severityLabel, { color: theme.textPrimary }]}
              >
                {severity} extreme
              </Text>
            </View>

            <View style={styles.symptomInputContainer}>
              <TextInput
                style={[
                  styles.symptomInput,
                  {
                    backgroundColor: theme.card,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="itching, swelling"
                placeholderTextColor={theme.textTertiary}
                value={symptomInput}
                onChangeText={setSymptomInput}
              />
              <TouchableOpacity
                onPress={addSymptom}
                style={[
                  styles.addSymptomButton,
                  { backgroundColor: theme.primary },
                ]}
              >
                <Text style={styles.addSymptomButtonText}>add</Text>
              </TouchableOpacity>
            </View>

            {symptoms.length > 0 && (
              <View style={styles.symptomsAdded}>
                <Text
                  style={[styles.miniLabel, { color: theme.textSecondary }]}
                >
                  Symptom added
                </Text>
                {symptoms.map((symptom: any, index: number) => (
                  <View
                    key={index}
                    style={[
                      styles.symptomCard,
                      {
                        backgroundColor: isDark ? "#000" : "#1F2937",
                      },
                    ]}
                  >
                    <View style={styles.symptomCardContent}>
                      <Text style={[styles.symptomName, { color: "#FFF" }]}>
                        {symptom.name}
                      </Text>
                      <Text
                        style={[
                          styles.symptomDetails,
                          { color: "rgba(255,255,255,0.7)" },
                        ]}
                      >
                        Severity: {symptom.severity}/5 at {symptom.time}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeSymptom(index)}>
                      <Ionicons
                        name="close"
                        size={20}
                        color="rgba(255,255,255,0.7)"
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleComplete}
            disabled={!mealName.trim() || ingredients.length === 0}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                !mealName.trim() || ingredients.length === 0
                  ? [theme.border, theme.border]
                  : isDark
                    ? ["#22C55E", "#16A34A"]
                    : ["#86EFAC", "#4ADE80"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.completeButton}
            >
              <Text
                style={[
                  styles.completeButtonText,
                  {
                    color:
                      !mealName.trim() || ingredients.length === 0
                        ? theme.textTertiary
                        : "#FFF",
                  },
                ]}
              >
                Complete
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  tagsContainer: {
    marginTop: 16,
  },
  severityContainer: {
    marginBottom: 16,
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 4,
  },
  sliderTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sliderTick: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  severityLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  symptomInputContainer: {
    flexDirection: "row",
    gap: 12,
  },
  symptomInput: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  addSymptomButton: {
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addSymptomButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  symptomsAdded: {
    marginTop: 16,
  },
  completeButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  formGroup: {
    marginBottom: 32,
  },
  formLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  symptomCardContent: {
    flex: 1,
  },
  symptomName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  symptomDetails: {
    fontSize: 12,
  },
  unsafeTag: {
    borderWidth: 1.5,
  },
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  noneText: {
    fontSize: 14,
  },
  symptomCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  miniLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  toggleButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  dropdown: {
    width: "100%",
    maxHeight: 200,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
});
