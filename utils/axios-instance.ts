import { RootState } from "@/redux/store";
import axios, { type AxiosInstance } from "axios";
import { type Store } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import { refreshUserToken } from "../services/api";
import { setAccessToken } from "@/redux/auth-slice";

const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export let axiosIntance: AxiosInstance;

export const setupAxiosInstance = (store: Store<RootState>) => {
  axiosIntance = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  axiosIntance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.access_token;
      if (token != null) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    async (error) => await Promise.reject(error)
  );
  axiosIntance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log("error in axios", error);
      const previousRequest = error.config;
      console.log("error.response", error.response);
      if (
        error.response?.status === 403 &&
        error.response?.data?.message !== "PermissionError"
      ) {
        try {
          const tokenResponse = await refreshUserToken();
          store.dispatch(setAccessToken(tokenResponse.data.access_token));
          return await axiosIntance(previousRequest);
        } catch (error) {
          store.dispatch(setAccessToken(null));
        }
      }
      return await Promise.reject(error);
    }
  );
};
