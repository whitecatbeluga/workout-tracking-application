import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { auth } from "@/utils/firebase-config";
import { MarkedDate } from "../../custom-types/calendar-type";

export const fetchMarkedDates = createAsyncThunk(
  "calendar/fetchMarkedDates",
  async (_, thunkAPI) => {
    try {
      const user_id = auth.currentUser?.uid;
      const workoutsCollectionRef = collection(db, "workouts");
      const q = query(workoutsCollectionRef, where("user_id", "==", user_id));
      const workoutsSnapshot = await getDocs(q);

      const markedDates = workoutsSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          const date = data?.created_at?.toDate()?.toISOString().split("T")[0];
          const img_url = data?.image_urls?.[0] ?? undefined;
          if (!date) return null;
          return { date, img_url };
        })
        .filter((entry): entry is MarkedDate => entry !== null);

      return markedDates;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch calendar data");
    }
  }
);

interface CalendarState {
  markedDates: MarkedDate[];
  streakCount: number;
  restCount: number;
  loading: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CalendarState = {
  markedDates: [],
  streakCount: 0,
  restCount: 0,
  loading: "idle",
  error: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    calculateStreakAndRest(state) {
      const workoutDates = new Set(
        state.markedDates.map((d) => d?.date).filter(Boolean)
      );

      const getStartOfWeek = (date: Date) => {
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.getFullYear(), date.getMonth(), diff);
      };

      const isDateInRange = (date: Date, start: Date, end: Date) =>
        date >= start && date <= end;

      const countStreak = () => {
        let count = 0;
        let today = new Date();
        let weekStart = getStartOfWeek(today);
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const hasWorkoutThisWeek = Array.from(workoutDates).some((dateStr) => {
          const date = new Date(dateStr);
          return isDateInRange(date, weekStart, weekEnd);
        });

        if (hasWorkoutThisWeek) count++;

        while (true) {
          weekStart.setDate(weekStart.getDate() - 7);
          weekEnd.setDate(weekEnd.getDate() - 7);

          const hadWorkout = Array.from(workoutDates).some((dateStr) => {
            const date = new Date(dateStr);
            return isDateInRange(date, weekStart, weekEnd);
          });

          if (hadWorkout) {
            count++;
          } else {
            break;
          }
        }

        return count;
      };

      const countRest = () => {
        if (state.markedDates.length === 0) return 0;

        const lastWorkoutDate = new Date(
          Math.max(...state.markedDates.map((d) => new Date(d.date).getTime()))
        );

        const today = new Date();
        const last = new Date(lastWorkoutDate.toISOString().split("T")[0]);
        const current = new Date(today.toISOString().split("T")[0]);

        const diffMs = current.getTime() - last.getTime();
        return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      };

      state.streakCount = countStreak();
      state.restCount = countRest();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarkedDates.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchMarkedDates.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.markedDates = action.payload;
      })
      .addCase(fetchMarkedDates.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { calculateStreakAndRest } = calendarSlice.actions;
export default calendarSlice.reducer;
