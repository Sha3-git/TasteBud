declare const __DEV__: boolean;

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * API Base URL Configuration
 * 
 * Automatically detects the platform and uses the correct URL:
 * - Android Emulator: 10.0.2.2 (special alias for host machine)
 * - iOS Simulator: localhost
 * - Real Device: Use your computer's local IP address
 * 
 * To find your local IP:
 * - Mac: System Preferences > Network > Wi-Fi > IP Address
 * - Or run in terminal: ipconfig getifaddr en0
 */

// Change this following to your computer's IP when testing on real device
const LOCAL_IP = "192.168.4.64"; 

const getBaseUrl = (): string => {
  const PORT = 4000;
  
  if (__DEV__) {
    // Development mode
    if (Platform.OS === "android") {
      // Android emulator uses 10.0.2.2 to access host machine
      return `http://10.0.2.2:${PORT}/api`;
    } else if (Platform.OS === "ios") {
      // iOS simulator can use localhost
      return `http://localhost:${PORT}/api`;
    } else {
      // Real device - use your local IP
      return `http://${LOCAL_IP}:${PORT}/api`;
    }
  } else {
    // Production - replace with your actual production API URL
    return "http://10.0.2.2:4000/api";
  }
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Log errors in development
    if (__DEV__) {
      console.error("API Error:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401) {
      // Clear stored token
      await AsyncStorage.removeItem("authToken");
      // TODO: Navigate to login screen or refresh token
    }
    
    return Promise.reject(error);
  }
);

export default api;

