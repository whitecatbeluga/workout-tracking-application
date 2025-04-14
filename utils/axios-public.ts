import axios from "axios";
import Constants from "expo-constants";

const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
