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
            onPress={onLoginPress}  
          >
            <Text style={styles.loginButtonText}>Login </Text>
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