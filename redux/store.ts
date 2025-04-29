import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import workoutReducer from "./slices/workout-slice";
import exerciseReducer from "./slices/exercise-slice";
import routineReducer from "./slices/routine-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
    exercise: exerciseReducer,
    routine: routineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
