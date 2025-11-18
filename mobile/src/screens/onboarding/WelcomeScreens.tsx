/**
 * WELCOME SCREENS (Transition Screens)
 * 
 * PURPOSE:
 * - Three celebratory screens shown after user completes registration
 * - Provides positive feedback and smooth transition to main app
 * 
 * SCREENS INCLUDED:
 * 1. SetupProgressScreen - "Setting Up Your Account" (2 seconds)
 * 2. WelcomeUserScreen - "Welcome [FirstName]" (2.5 seconds)
 * 3. GreatChoiceScreen - "You've Made a Great Choice [FirstName]!" (2.5 seconds)
 * 
 * BACKEND INTEGRATION:
 * - No API calls needed for these screens
 * - These are purely UI/UX delight screens
 * 
 * NOTES:
 * - These screens auto-transition (no user interaction needed)
 * - They provide time for any background data syncing if needed
 * - Could add subtle animations with react-native-reanimated in future
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

/**
 * SetupProgressScreen - Shows while account is being set up
 * Could show loading spinner or progress indicator here
 */
export function SetupProgressScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.setupText}>Setting Up{'\n'}Your Account</Text>
    </View>
  );
}

/**
 * WelcomeUserScreen - Personalized welcome with user's first name
 */
export function WelcomeUserScreen({ userName }: { userName: string }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.welcomeName}>{userName}</Text>
    </View>
  );
}

/**
 * GreatChoiceScreen - Final congratulatory message
 */
export function GreatChoiceScreen({ userName }: { userName: string }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.greatChoiceText}>
        You've Made a Great{'\n'}Choice!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  setupText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 44,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeName: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '600',
  },
  greatChoiceText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 40,
  },
});