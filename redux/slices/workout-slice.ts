import { ApiError } from "@/custom-types/api-error-type";
import { Loading } from "@/custom-types/loading-type";
import { Workout, WorkoutFormData } from "@/custom-types/workout-type";
import { axiosIntance } from "@/utils/axios-instance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getWorkout = createAsyncThunk(
  "workout/getWorkout",
  async (_, thunkApi) => {
    try {
      const response = await axiosIntance.get("workout", {});
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
    try {
      const response = await axiosIntance.post("workout", data, {
        headers: {
          "Content-type": "application/json",
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
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  workout: null,
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
        state.workout = action.payload;
      })
      .addCase(getWorkout.rejected, (state, action) => {
        state.loading = Loading.Rejected;
        state.error = action.payload as string;
      });
  },
});

export default WorkoutSlice.reducer;
