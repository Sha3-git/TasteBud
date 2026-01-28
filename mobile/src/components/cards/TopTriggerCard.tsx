import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { TriggerCard } from '../../components/cards/TriggerCard';
import { useAnalysis } from '../../hooks/useAnalysis';
interface TopTrigger{
    food: string,
    appearances: number,
    avgSeverity: number,
    emoji: string,
}
export function TopTriggerCard({topTrigger, theme, isDark}: {topTrigger: TopTrigger; theme: any; isDark: boolean;}){
    return(
        <>
           <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                    Your biggest trigger
                  </Text>
                  
                  <LinearGradient
                    colors={isDark ? ['#EF4444', '#DC2626'] : ['#FEE2E2', '#FECACA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.heroCard}
                  >
                    <View style={styles.heroContent}>
                      <Text style={styles.heroEmoji}>
                        {topTrigger.emoji}
                      </Text>
                      <Text style={[styles.heroFoodName, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
                        {topTrigger.food}
                      </Text>
                      <Text style={[styles.heroStats, { color: isDark ? 'rgba(255,255,255,0.9)' : '#991B1B' }]}>
                        Appeared in {topTrigger.appearances} symptomatic meals
                      </Text>
                      <View style={[styles.severityBadge, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(127,29,29,0.1)' }]}>
                        <Text style={[styles.severityText, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
                          Avg severity: {topTrigger.avgSeverity}/10
                        </Text>
                      </View>
                      
                      {/* Recommendation */}
                      <View style={[styles.recommendation, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(127,29,29,0.15)' }]}>
                        <Ionicons name="bulb" size={20} color={isDark ? '#FCD34D' : '#D97706'} />
                        <Text style={[styles.recommendationText, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
                          Try avoiding {topTrigger.food.toLowerCase()} for 1 week
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
        </>
    )
}

const styles = StyleSheet.create({
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
     heroCard: {
    borderRadius: 24,
    padding: 24,
    minHeight: 240,
  },
  heroContent: {
    alignItems: 'center',
    gap: 12,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  heroFoodName: {
    fontSize: 28,
    fontWeight: '700',
  },
  heroStats: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
})