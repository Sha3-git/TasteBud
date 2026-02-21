/**
 * FOOD LIBRARY SCREEN - v2 (Redesigned)
 * 
 * Features:
 * - "My Foods" / "Browse All" segmented control
 * - Collapsible sections: Safe, Suspected, Confirmed
 * - Algorithm integration: track labels, confidence, reaction rate
 * - Browse mode: Search ingredients + branded foods
 * - Clean visual hierarchy, no emojis
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { useUnsafeFoods } from '../../hooks/useUnsafeFoods';
import { useSearchFoods } from '../../hooks/useSearchFoods';
import { useSuspectedFoods } from '../../hooks/useSuspectedFoods';
import api from '../../services/apiClient';

interface FoodLibraryScreenProps {
  onBack: () => void;
}

interface Food {
  id: string;
  name: string;
  category: string;
  isSafe: boolean;
  status?: 'confirmed' | 'suspected';
  preExisting?: boolean;
  // Algorithm data
  track?: 'ige_allergy' | 'fodmap' | 'intolerance';
  trackLabel?: string;
  confidence?: 'low' | 'moderate' | 'high' | 'very_high';
  reactionRate?: number;
  avgSeverity?: number;
  avgHoursToReaction?: number;
  totalMeals?: number;
  reactionMeals?: number;
  recommendation?: string;
}

type MainTab = 'my_foods' | 'browse';

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function FoodLibraryScreen({ onBack }: FoodLibraryScreenProps) {
  const { theme, isDark } = useTheme();
  const [mainTab, setMainTab] = useState<MainTab>('my_foods');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    safe: true,
    suspected: true,
    confirmed: true,
  });
  
  // Data fetching
  const { data: unsafeFoodsData, isLoading, error, refetch } = useUnsafeFoods();
  const { data: suspectedData } = useSuspectedFoods();
  
  // Transform API data
  const { safeFoods, suspectedFoods, confirmedFoods } = useMemo(() => {
    const safe: Food[] = [];
    const suspected: Food[] = [];
    const confirmed: Food[] = [];
    
    // Process foods from API
    if (unsafeFoodsData?.ingredients) {
      const seen = new Set<string>();
      
      unsafeFoodsData.ingredients.forEach((item: any) => {
        const ingredientId = item.ingredient?._id;
        if (!ingredientId || seen.has(ingredientId)) return;
        seen.add(ingredientId);
        
        // Find algorithm data for this ingredient
        const algoData = suspectedData?.find((s: any) => s.ingredientId === ingredientId);
        
        const food: Food = {
          id: item._id,
          name: item.ingredient?.name || 'Unknown',
          category: item.ingredient?.foodGroup || 'Other',
          isSafe: item.status === 'safe',
          status: item.status,
          preExisting: item.preExisting,
          // Algorithm data
          track: algoData?.track,
          trackLabel: algoData?.trackLabel,
          confidence: algoData?.confidence,
          reactionRate: algoData?.reactionRate,
          avgSeverity: algoData?.avgSeverity,
          avgHoursToReaction: algoData?.avgHoursToReaction,
          totalMeals: algoData?.totalMeals,
          reactionMeals: algoData?.reactionMeals,
          recommendation: algoData?.recommendation,
        };
        
        if (item.status === 'safe') {
          safe.push(food);
        } else if (item.status === 'suspected') {
          suspected.push(food);
        } else {
          confirmed.push(food);
        }
      });
    }
    
    return { safeFoods: safe, suspectedFoods: suspected, confirmedFoods: confirmed };
  }, [unsafeFoodsData, suspectedData]);
  
  // Filter by search
  const filterBySearch = (foods: Food[]) => {
    if (!searchQuery.trim()) return foods;
    return foods.filter(f => 
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Header onBack={onBack} theme={theme} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading your food library...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Error state
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Header onBack={onBack} theme={theme} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.textPrimary }]}>
            Failed to load
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: theme.primary }]}
            onPress={refetch}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const totalCount = safeFoods.length + suspectedFoods.length + confirmedFoods.length;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <Header onBack={onBack} theme={theme} subtitle={`${totalCount} foods tracked`} />
      
      {/* Main Tab Selector */}
      <View style={styles.tabSelectorContainer}>
        <View style={[styles.tabSelector, { backgroundColor: isDark ? '#1c1c1e' : '#f0f0f0' }]}>
          <TouchableOpacity
            style={[
              styles.tabSelectorButton,
              mainTab === 'my_foods' && { backgroundColor: theme.card }
            ]}
            onPress={() => setMainTab('my_foods')}
          >
            <Text style={[
              styles.tabSelectorText,
              { color: mainTab === 'my_foods' ? theme.textPrimary : theme.textSecondary }
            ]}>
              My Foods
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabSelectorButton,
              mainTab === 'browse' && { backgroundColor: theme.card }
            ]}
            onPress={() => setMainTab('browse')}
          >
            <Text style={[
              styles.tabSelectorText,
              { color: mainTab === 'browse' ? theme.textPrimary : theme.textSecondary }
            ]}>
              Browse All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {mainTab === 'my_foods' ? (
        <MyFoodsTab
          theme={theme}
          isDark={isDark}
          safeFoods={filterBySearch(safeFoods)}
          suspectedFoods={filterBySearch(suspectedFoods)}
          confirmedFoods={filterBySearch(confirmedFoods)}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ) : (
        <BrowseTab
          theme={theme}
          isDark={isDark}
          onFoodAdded={refetch}
        />
      )}
    </SafeAreaView>
  );
}

