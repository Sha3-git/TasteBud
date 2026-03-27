import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getBaseURL = () => {
  if (Constants.appOwnership === "expo") {
    const debuggerHost =
      Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
    const host = debuggerHost?.split(":")[0];
    if (host) {
      return `http://${host}:4000/api`;
    }
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000/api";
  }

  return "http://localhost:4000/api";
};

const api = axios.create({
  //baseURL: getBaseURL(),
  baseURL: "https://tastebudservice.ca/api",
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const res = await api.post("/auth/refresh", { refreshToken });
      const newAccessToken = res.data.accessToken;
      await AsyncStorage.setItem("authToken", newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

export default api;
