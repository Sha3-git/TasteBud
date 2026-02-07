import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getBaseURL = () => {
  // Physical device (Expo Go) - use your Mac's local IP
  if (Constants.appOwnership === "expo") {
    // Get the debugger host which contains your Mac's IP
    const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    const host = debuggerHost?.split(":")[0];
    if (host) {
      return `http://${host}:4000/api`;
    }
  }
  
  // Android emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000/api";
  }
  
  // iOS simulator
  return "http://localhost:4000/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;