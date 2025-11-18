/**
 * SPLASH SCREEN
 * 
 * PURPOSE:
 * - First screen users see when opening the app
 * - Shows TasteBud branding for 3 seconds
 * - Auto-transitions to Auth screen
 * 
 * BACKEND INTEGRATION:
 * - No backend integration needed for this screen
 * - This is purely a UI/branding screen
 * 
 * FUTURE ENHANCEMENTS:
 * - Could check if user is already logged in (check auth token)
 * - If logged in, skip to HomeScreen instead of AuthScreen
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.logo}>TasteBud</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '600',
  },
});