import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

import { LoginFormData, RegisterFormData } from "@/custom-types/form-data-type";
import { Loading } from "@/custom-types/loading-type";
import { User } from "@/custom-types/user-type";
import { ApiError } from "@/custom-types/api-error-type";
import { refreshUserToken } from "@/services/api";
import Constants from "expo-constants";
import { getAuthToken } from "@/services/get-token";

const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, thunkApi) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      await AsyncStorage.setItem("loggedIn", "true");
      await AsyncStorage.setItem("token", response.data.access_token);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      await AsyncStorage.removeItem("loggedIn");
      return thunkApi.rejectWithValue(response);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData, thunkApi) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      await AsyncStorage.setItem("loggedIn", "true");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      await AsyncStorage.removeItem("loggedIn");
      return thunkApi.rejectWithValue(response.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkApi) => {
    try {
      const response = await refreshUserToken();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      await AsyncStorage.removeItem("loggedIn");
      return thunkApi.rejectWithValue(response.message);
    }
  }
);
export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      return thunkApi.rejectWithValue("No token available for logout");
    }

    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("loggedIn");

    return true;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Logout failed:", axiosError);

    if (axiosError.response && axiosError.response.data) {
      const responseData = axiosError.response.data as ApiError;
      return thunkApi.rejectWithValue(responseData.message);
    } else {
      return thunkApi.rejectWithValue(
        axiosError.message || "Logout failed unexpectedly"
      );
    }
  }
});

export const setUserToken = createAsyncThunk(
  "auth/setUserToken",
  async (token: string, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem("token", token);
      return token;
    } catch (error) {
      return rejectWithValue("Failed to store token");
    }
  }
);

// State
interface InitialState {
  loading: Loading;
  error: string | null | Record<string, string>;
  access_token: string | null;
  user: User | null;
  message: string | null;
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  access_token: null,
  user: null,
  message: null,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
    },
    resetErrorMessage: (state, action) => {
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserFromFirebase: (state, action) => {
      const {
        uid,
        email,
        displayName,
        first_name,
        last_name,
        username,
        address,
        birthday,
        gender,
        height,
        weight,
        bmi,
        activity_level,
        workout_type,
      } = action.payload;

      state.user = {
        firebaseUid: uid,
        email: email || "",
        first_name: first_name || "",
        last_name: last_name || "",
        username: username || "",
        address: address || "",
        birthday: birthday || "",
        gender: gender || "",
        height: height || "",
        weight: weight || "",
        bmi: bmi || 0,
        activity_level: activity_level || "",
        workout_type: workout_type || [],
        provider: "firebase",
        displayName: displayName || "",
      };
      state.loading = Loading.Fulfilled;
    },

    clearUser: (state) => {
      state.user = null;
      state.access_token = null;
      state.loading = Loading.Idle;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUserToken.fulfilled, (state, action) => {
        state.access_token = action.payload;
      })
      .addCase(setUserToken.rejected, (state, action) => {
        console.error(action.payload);
      });
  },
  // extraReducers: (builder) => {
  //   builder
  //     // Login
  //     .addCase(login.pending, (state) => {
  //       state.loading = Loading.Pending;
  //       state.error = null;
  //     })
  //     .addCase(login.fulfilled, (state, action) => {
  //       state.loading = Loading.Fulfilled;
  //       state.access_token = action.payload.access_token;
  //       state.user = action.payload.user;
  //       state.error = null;
  //     })
  //     .addCase(login.rejected, (state, action) => {
  //       state.loading = Loading.Rejected;
  //       const payload = action.payload as string | ApiError;

  //       if (typeof payload === "string") {
  //         state.error = payload;
  //       } else if (payload?.errors?.length) {
  //         const fieldErrors: Record<string, string> = {};
  //         payload.errors.forEach((err) => {
  //           const match = err.match(/^(\w+)\s+(.*)$/);
  //           if (match) {
  //             const field = match[1].toLowerCase();
  //             fieldErrors[field] = match[0];
  //           }
  //         });
  //         state.error = fieldErrors;
  //       } else {
  //         state.error = payload?.message ?? "An error occurred";
  //       }
  //     })

  //     // Register
  //     .addCase(register.pending, (state) => {
  //       state.loading = Loading.Pending;
  //       state.error = null;
  //     })
  //     .addCase(register.fulfilled, (state, action) => {
  //       state.loading = Loading.Fulfilled;
  //       state.access_token = action.payload.access_token;
  //       state.user = action.payload.user;
  //       state.error = null;
  //     })
  //     .addCase(register.rejected, (state, action) => {
  //       state.loading = Loading.Rejected;
  //       state.error = action.payload as string;
  //     })

  //     // Refresh Token
  //     .addCase(refreshToken.pending, (state) => {
  //       state.loading = Loading.Pending;
  //       state.error = null;
  //     })
  //     .addCase(refreshToken.fulfilled, (state, action) => {
  //       state.loading = Loading.Fulfilled;
  //       state.access_token = action.payload.access_token;
  //       state.user = action.payload.user;
  //       state.error = null;
  //     })
  //     .addCase(refreshToken.rejected, (state) => {
  //       state.loading = Loading.Rejected;
  //     })

  //     // Logout
  //     .addCase(logout.pending, (state) => {
  //       state.loading = Loading.Pending;
  //     })
  //     .addCase(logout.fulfilled, (state) => {
  //       state.loading = Loading.Fulfilled;
  //       state.access_token = null;
  //       state.user = null;
  //       state.error = null;
  //     })
  //     .addCase(logout.rejected, (state) => {
  //       state.loading = Loading.Rejected;
  //     });
  // },
});

export const {
  setAccessToken,
  resetErrorMessage,
  setUser,
  setUserFromFirebase,
  clearUser,
} = authSlice.actions;
export default authSlice.reducer;
