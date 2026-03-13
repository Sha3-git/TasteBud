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
import { MyFoodsTab } from '../tabs/MyFoodsTab';
import api from '../../services/apiClient';


export function BrowseResultCard({
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

const styles = StyleSheet.create({
     browseCard: { borderRadius: 12, marginBottom: 8, overflow: 'hidden' },
  browseCardMain: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  browseCardInfo: { flex: 1 },
  browseCardName: { fontSize: 15, fontWeight: '600' },
  browseCardMeta: { fontSize: 12, marginTop: 2 },
  browseCardActions: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingBottom: 14 },
  browseActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  browseActionText: { fontSize: 13, fontWeight: '600' },
});