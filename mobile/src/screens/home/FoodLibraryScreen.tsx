/**
 * FOOD LIBRARY SCREEN - CLEAN & MINIMAL
 * 
 * Design Philosophy:
 * - Monochrome with simple status indicators
 * - Clean cards matching home screen aesthetic
 * - No rainbow colors - just safe (green) vs unsafe (red)
 * - Professional and easy on the eyes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

interface FoodLibraryScreenProps {
  onBack: () => void;
}

interface Food {
  id: string;
  name: string;
  category: string;
  emoji: string;
  isSafe: boolean;
  avgSeverity?: number;
  reactionCount?: number;
  symptoms?: string[];
  lastReaction?: string;
  notes?: string;
}

type FilterTab = 'all' | 'safe' | 'unsafe';

export function FoodLibraryScreen({ onBack }: FoodLibraryScreenProps) {
  const { theme, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  /**
   * TODO BACKEND: Fetch food library
   * GET /api/users/{userId}/food-library
   */
  const [foods, setFoods] = useState<Food[]>([
    {
      id: '1',
      name: 'Milk',
      category: 'Dairy',
      emoji: '🥛',
      isSafe: false,
      avgSeverity: 8,
      reactionCount: 12,
      symptoms: ['Itch', 'Bloating', 'Nausea'],
      lastReaction: '2024-11-10',
    },
    {
      id: '2',
      name: 'Eggs',
      category: 'Poultry',
      emoji: '🥚',
      isSafe: false,
      avgSeverity: 5,
      reactionCount: 6,
      symptoms: ['Itch', 'Bloating'],
      lastReaction: '2024-11-05',
    },
    {
      id: '3',
      name: 'Chicken',
      category: 'Poultry',
      emoji: '🍗',
      isSafe: true,
      notes: 'No reactions in 20+ meals',
    },
    {
      id: '4',
      name: 'Broccoli',
      category: 'Vegetables',
      emoji: '🥦',
      isSafe: true,
      notes: 'Safe to eat',
    },
  ]);
  
  const deleteFood = (id: string) => {
    setFoods(foods.filter(food => food.id !== id));
  };
  
  const addFood = (newFood: Omit<Food, 'id'>) => {
    const food: Food = {
      ...newFood,
      id: Date.now().toString(),
    };
    setFoods([food, ...foods]);
    setShowAddModal(false);
  };
  
  // Filter foods
  const filteredFoods = foods.filter(food => {
    if (searchQuery && !food.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'safe' && !food.isSafe) return false;
    if (activeTab === 'unsafe' && food.isSafe) return false;
    return true;
  });
  
  const safeFoodsCount = foods.filter(f => f.isSafe).length;
  const unsafeFoodsCount = foods.filter(f => !f.isSafe).length;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Food Library
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {foods.length} foods tracked
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search foods..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Filter Tabs */}
      <View style={styles.tabsSection}>
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'all' && styles.tabTextActive,
            { color: activeTab === 'all' ? theme.primary : theme.textSecondary }
          ]}>
            All
          </Text>
          {activeTab === 'all' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.primary }]} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('safe')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'safe' && styles.tabTextActive,
            { color: activeTab === 'safe' ? theme.success : theme.textSecondary }
          ]}>
            Safe ({safeFoodsCount})
          </Text>
          {activeTab === 'safe' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.success }]} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('unsafe')}
          style={styles.tabButton}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'unsafe' && styles.tabTextActive,
            { color: activeTab === 'unsafe' ? theme.danger : theme.textSecondary }
          ]}>
            Unsafe ({unsafeFoodsCount})
          </Text>
          {activeTab === 'unsafe' && (
            <View style={[styles.tabIndicator, { backgroundColor: theme.danger }]} />
          )}
        </TouchableOpacity>
      </View>
      
      {/* Food List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredFoods.length === 0 ? (
          <EmptyState theme={theme} searchQuery={searchQuery} />
        ) : (
          filteredFoods.map(food => (
            <FoodCard
              key={food.id}
              food={food}
              onDelete={() => deleteFood(food.id)}
              theme={theme}
              isDark={isDark}
            />
          ))
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>
      
      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => setShowAddModal(true)}
        style={[styles.fab, { backgroundColor: theme.primary }]}
      >
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
      
      {/* Add Food Modal */}
      <AddFoodModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addFood}
        theme={theme}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// FOOD CARD - CLEAN & MINIMAL