// =============================================================================
// HEADER
// =============================================================================

function Header({ 
  onBack, 
  theme, 
  subtitle 
}: { 
  onBack: () => void; 
  theme: any;
  subtitle?: string;
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Food Library
        </Text>
        {subtitle && (
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={{ width: 40 }} />
    </View>
  );
}

// =============================================================================
// MY FOODS TAB
// =============================================================================

function MyFoodsTab({
  theme,
  isDark,
  safeFoods,
  suspectedFoods,
  confirmedFoods,
  expandedSections,
  toggleSection,
  searchQuery,
  setSearchQuery,
}: {
  theme: any;
  isDark: boolean;
  safeFoods: Food[];
  suspectedFoods: Food[];
  confirmedFoods: Food[];
  expandedSections: { safe: boolean; suspected: boolean; confirmed: boolean };
  toggleSection: (section: 'safe' | 'suspected' | 'confirmed') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const isEmpty = safeFoods.length === 0 && suspectedFoods.length === 0 && confirmedFoods.length === 0;
  
  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search your foods..."
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
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty ? (
          <EmptyState theme={theme} searchQuery={searchQuery} />
        ) : (
          <>
            {/* SUSPECTED SECTION */}
            {suspectedFoods.length > 0 && (
              <CollapsibleSection
                title="Suspected Triggers"
                count={suspectedFoods.length}
                icon="analytics-outline"
                color="#F59E0B"
                isExpanded={expandedSections.suspected}
                onToggle={() => toggleSection('suspected')}
                theme={theme}
                isDark={isDark}
              >
                {suspectedFoods.map(food => (
                  <FoodCard key={food.id} food={food} theme={theme} isDark={isDark} />
                ))}
              </CollapsibleSection>
            )}
            
            {/* CONFIRMED SECTION */}
            {confirmedFoods.length > 0 && (
              <CollapsibleSection
                title="Confirmed Unsafe"
                count={confirmedFoods.length}
                icon="close-circle-outline"
                color="#EF4444"
                isExpanded={expandedSections.confirmed}
                onToggle={() => toggleSection('confirmed')}
                theme={theme}
                isDark={isDark}
              >
                {confirmedFoods.map(food => (
                  <FoodCard key={food.id} food={food} theme={theme} isDark={isDark} />
                ))}
              </CollapsibleSection>
            )}
            
            {/* SAFE SECTION */}
            {safeFoods.length > 0 && (
              <CollapsibleSection
                title="Safe Foods"
                count={safeFoods.length}
                icon="checkmark-circle-outline"
                color="#22C55E"
                isExpanded={expandedSections.safe}
                onToggle={() => toggleSection('safe')}
                theme={theme}
                isDark={isDark}
              >
                {safeFoods.map(food => (
                  <FoodCard key={food.id} food={food} theme={theme} isDark={isDark} />
                ))}
              </CollapsibleSection>
            )}
          </>
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </>
  );
}

// =============================================================================
// BROWSE TAB
// =============================================================================

function BrowseTab({ theme, isDark, onFoodAdded }: { theme: any; isDark: boolean; onFoodAdded: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const { 
    ingredients, 
    brandedFoods, 
    loading,
    hasMoreIngredients,
    hasMoreBranded,
    loadMoreIngredients,
    loadMoreBranded,
    ingredientsTotal,
    brandedTotal,
  } = useSearchFoods(searchQuery);
  
  const handleAddFood = async (item: any, type: 'ingredient' | 'branded', isSafe: boolean) => {
    setSaving(true);
    try {
      // TODO: Replace with real userId from auth context
      const userId = "69173dd5a3866b85b59d9760";
      
      const response = await api.post(`/unsafefood/create?userId=${userId}`, {
        ingredient: item._id,
        status: isSafe ? 'safe' : 'confirmed',
        preExisting: false,
      });
      
      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          'Added!', 
          `${item.name} has been marked as ${isSafe ? 'safe' : 'unsafe'}.`,
          [{ text: 'OK', onPress: onFoodAdded }]
        );
      }
    } catch (err: any) {
      console.error('Error adding food:', err);
      Alert.alert('Error', 'Failed to add food. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search ingredients or products..."
            placeholderTextColor={theme.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery.length < 2 ? (
          <View style={styles.browseEmpty}>
            <Ionicons name="search-outline" size={48} color={theme.textTertiary} />
            <Text style={[styles.browseEmptyTitle, { color: theme.textSecondary }]}>
              Search our database
            </Text>
            <Text style={[styles.browseEmptySubtitle, { color: theme.textTertiary }]}>
              Find ingredients or branded products to mark as safe or unsafe
            </Text>
          </View>
        ) : loading ? (
          <View style={styles.browseLoading}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={{ color: theme.textSecondary, marginTop: 8 }}>Searching...</Text>
          </View>
        ) : (
          <>
            {/* Ingredients Results */}
            {ingredients.length > 0 && (
              <View style={styles.browseSection}>
                <Text style={[styles.browseSectionTitle, { color: theme.textSecondary }]}>
                  INGREDIENTS ({ingredients.length}{ingredientsTotal > ingredients.length ? ` of ${ingredientsTotal}` : ''})
                </Text>
                {ingredients.map((item: any) => (
                  <BrowseResultCard
                    key={`ing-${item._id}`}
                    item={item}
                    type="ingredient"
                    theme={theme}
                    isDark={isDark}
                    onAdd={handleAddFood}
                    disabled={saving}
                  />
                ))}
                {hasMoreIngredients && (
                  <TouchableOpacity 
                    style={[styles.loadMoreButton, { backgroundColor: theme.card }]}
                    onPress={loadMoreIngredients}
                  >
                    <Text style={[styles.loadMoreText, { color: theme.primary }]}>
                      Show more ingredients
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Branded Results */}
            {brandedFoods.length > 0 && (
              <View style={styles.browseSection}>
                <Text style={[styles.browseSectionTitle, { color: theme.textSecondary }]}>
                  BRANDED PRODUCTS ({brandedFoods.length}{brandedTotal > brandedFoods.length ? ` of ${brandedTotal}` : ''})
                </Text>
                {brandedFoods.map((item: any) => (
                  <BrowseResultCard
                    key={`brand-${item._id}`}
                    item={item}
                    type="branded"
                    theme={theme}
                    isDark={isDark}
                    onAdd={handleAddFood}
                    disabled={saving}
                  />
                ))}
                {hasMoreBranded && (
                  <TouchableOpacity 
                    style={[styles.loadMoreButton, { backgroundColor: theme.card }]}
                    onPress={loadMoreBranded}
                  >
                    <Text style={[styles.loadMoreText, { color: theme.primary }]}>
                      Show more products
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {ingredients.length === 0 && brandedFoods.length === 0 && (
              <View style={styles.browseEmpty}>
                <Text style={[styles.browseEmptyTitle, { color: theme.textSecondary }]}>
                  No results found
                </Text>
                <Text style={[styles.browseEmptySubtitle, { color: theme.textTertiary }]}>
                  Try a different search term
                </Text>
              </View>
            )}
          </>
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </>
  );
}

// =============================================================================
// BROWSE RESULT CARD
// =============================================================================

function BrowseResultCard({
  item,
  type,
  theme,
  isDark,
  onAdd,
  disabled,
}: {
  item: any;
  type: 'ingredient' | 'branded';
  theme: any;
  isDark: boolean;
  onAdd: (item: any, type: 'ingredient' | 'branded', isSafe: boolean) => void;
  disabled?: boolean;
}) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <View style={[styles.browseCard, { backgroundColor: theme.card }]}>
      <TouchableOpacity 
        style={styles.browseCardMain}
        onPress={() => setShowActions(!showActions)}
        activeOpacity={0.7}
      >
        <View style={styles.browseCardInfo}>
          <Text style={[styles.browseCardName, { color: theme.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.browseCardMeta, { color: theme.textTertiary }]}>
            {type === 'branded' ? item.brandOwner || 'Branded Product' : item.foodGroup || 'Ingredient'}
          </Text>
        </View>
        <Ionicons 
          name={showActions ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={theme.textTertiary} 
        />
      </TouchableOpacity>
      
      {showActions && (
        <View style={styles.browseCardActions}>
          <TouchableOpacity
            style={[styles.browseActionButton, { backgroundColor: `${theme.success}15`, opacity: disabled ? 0.5 : 1 }]}
            onPress={() => onAdd(item, type, true)}
            disabled={disabled}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.success} />
            <Text style={[styles.browseActionText, { color: theme.success }]}>Safe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.browseActionButton, { backgroundColor: `${theme.danger}15`, opacity: disabled ? 0.5 : 1 }]}
            onPress={() => onAdd(item, type, false)}
            disabled={disabled}
          >
            <Ionicons name="close-circle-outline" size={18} color={theme.danger} />
            <Text style={[styles.browseActionText, { color: theme.danger }]}>Unsafe</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// =============================================================================
// COLLAPSIBLE SECTION
// =============================================================================

function CollapsibleSection({
  title,
  count,
  icon,
  color,
  isExpanded,
  onToggle,
  children,
  theme,
  isDark,
}: {
  title: string;
  count: number;
  icon: string;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  theme: any;
  isDark: boolean;
}) {
  return (
    <View style={styles.section}>
      <TouchableOpacity 
        style={[styles.sectionHeader, { backgroundColor: theme.card }]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.sectionIcon, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon as any} size={18} color={color} />
          </View>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            {title}
          </Text>
          <View style={[styles.sectionCount, { backgroundColor: isDark ? '#2c2c2e' : '#e5e5e5' }]}>
            <Text style={[styles.sectionCountText, { color: theme.textSecondary }]}>
              {count}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={theme.textSecondary} 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
}

// =============================================================================
// FOOD CARD - Compact with algorithm data
// =============================================================================

function FoodCard({
  food,
  theme,
  isDark,
}: {
  food: Food;
  theme: any;
  isDark: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getTrackInfo = (track?: string) => {
    switch (track) {
      case 'ige_allergy':
        return { label: 'Allergy Pattern', color: '#EF4444', icon: 'alert-circle' };
      case 'fodmap':
        return { label: 'FODMAP', color: '#F59E0B', icon: 'nutrition' };
      case 'intolerance':
        return { label: 'Intolerance', color: '#8B5CF6', icon: 'time' };
      default:
        return null;
    }
  };
  
  const getConfidenceLabel = (confidence?: string) => {
    switch (confidence) {
      case 'very_high': return 'Very High';
      case 'high': return 'High';
      case 'moderate': return 'Moderate';
      case 'low': return 'Low';
      default: return null;
    }
  };
  
  const trackInfo = getTrackInfo(food.track);
  
  return (
    <TouchableOpacity
      style={[styles.foodCard, { backgroundColor: isDark ? '#1c1c1e' : '#f9fafb' }]}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      {/* Main Row */}
      <View style={styles.foodCardMain}>
        <View style={styles.foodCardInfo}>
          <Text style={[styles.foodCardName, { color: theme.textPrimary }]}>
            {food.name}
          </Text>
          <Text style={[styles.foodCardCategory, { color: theme.textTertiary }]}>
            {food.category}
          </Text>
        </View>
        
        {/* Quick Stats */}
        {food.reactionRate !== undefined && (
          <View style={[styles.quickStat, { backgroundColor: `${theme.danger}10` }]}>
            <Text style={[styles.quickStatValue, { color: theme.danger }]}>
              {food.reactionRate}%
            </Text>
          </View>
        )}
      </View>
      
      {/* Track Badge */}
      {trackInfo && (
        <View style={styles.trackRow}>
          <View style={[styles.trackBadge, { backgroundColor: `${trackInfo.color}15` }]}>
            <Ionicons name={trackInfo.icon as any} size={12} color={trackInfo.color} />
            <Text style={[styles.trackBadgeText, { color: trackInfo.color }]}>
              {trackInfo.label}
            </Text>
          </View>
          {food.confidence && (
            <Text style={[styles.confidenceText, { color: theme.textTertiary }]}>
              {getConfidenceLabel(food.confidence)} confidence
            </Text>
          )}
        </View>
      )}
      
      {/* Source tag */}
      {food.preExisting && (
        <View style={styles.sourceRow}>
          <Ionicons name="medical-outline" size={12} color={theme.textTertiary} />
          <Text style={[styles.sourceText, { color: theme.textTertiary }]}>
            Declared at signup
          </Text>
        </View>
      )}
      
      {!food.preExisting && food.status === 'suspected' && !trackInfo && (
        <View style={styles.sourceRow}>
          <Ionicons name="analytics-outline" size={12} color={theme.textTertiary} />
          <Text style={[styles.sourceText, { color: theme.textTertiary }]}>
            Pattern detected
          </Text>
        </View>
      )}
      
      {/* Expanded Details */}
      {isExpanded && (
        <View style={[styles.expandedDetails, { borderTopColor: theme.border }]}>
          {food.avgSeverity !== undefined && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Severity</Text>
              <View style={styles.severityBarContainer}>
                <View style={[styles.severityBarBg, { backgroundColor: theme.border }]}>
                  <View 
                    style={[
                      styles.severityBarFill, 
                      { 
                        width: `${(food.avgSeverity / 10) * 100}%`,
                        backgroundColor: food.avgSeverity >= 7 ? '#EF4444' : food.avgSeverity >= 4 ? '#F59E0B' : '#22C55E'
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                  {food.avgSeverity}/10
                </Text>
              </View>
            </View>
          )}
          
          {food.avgHoursToReaction !== undefined && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Avg time to reaction</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {food.avgHoursToReaction < 1 
                  ? `${Math.round(food.avgHoursToReaction * 60)} min`
                  : `${food.avgHoursToReaction}h`
                }
              </Text>
            </View>
          )}
          
          {food.totalMeals !== undefined && (
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>Data points</Text>
              <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
                {food.reactionMeals}/{food.totalMeals} meals had reactions
              </Text>
            </View>
          )}
          
          {food.recommendation && (
            <View style={[styles.recommendationBox, { backgroundColor: isDark ? '#1a1a1a' : '#fff7ed' }]}>
              <Text style={[styles.recommendationText, { color: theme.textSecondary }]}>
                {food.recommendation.replace(/^[^\s]+\s/, '')}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

// =============================================================================
// EMPTY STATE
// =============================================================================

function EmptyState({ theme, searchQuery }: { theme: any; searchQuery: string }) {
  return (
    <View style={styles.emptyState}>
      <Ionicons 
        name={searchQuery ? "search-outline" : "nutrition-outline"} 
        size={48} 
        color={theme.textTertiary} 
      />
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        {searchQuery ? 'No foods found' : 'No foods tracked yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery
          ? 'Try a different search term'
          : 'Log meals and reactions to start building your food profile'
        }
      </Text>
    </View>
  );
}

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Loading & Error
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  errorText: { fontSize: 18, fontWeight: '600' },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  retryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  
  // Tab Selector
  tabSelectorContainer: { paddingHorizontal: 24, marginBottom: 16 },
  tabSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tabSelectorButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabSelectorText: { fontSize: 14, fontWeight: '600' },
  
  // Search
  searchSection: { paddingHorizontal: 24, marginBottom: 16 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  
  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  
  // Section
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '600' },
  sectionCount: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  sectionCountText: { fontSize: 12, fontWeight: '600' },
  sectionContent: { marginTop: 8, gap: 8 },
  
  // Food Card
  foodCard: { borderRadius: 12, padding: 14 },
  foodCardMain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  foodCardInfo: { flex: 1 },
  foodCardName: { fontSize: 15, fontWeight: '600' },
  foodCardCategory: { fontSize: 12, marginTop: 2 },
  quickStat: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  quickStatValue: { fontSize: 13, fontWeight: '700' },
  
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  trackBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  trackBadgeText: { fontSize: 11, fontWeight: '600' },
  confidenceText: { fontSize: 11 },
  
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  sourceText: { fontSize: 11 },
  
  expandedDetails: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, gap: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  detailLabel: { fontSize: 12 },
  detailValue: { fontSize: 12, fontWeight: '600' },
  severityBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  severityBarBg: { width: 80, height: 4, borderRadius: 2, overflow: 'hidden' },
  severityBarFill: { height: '100%', borderRadius: 2 },
  recommendationBox: { padding: 10, borderRadius: 8, marginTop: 4 },
  recommendationText: { fontSize: 12, lineHeight: 16 },
  
  // Browse
  browseEmpty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  browseEmptyTitle: { fontSize: 16, fontWeight: '600' },
  browseEmptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  browseLoading: { alignItems: 'center', paddingVertical: 40 },
  browseSection: { marginBottom: 20 },
  browseSectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 10 },
  browseCard: { borderRadius: 12, marginBottom: 8, overflow: 'hidden' },
  browseCardMain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  browseCardInfo: { flex: 1 },
  browseCardName: { fontSize: 15, fontWeight: '600' },
  browseCardMeta: { fontSize: 12, marginTop: 2 },
  browseCardActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingBottom: 14 },
  browseActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  browseActionText: { fontSize: 13, fontWeight: '600' },
  loadMoreButton: { alignItems: 'center', paddingVertical: 12, borderRadius: 10, marginTop: 4 },
  loadMoreText: { fontSize: 13, fontWeight: '600' },
  
  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});