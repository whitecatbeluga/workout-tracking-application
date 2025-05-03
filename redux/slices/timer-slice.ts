// timer-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  duration: number;
}

const initialState: TimerState = {
  duration: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    resetDuration(state) {
      state.duration = 0;
    },
    updateDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload
    }
  },
});

export const { setDuration, resetDuration } = timerSlice.actions;
export default timerSlice.reducer;
