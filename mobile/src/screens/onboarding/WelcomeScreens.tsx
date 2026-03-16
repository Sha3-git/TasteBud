import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated } from 'react-native';

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
  const [visibleEmojis, setVisibleEmojis] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const emojis = ['🥗', '🍎', '🥑', '🍳', '🥜'];

  useEffect(() => {
    const emojiInterval = setInterval(() => {
      setVisibleEmojis(prev => {
        if (prev >= emojis.length) {
          clearInterval(emojiInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();

    return () => clearInterval(emojiInterval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Text style={styles.almostThereText}>Almost There</Text>
      <Text style={styles.subtitleText}>Preparing your experience</Text>
      
      <View style={styles.emojiRow}>
        {emojis.map((emoji, index) => (
          <Text
            key={index}
            style={[
              styles.emoji,
              { opacity: index < visibleEmojis ? 1 : 0.2 }
            ]}
          >
            {emoji}
          </Text>
        ))}
      </View>
      
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: progressWidth }
          ]}
        />
      </View>
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
  almostThereText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  emoji: {
    fontSize: 36,
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8ef160',
    borderRadius: 3,
  },
});