import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

declare const __DEV__: boolean;

const api = axios.create({
  baseURL: __DEV__ ? "http://localhost:4000/api" : "https://OUR-production-Server.com/api",
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