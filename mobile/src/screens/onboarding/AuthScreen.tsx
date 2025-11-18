/**
 * AUTH SCREEN (Sign Up / Login Selection)
 * 
 * PURPOSE:
 * - User chooses between creating a new account or logging into existing account
 * - Entry point for authentication flow
 * 
 * BACKEND INTEGRATION:
 * - No API calls on this screen
 * - This screen just routes users to the appropriate authentication flow
 * 
 * NAVIGATION:
 * - "Sign up with email" → EmailPasswordScreen (for new users)
 * - "Login" → Login flow (NOT YET IMPLEMENTED - needs backend team)
 * 
 * TODO FOR BACKEND TEAM:
 * - Implement Login screen and authentication endpoint
 * - Add OAuth providers if needed (Google, Apple Sign-In, etc.)
 */

import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

interface AuthScreenProps {
  onSignUpPress: () => void;
  onLoginPress: () => void;
}

export function AuthScreen({ onSignUpPress, onLoginPress }: AuthScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <Text style={styles.logo}>TasteBud</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.signupButton]}
            onPress={onSignUpPress}
          >
            <Text style={styles.signupButtonText}>Sign up with email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={onLoginPress}  // <-- This now goes to home!
          >
            <Text style={styles.loginButtonText}>Login (Skip to Home)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 80,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#fff',
  },
  signupButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});