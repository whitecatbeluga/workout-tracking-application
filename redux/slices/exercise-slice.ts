import { ApiError } from "@/custom-types/api-error-type";
import { Exercise } from "@/custom-types/exercise-type";
import { Loading } from "@/custom-types/loading-type";
import { axiosInstance } from "@/utils/axios-instance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getExercise = createAsyncThunk(
  "exercise/getExercise",
  async (_, thunkApi) => {
    try {
      const response = await axiosInstance.get("exercise", {});
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
  exercise: Exercise[] | null;
}

const initialState: InitialState = {
  loading: Loading.Idle,
  error: null,
  exercise: null,
};

const ExerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExercise.pending, (state) => {
        state.loading = Loading.Fulfilled;
        state.error = null;
      })
      .addCase(getExercise.fulfilled, (state, action) => {
        state.loading = Loading.Fulfilled;
        state.error = null;
        state.exercise = action.payload;
      })
      .addCase(getExercise.rejected, (state, action) => {
        state.loading = Loading.Rejected;
        state.error = action.payload as string;
      });
  },
});

export default ExerciseSlice.reducer;
