import { RootState } from "@/redux/store"; // Import your RootState type
import { ApiError } from "@/custom-types/api-error-type";
import { Loading } from "@/custom-types/loading-type";
import { Workout, WorkoutFormData } from "@/custom-types/workout-type";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getAuthToken } from "@/services/get-token";

import Constants from "expo-constants";
import { supabase } from "@/utils/supabase";

// Get the API URL from expo config
const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export const getWorkout = createAsyncThunk(
  "workout/getWorkout",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const authUserId = state.auth.user?.id;
      if (!authUserId) {
        return rejectWithValue("User is not authenticated.");
      }

      const { data, error } = await supabase
        .from("Workout")
        .select("*")
        .eq("user_id", authUserId);

      if (error) {
        console.error("Error fetching workouts:", error.message);
        return rejectWithValue(error.message);
      }
      return data;
    } catch (err: any) {
      console.log("err", err.message);
      return rejectWithValue(err.message);
    }
  }
);

export const createWorkout = createAsyncThunk(
  "workout/createWorkout",
  async (data: WorkoutFormData, thunkApi) => {
    const token = await getAuthToken(); // Get the auth token

    try {
      const response = await axios.post(`${API_URL}/workout`, data, {
        headers: {
          "Content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      return thunkApi.rejectWithValue(response.message);
    }
  }
);

interface InitialState {
  loading: Loading;
  error: string | null | Record<string, string>;
  workout: Workout[];
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  workout: [],
};

const WorkoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createWorkout.pending, (state) => {
        state.loading = Loading.Pending;
        state.error = null;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.loading = Loading.Fulfilled;
        state.error = null;
        state.workout = [action.payload, ...(state.workout ?? [])];
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.loading = Loading.Rejected;
        state.error = action.payload as string;
      });

    builder
      .addCase(getWorkout.pending, (state) => {
        state.loading = Loading.Pending;
        state.error = null;
      })
      .addCase(getWorkout.fulfilled, (state, action) => {
        state.loading = Loading.Fulfilled;
        state.error = null;
        state.workout = action.payload ?? [];
      })
      .addCase(getWorkout.rejected, (state, action) => {
        state.loading = Loading.Rejected;
        state.error = action.payload as string;
      });
  },
});

export default WorkoutSlice.reducer;
