import { ApiError } from "@/custom-types/api-error-type";
import { WorkoutFormData } from "@/custom-types/workout-type";
import { axiosIntance } from "@/utils/axios-instance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const createWorkout = createAsyncThunk(
  "post/createWorkout",
  async (data: WorkoutFormData, thunkApi) => {
    try {
      const response = await axiosIntance.post("/private/create", data, {
        headers: { "Content-type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const response = axiosError.response?.data as ApiError;
      return thunkApi.rejectWithValue(response.message);
    }
  }
);
