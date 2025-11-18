/**
 * EMAIL & PASSWORD INPUT SCREEN
 * 
 * PURPOSE:
 * - Collects user's email and password for account creation
 * - Validates email format and password strength
 * 
 * BACKEND INTEGRATION REQUIRED:
 * ==================================
 * 
 * API ENDPOINT NEEDED: POST /api/auth/register
 * 
 * REQUEST BODY:
 * {
 *   "email": "user@example.com",
 *   "password": "securepassword123"
 * }
 * 
 * EXPECTED RESPONSE (Success - 201 Created):
 * {
 *   "success": true,
 *   "userId": "user_123abc",
 *   "message": "Account created successfully"
 * }
 * 
 * EXPECTED RESPONSE (Error - 400 Bad Request):
 * {
 *   "success": false,
 *   "error": "Email already exists"
 * }
 * 
 * VALIDATION REQUIREMENTS:
 * - Email: Must be valid format (contains @ and .)
 * - Password: Minimum 8 characters
 * - Both fields are required
 * 
 * SECURITY NOTES FOR BACKEND:
 * - Hash passwords using bcrypt or similar (NEVER store plain text)
 * - Implement rate limiting to prevent brute force attacks
 * - Validate email uniqueness before creating account
 * - Consider email verification flow (send confirmation email)
 * 
 * TODO:
 * - Add error handling for duplicate emails
 * - Add loading state during API call
 * - Store auth token securely after successful registration
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmailPasswordScreenProps {
  onBack: () => void;
  onContinue: (email: string, password: string) => void;
}

/**
 * validateEmail - Client-side email validation
 * Backend should also validate on server side
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function EmailPasswordScreen({ onBack, onContinue }: EmailPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const isEmailValid = validateEmail(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;
  
  /**
   * handleContinue - Triggered when user presses continue button
   * 
   * BACKEND TEAM: This is where you should make the API call
   * 
   * Example implementation:
   * 
   * const handleContinue = async () => {
   *   try {
   *     const response = await fetch('YOUR_API_URL/api/auth/register', {
   *       method: 'POST',
   *       headers: { 'Content-Type': 'application/json' },
   *       body: JSON.stringify({ email, password })
   *     });
   *     
   *     const data = await response.json();
   *     
   *     if (response.ok) {
   *       // Success - store userId and proceed to next screen
   *       onContinue(email, password);
   *     } else {
   *       // Error - show error message to user
   *       alert(data.error);
   *     }
   *   } catch (error) {
   *     alert('Network error. Please try again.');
   *   }
   * };
   */
  const handleContinue = () => {
    if (isFormValid) {
      console.log('📧 EMAIL/PASSWORD TO SEND TO BACKEND:', { email, password });
      // TODO BACKEND: Replace this with actual API call
      onContinue(email, password);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerBrand}>TasteBud</Text>
        </View>
        
        <View style={styles.formContent}>
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Enter your email</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="john.doe@gmail.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {isEmailValid && (
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.validIcon} />
              )}
            </View>
          </View>
          
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Create a password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••••"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>8 characters minimum</Text>
          </View>
        </View>
        
        {isFormValid && (
          <TouchableOpacity 
            onPress={handleContinue}
            style={styles.continueButton}
            activeOpacity={0.8}
          >
            <Text style={styles.continueIcon}>→</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 28,
  },
  headerBrand: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginRight: 40,
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputSection: {
    marginBottom: 40,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  input: {
    color: '#fff',
    fontSize: 18,
    paddingVertical: 12,
    flex: 1,
  },
  validIcon: {
    marginLeft: 8,
  },
  eyeButton: {
    padding: 8,
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  continueButton: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueIcon: {
    color: '#000',
    fontSize: 28,
    fontWeight: '600',
  },
});