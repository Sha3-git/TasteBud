import React, {  useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function MealSymptomHeroCard({
  mealCount,
  reacCount,
  onPress,
  isDark,
}: {
  mealCount: number;
  reacCount: number;
  onPress: () => void;
  isDark: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 400,
    }).start();
  };
  
  return (
    
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={isDark ? ['#FCD34D', '#F59E0B'] : ['#FDE68A', '#FCD34D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <Text style={styles.heroTitle}>Meal & Symptom Logs</Text>
            <Ionicons name="restaurant" size={24} color="#92400E" />
          </View>
          
          {/* Big Radial Display */}
          <View style={styles.heroRadial}>
            <View style={styles.heroCircle}>
              <Text style={styles.heroValue}>{mealCount}</Text>
              <Text style={styles.heroSubtext}>meals today</Text>
            </View>
          </View>
          
          {/* Bottom Stats */}
          <View style={styles.heroBottom}>
            <View style={styles.heroStat}>
              <View style={[styles.heroDot, { backgroundColor: reacCount > 0 ? '#EF4444' : '#22C55E' }]} />
              <Text style={styles.heroStatText}>
                <Text style={styles.heroStatBold}>{reacCount}</Text> reactions
              </Text>
            </View>
            <TouchableOpacity style={styles.heroAction} onPress={onPress}>
              <Text style={styles.heroActionText}>View details</Text>
              <Ionicons name="arrow-forward" size={16} color="#92400E" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({ 
    heroSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  heroCard: {
    borderRadius: 32,
    padding: 24,
    minHeight: 260,
    justifyContent: 'space-between',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400E',
  },
  heroRadial: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  heroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 8,
    borderColor: '#F59E0B',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#92400E',
  },
  heroSubtext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92400E',
    marginTop: 4,
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroStatText: {
    fontSize: 14,
    color: '#92400E',
  },
  heroStatBold: {
    fontWeight: '700',
  },
  heroAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
  }
})
