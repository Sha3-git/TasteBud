/**
 * SYMPTOM ANALYSIS SCREEN
 * 
 * Features:
 * - Personalized insights (not just data dumps)
 * - Top trigger identification
 * - Monthly improvement tracking
 * - Top 5 trigger foods
 * - Weekly trend visualization
 * - Time-of-day patterns
 * - Beautiful, actionable UI
 * 
 * Possible Backend Integration?:
 * GET /api/users/{userId}/symptom-analysis?month={month}&year={year}
 */

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
import { TopTriggerCard } from '../../components/cards/TopTriggerCard';
import { useAnalysis } from '../../hooks/useAnalysis';

interface SymptomAnalysisScreenProps {
  onBack: () => void;
}

const { width } = Dimensions.get('window');

export function SymptomAnalysisScreen({ onBack }: SymptomAnalysisScreenProps) {
  const { theme, isDark } = useTheme();
  const {topTrigger, topTriggers, loading} = useAnalysis();
  console.log("top trigger " + loading)
  
  const [analysisData] = useState({
    topTrigger: {
      food: 'Wheat',
      appearances: 8,
      avgSeverity: 6.5,
      emoji: '🌾',
    },
    monthlyImprovement: 40, // 40% fewer symptoms than last month
    weeklyTrend: [
      { week: 'Week 1', avgSeverity: 7.2 },
      { week: 'Week 2', avgSeverity: 5.8 },
      { week: 'Week 3', avgSeverity: 4.1 },
      { week: 'Week 4', avgSeverity: 3.5 },
    ],
    timeOfDay: {
      breakfast: 15,
      lunch: 45,
      dinner: 40,
    },
    topTriggers: [
      { food: 'Wheat', count: 8, emoji: '🌾' },
      { food: 'Eggs', count: 6, emoji: '🥚' },
      { food: 'Dairy', count: 4, emoji: '🥛' },
      { food: 'Peanuts', count: 3, emoji: '🥜' },
      { food: 'Shellfish', count: 2, emoji: '🦐' },
    ],
    totalSymptoms: 23,
    symptomFreeDays: 7,
  });
  
  
    if (loading) {
      return (
        <SafeAreaView
          style={[styles.container, { backgroundColor: theme.background }]}
        >
          <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>
              Loading...
            </Text>
          </View>
        </SafeAreaView>
      );
    }
  const maxTriggerCount = Math.max(...topTriggers.map(t => t.count));
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Symptom Analysis
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TopTriggerCard
        topTrigger={topTrigger}
        theme={theme}
        isDark={isDark}
        />
     
        
        {/* Monthly Progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            This month
          </Text>
          
          <View style={[styles.progressCard, { backgroundColor: theme.card }]}>
            <View style={styles.progressHeader}>
              <View>
                <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
                  Monthly improvement
                </Text>
                <Text style={[styles.progressValue, { color: theme.success }]}>
                  {analysisData.monthlyImprovement}% fewer symptoms! 🎉
                </Text>
              </View>
              <View style={styles.progressRing}>
                <View style={[styles.progressRingOuter, { borderColor: theme.success }]}>
                  <Text style={[styles.progressPercentage, { color: theme.success }]}>
                    {analysisData.monthlyImprovement}%
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Quick Stats */}
            <View style={styles.quickStats}>
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatNumber, { color: theme.textPrimary }]}>
                  {analysisData.totalSymptoms}
                </Text>
                <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>
                  total symptoms
                </Text>
              </View>
              <View style={[styles.quickStatDivider, { backgroundColor: theme.border }]} />
              <View style={styles.quickStat}>
                <Text style={[styles.quickStatNumber, { color: theme.success }]}>
                  {analysisData.symptomFreeDays}
                </Text>
                <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>
                  symptom-free days
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Weekly Trend */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Weekly trend
          </Text>
          
          <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
            <View style={styles.chart}>
              {analysisData.weeklyTrend.map((week, index) => {
                const maxSeverity = 10;
                const barHeight = (week.avgSeverity / maxSeverity) * 120;
                const isImproving = index > 0 && week.avgSeverity < analysisData.weeklyTrend[index - 1].avgSeverity;
                
                return (
                  <View key={index} style={styles.chartBar}>
                    <View style={styles.chartBarContainer}>
                      <LinearGradient
                        colors={isImproving 
                          ? ['#86EFAC', '#4ADE80']
                          : ['#FCA5A5', '#EF4444']
                        }
                        style={[styles.chartBarFill, { height: barHeight }]}
                      >
                        <Text style={styles.chartBarValue}>
                          {week.avgSeverity}
                        </Text>
                      </LinearGradient>
                    </View>
                    <Text style={[styles.chartLabel, { color: theme.textSecondary }]}>
                      {week.week.replace('Week ', 'W')}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={[styles.chartCaption, { color: theme.textSecondary }]}>
              Average severity per week (0-10 scale)
            </Text>
          </View>
        </View>
        
        {/* Time of Day Patterns */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Your danger times
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            When symptoms occur most
          </Text>
          
          <View style={[styles.timeCard, { backgroundColor: theme.card }]}>
            <TimeOfDayBar
              icon="sunny"
              label="Breakfast"
              percentage={analysisData.timeOfDay.breakfast}
              color="#FCD34D"
              theme={theme}
            />
            <TimeOfDayBar
              icon="partly-sunny"
              label="Lunch"
              percentage={analysisData.timeOfDay.lunch}
              color="#FB923C"
              theme={theme}
              isDanger
            />
            <TimeOfDayBar
              icon="moon"
              label="Dinner"
              percentage={analysisData.timeOfDay.dinner}
              color="#A78BFA"
              theme={theme}
            />
          </View>
        </View>
        
        {/* Top Trigger Foods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Top trigger foods
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Foods that caused reactions
          </Text>
          
          <View style={styles.triggersGrid}>
            {topTriggers.map((trigger, index) => (
              <TriggerCard
                key={index}
                rank={index + 1}
                emoji={trigger.emoji}
                food={trigger.food}
                count={trigger.count}
                maxCount={maxTriggerCount}
                theme={theme}
                isDark={isDark}
              />
            ))}
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}


function TimeOfDayBar({
  icon,
  label,
  percentage,
  color,
  isDanger,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  percentage: number;
  color: string;
  isDanger?: boolean;
  theme: any;
}) {
  return (
    <View style={styles.timeRow}>
      <View style={styles.timeRowLeft}>
        <Ionicons name={icon} size={20} color={color} />
        <Text style={[styles.timeLabel, { color: theme.textPrimary }]}>
          {label}
        </Text>
      </View>
      
      <View style={styles.timeRowRight}>
        <View style={[styles.timeBar, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.timeBarFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: color,
              }
            ]} 
          />
        </View>
        <Text style={[styles.timePercentage, { color: isDanger ? '#EF4444' : theme.textPrimary }]}>
          {percentage}%
        </Text>
        {isDanger && (
          <View style={styles.dangerBadge}>
            <Text style={styles.dangerText}>⚠️</Text>
          </View>
        )}
      </View>
    </View>
  );
}



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
  
  // HERO CARD
 
  
  // PROGRESS CARD
  progressCard: {
    borderRadius: 20,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  progressRing: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700',
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  quickStatDivider: {
    width: 1,
    height: 50,
  },
  
  // CHART
  chartCard: {
    borderRadius: 20,
    padding: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: 16,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBarContainer: {
    width: '80%',
    height: 120,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 30,
  },
  chartBarValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartCaption: {
    fontSize: 12,
    textAlign: 'center',
  },
  
  // TIME OF DAY
  timeCard: {
    borderRadius: 20,
    padding: 20,
    gap: 20,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 120,
  },
  timeLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  timeRowRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timeBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  timePercentage: {
    fontSize: 15,
    fontWeight: '700',
    width: 45,
    textAlign: 'right',
  },
  dangerBadge: {
    marginLeft: 4,
  },
  dangerText: {
    fontSize: 16,
  },
  
  // TRIGGERS GRID
  triggersGrid: {
    gap: 12,
  }, 
});