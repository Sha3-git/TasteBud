/**
 * TASTEBUD APP
 * 
 * - Handles onboarding flow navigation
 * - Will eventually route to HomeScreen after onboarding complete
 * 
 * ONBOARDING FLOW:
 * 1. Splash (3 sec)
 * 2. Auth (Sign up / Login selection)
 * 3. Email/Password input
 * 4. Name input
 * 5. Allergy declaration
 * 6. Setup progress (2 sec)
 * 7. Welcome user (2.5 sec)
 * 8. Great choice (2.5 sec)
 * 9. Home screen
 * 
 * BACKEND TEAM NOTES:
 * - All backend integration points are documented in individual screen files
 * - User data should be stored progressively as they complete each step
 * - Consider implementing authentication token storage (AsyncStorage or SecureStore)
 * - Add error handling for network failures & testing with mock backend responses
 */

import React, { useState, useEffect } from 'react';

// Import all onboarding screens
import { SplashScreen } from './src/screens/onboarding/SplashScreen';
import { AuthScreen } from './src/screens/onboarding/AuthScreen';
import { EmailPasswordScreen } from './src/screens/onboarding/EmailPasswordScreen';
import { NameInputScreen } from './src/screens/onboarding/NameInputScreen';
import { AllergyDeclarationScreen } from './src/screens/onboarding/AllergyDeclarationScreen';
import {
  SetupProgressScreen,
  WelcomeUserScreen,
  GreatChoiceScreen,
} from './src/screens/onboarding/WelcomeScreens';
import { HomeScreen } from './src/screens/home/HomeScreen';
import { ThemeProvider } from './src/theme/ThemeContext';
import { MealLogScreen } from './src/screens/home/MealLogScreen';
import { SymptomAnalysisScreen } from './src/screens/home/SymptomAnalysisScreen';
import { CrossReactivityScreen } from './src/screens/home/CrossReactivityScreen';
import { FoodLibraryScreen } from './src/screens/home/FoodLibraryScreen';
import { ProfileScreen } from './src/screens/home/ProfileScreen';
import { NotificationsScreen } from './src/screens/home/NotificationsScreen';




// Type definition for all possible screens
type Screen =
  | 'splash'
  | 'auth'
  | 'emailPassword'
  | 'nameInput'
  | 'allergyDeclaration'
  | 'setupProgress'
  | 'welcomeUser'
  | 'greatChoice'
  | 'mealLog'
  | 'home'
  | 'symptomAnalysis'
  | 'crossReactivity'
  | 'foodLibrary'
  | 'profile'
  | 'notifications';
  

function AppContent() {
  //const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  
  // Store user data collected during onboarding
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    allergies: [] as string[],
    symptoms: [] as string[],
  });
  
  // Auto-transition from splash to auth after 3 seconds
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('auth');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);
  
  // Auto-transition through welcome screens
  useEffect(() => {
    if (currentScreen === 'setupProgress') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcomeUser');
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (currentScreen === 'welcomeUser') {
      const timer = setTimeout(() => {
        setCurrentScreen('greatChoice');
      }, 2500);
      return () => clearTimeout(timer);
    }
    
    if (currentScreen === 'greatChoice') {
      const timer = setTimeout(() => {
        setCurrentScreen('home');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);
  
  // Render appropriate screen based on current navigation state
  switch (currentScreen) {
    case 'splash':
      return <SplashScreen />;
    
    case 'auth':
  return (
    <AuthScreen 
      onSignUpPress={() => setCurrentScreen('emailPassword')}
      onLoginPress={() => {
        // QUICK LOGIN - Skip to home for testing
        setUserData({
          ...userData,
          firstName: 'Test User',  // <<<<<< Default test name
          lastName: 'Demo',
        });
        setCurrentScreen('home');
      }}
    />
  );


  case 'symptomAnalysis':
  return (
    <SymptomAnalysisScreen 
      onBack={() => setCurrentScreen('home')}
    />
  );


  case 'crossReactivity':
  return (
    <CrossReactivityScreen 
      onBack={() => setCurrentScreen('home')}
    />
  );

  case 'foodLibrary':
  return (
    <FoodLibraryScreen 
      onBack={() => setCurrentScreen('home')}
    />
  );

  case 'profile':
  return (
    <ProfileScreen 
      onBack={() => setCurrentScreen('home')}
      onEditAllergies={() => setCurrentScreen('allergyDeclaration')}
      onSignOut={() => setCurrentScreen('auth')}
    />
  );

    case 'emailPassword':
      return (
        <EmailPasswordScreen 
          onBack={() => setCurrentScreen('auth')}
          onContinue={(email, password) => {
            setUserData({ ...userData, email, password });
            setCurrentScreen('nameInput');
          }}
        />
      );
    
    case 'nameInput':
      return (
        <NameInputScreen 
          onBack={() => setCurrentScreen('emailPassword')}
          onContinue={(firstName, lastName) => {
            setUserData({ ...userData, firstName, lastName });
            setCurrentScreen('allergyDeclaration');
          }}
        />
      );
    
    case 'allergyDeclaration':
      return (
        <AllergyDeclarationScreen 
          onBack={() => setCurrentScreen('nameInput')}
          onContinue={(allergyData) => {
            setUserData({
              ...userData,
              allergies: allergyData.allergies,
              symptoms: allergyData.symptoms,
            });
            
            // Log complete user data for backend team
            console.log('✅ COMPLETE USER DATA FOR BACKEND:', {
              ...userData,
              ...allergyData,
            });
            
            setCurrentScreen('setupProgress');
          }}
        />
      );
    
    case 'setupProgress':
      return <SetupProgressScreen />;
    
    case 'welcomeUser':
      return <WelcomeUserScreen userName={userData.firstName} />;
    
    case 'greatChoice':
      return <GreatChoiceScreen userName={userData.firstName} />;
    
    case 'home':
  return (
    <HomeScreen 
      userName={userData.firstName}
      onNavigate={(screen) => {
        console.log(`Navigate to: ${screen}`);
        setCurrentScreen(screen as Screen); // Actually navigate!
      }}
    />
  );

  case 'notifications':
  return (
    <NotificationsScreen 
      onBack={() => setCurrentScreen('home')}
    />
  );

case 'mealLog':
  return (
    <MealLogScreen 
      onBack={() => setCurrentScreen('home')}
    />
  );
    
    default:
      return <SplashScreen />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}