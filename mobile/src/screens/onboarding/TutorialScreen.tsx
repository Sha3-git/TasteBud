/**
 * TUTORIAL SCREEN
 * Simple. Intentional. Human.
 * With thoughtful micro-interactions.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../theme/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TutorialScreenProps {
  onComplete: () => void;
  showSkip?: boolean;
}

// Typewriter component
const Typewriter = ({ 
  text, 
  style, 
  delay = 0, 
  speed = 40,
  onComplete 
}: { 
  text: string; 
  style: any; 
  delay?: number; 
  speed?: number;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    let interval: NodeJS.Timeout;
    
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          onComplete?.();
        }
      }, speed);
    }, delay);
    
    return () => {
      clearTimeout(startTimeout);
      if (interval) clearInterval(interval);
    };
  }, [text]);

  return <Text style={style}>{displayedText}</Text>;
};

// Floating dot for "connecting" animation
const ConnectingDot = ({ delay, startPos, endPos, duration, color }: any) => {
  const position = useRef(new Animated.ValueXY(startPos)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(position, {
          toValue: endPos,
          duration: duration,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(duration - 300),
          Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.connectingDot,
        {
          backgroundColor: color,
          opacity,
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { scale },
          ],
        },
      ]}
    />
  );
};

// Smooth animated progress dot (expands into a pill shape when active)
const ProgressDot = ({ isActive, color, inactiveColor }: { isActive: boolean, color: string, inactiveColor: string }) => {
  const widthAnim = useRef(new Animated.Value(isActive ? 24 : 8)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: isActive ? 24 : 8,
      useNativeDriver: false,
      friction: 8,
      tension: 50,
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={[
        styles.progressDot,
        {
          width: widthAnim,
          backgroundColor: isActive ? color : inactiveColor,
        },
      ]}
    />
  );
};

const SLIDES = [
  {
    id: 'intro',
    type: 'text',
    line1: 'Food reactions',
    line2: 'are confusing.',
    line3: 'They can take minutes. Or days.',
    line4: 'Most people give up trying to figure it out.',
  },
  {
    id: 'meals',
    type: 'video',
    video: require('../../../assets/videos/tutorial_1_log_meals.mp4'),
    caption: 'Log What You Eat',
    subCaption: 'Track your ingredients with precision.',
  },
  {
    id: 'symptoms',
    type: 'video',
    video: require('../../../assets/videos/tutorial_2_track_symptoms.mp4'),
    caption: 'Record How You Feel',
    subCaption: 'Note your symptoms exactly when they happen.',
  },
  {
    id: 'analysis',
    type: 'dramatic',
    video: require('../../../assets/videos/tutorial_3_ai_detection.mp4'),
    dramaticText: 'We find the patterns',
    caption: 'We Find The Patterns',
    subCaption: 'Connecting the dots behind the scenes.',
  },
  {
    id: 'library',
    type: 'video',
    video: require('../../../assets/videos/tutorial_4_food_library.mp4'),
    caption: 'Build Your Library',
    subCaption: 'Know exactly what works best for your body.',
  },
  {
    id: 'cross',
    type: 'video',
    video: require('../../../assets/videos/tutorial_5_cross_reactivity.mp4'),
    caption: 'Stay One Step Ahead',
    subCaption: 'Identify hidden cross-reactivities early on.',
  },
  {
    id: 'outro',
    type: 'text',
    line1: 'Your body',
    line2: 'knows things.',
    line3: '',
    line4: 'Let\'s help you listen.',
    isLast: true,
  },
];

export function TutorialScreen({ onComplete, showSkip = true }: TutorialScreenProps) {
  const { theme, isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<Video>(null);
  const dramaticVideoRef = useRef<Video>(null);
  
  // Dynamic Background Colors
  const bgColor = isDark ? '#141617' : '#fdfde9';
  
  // Dramatic slide state
  const [dramaticPhase, setDramaticPhase] = useState<'text' | 'video'>('text');
  const dramaticFadeOut = useRef(new Animated.Value(1)).current;
  const videoFadeIn = useRef(new Animated.Value(0)).current;
  const [showDots, setShowDots] = useState(false);
  const [dramaticTypewriterDone, setDramaticTypewriterDone] = useState(false);

  const currentSlide = SLIDES[currentIndex];
  const isLastSlide = currentIndex === SLIDES.length - 1;

  // Button glow effect on the last slide
  useEffect(() => {
    if (isLastSlide) {
      Animated.sequence([
        Animated.delay(2000), // Wait 2 seconds
        Animated.timing(buttonGlowAnim, {
          toValue: 1, // Stay glowing at full opacity
          duration: 5000,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      buttonGlowAnim.stopAnimation();
      buttonGlowAnim.setValue(0);
    }
  }, [isLastSlide]);

  // Reset dramatic state when entering the dramatic slide
  useEffect(() => {
    if (currentSlide.type === 'dramatic') {
      setDramaticPhase('text');
      setShowDots(false);
      setDramaticTypewriterDone(false);
      dramaticFadeOut.setValue(1);
      videoFadeIn.setValue(0);
    }
  }, [currentIndex]);

  // Handle dramatic slide animation
  useEffect(() => {
    if (dramaticTypewriterDone && currentSlide.type === 'dramatic') {
      // Show dots
      setTimeout(() => setShowDots(true), 300);
      
      // After dots converge, fade out text and fade in video cinematically
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        // Fade out text
        Animated.timing(dramaticFadeOut, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          setDramaticPhase('video');
          
          // Fade in video
          Animated.timing(videoFadeIn, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            dramaticVideoRef.current?.playAsync();
          });
        });
      }, 1800);
    }
  }, [dramaticTypewriterDone]);

  useEffect(() => {
    if (currentSlide.type === 'video' && videoRef.current) {
      videoRef.current.replayAsync();
    }
  }, [currentIndex]);

  const animateOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isLastSlide) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onComplete();
    } else {
      animateOut(() => setCurrentIndex(prev => prev + 1));
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateOut(() => setCurrentIndex(prev => prev - 1));
    }
  };

  const renderConnectingDots = () => {
    const positions = [
      { start: { x: -80, y: -100 }, end: { x: 0, y: 0 } },
      { start: { x: 100, y: -60 }, end: { x: 0, y: 0 } },
      { start: { x: -60, y: 80 }, end: { x: 0, y: 0 } },
      { start: { x: 90, y: 70 }, end: { x: 0, y: 0 } },
      { start: { x: 0, y: -120 }, end: { x: 0, y: 0 } },
      { start: { x: -110, y: 20 }, end: { x: 0, y: 0 } },
    ];
    
    const colors = isDark 
      ? ['#60A5FA', '#34D399', '#FBBF24', '#F472B6', '#A78BFA', '#22D3EE']
      : ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];

    return positions.map((pos, i) => (
      <ConnectingDot
        key={i}
        delay={i * 150}
        startPos={pos.start}
        endPos={pos.end}
        duration={800 + i * 100}
        color={colors[i]}
      />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Top bar */}
        <View style={styles.topBar}>
          {currentIndex > 0 ? (
            <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.topBarText, { color: theme.textTertiary }]}>Back</Text>
            </TouchableOpacity>
          ) : <View />}
          
          {showSkip && !isLastSlide ? (
            <TouchableOpacity onPress={onComplete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.topBarText, { color: theme.textTertiary }]}>Skip</Text>
            </TouchableOpacity>
          ) : <View />}
        </View>

        {/* Main content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          {/* DRAMATIC SLIDE */}
          {currentSlide.type === 'dramatic' ? (
            <View style={styles.dramaticContainer}>
              {/* Phase 1: Centered text with dots */}
              {dramaticPhase === 'text' && (
                <Animated.View
                  style={[
                    styles.dramaticTextContainer,
                    { opacity: dramaticFadeOut },
                  ]}
                >
                  {showDots && (
                    <View style={styles.dotsContainer}>
                      {renderConnectingDots()}
                    </View>
                  )}
                  <Typewriter
                    text={currentSlide.dramaticText!}
                    style={[styles.dramaticText, { color: theme.textPrimary }]}
                    speed={60}
                    onComplete={() => setDramaticTypewriterDone(true)}
                  />
                </Animated.View>
              )}
              
              {/* Phase 2: Video with caption */}
              {dramaticPhase === 'video' && (
                <Animated.View style={[styles.videoSlideContainer, { opacity: videoFadeIn }]}>
                  <View style={styles.videoWrapper}>
                    <View style={[styles.videoGlow, { 
                      shadowColor: isDark ? '#000' : '#1e293b',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    }]}>
                      <Video
                        ref={dramaticVideoRef}
                        source={currentSlide.video}
                        style={styles.video}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        isMuted
                        shouldPlay={true}
                      />
                    </View>
                  </View>
                  <View style={styles.captionArea}>
                    <Typewriter
                      key={`${currentSlide.id}-cap`}
                      text={currentSlide.caption!}
                      style={[styles.caption, { color: theme.textPrimary }]}
                      speed={35}
                    />
                    {currentSlide.subCaption && (
                      <Typewriter
                        key={`${currentSlide.id}-sub`}
                        text={currentSlide.subCaption}
                        style={[styles.subCaption, { color: theme.textSecondary }]}
                        delay={currentSlide.caption!.length * 35 + 200}
                        speed={25}
                      />
                    )}
                  </View>
                </Animated.View>
              )}
            </View>
          ) : currentSlide.type === 'video' ? (
            <>
              {/* VIDEO SLIDE */}
              <View style={styles.videoSlideContainer}>
                <View style={styles.videoWrapper}>
                  <View style={[styles.videoGlow, { 
                    shadowColor: isDark ? '#000' : '#1e293b',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  }]}>
                    <Video
                      ref={videoRef}
                      source={currentSlide.video}
                      style={styles.video}
                      resizeMode={ResizeMode.COVER}
                      isLooping
                      isMuted
                      shouldPlay
                    />
                  </View>
                </View>
                
                <View style={styles.captionArea}>
                  <Typewriter
                    key={`${currentSlide.id}-cap`}
                    text={currentSlide.caption!}
                    style={[styles.caption, { color: theme.textPrimary }]}
                    delay={200}
                    speed={35}
                  />
                  {currentSlide.subCaption && (
                    <Typewriter
                      key={`${currentSlide.id}-sub`}
                      text={currentSlide.subCaption}
                      style={[styles.subCaption, { color: theme.textSecondary }]}
                      delay={200 + currentSlide.caption!.length * 35 + 200}
                      speed={25}
                    />
                  )}
                </View>
              </View>
            </>
          ) : (
            /* TEXT SLIDE */
            <View style={styles.textSlide}>
              <View style={styles.textContent}>
                <Typewriter
                  key={`${currentSlide.id}-1`}
                  text={currentSlide.line1!}
                  style={[styles.bigText, { color: theme.textPrimary }]}
                  speed={40}
                />
                <Typewriter
                  key={`${currentSlide.id}-2`}
                  text={currentSlide.line2!}
                  style={[styles.bigText, { color: theme.textPrimary }]}
                  delay={currentSlide.line1!.length * 40 + 100}
                  speed={40}
                />
                {currentSlide.line3 ? (
                  <Typewriter
                    key={`${currentSlide.id}-3`}
                    text={currentSlide.line3}
                    style={[styles.smallText, { color: theme.textSecondary, marginTop: 32 }]}
                    delay={currentSlide.line1!.length * 40 + currentSlide.line2!.length * 40 + 400}
                    speed={25}
                  />
                ) : null}
                <Typewriter
                  key={`${currentSlide.id}-4`}
                  text={currentSlide.line4!}
                  style={[styles.smallText, { color: theme.textSecondary, marginTop: currentSlide.line3 ? 0 : 32 }]}
                  delay={
                    currentSlide.line1!.length * 40 + 
                    currentSlide.line2!.length * 40 + 
                    (currentSlide.line3?.length || 0) * 25 + 600
                  }
                  speed={25}
                />
              </View>
            </View>
          )}
        </Animated.View>

        {/* Bottom */}
        <View style={styles.bottom}>
          <View style={styles.progress}>
            {SLIDES.map((_, i) => (
              <ProgressDot
                key={i}
                isActive={i === currentIndex}
                color={theme.textPrimary}
                inactiveColor={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
              />
            ))}
          </View>

          <View style={styles.buttonWrapper}>
            {isLastSlide && (
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  styles.buttonGlow,
                  { opacity: buttonGlowAnim }
                ]}
                pointerEvents="none"
              />
            )}
            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: isLastSlide 
                  ? '#8ef160f0'
                  : (isDark ? '#fff' : '#1a1a1a'),
              }]}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { 
                color: isLastSlide 
                  ? '#303030'
                  : (isDark ? '#0f1518' : '#fff'),
              }]}>
                {isLastSlide ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 10,
  },
  topBarText: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Content
  content: {
    flex: 1,
  },
  
  // Video slide container
  videoSlideContainer: {
    flex: 1,
  },

  // Video Layout with ultra-soft shadow
  videoWrapper: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16, 
    justifyContent: 'center',
    maxHeight: SCREEN_HEIGHT * 0.52, 
  },
  videoGlow: {
    flex: 1,
    borderRadius: 32,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08, 
    shadowRadius: 32,
    elevation: 8,
  },
  video: {
    flex: 1,
    borderRadius: 32,
  },

  captionArea: {
    paddingHorizontal: 32, 
    paddingTop: 32,
    paddingBottom: 8,
    alignItems: 'center',
    zIndex: 20,
  },
  // Bold Native Typography (Creates SF Pro Display on iOS)
  caption: {
    fontSize: 26, 
    fontWeight: '700', 
    letterSpacing: -0.5, 
    textAlign: 'center',
  },
  subCaption: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 8,
  },

  // Dramatic slide
  dramaticContainer: {
    flex: 1,
  },
  dramaticTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dramaticText: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  dotsContainer: {
    position: 'absolute',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Text slide
  textSlide: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  textContent: {},
  bigText: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 48,
  },
  smallText: {
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: -0.3,
  },

  // Bottom
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 16, 
    zIndex: 20,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center', 
    gap: 8,
    marginBottom: 28,
  },
  progressDot: {
    height: 8,
    borderRadius: 4, 
  },
  buttonWrapper: {
    position: 'relative',
  },
  button: {
    height: 56,
    borderRadius: 32, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Keeps the button text/background above the glow
  },
  buttonGlow: {
    borderRadius: 32,
    backgroundColor: '#bcfc99',
    shadowColor: '#1f3d33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1, // Sits exactly underneath the button
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
});