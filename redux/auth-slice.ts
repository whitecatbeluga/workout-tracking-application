import { LoginFormData, RegisterFormData } from "@/custom-types/form-data-type";
import { Loading } from "@/custom-types/loading-type";
import { User } from "@/custom-types/user-type";
import { axiosIntance } from "@/utils/axios-instance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { ApiError } from "@/custom-types/api-error-type";
import { refreshUserToken } from "@/services/api";

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, thunkApi) => {
    try {
      const response = await axiosIntance.post(`/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      await AsyncStorage.setItem("loggedIn", "true");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      AsyncStorage.removeItem("loggedIn");
      return thunkApi.rejectWithValue(response.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterFormData, thunkApi) => {
    try {
      const response = await axiosIntance.post("/auth/register", data);
      await AsyncStorage.setItem("loggedIn", "true");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      AsyncStorage.removeItem("loggedIn");
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
      AsyncStorage.removeItem("loggedIn");
      return thunkApi.rejectWithValue(response.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  try {
    console.log("test1");
    const response = await axiosIntance.post("/auth/logout");
    console.log("response", response);
    await AsyncStorage.removeItem("loggedIn");
    console.log("test2");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const response = axiosError.response?.data as ApiError;
    AsyncStorage.removeItem("loggedIn");
    return thunkApi.rejectWithValue(response.message);
  }
});

interface InitialState {
  loading:
    | Loading.Idle
    | Loading.Pending
    | Loading.Fulfilled
    | Loading.Rejected;
  error: string | null;
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
  },
  extraReducers: (builder) => {
    /**
     * Login
     */
    builder.addCase(login.pending, (state) => {
      state.loading = Loading.Pending;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled;
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = Loading.Rejected;
      state.error = action.payload as string;
    });

    /**
     * Register
     */
    builder.addCase(register.pending, (state) => {
      state.loading = Loading.Pending;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled;
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = Loading.Rejected;
      state.error = action.payload as string;
    });

    /**
     * Refresh Token
     */
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = Loading.Pending;
      state.access_token = null;
      state.user = null;
      state.error = null;
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = Loading.Fulfilled;
      state.access_token = action.payload.access_token;
      state.user = action.payload.user;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = Loading.Rejected;
    });

    /**
     * Logout
     */
    builder.addCase(logout.pending, (state) => {
      state.loading = Loading.Pending;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = Loading.Fulfilled;
      state.access_token = null;
      state.user = null;
      state.error = null;
      console.log("Logout successful");
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = Loading.Rejected;
    });
  },
});

export const { setAccessToken, resetErrorMessage } = authSlice.actions;
export default authSlice.reducer;
