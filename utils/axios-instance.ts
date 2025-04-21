import { RootState } from "@/redux/store";
import axios, { type AxiosInstance } from "axios";
import { type Store } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import { refreshUserToken } from "../services/api";
import { setAccessToken } from "@/redux/auth-slice";

const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export let axiosInstance: AxiosInstance;

export const setupAxiosInstance = async (
  store: Store<RootState>,
  onTokenRefresh?: (token: string | null) => void
) => {
  const state = store.getState();
  const access_token = state.auth.access_token;

  axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      ...(access_token && { Authorization: `Bearer ${access_token}` }),
    },
    withCredentials: true,
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const previousRequest = error.config;
      if (
        error.response?.status === 403 &&
        error.response?.data?.message !== "PermissionError"
      ) {
        try {
          const tokenResponse = await refreshUserToken();
          const newToken = tokenResponse.data.access_token;

          // Update redux auth state
          store.dispatch(setAccessToken(newToken));

          // Set new token in Axios
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;

          onTokenRefresh?.(newToken);

          // Retry original request
          previousRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return await axiosInstance(previousRequest);
        } catch (error) {
          onTokenRefresh?.(null);
        }
      }
      return await Promise.reject(error);
    }
  );
};
