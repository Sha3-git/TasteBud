/**
 * WELCOME SCREENS (Transition Screens)
 */
import React, { useEffect, useRef, useState } from 'react';
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
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [visibleEmojis, setVisibleEmojis] = useState(0);
  const foodEmojis = ['🥗', '🍎', '🥑', '🍳', '🥜'];
  
  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start();
    
    // Show emojis progressively
    foodEmojis.forEach((_, index) => {
      setTimeout(() => {
        setVisibleEmojis(index + 1);
      }, (index + 1) * 400);
    });
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
      
      {/* Food emoji row - appear progressively */}
      <View style={styles.emojiRow}>
        {foodEmojis.map((emoji, index) => (
          <Animated.Text 
            key={index} 
            style={[
              styles.foodEmoji,
              { opacity: index < visibleEmojis ? 1 : 0.2 }
            ]}
          >
            {emoji}
          </Animated.Text>
        ))}
      </View>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
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
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 40,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  foodEmoji: {
    fontSize: 36,
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
});
