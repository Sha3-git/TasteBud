/**
 * NOTIFICATIONS SCREEN - MINIMAL
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface NotificationsScreenProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { theme, isDark } = useTheme();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '7 Day Streak! 🎉',
      message: "You've logged meals for 7 days straight",
      time: '2h ago',
    },
    {
      id: '2',
      title: 'Possible Reaction',
      message: 'You logged symptoms after eating dairy',
      time: '5h ago',
    },
    {
      id: '3',
      title: 'Weekly Report Ready',
      message: '40% improvement this week',
      time: '1d ago',
    },
  ]);
  
  const clearAll = () => {
    Alert.alert(
      'Clear Notifications',
      'Remove all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: () => setNotifications([]) },
      ]
    );
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
          Notifications
        </Text>
        <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
          <Text style={[styles.clearText, { color: theme.primary }]}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              All caught up!
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              No new notifications
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((notification, index) => (
              <View key={notification.id}>
                <View style={styles.item}>
                  <Text style={[styles.title, { color: theme.textPrimary }]}>
                    {notification.title}
                  </Text>
                  <Text style={[styles.message, { color: theme.textSecondary }]}>
                    {notification.message}
                  </Text>
                  <Text style={[styles.time, { color: theme.textTertiary }]}>
                    {notification.time}
                  </Text>
                </View>
                {index < notifications.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                )}
              </View>
            ))}
          </View>
        )}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  // LIST
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  
  // ITEM
  item: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
  },
  
  // DIVIDER
  divider: {
    height: 1,
  },
  
  // EMPTY
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
  },
});