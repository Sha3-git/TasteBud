/**
 * TASTEBUD APP
 * 
 * Main entry point. Uses React Navigation for screen management.
 * 
 * This is an update from what we had previously in App.tsx, which used a switch statement
 * to handle screen rendering. Now, we leverage React Navigation to provide a more
 * structured and scalable navigation system.
 */

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}