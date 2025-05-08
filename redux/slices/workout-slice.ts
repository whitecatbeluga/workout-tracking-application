import { ApiError } from "@/custom-types/api-error-type";
import { Loading } from "@/custom-types/loading-type";
import {
  DurationVolumeSets,
  Workout,
  WorkoutFormData,
} from "@/custom-types/workout-type";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { getAuthToken } from "@/services/get-token";

import Constants from "expo-constants";
import { WorkoutSets } from "@/custom-types/exercise-type";
import { RootState } from "../store";

import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { auth } from "@/utils/firebase-config";

// Get the API URL from expo config
const API_URL = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

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

export const getUserWorkouts = createAsyncThunk(
  "workout/getUserWorkouts",
  async (_, thunkApi) => {
    try {
      const workoutsCollectionRef = collection(db, "workouts");
      const q = query(
        workoutsCollectionRef,
        where("user_id", "==", auth.currentUser?.uid)
      );
      const workoutsSnapshot = await getDocs(q);

      const workouts = [];

      for (const workoutDoc of workoutsSnapshot.docs) {
        const workoutData = workoutDoc.data();
        const workoutId = workoutDoc.id;

        workouts.push({
          id: workoutId,
          ...workoutData,
        });
      }

      return workouts;
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return thunkApi.rejectWithValue("Failed to fetch user workouts");
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

export const selectTotalVolumeSets = (state: RootState) => {
  const workoutSets = state.workout.workoutSets;
  let totalVolume = 0;
  let totalSets = 0;
  Object.values(workoutSets).forEach((exercise) => {
    exercise.sets.forEach((set) => {
      if (set.checked) {
        const kg = parseFloat(set.kg) || 0;
        const reps = parseFloat(set.reps) || 0;
        totalVolume += kg * reps;
        totalSets += 1;
      }
    });
  });
  return { totalVolume, totalSets };
};

interface InitialState {
  loading: Loading;
  error: string | null | Record<string, string>;
  workout: Workout[] | null;
  workoutSets: WorkoutSets;
  draftWorkout: boolean;
  totalVolumeSets: { totalVolume: number; totalSets: number };
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  workout: null,
  workoutSets: {},
  draftWorkout: false,
  totalVolumeSets: {
    totalVolume: 0,
    totalSets: 0,
  },
};

const WorkoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    updateWorkoutSets(state, action) {
      const newSets: WorkoutSets = action.payload;
      state.workoutSets = {
        ...state.workoutSets,
        ...newSets,
      };
    },
    clearWorkoutSets(state) {
      state.workoutSets = {};
    },
    drarfWorkout(state) {
      state.draftWorkout = true;
    },
    undraftWorkout(state) {
      state.draftWorkout = false;
    },
    updateTotalVolumeSets(state, action) {
      state.totalVolumeSets = action.payload;
    },
    clearTotalVolumeSets(state) {
      state.totalVolumeSets = {
        totalVolume: 0,
        totalSets: 0,
      };
    },
  },
  extraReducers: () => {},
});

export const {
  updateWorkoutSets,
  clearWorkoutSets,
  drarfWorkout,
  undraftWorkout,
  updateTotalVolumeSets,
  clearTotalVolumeSets,
} = WorkoutSlice.actions;

export default WorkoutSlice.reducer;
