/**
 * APP NAVIGATOR
 * 
 * Handles all screen navigation using React Navigation.
 * lil update: it replaces the previous switch statement in App.tsx with proper navigation.
 * This is done to enable smooth transitions and a better user experience 
 * as well as deep linking capabilities and better UX for Android.
 * 
 */

import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Onboarding screens
import { SplashScreen } from "../screens/onboarding/SplashScreen";
import { AuthScreen } from "../screens/onboarding/AuthScreen";
import { EmailPasswordScreen } from "../screens/onboarding/EmailPasswordScreen";
import { NameInputScreen } from "../screens/onboarding/NameInputScreen";
import { AllergyDeclarationScreen } from "../screens/onboarding/AllergyDeclarationScreen";
import {
  SetupProgressScreen,
  WelcomeUserScreen,
  GreatChoiceScreen,
} from "../screens/onboarding/WelcomeScreens";

// Home screens
import { HomeScreen } from "../screens/home/HomeScreen";
import { MealLogScreen } from "../screens/home/MealLogScreen";
import { SymptomAnalysisScreen } from "../screens/home/SymptomAnalysisScreen";
import { CrossReactivityScreen } from "../screens/home/CrossReactivityScreen";
import { FoodLibraryScreen } from "../screens/home/FoodLibraryScreen";
import { ProfileScreen } from "../screens/home/ProfileScreen";
import { NotificationsScreen } from "../screens/home/NotificationsScreen";

// Define all screens and their params
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  EmailPassword: undefined;
  NameInput: undefined;
  AllergyDeclaration: undefined;
  SetupProgress: undefined;
  WelcomeUser: { userName: string };
  GreatChoice: { userName: string };
  Home: { userName: string };
  MealLog: undefined;
  SymptomAnalysis: undefined;
  CrossReactivity: undefined;
  FoodLibrary: undefined;
  Profile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  // Store user data during onboarding
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    allergies: [] as string[],
    symptoms: [] as string[],
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        
        <Stack.Screen name="Auth">
          {({ navigation }) => (
            <AuthScreen
              onSignUpPress={() => navigation.navigate("EmailPassword")}
              onLoginPress={() => {
                setUserData({ ...userData, firstName: "Test User", lastName: "Demo" });
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home", params: { userName: "Test User" } }],
                });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="EmailPassword">
          {({ navigation }) => (
            <EmailPasswordScreen
              onBack={() => navigation.goBack()}
              onContinue={(email, password) => {
                setUserData({ ...userData, email, password });
                navigation.navigate("NameInput");
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="NameInput">
          {({ navigation }) => (
            <NameInputScreen
              onBack={() => navigation.goBack()}
              onContinue={(firstName, lastName) => {
                setUserData({ ...userData, firstName, lastName });
                navigation.navigate("AllergyDeclaration");
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AllergyDeclaration">
          {({ navigation }) => (
            <AllergyDeclarationScreen
              onBack={() => navigation.goBack()}
              onContinue={(allergyData) => {
                const updatedUserData = {
                  ...userData,
                  allergies: allergyData.allergies,
                  symptoms: allergyData.symptoms,
                };
                setUserData(updatedUserData);
                console.log("✅ COMPLETE USER DATA:", updatedUserData);
                navigation.navigate("SetupProgress");
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SetupProgress">
          {({ navigation }) => {
            React.useEffect(() => {
              const timer = setTimeout(() => {
                navigation.navigate("WelcomeUser", { userName: userData.firstName });
              }, 2000);
              return () => clearTimeout(timer);
            }, []);
            return <SetupProgressScreen />;
          }}
        </Stack.Screen>

        <Stack.Screen name="WelcomeUser">
          {({ navigation, route }) => {
            React.useEffect(() => {
              const timer = setTimeout(() => {
                navigation.navigate("GreatChoice", { userName: route.params.userName });
              }, 2500);
              return () => clearTimeout(timer);
            }, []);
            return <WelcomeUserScreen userName={route.params.userName} />;
          }}
        </Stack.Screen>

        <Stack.Screen name="GreatChoice">
          {({ navigation, route }) => {
            React.useEffect(() => {
              const timer = setTimeout(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Home", params: { userName: route.params.userName } }],
                });
              }, 2500);
              return () => clearTimeout(timer);
            }, []);
            return <GreatChoiceScreen userName={route.params.userName} />;
          }}
        </Stack.Screen>

        {/* Main App Screens */}
        <Stack.Screen name="Home">
          {({ navigation, route }) => (
            <HomeScreen
              userName={route.params.userName}
              onNavigate={(screen) => {
                const screenMap: Record<string, keyof RootStackParamList> = {
                  mealLog: "MealLog",
                  symptomAnalysis: "SymptomAnalysis",
                  crossReactivity: "CrossReactivity",
                  foodLibrary: "FoodLibrary",
                  profile: "Profile",
                  notifications: "Notifications",
                };
                const targetScreen = screenMap[screen];
                if (targetScreen) {
                  navigation.navigate(targetScreen);
                }
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="MealLog">
          {({ navigation }) => (
            <MealLogScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="SymptomAnalysis">
          {({ navigation }) => (
            <SymptomAnalysisScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="CrossReactivity">
          {({ navigation }) => (
            <CrossReactivityScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="FoodLibrary">
          {({ navigation }) => (
            <FoodLibraryScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {({ navigation }) => (
            <ProfileScreen
              onBack={() => navigation.goBack()}
              onEditAllergies={() => navigation.navigate("AllergyDeclaration")}
              onSignOut={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Auth" }],
                });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Notifications">
          {({ navigation }) => (
            <NotificationsScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}