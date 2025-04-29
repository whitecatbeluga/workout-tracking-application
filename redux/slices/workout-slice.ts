import { ApiError } from "@/custom-types/api-error-type";
import { Loading } from "@/custom-types/loading-type";
import { Workout, WorkoutFormData } from "@/custom-types/workout-type";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getAuthToken } from "@/services/get-token";

import Constants from "expo-constants";

// Get the API URL from expo config
const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

export type WorkoutSets = {
  [exerciseId: string]: {
    name: string;
    sets: {
      set: number;
      previous: string;
      kg: string;
      reps: string;
      checked: boolean;
    }[];
  };
};

export const getWorkout = createAsyncThunk(
  "workout/getWorkout",
  async (_, thunkApi) => {
    const token = await getAuthToken();
    try {
      const response = await axios.get(`${API_URL}/workout`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      return thunkApi.rejectWithValue(response.message);
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
  workout: Workout[] | null;
  workoutSets: WorkoutSets | null;
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  workout: null,
  workoutSets: null,
};

const WorkoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    updateWorkoutSets(state, action) {
      const newSets = action.payload
      state.workoutSets = {
        ...state.workoutSets,
        ...newSets
      }
    },
  },
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
        state.workout = action.payload;
      })
      .addCase(getWorkout.rejected, (state, action) => {
        state.loading = Loading.Rejected;
        state.error = action.payload as string;
      });
  },
});

export const { updateWorkoutSets } = WorkoutSlice.actions;

export default WorkoutSlice.reducer;
