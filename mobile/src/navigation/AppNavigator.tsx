/**
 * APP NAVIGATOR
 * 
 * Handles all screen navigation using React Navigation.
 * 
 * Structure:
 * - Stack Navigator: Onboarding flow + screens that overlay the tabs
 * - Tab Navigator: Main app screens (all show tab bar)
 */

import React, { useState } from "react";
import { View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";

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
import { FoodLibraryScreen } from "../screens/home/FoodLibraryScreen";
import { ProfileScreen } from "../screens/home/ProfileScreen";
import { NotificationsScreen } from "../screens/home/NotificationsScreen";
import { SymptomAnalysisScreen } from "../screens/home/SymptomAnalysisScreen";
import { CrossReactivityScreen } from "../screens/home/CrossReactivityScreen";

// Type definitions
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  EmailPassword: undefined;
  NameInput: undefined;
  AllergyDeclaration: undefined;
  SetupProgress: undefined;
  WelcomeUser: { userName: string };
  GreatChoice: { userName: string };
  MainApp: { userName: string };
  Notifications: undefined;
  SymptomAnalysis: undefined;
  CrossReactivity: undefined;
};

export type MainTabParamList = {
  Home: { userName: string };
  MealLog: undefined;
  Scan: undefined;
  Library: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder for Scan screen
function ScanScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
      <Ionicons name="camera" size={64} color={theme.textSecondary} />
      <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 18 }}>Scan Coming Soon</Text>
    </View>
  );
}

// Home Screen wrapper with navigation
function HomeScreenWrapper({ userName }: { userName: string }) {
  const stackNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const tabNavigation = useNavigation<any>();
  
  return (
    <HomeScreen
      userName={userName}
      onNavigate={(screen) => {
        // Tab screens - use tab navigation
        if (screen === "mealLog") {
          tabNavigation.navigate("MealLog");
        } else if (screen === "foodLibrary") {
          tabNavigation.navigate("Library");
        }
        // Stack screens - use stack navigation
        else if (screen === "symptomAnalysis") {
          stackNavigation.navigate("SymptomAnalysis");
        } else if (screen === "crossReactivity") {
          stackNavigation.navigate("CrossReactivity");
        } else if (screen === "notifications") {
          stackNavigation.navigate("Notifications");
        }
      }}
    />
  );
}

// Tab Navigator for main app
function MainTabNavigator({ route }: { route: { params: { userName: string } } }) {
  const { theme, isDark } = useTheme();
  const userName = route.params?.userName || "User";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MealLog") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Scan") {
            iconName = focused ? "camera" : "camera-outline";
          } else if (route.name === "Library") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: isDark ? "#FFFFFF" : "#000000",
        tabBarInactiveTintColor: isDark ? "#888888" : "#888888",
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          alignSelf: "center",
          width: "90%",
          marginLeft: "5%",
          height: 80,
          borderRadius: 28,
          backgroundColor: isDark ? "rgba(28, 28, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
          paddingBottom: 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      })}
    >
      <Tab.Screen name="Home">
  {() => <HomeScreenWrapper userName={userName} />}
      </Tab.Screen>
      <Tab.Screen name="MealLog">
        {({ navigation }) => <MealLogScreen onBack={() => navigation.navigate("Home")} />}
      </Tab.Screen>
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Library">
        {({ navigation }) => <FoodLibraryScreen onBack={() => navigation.navigate("Home")} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {({ navigation }) => (
          <ProfileScreen
            onBack={() => navigation.navigate("Home")}
            onEditAllergies={() => {}}
            onSignOut={() => {}}
          />
  )}
    </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator() {
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
                  routes: [{ name: "MainApp", params: { userName: "Test User" } }],
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
                  routes: [{ name: "MainApp", params: { userName: route.params.userName } }],
                });
              }, 2500);
              return () => clearTimeout(timer);
            }, []);
            return <GreatChoiceScreen userName={route.params.userName} />;
          }}
        </Stack.Screen>

        {/* Main App with Tab Bar */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />

        {/* Overlay Screens (no tab bar) */}
        <Stack.Screen name="Notifications">
          {({ navigation }) => (
            <NotificationsScreen onBack={() => navigation.goBack()} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}