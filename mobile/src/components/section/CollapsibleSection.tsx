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


export function CollapsibleSection({
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

const styles = StyleSheet.create({
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
});