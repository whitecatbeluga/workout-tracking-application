import { RootState } from "@/redux/store";
import axios, { type AxiosInstance } from "axios";
import { type Store } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import { refreshUserToken } from "../services/api";
import { setAccessToken } from "@/redux/auth-slice";
// import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export let axiosIntance: AxiosInstance;

// Set up the instance with Redux integration
export const setupAxiosInstance = async (
  store: Store<RootState>,
  onTokenRefresh?: (token: string | null) => void
) => {
  // const token = await AsyncStorage.getItem("token");
  const token = store.getState().auth.access_token;
  axiosIntance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      // Authorization: token ? `Bearer ${token}` : "",
    },
    withCredentials: true,
  });

  axiosIntance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const previousRequest = error.config;
      if (
        error.response?.status === 403 &&
        error.response?.data?.message !== "PermissionError"
      ) {
        try {
          const tokenResponse = await refreshUserToken();
          onTokenRefresh?.(tokenResponse.data.access_token);
          return await axiosIntance(previousRequest);
        } catch (error) {
          onTokenRefresh?.(null);
        }
      }
      return await Promise.reject(error);
    }
  );
};
