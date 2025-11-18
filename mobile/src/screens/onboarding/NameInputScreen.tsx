/**
 * NAME INPUT SCREEN
 * 
 * PURPOSE:
 * - Collects user's first and last name
 * - Required for personalizing user experience
 * 
 * BACKEND INTEGRATION REQUIRED:
 * ==================================
 * 
 * API ENDPOINT NEEDED: PATCH /api/users/{userId}/profile
 * 
 * REQUEST BODY:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe"
 * }
 * 
 * EXPECTED RESPONSE (Success - 200 OK):
 * {
 *   "success": true,
 *   "user": {
 *     "id": "user_123abc",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "email": "john@example.com"
 *   }
 * }
 * 
 * WHEN TO CALL THIS API:
 * - After successful email/password registration
 * - User should already have a userId from previous step
 * 
 * VALIDATION:
 * - Both first and last name are required
 * - Minimum 1 character each (after trimming whitespace)
 * 
 * TODO FOR BACKEND:
 * - Store firstName and lastName in user profile
 * - Return updated user object
 * - Handle special characters in names appropriately
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

interface NameInputScreenProps {
  onBack: () => void;
  onContinue: (firstName: string, lastName: string) => void;
}

export function NameInputScreen({ onBack, onContinue }: NameInputScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const isValid = firstName.trim().length > 0 && lastName.trim().length > 0;
  
  /**
   * handleContinue - Send user's name to backend
   * 
   * BACKEND TEAM: API call implementation example:
   * 
   * const handleContinue = async () => {
   *   try {
   *     const response = await fetch(`YOUR_API_URL/api/users/${userId}/profile`, {
   *       method: 'PATCH',
   *       headers: {
   *         'Content-Type': 'application/json',
   *         'Authorization': `Bearer ${authToken}`
   *       },
   *       body: JSON.stringify({
   *         firstName: firstName.trim(),
   *         lastName: lastName.trim()
   *       })
   *     });
   *     
   *     const data = await response.json();
   *     
   *     if (response.ok) {
   *       onContinue(firstName.trim(), lastName.trim());
   *     } else {
   *       alert(data.error);
   *     }
   *   } catch (error) {
   *     alert('Network error. Please try again.');
   *   }
   * };
   */
  const handleContinue = () => {
    if (isValid) {
      console.log('👤 NAME DATA TO SEND TO BACKEND:', {
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });
      // TODO BACKEND: Replace with actual API call
      onContinue(firstName.trim(), lastName.trim());
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
          <Text style={styles.screenTitle}>What's your name</Text>
          
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor="#666"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            <Text style={styles.inputSubLabel}>First Name</Text>
          </View>
          
          <View style={styles.inputSection}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor="#666"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>
            <Text style={styles.inputSubLabel}>Last Name</Text>
          </View>
        </View>
        
        {isValid && (
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
  screenTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 40,
  },
  inputSection: {
    marginBottom: 40,
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
  inputSubLabel: {
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