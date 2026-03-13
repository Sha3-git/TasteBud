import api from "./apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const login = async (email:string, password:string) => {
  const res = await api.post("/auth/login", { email, password });

  const { accessToken, refreshToken, user } = res.data;

  await AsyncStorage.setItem("authToken", accessToken);
  await AsyncStorage.setItem("refreshToken", refreshToken);
  await AsyncStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const register = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const logout = async () => {
  await AsyncStorage.removeItem("authToken");
  await AsyncStorage.removeItem("refreshToken");
  await AsyncStorage.removeItem("user");
};

export const getStoredUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};