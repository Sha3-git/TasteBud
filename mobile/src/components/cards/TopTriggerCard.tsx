import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

interface TopTrigger {
  food: string;
  appearances: number;
  avgSeverity: number;
  emoji: string;
}

export function TopTriggerCard({
  topTrigger,
  theme,
  isDark,
}: {
  topTrigger: TopTrigger;
  theme: any;
  isDark: boolean;
}) {
  // Severity ring calculations
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const severityPercent = (topTrigger.avgSeverity / 10) * 100;
  const strokeDashoffset = circumference - (severityPercent / 100) * circumference;

  return (
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
        {/* Decorative background circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />

        <View style={styles.heroContent}>
          {/* Top row: Severity ring + Food info */}
          <View style={styles.topRow}>
            {/* Severity Ring */}
            <View style={styles.ringContainer}>
              <Svg width={size} height={size} style={styles.svg}>
                {/* Background circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(127,29,29,0.15)'}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Progress circle */}
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={isDark ? '#FFF' : '#7F1D1D'}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  rotation="-90"
                  origin={`${size / 2}, ${size / 2}`}
                />
              </Svg>
              <View style={styles.ringCenter}>
                <Text style={[styles.ringValue, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
                  {topTrigger.avgSeverity.toFixed(1)}
                </Text>
                <Text style={[styles.ringLabel, { color: isDark ? 'rgba(255,255,255,0.8)' : '#991B1B' }]}>
                  /10
                </Text>
              </View>
            </View>

            {/* Food info */}
            <View style={styles.foodInfo}>
              <Text style={[styles.heroFoodName, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
                {topTrigger.food}
              </Text>
              <Text style={[styles.heroStats, { color: isDark ? 'rgba(255,255,255,0.9)' : '#991B1B' }]}>
                {topTrigger.appearances} symptomatic meals
              </Text>
              <View style={[styles.severityBadge, { backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(127,29,29,0.1)' }]}>
                <Ionicons 
                  name="warning" 
                  size={14} 
                  color={isDark ? '#FCD34D' : '#D97706'} 
                />
                <Text style={[styles.severityText, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
                  High correlation
                </Text>
              </View>
            </View>
          </View>

          {/* Recommendation */}
          <View style={[styles.recommendation, { backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(127,29,29,0.12)' }]}>
            <Ionicons name="bulb" size={18} color={isDark ? '#FCD34D' : '#D97706'} />
            <Text style={[styles.recommendationText, { color: isDark ? '#FFF' : '#7F1D1D' }]}>
              Try avoiding {topTrigger.food.toLowerCase()} for 1 week to test
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  // Decorative circles
  decorCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  heroContent: {
    gap: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ringContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  ringCenter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  ringValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  ringLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  foodInfo: {
    flex: 1,
    gap: 6,
  },
  heroFoodName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroStats: {
    fontSize: 14,
    fontWeight: '500',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
});
