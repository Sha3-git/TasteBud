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