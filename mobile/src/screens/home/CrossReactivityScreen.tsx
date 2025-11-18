/**
 * CROSS REACTIVE FOODS SCREEN
 * 
 * Features:
 * - Visual risk overview
 * - Expandable allergen cards with cross-reactive foods
 * - Percentage bars showing reactivity likelihood
 * - Educational scientific explanations
 * - Color-coded by food category
 * - Beautiful, engaging UI
 * 
 * Possible Backend Integration? (Shema&Ethan):
 * GET /api/users/{userId}/cross-reactivity
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

interface CrossReactivityScreenProps {
  onBack: () => void;
}

interface RelatedFood {
  name: string;
  emoji: string;
  percentage: number;
  riskLevel: 'high' | 'medium' | 'low';
}

interface CrossReactivity {
  allergen: string;
  category: string;
  emoji: string;
  color: string;
  relatedFoods: RelatedFood[];
  scientificReason: string;
  advice: string;
  isExpanded: boolean;
}

export function CrossReactivityScreen({ onBack }: CrossReactivityScreenProps) {
  const { theme, isDark } = useTheme();
  
  /**
   * TODO BACKEND: Fetch cross-reactivity data
   * GET /api/users/{userId}/cross-reactivity
   * 
   * Expected Response:
   * {
   *   userAllergies: ["Peanut", "Shellfish",...etc],
   *   riskOverview: { high: 3, medium: 5, low: 2 },
   *   crossReactivities: [
   *     {
   *       allergen: "Peanut",
   *       category: "Legumes",
   *       emoji: "🥜",
   *       color: "#A0826D",
   *       relatedFoods: [
   *         { name: "Tree nuts", emoji: "🌰", percentage: 85, riskLevel: "high" }
   *       ],
   *       scientificReason: "Similar protein structure",
   *       advice: "Avoid all legumes"
   *     }
   *   ]
   * }
   */
  const [data, setData] = useState({
    userAllergies: ['Peanut', 'Shellfish'],
    riskOverview: {
      high: 3,
      medium: 5,
      low: 2,
    },
    crossReactivities: [
      {
        allergen: 'Peanut',
        category: 'Legumes',
        emoji: '🥜',
        color: '#A0826D',
        relatedFoods: [
          { name: 'Tree nuts', emoji: '🌰', percentage: 85, riskLevel: 'high' as const },
          { name: 'Soy', emoji: '🫘', percentage: 70, riskLevel: 'medium' as const },
          { name: 'Beans', emoji: '🫛', percentage: 45, riskLevel: 'medium' as const },
        ],
        scientificReason: 'Similar protein structure (Ara h 2 protein family)',
        advice: 'Avoid all legumes and tree nuts to minimize cross-reaction risk',
        isExpanded: false,
      },
      {
        allergen: 'Shellfish',
        category: 'Seafood',
        emoji: '🦐',
        color: '#5DADE2',
        relatedFoods: [
          { name: 'Fish', emoji: '🐟', percentage: 60, riskLevel: 'medium' as const },
          { name: 'Mollusk', emoji: '🦞', percentage: 90, riskLevel: 'high' as const },
          { name: 'Squid', emoji: '🦑', percentage: 75, riskLevel: 'high' as const },
        ],
        scientificReason: 'Tropomyosin protein common in all crustaceans',
        advice: 'Avoid all shellfish and be cautious with fish products',
        isExpanded: false,
      },
    ],
  });
  
  const toggleExpand = (index: number) => {
    const updated = [...data.crossReactivities];
    updated[index].isExpanded = !updated[index].isExpanded;
    setData({ ...data, crossReactivities: updated });
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#22C55E';
      default: return theme.textSecondary;
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Cross Reactive Foods
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Section */}
        <View style={styles.section}>
          <Text style={[styles.introTitle, { color: theme.textPrimary }]}>
            Based on your allergies
          </Text>
          <View style={styles.allergyTags}>
            {data.userAllergies.map((allergy, index) => (
              <View 
                key={index}
                style={[styles.allergyTag, { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6',
                  borderColor: theme.border,
                }]}
              >
                <Text style={[styles.allergyTagText, { color: theme.textPrimary }]}>
                  {allergy}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Risk Overview */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Your risk overview
          </Text>
          
          <View style={[styles.riskCard, { backgroundColor: theme.card }]}>
            <RiskItem
              label="High Risk"
              count={data.riskOverview.high}
              color="#EF4444"
              icon="warning"
              theme={theme}
            />
            <View style={[styles.riskDivider, { backgroundColor: theme.border }]} />
            <RiskItem
              label="Medium Risk"
              count={data.riskOverview.medium}
              color="#F59E0B"
              icon="alert-circle"
              theme={theme}
            />
            <View style={[styles.riskDivider, { backgroundColor: theme.border }]} />
            <RiskItem
              label="Low Risk"
              count={data.riskOverview.low}
              color="#22C55E"
              icon="checkmark-circle"
              theme={theme}
            />
          </View>
        </View>
        
        {/* Cross-Reactivities */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Foods to watch out for
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Tap to see details and scientific explanations
          </Text>
          
          {data.crossReactivities.map((item, index) => (
            <AllergenCard
              key={index}
              item={item}
              onToggle={() => toggleExpand(index)}
              getRiskColor={getRiskColor}
              theme={theme}
              isDark={isDark}
            />
          ))}
        </View>
        
        {/* Educational Footer */}
        <View style={[styles.footerCard, { backgroundColor: isDark ? '#1C1C1E' : '#F9FAFB' }]}>
          <Ionicons name="information-circle" size={24} color={theme.primary} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Cross-reactivity occurs when proteins in different foods are similar enough that your immune system mistakes them for your known allergens. Always consult with an allergist before introducing new foods.
          </Text>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function RiskItem({
  label,
  count,
  color,
  icon,
  theme,
}: {
  label: string;
  count: number;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme: any;
}) {
  return (
    <View style={styles.riskItem}>
      <View style={[styles.riskIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.riskTextContainer}>
        <Text style={[styles.riskLabel, { color: theme.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.riskCount, { color: theme.textPrimary }]}>
          {count} {count === 1 ? 'food' : 'foods'}
        </Text>
      </View>
    </View>
  );
}

function AllergenCard({
  item,
  onToggle,
  getRiskColor,
  theme,
  isDark,
}: {
  item: CrossReactivity;
  onToggle: () => void;
  getRiskColor: (level: string) => string;
  theme: any;
  isDark: boolean;
}) {
  return (
    <View style={styles.allergenCard}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isDark 
            ? [item.color, `${item.color}DD`]
            : [`${item.color}30`, `${item.color}20`]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.allergenHeader}
        >
          <View style={styles.allergenHeaderLeft}>
            <Text style={styles.allergenEmoji}>{item.emoji}</Text>
            <View>
              <Text style={[styles.allergenName, { color: isDark ? '#FFF' : item.color }]}>
                {item.allergen}
              </Text>
              <Text style={[styles.allergenCategory, { 
                color: isDark ? 'rgba(255,255,255,0.8)' : `${item.color}CC` 
              }]}>
                {item.category}
              </Text>
            </View>
          </View>
          
          <Animated.View style={{ 
            transform: [{ rotate: item.isExpanded ? '180deg' : '0deg' }] 
          }}>
            <Ionicons 
              name="chevron-down" 
              size={24} 
              color={isDark ? '#FFF' : item.color} 
            />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
      
      {item.isExpanded && (
        <View style={[styles.allergenContent, { backgroundColor: theme.card }]}>
          {/* Related Foods */}
          <Text style={[styles.contentLabel, { color: theme.textSecondary }]}>
            Cross-reacts with:
          </Text>
          
          <View style={styles.relatedFoods}>
            {item.relatedFoods.map((food, foodIndex) => (
              <View key={foodIndex} style={styles.relatedFood}>
                <View style={styles.relatedFoodLeft}>
                  <Text style={styles.relatedFoodEmoji}>{food.emoji}</Text>
                  <Text style={[styles.relatedFoodName, { color: theme.textPrimary }]}>
                    {food.name}
                  </Text>
                </View>
                
                <View style={styles.relatedFoodRight}>
                  <View style={styles.percentageBarContainer}>
                    <View style={[styles.percentageBarBg, { backgroundColor: theme.border }]}>
                      <View 
                        style={[
                          styles.percentageBarFill,
                          { 
                            width: `${food.percentage}%`,
                            backgroundColor: getRiskColor(food.riskLevel),
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.percentageText, { color: theme.textPrimary }]}>
                      {food.percentage}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          {/* Scientific Explanation */}
          <View style={[styles.infoBox, { backgroundColor: isDark ? '#000' : '#F9FAFB' }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="flask" size={18} color={theme.primary} />
              <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>
                Why does this happen?
              </Text>
            </View>
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {item.scientificReason}
            </Text>
          </View>
          
          {/* Advice */}
          <View style={[styles.adviceBox, { backgroundColor: `${item.color}10` }]}>
            <Ionicons name="bulb" size={18} color={item.color} />
            <Text style={[styles.adviceText, { color: isDark ? theme.textPrimary : item.color }]}>
              {item.advice}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  
  // SECTIONS
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  
  // INTRO
  introTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  allergyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  allergyTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // RISK OVERVIEW
  riskCard: {
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  riskTextContainer: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  riskCount: {
    fontSize: 16,
    fontWeight: '700',
  },
  riskDivider: {
    height: 1,
  },
  
  // ALLERGEN CARDS
  allergenCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  allergenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  allergenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  allergenEmoji: {
    fontSize: 40,
  },
  allergenName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  allergenCategory: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // ALLERGEN CONTENT
  allergenContent: {
    padding: 20,
    gap: 20,
  },
  contentLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  relatedFoods: {
    gap: 12,
  },
  relatedFood: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  relatedFoodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  relatedFoodEmoji: {
    fontSize: 24,
  },
  relatedFoodName: {
    fontSize: 15,
    fontWeight: '600',
  },
  relatedFoodRight: {
    width: 140,
  },
  percentageBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  percentageBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  
  // INFO BOX
  infoBox: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // ADVICE BOX
  adviceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  
  // FOOTER
  footerCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  footerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});