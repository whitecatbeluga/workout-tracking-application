import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import workoutReducer from "./slices/workout-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
