import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSearchFoods, useExpandBrandedFood } from "../../hooks/useSearchFoods";
import { useSearchSymptom } from "../../hooks/useSymptom";
import { SearchForm } from "./SearchForm";
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
  // Use combined search for both ingredients and branded foods
  const { ingredients: ingredientResults, brandedFoods, loading: searchLoading } = useSearchFoods(ingredientInput);
  const { expandBrandedFood, loading: expandLoading } = useExpandBrandedFood();
  const symptomRes = useSearchSymptom(symptomInput);
  
  // Track which ingredients came from branded foods (for visual distinction)
  const [brandedSources, setBrandedSources] = useState<Record<string, string>>({});

  // Handle selecting a raw ingredient
  const handleSelectIngredient = (item: { _id: string; name: string }) => {
    setShowDropdown(false);
    addIngredient(item.name, item._id);
    setIngredientInput("");
  };

  // Handle selecting a branded food - expand it to its mapped ingredients
  const handleSelectBrandedFood = async (item: { _id: string; name: string; brandOwner?: string }) => {
    setShowDropdown(false);
    setIngredientInput("");
    
    const mappedIngredients = await expandBrandedFood(item._id);
    
    if (mappedIngredients.length === 0) {
      // No ingredients could be mapped - show a message or handle gracefully
      alert(`No ingredients could be mapped from "${item.name}". Try adding ingredients manually.`);
      return;
    }
    
    // Add each mapped ingredient
    for (const ing of mappedIngredients) {
      // Check if already added (by ID)
      addIngredient(ing.name, ing.id);
      // Track that this ingredient came from a branded product
      setBrandedSources(prev => ({ ...prev, [ing.id]: item.name }));
    }
  };

  const hasResults = ingredientResults.length > 0 || brandedFoods.length > 0;

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
        keyboardShouldPersistTaps="handled"
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
              Search ingredients or branded products
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
                placeholder="Search (e.g., wheat, Cheerios, peanut butter)"
                placeholderTextColor={theme.textTertiary}
                value={ingredientInput}
                onChangeText={(text) => {
                  setIngredientInput(text);
                  setShowDropdown(true);
                }}
                returnKeyType="done"
              />
              {(searchLoading || expandLoading) && (
                <ActivityIndicator 
                  style={styles.searchSpinner} 
                  size="small" 
                  color={theme.primary} 
                />
              )}
            </View>
            
            {/* Combined Search Results Dropdown */}
            {showDropdown && ingredientInput.length >= 2 && (
              <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {searchLoading ? (
                  <View style={styles.dropdownLoading}>
                    <ActivityIndicator size="small" color={theme.primary} />
                    <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>Searching...</Text>
                  </View>
                ) : !hasResults ? (
                  <View style={styles.dropdownItem}>
                    <Text style={{ color: theme.textSecondary }}>
                      No results found
                    </Text>
                  </View>
                ) : (
                  <ScrollView 
                    style={{ maxHeight: 300 }} 
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                  >
                    {/* Raw Ingredients Section */}
                    {ingredientResults.length > 0 && (
                      <>
                        <View style={[styles.sectionHeader, { backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}>
                          <Ionicons name="leaf-outline" size={14} color={theme.textSecondary} />
                          <Text style={[styles.sectionHeaderText, { color: theme.textSecondary }]}>
                            Ingredients
                          </Text>
                        </View>
                        {ingredientResults.map((item) => (
                          <TouchableOpacity
                            key={`ing-${item._id}`}
                            style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
                            onPress={() => handleSelectIngredient(item)}
                          >
                            <Text style={{ color: theme.textPrimary }}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                    
                    {/* Branded Foods Section */}
                    {brandedFoods.length > 0 && (
                      <>
                        <View style={[styles.sectionHeader, { backgroundColor: isDark ? '#1a1a2e' : '#f0f0ff' }]}>
                          <Ionicons name="pricetag-outline" size={14} color="#7c3aed" />
                          <Text style={[styles.sectionHeaderText, { color: '#7c3aed' }]}>
                            Branded Products
                          </Text>
                        </View>
                        {brandedFoods.map((item) => (
                          <TouchableOpacity
                            key={`brand-${item._id}`}
                            style={[styles.dropdownItem, styles.brandedItem, { borderBottomColor: theme.border }]}
                            onPress={() => handleSelectBrandedFood(item)}
                          >
                            <View style={styles.brandedItemContent}>
                              <View style={styles.brandedTag}>
                                <Text style={styles.brandedTagText}>BRANDED</Text>
                              </View>
                              <Text style={[styles.brandedName, { color: theme.textPrimary }]}>
                                {item.name}
                              </Text>
                              {item.brandOwner && (
                                <Text style={[styles.brandOwner, { color: theme.textSecondary }]}>
                                  {item.brandOwner}
                                </Text>
                              )}
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                          </TouchableOpacity>
                        ))}
                      </>
                    )}
                  </ScrollView>
                )}
              </View>
            )}

            {ingredients.length > 0 && (
              <View style={styles.tagsContainer}>
                <Text
                  style={[styles.miniLabel, { color: theme.textSecondary }]}
                >
                  Ingredients added ({ingredients.length})
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
              Severity (1-10)
            </Text>
            <View style={styles.severityContainer}>
              <View
                style={[styles.sliderTrack, { backgroundColor: theme.border }]}
              >
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width: `${(severity / 10) * 100}%`,
                      backgroundColor:
                        severity > 7
                          ? "#EF4444"
                          : severity > 4
                            ? "#F59E0B"
                            : "#22C55E",
                    },
                  ]}
                />
                <View style={styles.sliderTicks}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
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
                            width: 12,
                            height: 12,
                            borderRadius: 6,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.severityLabelRow}>
                <Text style={[styles.severityValue, { color: theme.textPrimary }]}>
                  {severity}/10
                </Text>
                <Text style={[styles.severityLabel, { color: theme.textSecondary }]}>
                  {severity <= 3 ? "Mild" : severity <= 6 ? "Moderate" : severity <= 8 ? "Severe" : "Very Severe"}
                </Text>
              </View>
            </View>

            <View style={styles.symptomInputContainer}>
     
            </View>
            <SearchForm
              theme={theme}
              text={"Symptom"}
              setInput={setSymptomInput}
              input={symptomInput}
              setShowDropdown={setShowDropdown}
              addInput={addSymptom}
              showDropdown={showDropdown}
              results={symptomRes}
            />
            {symptoms.length > 0 && (
              <View style={styles.symptomsAdded}>
                <Text
                  style={[styles.miniLabel, { color: theme.textSecondary }]}
                >
                  Symptoms added
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
                        Severity: {symptom.severity}/10 at {symptom.time}
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
    marginBottom: 8,
    position: "relative",
  },
  searchInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  searchSpinner: {
    position: "absolute",
    right: 16,
    top: 16,
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
  severityLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  severityValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  severityLabel: {
    fontSize: 14,
    fontWeight: "500",
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
    borderRadius: 12,
    zIndex: 10,
    elevation: 5,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  dropdownLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  brandedItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandedItemContent: {
    flex: 1,
  },
  brandedTag: {
    backgroundColor: "#7c3aed",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  brandedTagText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  brandedName: {
    fontSize: 14,
    fontWeight: "600",
  },
  brandOwner: {
    fontSize: 12,
    marginTop: 2,
  },
});