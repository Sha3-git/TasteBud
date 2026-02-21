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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSearchFoods, useExpandBrandedFood } from "../../hooks/useSearchFoods";
import { useSearchSymptom } from "../../hooks/useSymptom";
import { SearchForm } from "./SearchForm";

// Time options - reframed as "how soon AFTER eating"
const ONSET_OPTIONS = [
  { id: 'immediate', label: 'Immediately', minutes: 0, subtext: 'While eating or right after' },
  { id: '30min', label: 'Within 30 min', minutes: 30, subtext: null },
  { id: '1-2hr', label: '1-2 hours', minutes: 90, subtext: null },
  { id: '3-6hr', label: '3-6 hours', minutes: 270, subtext: null },
  { id: '6-12hr', label: '6-12 hours', minutes: 540, subtext: null },
  { id: 'nextday', label: 'Next day', minutes: 1440, subtext: '12+ hours later' },
];

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
  // UPDATED: Destructure new properties from hook
  const { 
    ingredients: ingredientResults, 
    brandedFoods, 
    ingredientsTotal,
    brandedTotal,
    loading: searchLoading,
    loadingMore,
    loadMoreIngredients,
    loadMoreBranded,
    hasMoreIngredients,
    hasMoreBranded,
  } = useSearchFoods(ingredientInput);
  
  const { expandBrandedFood, loading: expandLoading } = useExpandBrandedFood();
  const symptomRes = useSearchSymptom(symptomInput);
  
  const [brandedSources, setBrandedSources] = useState<Record<string, string>>({});
  
  // Reaction section state
  const [showReactionSection, setShowReactionSection] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<{ id: string; name: string } | null>(null);
  const [selectedOnset, setSelectedOnset] = useState<string>('immediate');
  const [symptomDropdownVisible, setSymptomDropdownVisible] = useState(false);
  
  // Info modal
  const [showTimingInfo, setShowTimingInfo] = useState(false);

  const handleSelectIngredient = (item: { _id: string; name: string }) => {
    setShowDropdown(false);
    addIngredient(item.name, item._id);
    setIngredientInput("");
  };

  const handleSelectBrandedFood = async (item: { _id: string; name: string; brandOwner?: string }) => {
    setShowDropdown(false);
    setIngredientInput("");
    
    const mappedIngredients = await expandBrandedFood(item._id);
    
    if (mappedIngredients.length === 0) {
      alert(`No ingredients could be mapped from "${item.name}". Try adding ingredients manually.`);
      return;
    }
    
    for (const ing of mappedIngredients) {
      addIngredient(ing.name, ing.id);
      setBrandedSources(prev => ({ ...prev, [ing.id]: item.name }));
    }
  };

  const handleAddSymptom = () => {
    if (selectedSymptom) {
      const onsetOption = ONSET_OPTIONS.find(t => t.id === selectedOnset);
      const onsetMinutes = onsetOption?.minutes || 0;
      
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      addSymptom(selectedSymptom.name, selectedSymptom.id, severity, onsetMinutes);
      
      setSelectedSymptom(null);
      setSymptomInput("");
      setSeverity(5);
      setSelectedOnset('immediate');
    }
  };

  const hasResults = ingredientResults.length > 0 || brandedFoods.length > 0;

  const getSeverityColor = (sev: number) => {
    if (sev <= 3) return "#34D399";
    if (sev <= 6) return "#FBBF24";
    if (sev <= 8) return "#F97316";
    return "#EF4444";
  };

  const getSeverityLabel = (sev: number) => {
    if (sev <= 3) return "Mild";
    if (sev <= 6) return "Moderate";
    if (sev <= 8) return "Severe";
    return "Very Severe";
  };

  // Timing Info Modal Component
  const TimingInfoModal = () => (
    <Modal
      visible={showTimingInfo}
      transparent
      animationType="fade"
      onRequestClose={() => setShowTimingInfo(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowTimingInfo(false)}
      >
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Why timing matters
            </Text>
            <TouchableOpacity onPress={() => setShowTimingInfo(false)}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.modalText, { color: theme.textSecondary }]}>
            Different reactions happen at different speeds. This helps us understand what type of sensitivity you might have.
          </Text>
          
          <View style={styles.timeline}>
            <View style={styles.timelineTrack}>
              <LinearGradient
                colors={['#EF4444', '#F97316', '#FBBF24', '#34D399']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.timelineGradient}
              />
            </View>
            
            <View style={styles.timelineLabels}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#EF4444' }]} />
                <Text style={[styles.timelineTime, { color: theme.textPrimary }]}>0-2h</Text>
                <Text style={[styles.timelineType, { color: theme.textSecondary }]}>Allergy</Text>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#F97316' }]} />
                <Text style={[styles.timelineTime, { color: theme.textPrimary }]}>2-6h</Text>
                <Text style={[styles.timelineType, { color: theme.textSecondary }]}>FODMAP</Text>
              </View>
              
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#34D399' }]} />
                <Text style={[styles.timelineTime, { color: theme.textPrimary }]}>6-24h</Text>
                <Text style={[styles.timelineType, { color: theme.textSecondary }]}>Intolerance</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.infoBox, { backgroundColor: isDark ? '#2c2c2e' : '#f5f5f5' }]}>
            <Ionicons name="bulb-outline" size={18} color="#FBBF24" />
            <Text style={[styles.infoBoxText, { color: theme.textSecondary }]}>
              Don't worry about being exact. An estimate is fine!
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Calculate remaining counts for "Show more"
  const remainingIngredients = ingredientsTotal - ingredientResults.length;
  const remainingBranded = brandedTotal - brandedFoods.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <TimingInfoModal />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Log Meal
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
          {/* MEAL NAME */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
              Meal name
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.card, color: theme.textPrimary, borderColor: theme.border }]}
              placeholder="e.g., Breakfast, Lunch, Snack..."
              placeholderTextColor={theme.textTertiary}
              value={mealName}
              onChangeText={setMealName}
            />
          </View>

          {/* INGREDIENTS */}
          <View style={styles.formGroup}>
            <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
              What did you eat?
            </Text>

            <View style={styles.toggleButtons}>
              <TouchableOpacity style={[styles.toggleButton, { backgroundColor: theme.card }]}>
                <Text style={[styles.toggleButtonText, { color: theme.textPrimary }]}>Manual</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F3F4F6" }]}>
                <Ionicons name="camera" size={18} color={theme.textSecondary} />
                <Text style={[styles.toggleButtonText, { color: theme.textSecondary }]}>Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={[styles.searchInput, { backgroundColor: theme.card, color: theme.textPrimary, borderColor: theme.border }]}
                placeholder="Search ingredients or products..."
                placeholderTextColor={theme.textTertiary}
                value={ingredientInput}
                onChangeText={(text) => {
                  setIngredientInput(text);
                  setShowDropdown(true);
                }}
                returnKeyType="done"
              />
              {(searchLoading || expandLoading) && (
                <ActivityIndicator style={styles.searchSpinner} size="small" color={theme.primary} />
              )}
            </View>
            
            {/* Dropdown */}
            {showDropdown && ingredientInput.length >= 2 && (
              <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {searchLoading ? (
                  <View style={styles.dropdownLoading}>
                    <ActivityIndicator size="small" color={theme.primary} />
                    <Text style={{ color: theme.textSecondary, marginLeft: 8 }}>Searching...</Text>
                  </View>
                ) : !hasResults ? (
                  <View style={styles.dropdownItem}>
                    <Text style={{ color: theme.textSecondary }}>No results found</Text>
                  </View>
                ) : (
                  <ScrollView style={{ maxHeight: 350 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                    {/* INGREDIENTS SECTION */}
                    {ingredientResults.length > 0 && (
                      <>
                        <View style={[styles.sectionHeader, { backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}>
                          <Ionicons name="leaf-outline" size={14} color={theme.textSecondary} />
                          <Text style={[styles.sectionHeaderText, { color: theme.textSecondary }]}>
                            Ingredients ({ingredientResults.length}{ingredientsTotal > ingredientResults.length ? ` of ${ingredientsTotal}` : ''})
                          </Text>
                        </View>
                        {ingredientResults.map((item: any) => (
                          <TouchableOpacity
                            key={`ing-${item._id}`}
                            style={[styles.dropdownItem, { borderBottomColor: theme.border }]}
                            onPress={() => handleSelectIngredient(item)}
                          >
                            <Text style={{ color: theme.textPrimary }}>{item.name}</Text>
                            {item.foodGroup && (
                              <Text style={{ color: theme.textTertiary, fontSize: 12, marginTop: 2 }}>{item.foodGroup}</Text>
                            )}
                          </TouchableOpacity>
                        ))}
                        
                        {/* LOAD MORE INGREDIENTS BUTTON */}
                        {hasMoreIngredients && (
                          <TouchableOpacity
                            style={[styles.loadMoreButton, { backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0' }]}
                            onPress={loadMoreIngredients}
                            disabled={loadingMore}
                          >
                            {loadingMore ? (
                              <ActivityIndicator size="small" color={theme.primary} />
                            ) : (
                              <>
                                <Ionicons name="chevron-down" size={16} color={theme.primary} />
                                <Text style={[styles.loadMoreText, { color: theme.primary }]}>
                                  Show {remainingIngredients} more ingredient{remainingIngredients !== 1 ? 's' : ''}
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    
                    {/* BRANDED PRODUCTS SECTION */}
                    {brandedFoods.length > 0 && (
                      <>
                        <View style={[styles.sectionHeader, { backgroundColor: isDark ? '#1a1a2e' : '#f0f0ff', marginTop: 4 }]}>
                          <Ionicons name="pricetag-outline" size={14} color="#7c3aed" />
                          <Text style={[styles.sectionHeaderText, { color: '#7c3aed' }]}>
                            Branded Products ({brandedFoods.length}{brandedTotal > brandedFoods.length ? ` of ${brandedTotal}` : ''})
                          </Text>
                        </View>
                        {brandedFoods.map((item: any) => (
                          <TouchableOpacity
                            key={`brand-${item._id}`}
                            style={[styles.dropdownItem, styles.brandedItem, { borderBottomColor: theme.border }]}
                            onPress={() => handleSelectBrandedFood(item)}
                          >
                            <View style={styles.brandedItemContent}>
                              <View style={styles.brandedTag}>
                                <Text style={styles.brandedTagText}>BRANDED</Text>
                              </View>
                              <Text style={[styles.brandedName, { color: theme.textPrimary }]}>{item.name}</Text>
                              {item.brandOwner && (
                                <Text style={[styles.brandOwner, { color: theme.textSecondary }]}>{item.brandOwner}</Text>
                              )}
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={theme.textTertiary} />
                          </TouchableOpacity>
                        ))}
                        
                        {/* LOAD MORE BRANDED BUTTON */}
                        {hasMoreBranded && (
                          <TouchableOpacity
                            style={[styles.loadMoreButton, { backgroundColor: isDark ? '#1a1a2e' : '#f0f0ff' }]}
                            onPress={loadMoreBranded}
                            disabled={loadingMore}
                          >
                            {loadingMore ? (
                              <ActivityIndicator size="small" color="#7c3aed" />
                            ) : (
                              <>
                                <Ionicons name="chevron-down" size={16} color="#7c3aed" />
                                <Text style={[styles.loadMoreText, { color: '#7c3aed' }]}>
                                  Show {remainingBranded} more product{remainingBranded !== 1 ? 's' : ''}
                                </Text>
                              </>
                            )}
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                  </ScrollView>
                )}
              </View>
            )}

            {/* Added Ingredients */}
            {ingredients.length > 0 && (
              <View style={styles.tagsContainer}>
                <View style={styles.tags}>
                  {ingredients.map((ingredient: string, index: number) => (
                    <View
                      key={index}
                      style={[styles.tag, { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6" }]}
                    >
                      <Text style={[styles.tagText, { color: theme.textPrimary }]}>{ingredient}</Text>
                      <TouchableOpacity onPress={() => removeIngredient(index)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="close" size={16} color={theme.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* REACTION SECTION */}
          <TouchableOpacity 
            style={[styles.reactionToggle, { 
              backgroundColor: showReactionSection 
                ? (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)')
                : (isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb'),
              borderColor: showReactionSection ? '#EF4444' : theme.border
            }]}
            onPress={() => setShowReactionSection(!showReactionSection)}
            activeOpacity={0.7}
          >
            <View style={styles.reactionToggleLeft}>
              <View style={[styles.reactionIcon, { backgroundColor: showReactionSection ? '#EF4444' : theme.textTertiary }]}>
                <Ionicons name="pulse" size={16} color="#FFF" />
              </View>
              <View>
                <Text style={[styles.reactionToggleTitle, { color: theme.textPrimary }]}>
                  Had a reaction?
                </Text>
                <Text style={[styles.reactionToggleSubtext, { color: theme.textTertiary }]}>
                  {showReactionSection ? "Log your symptoms below" : "Tap to add symptoms"}
                </Text>
              </View>
            </View>
            <Ionicons 
              name={showReactionSection ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={theme.textSecondary} 
            />
          </TouchableOpacity>

          {showReactionSection && (
            <View style={[styles.reactionContent, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }]}>
              
              {/* SYMPTOM SEARCH */}
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>What symptom?</Text>
              <SearchForm
                theme={theme}
                text={"Symptom"}
                setInput={(text: string) => {
                  setSymptomInput(text);
                  setSymptomDropdownVisible(true);
                  if (text === '') setSelectedSymptom(null);
                }}
                input={symptomInput}
                setShowDropdown={setSymptomDropdownVisible}
                addInput={(name: string, id: string) => {
                  setSelectedSymptom({ id, name });
                  setSymptomInput(name);
                  setSymptomDropdownVisible(false);
                }}
                showDropdown={symptomDropdownVisible}
                results={symptomRes}
              />
              
              {selectedSymptom && (
                <View style={[styles.selectedBadge, { backgroundColor: isDark ? '#1e3a1e' : '#ecfdf5' }]}>
                  <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                  <Text style={[styles.selectedBadgeText, { color: theme.textPrimary }]}>
                    {selectedSymptom.name}
                  </Text>
                  <TouchableOpacity onPress={() => { setSelectedSymptom(null); setSymptomInput(""); }}>
                    <Ionicons name="close-circle" size={18} color={theme.textTertiary} />
                  </TouchableOpacity>
                </View>
              )}

              {selectedSymptom && (
                <>
                  {/* SEVERITY */}
                  <Text style={[styles.fieldLabel, { color: theme.textSecondary, marginTop: 20 }]}>How severe?</Text>
                  <View style={styles.severityRow}>
                    <View style={styles.severityTrack}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => (
                        <TouchableOpacity
                          key={tick}
                          onPress={() => setSeverity(tick)}
                          style={[
                            styles.severityDot,
                            { 
                              backgroundColor: tick <= severity ? getSeverityColor(severity) : (isDark ? '#333' : '#e5e5e5'),
                              transform: [{ scale: tick === severity ? 1.3 : 1 }]
                            }
                          ]}
                        />
                      ))}
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(severity) + '20' }]}>
                      <Text style={[styles.severityBadgeText, { color: getSeverityColor(severity) }]}>
                        {severity} · {getSeverityLabel(severity)}
                      </Text>
                    </View>
                  </View>

                  {/* TIMING */}
                  <View style={styles.timingHeader}>
                    <Text style={[styles.fieldLabel, { color: theme.textSecondary, marginTop: 20, marginBottom: 0 }]}>
                      How soon after eating?
                    </Text>
                    <TouchableOpacity 
                      onPress={() => setShowTimingInfo(true)}
                      style={styles.infoButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="help-circle-outline" size={20} color={theme.textTertiary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.onsetGrid}>
                    {ONSET_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.onsetOption,
                          {
                            backgroundColor: selectedOnset === option.id 
                              ? (isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)')
                              : (isDark ? 'rgba(255,255,255,0.05)' : '#fff'),
                            borderColor: selectedOnset === option.id ? '#3B82F6' : theme.border,
                          },
                        ]}
                        onPress={() => setSelectedOnset(option.id)}
                      >
                        <Text style={[
                          styles.onsetLabel,
                          { 
                            color: selectedOnset === option.id ? '#3B82F6' : theme.textPrimary,
                            fontWeight: selectedOnset === option.id ? '600' : '400'
                          }
                        ]}>
                          {option.label}
                        </Text>
                        {option.subtext && (
                          <Text style={[styles.onsetSubtext, { color: theme.textTertiary }]}>
                            {option.subtext}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* ADD SYMPTOM BUTTON */}
                  <TouchableOpacity
                    style={styles.addSymptomBtn}
                    onPress={handleAddSymptom}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add" size={20} color="#FFF" />
                    <Text style={styles.addSymptomBtnText}>Add Symptom</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ADDED SYMPTOMS */}
              {symptoms.length > 0 && (
                <View style={styles.symptomsList}>
                  {symptoms.map((symptom: any, index: number) => (
                    <View
                      key={index}
                      style={[styles.symptomCard, { backgroundColor: isDark ? '#1c1c1e' : '#1F2937' }]}
                    >
                      <View style={styles.symptomCardLeft}>
                        <Text style={styles.symptomCardName}>{symptom.name}</Text>
                        <View style={styles.symptomCardMeta}>
                          <View style={[styles.symptomCardBadge, { backgroundColor: getSeverityColor(symptom.severity) }]}>
                            <Text style={styles.symptomCardBadgeText}>{symptom.severity}/10</Text>
                          </View>
                          <Text style={styles.symptomCardTime}>{symptom.time}</Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => removeSymptom(index)} style={styles.symptomCardRemove}>
                        <Ionicons name="trash-outline" size={18} color="rgba(255,255,255,0.6)" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* SAVE BUTTON */}
          <TouchableOpacity
            onPress={handleComplete}
            disabled={!mealName.trim() || ingredients.length === 0}
            activeOpacity={0.8}
            style={{ marginTop: 24 }}
          >
            <LinearGradient
              colors={
                !mealName.trim() || ingredients.length === 0
                  ? [theme.border, theme.border]
                  : ['#22C55E', '#16A34A']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={[styles.saveButtonText, { color: !mealName.trim() || ingredients.length === 0 ? theme.textTertiary : '#FFF' }]}>
                Save Meal
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.helperText, { color: theme.textTertiary }]}>
            You can add reactions later by editing this meal
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  formSection: { paddingHorizontal: 20 },
  formGroup: { marginBottom: 24 },
  formLabel: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  input: { borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1 },
  toggleButtons: { flexDirection: "row", gap: 10, marginBottom: 16 },
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  toggleButtonText: { fontSize: 14, fontWeight: "500" },
  searchContainer: { position: "relative" },
  searchInput: { borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1 },
  searchSpinner: { position: "absolute", right: 14, top: 14 },
  dropdown: {
    width: "100%",
    borderRadius: 12,
    zIndex: 10,
    elevation: 5,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 8,
  },
  dropdownLoading: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 16 },
  dropdownItem: { padding: 14, borderBottomWidth: 1 },
  sectionHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  sectionHeaderText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  brandedItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brandedItemContent: { flex: 1 },
  brandedTag: { backgroundColor: "#7c3aed", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start", marginBottom: 4 },
  brandedTagText: { color: "#FFF", fontSize: 9, fontWeight: "700", letterSpacing: 0.5 },
  brandedName: { fontSize: 14, fontWeight: "600" },
  brandOwner: { fontSize: 12, marginTop: 2 },
  tagsContainer: { marginTop: 12 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, gap: 6 },
  tagText: { fontSize: 14, fontWeight: "500" },
  
  // Load More Button
  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  loadMoreText: {
    fontSize: 13,
    fontWeight: "600",
  },
  
  // Reaction Toggle
  reactionToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  reactionToggleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  reactionIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  reactionToggleTitle: { fontSize: 15, fontWeight: "600" },
  reactionToggleSubtext: { fontSize: 13, marginTop: 2 },
  
  // Reaction Content
  reactionContent: { borderRadius: 14, padding: 16, marginBottom: 8 },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.3 },
  selectedBadge: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10, marginTop: 8, gap: 8 },
  selectedBadgeText: { flex: 1, fontSize: 15, fontWeight: "500" },
  
  // Severity
  severityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  severityTrack: { flex: 1, flexDirection: "row", justifyContent: "space-between" },
  severityDot: { width: 20, height: 20, borderRadius: 10 },
  severityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  severityBadgeText: { fontSize: 13, fontWeight: "600" },
  
  // Timing
  timingHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  infoButton: { padding: 4 },
  onsetGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  onsetOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, minWidth: '30%' },
  onsetLabel: { fontSize: 13 },
  onsetSubtext: { fontSize: 11, marginTop: 2 },
  
  // Add Symptom
  addSymptomBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22C55E",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  addSymptomBtnText: { color: "#FFF", fontSize: 15, fontWeight: "600" },
  
  // Symptoms List
  symptomsList: { marginTop: 16, gap: 10 },
  symptomCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 12 },
  symptomCardLeft: { flex: 1 },
  symptomCardName: { color: "#FFF", fontSize: 15, fontWeight: "600", marginBottom: 6 },
  symptomCardMeta: { flexDirection: "row", alignItems: "center", gap: 10 },
  symptomCardBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  symptomCardBadgeText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  symptomCardTime: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  symptomCardRemove: { padding: 8 },
  
  // Save Button
  saveButton: { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  saveButtonText: { fontSize: 17, fontWeight: "700" },
  helperText: { fontSize: 13, textAlign: "center", marginTop: 12 },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalContent: { width: "100%", maxWidth: 340, borderRadius: 20, padding: 24 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  
  // Timeline in modal
  timeline: { marginBottom: 20 },
  timelineTrack: { height: 6, borderRadius: 3, marginBottom: 16 },
  timelineGradient: { flex: 1, height: "100%", borderRadius: 3 },
  timelineLabels: { flexDirection: "row", justifyContent: "space-between" },
  timelineItem: { alignItems: "center" },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginBottom: 6 },
  timelineTime: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  timelineType: { fontSize: 11 },
  
  infoBox: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 10, gap: 10 },
  infoBoxText: { flex: 1, fontSize: 13 },
});