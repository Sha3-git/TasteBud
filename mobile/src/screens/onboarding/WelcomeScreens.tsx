
import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export function SetupProgressScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.setupText}>Setting Up{'\n'}Your Account</Text>
    </View>
  );
}


export function WelcomeUserScreen({ userName }: { userName: string }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.welcomeName}>{userName}</Text>
    </View>
  );
}


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