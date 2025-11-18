/**
 * PROFILE SCREEN - CLEAN, ALIVE & PERSONAL
 * 
 * Design Philosophy:
 * - Personal and warm (not corporate)
 * - Clean cards like the rest of the app
 * - Breathing room, beautiful spacing
 * - Matches home screen aesthetic
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
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

interface ProfileScreenProps {
  onBack: () => void;
  onEditAllergies: () => void;
  onSignOut: () => void;
}

export function ProfileScreen({ onBack, onEditAllergies, onSignOut }: ProfileScreenProps) {
  const { theme, isDark } = useTheme();
  
  /**
   * TODO BACKEND: Fetch user profile
   * GET /api/users/{userId}/profile
   */
  const [profile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
    allergies: ['Peanuts', 'Shellfish', 'Dairy'],
    memberSince: '2024-01-15',
    totalMeals: 247,
    symptomFreeDays: 45,
  });
  
  const [notifications, setNotifications] = useState({
    mealReminders: true,
    reactionAlerts: true,
    weeklyReports: false,
  });
  
  const handleToggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications],
    }));
  };
  
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Download all your meal logs and symptom data',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {} },
      ]
    );
  };
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onSignOut },
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
          Profile
        </Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero */}
        <View style={styles.profileSection}>
          <View style={[styles.avatarLarge, { 
            backgroundColor: isDark ? '#7C3AED' : '#E0E7FF' 
          }]}>
            <Text style={[styles.avatarLargeText, { 
              color: isDark ? '#FFF' : '#6366F1' 
            }]}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>
            {profile.name}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
            {profile.email}
          </Text>
          
          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color: theme.textPrimary }]}>
                {profile.totalMeals}
              </Text>
              <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>
                meals logged
              </Text>
            </View>
            <View style={[styles.quickStatDivider, { backgroundColor: theme.border }]} />
            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color: theme.success }]}>
                {profile.symptomFreeDays}
              </Text>
              <Text style={[styles.quickStatLabel, { color: theme.textSecondary }]}>
                symptom-free days
              </Text>
            </View>
          </View>
        </View>
        
        {/* Your Allergies */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Your Allergies
            </Text>
            <TouchableOpacity onPress={onEditAllergies}>
              <Text style={[styles.editLink, { color: theme.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            {profile.allergies.map((allergy, index) => (
              <View key={index}>
                <View style={styles.allergyRow}>
                  <View style={styles.allergyLeft}>
                    <View style={[styles.allergyDot, { backgroundColor: theme.danger }]} />
                    <Text style={[styles.allergyName, { color: theme.textPrimary }]}>
                      {allergy}
                    </Text>
                  </View>
                  <Ionicons name="warning" size={20} color={theme.danger} />
                </View>
                {index < profile.allergies.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: theme.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>
        
        
        
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Notifications
          </Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="restaurant" size={22} color={theme.textPrimary} />
                <Text style={[styles.settingText, { color: theme.textPrimary }]}>
                  Meal Reminders
                </Text>
              </View>
              <Switch
                value={notifications.mealReminders}
                onValueChange={() => handleToggleNotification('mealReminders')}
                trackColor={{ false: '#D1D5DB', true: theme.primary }}
                thumbColor="#FFF"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="alert-circle" size={22} color={theme.textPrimary} />
                <Text style={[styles.settingText, { color: theme.textPrimary }]}>
                  Reaction Alerts
                </Text>
              </View>
              <Switch
                value={notifications.reactionAlerts}
                onValueChange={() => handleToggleNotification('reactionAlerts')}
                trackColor={{ false: '#D1D5DB', true: theme.primary }}
                thumbColor="#FFF"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="stats-chart" size={22} color={theme.textPrimary} />
                <Text style={[styles.settingText, { color: theme.textPrimary }]}>
                  Weekly Reports
                </Text>
              </View>
              <Switch
                value={notifications.weeklyReports}
                onValueChange={() => handleToggleNotification('weeklyReports')}
                trackColor={{ false: '#D1D5DB', true: theme.primary }}
                thumbColor="#FFF"
              />
            </View>
          </View>
        </View>
        
        {/* More Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            More
          </Text>
          
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              style={styles.optionRow}
              onPress={handleExportData}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="download" size={22} color={theme.textPrimary} />
                <Text style={[styles.settingText, { color: theme.textPrimary }]}>
                  Export Data
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="help-circle" size={22} color={theme.textPrimary} />
                <Text style={[styles.settingText, { color: theme.textPrimary }]}>
                  Help & Support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            
            <TouchableOpacity style={styles.optionRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle" size={22} color={theme.textPrimary} />
                <Text style={[styles.settingText, { color: theme.textPrimary }]}>
                  About TasteBud
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={[styles.signOutButton, { backgroundColor: `${theme.danger}15` }]}
          >
            <Ionicons name="log-out" size={22} color={theme.danger} />
            <Text style={[styles.signOutText, { color: theme.danger }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textTertiary }]}>
            TasteBud v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: theme.textTertiary }]}>
            Member since {new Date(profile.memberSince).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </Text>
        </View>
        
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
  
  // PROFILE
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLargeText: {
    fontSize: 40,
    fontWeight: '700',
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    marginBottom: 24,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 13,
  },
  quickStatDivider: {
    width: 1,
    height: 48,
  },
  
  // SECTIONS
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  editLink: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  // CARD
  card: {
    borderRadius: 16,
    padding: 20,
  },
  
  // ALLERGY
  allergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  allergyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  allergyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  allergyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // SETTINGS
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  
  // OPTIONS
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  
  // DIVIDER
  divider: {
    height: 1,
    marginVertical: 8,
  },
  
  // SIGN OUT
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '700',
  },
  
  // FOOTER
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});