// ============================================================================

function FoodCard({
  food,
  onDelete,
  theme,
  isDark,
}: {
  food: Food;
  onDelete: () => void;
  theme: any;
  isDark: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <View style={styles.foodCardWrapper}>
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={[styles.foodCard, { backgroundColor: theme.card }]}>
          {/* Header */}
          <View style={styles.foodHeader}>
            <View style={styles.foodLeft}>
              <Text style={styles.foodEmoji}>{food.emoji}</Text>
              <View>
                <Text style={[styles.foodName, { color: theme.textPrimary }]}>
                  {food.name}
                </Text>
                <Text style={[styles.foodCategory, { color: theme.textSecondary }]}>
                  {food.category}
                </Text>
              </View>
            </View>
            
            {/* Status Badge */}
            <View style={[
              styles.statusBadge,
              { backgroundColor: food.isSafe ? `${theme.success}15` : `${theme.danger}15` }
            ]}>
              <Ionicons 
                name={food.isSafe ? "checkmark-circle" : "warning"} 
                size={16} 
                color={food.isSafe ? theme.success : theme.danger} 
              />
              <Text style={[
                styles.statusText,
                { color: food.isSafe ? theme.success : theme.danger }
              ]}>
                {food.isSafe ? 'SAFE' : 'UNSAFE'}
              </Text>
            </View>
          </View>
          
          {/* Unsafe Details */}
          {!food.isSafe && (
            <>
              {/* Severity Bar */}
              {food.avgSeverity && (
                <View style={styles.severitySection}>
                  <View style={styles.severityTop}>
                    <Text style={[styles.severityLabel, { color: theme.textSecondary }]}>
                      Severity
                    </Text>
                    <Text style={[styles.severityValue, { color: theme.textPrimary }]}>
                      {food.avgSeverity}/10
                    </Text>
                  </View>
                  <View style={[styles.severityBar, { backgroundColor: theme.border }]}>
                    <LinearGradient
                      colors={['#EF4444', '#DC2626']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.severityFill, { width: `${(food.avgSeverity / 10) * 100}%` }]}
                    />
                  </View>
                </View>
              )}
              
              {/* Symptoms */}
              {food.symptoms && food.symptoms.length > 0 && (
                <View style={styles.symptomsSection}>
                  <View style={styles.symptomTags}>
                    {food.symptoms.map((symptom, index) => (
                      <View 
                        key={index}
                        style={[styles.symptomTag, { 
                          backgroundColor: isDark ? '#2C2C2E' : '#F3F4F6',
                        }]}
                      >
                        <Text style={[styles.symptomText, { color: theme.textSecondary }]}>
                          {symptom}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Reaction Count */}
              {food.reactionCount && (
                <View style={styles.metaSection}>
                  <Ionicons name="alert-circle-outline" size={16} color={theme.textTertiary} />
                  <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                    {food.reactionCount} reactions recorded
                  </Text>
                </View>
              )}
            </>
          )}
          
          {/* Safe Details */}
          {food.isSafe && food.notes && (
            <View style={styles.metaSection}>
              <Ionicons name="checkmark-circle-outline" size={16} color={theme.success} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {food.notes}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Expanded Actions */}
      {isExpanded && (
        <View style={[styles.expandedActions, { backgroundColor: theme.card }]}>
          {food.lastReaction && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
              <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                Last reaction: {new Date(food.lastReaction).toLocaleDateString()}
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            onPress={onDelete}
            style={[styles.deleteButton, { backgroundColor: `${theme.danger}10` }]}
          >
            <Ionicons name="trash-outline" size={18} color={theme.danger} />
            <Text style={[styles.deleteText, { color: theme.danger }]}>
              Delete food
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ============================================================================
// EMPTY STATE
// ============================================================================

function EmptyState({ theme, searchQuery }: { theme: any; searchQuery: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>
        {searchQuery ? '🔍' : '📚'}
      </Text>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        {searchQuery ? 'No foods found' : 'No foods added yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery
          ? 'Try a different search term'
          : 'Tap the + button to start building your library'
        }
      </Text>
    </View>
  );
}

// ============================================================================
// ADD FOOD MODAL
// ============================================================================

function AddFoodModal({
  visible,
  onClose,
  onAdd,
  theme,
  isDark,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (food: Omit<Food, 'id'>) => void;
  theme: any;
  isDark: boolean;
}) {
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const [isSafe, setIsSafe] = useState(true);
  const [severity, setSeverity] = useState(5);
  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  const emojiCategories = [
    { emoji: '🥛', name: 'Dairy' },
    { emoji: '🥚', name: 'Poultry' },
    { emoji: '🐟', name: 'Seafood' },
    { emoji: '🥜', name: 'Legumes' },
    { emoji: '🌾', name: 'Grains' },
    { emoji: '🍎', name: 'Fruits' },
    { emoji: '🥬', name: 'Vegetables' },
    { emoji: '🥩', name: 'Meat' },
    { emoji: '🍽️', name: 'Other' },
  ];
  
  const addSymptom = () => {
    if (symptomInput.trim()) {
      setSymptoms([...symptoms, symptomInput.trim()]);
      setSymptomInput('');
    }
  };
  
  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };
  
  const handleComplete = () => {
    if (!foodName.trim() || !category) return;
    
    const newFood: Omit<Food, 'id'> = {
      name: foodName,
      category,
      emoji,
      isSafe,
      avgSeverity: !isSafe ? severity : undefined,
      reactionCount: !isSafe && symptoms.length > 0 ? 1 : undefined,
      symptoms: !isSafe && symptoms.length > 0 ? symptoms : undefined,
      notes: isSafe ? 'Confirmed safe' : undefined,
    };
    
    onAdd(newFood);
    
    // Reset
    setFoodName('');
    setCategory('');
    setEmoji('🍽️');
    setIsSafe(true);
    setSeverity(5);
    setSymptoms([]);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
            Add Food
          </Text>
          <View style={{ width: 28 }} />
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Food Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Food Name
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card,
                  color: theme.textPrimary,
                }]}
                placeholder="e.g., Peanuts"
                placeholderTextColor={theme.textTertiary}
                value={foodName}
                onChangeText={setFoodName}
              />
            </View>
            
            {/* Category Selection */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Select Category
              </Text>
              <View style={styles.emojiGrid}>
                {emojiCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat.name}
                    onPress={() => {
                      setCategory(cat.name);
                      setEmoji(cat.emoji);
                    }}
                    style={[
                      styles.emojiButton,
                      category === cat.name && { backgroundColor: `${theme.primary}20` },
                      { backgroundColor: category === cat.name ? `${theme.primary}20` : theme.card }
                    ]}
                  >
                    <Text style={styles.emojiButtonEmoji}>{cat.emoji}</Text>
                    <Text style={[
                      styles.emojiButtonText,
                      { color: category === cat.name ? theme.primary : theme.textSecondary }
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Safe/Unsafe Toggle */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                Is this food safe?
              </Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => setIsSafe(true)}
                  style={[
                    styles.toggleButton,
                    isSafe && { backgroundColor: `${theme.success}20` },
                    { backgroundColor: isSafe ? `${theme.success}20` : theme.card }
                  ]}
                >
                  <Ionicons 
                    name="checkmark-circle" 
                    size={24} 
                    color={isSafe ? theme.success : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.toggleButtonText,
                    { color: isSafe ? theme.success : theme.textSecondary }
                  ]}>
                    Safe
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setIsSafe(false)}
                  style={[
                    styles.toggleButton,
                    !isSafe && { backgroundColor: `${theme.danger}20` },
                    { backgroundColor: !isSafe ? `${theme.danger}20` : theme.card }
                  ]}
                >
                  <Ionicons 
                    name="warning" 
                    size={24} 
                    color={!isSafe ? theme.danger : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.toggleButtonText,
                    { color: !isSafe ? theme.danger : theme.textSecondary }
                  ]}>
                    Unsafe
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Unsafe Food Details */}
            {!isSafe && (
              <>
                {/* Severity */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                    Severity: {severity}/10
                  </Text>
                  <View style={styles.severitySlider}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                      <TouchableOpacity
                        key={val}
                        onPress={() => setSeverity(val)}
                        style={[
                          styles.severityDot,
                          { backgroundColor: val <= severity ? theme.danger : theme.border }
                        ]}
                      />
                    ))}
                  </View>
                </View>
                
                {/* Symptoms */}
                <View style={styles.formGroup}>
                  <Text style={[styles.formLabel, { color: theme.textPrimary }]}>
                    Add Symptoms
                  </Text>
                  <View style={styles.symptomInputRow}>
                    <TextInput
                      style={[styles.symptomInput, { 
                        backgroundColor: theme.card,
                        color: theme.textPrimary,
                      }]}
                      placeholder="e.g., Itching"
                      placeholderTextColor={theme.textTertiary}
                      value={symptomInput}
                      onChangeText={setSymptomInput}
                      onSubmitEditing={addSymptom}
                    />
                    <TouchableOpacity 
                      onPress={addSymptom}
                      style={[styles.addButton, { backgroundColor: theme.primary }]}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {symptoms.length > 0 && (
                    <View style={styles.symptomsAdded}>
                      {symptoms.map((symptom, index) => (
                        <View 
                          key={index}
                          style={[styles.symptomChip, { backgroundColor: theme.card }]}
                        >
                          <Text style={[styles.symptomChipText, { color: theme.textPrimary }]}>
                            {symptom}
                          </Text>
                          <TouchableOpacity onPress={() => removeSymptom(index)}>
                            <Ionicons name="close" size={16} color={theme.textSecondary} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </>
            )}
            
            {/* Complete Button */}
            <TouchableOpacity
              onPress={handleComplete}
              disabled={!foodName.trim() || !category}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  !foodName.trim() || !category
                    ? [theme.border, theme.border]
                    : [theme.primary, theme.primaryLight]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.completeButton}
              >
                <Text style={[
                  styles.completeButtonText,
                  { color: !foodName.trim() || !category ? theme.textTertiary : '#FFF' }
                ]}>
                  Add to Library
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ============================================================================
// STYLES - CLEAN & MINIMAL
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  
  // SEARCH
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  
  // TABS
  tabsSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 24,
  },
  tabButton: {
    paddingBottom: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  
  // SCROLL
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  
  // FOOD CARD
  foodCardWrapper: {
    marginBottom: 16,
  },
  foodCard: {
    borderRadius: 16,
    padding: 20,
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  foodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  foodEmoji: {
    fontSize: 40,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  foodCategory: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // SEVERITY
  severitySection: {
    marginBottom: 12,
  },
  severityTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  severityValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  severityBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  severityFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  // SYMPTOMS
  symptomsSection: {
    marginBottom: 12,
  },
  symptomTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  symptomText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // META
  metaSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
  },
  
  // EXPANDED
  expandedActions: {
    borderRadius: 12,
    padding: 16,
    marginTop: -8,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // EMPTY
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  
  // FAB
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // MODAL
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalScroll: {
    flex: 1,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  
  // FORM
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  
  // EMOJI GRID
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emojiButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  emojiButtonEmoji: {
    fontSize: 32,
  },
  emojiButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  // TOGGLE
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  // SEVERITY SLIDER
  severitySlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  severityDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  
  // SYMPTOM INPUT
  symptomInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  symptomInput: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  addButton: {
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  symptomsAdded: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  symptomChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // COMPLETE
  completeButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  completeButtonText: {
    fontSize: 17,
    fontWeight: '700',
  },
});