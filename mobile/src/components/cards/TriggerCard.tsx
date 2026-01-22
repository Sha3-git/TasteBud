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

export function TriggerCard({
  rank,
  emoji,
  food,
  count,
  maxCount,
  theme,
  isDark,
}: {
  rank: number;
  emoji: string;
  food: string;
  count: number;
  maxCount: number;
  theme: any;
  isDark: boolean;
}) {
  const opacity = 0.5 + (count / maxCount) * 0.5;
  
  return (
    <View style={[styles.triggerCard, { backgroundColor: theme.card }]}>
      <View style={styles.triggerRank}>
        <Text style={[styles.triggerRankText, { color: theme.textSecondary }]}>
          #{rank}
        </Text>
      </View>
      
      <Text style={styles.triggerEmoji}>{emoji}</Text>
      
      <Text style={[styles.triggerFood, { color: theme.textPrimary }]}>
        {food}
      </Text>
      
      <View style={styles.triggerCountContainer}>
        <View style={[styles.triggerCountBar, { backgroundColor: theme.border }]}>
          <View 
            style={[
              styles.triggerCountFill,
              { 
                width: `${(count / maxCount) * 100}%`,
                backgroundColor: rank === 1 ? '#EF4444' : rank <= 3 ? '#F59E0B' : '#6B7280',
                opacity,
              }
            ]} 
          />
        </View>
        <Text style={[styles.triggerCount, { color: theme.textPrimary }]}>
          {count} reactions
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    triggerCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  triggerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerRankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  triggerEmoji: {
    fontSize: 32,
  },
  triggerFood: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  triggerCountContainer: {
    width: 120,
    gap: 4,
  },
  triggerCountBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  triggerCountFill: {
    height: '100%',
    borderRadius: 3,
  },
  triggerCount: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
  },
})