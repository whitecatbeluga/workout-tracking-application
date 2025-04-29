// store/routineSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RoutineService } from "../../services/routine-service";
import { Exercise } from "@/custom-types/exercise-type";

export type Routine = {
  id: string;
  routine_name?: string;
  exercises: Exercise[];
  createdAt?: string;
};

export type Program = {
  id: string;
  program_name?: string;
  createdAt?: string;
  routines: Routine[];
};

interface ProgramState {
  programs: Program[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgramState = {
  programs: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchRoutines = createAsyncThunk(
  "routines/fetchAll",
  async ({ userId, programId }: { userId: string; programId: string }) => {
    const routines = await RoutineService.getRoutines(userId, programId);
    return routines;
  }
);

export const fetchPrograms = createAsyncThunk(
  "programs/fetchAll",
  async ({ userId }: { userId: string }) => {
    const programs = await RoutineService.getPrograms(userId);

    return programs;
  }
);

export const createRoutine = createAsyncThunk(
  "routines/create",
  async ({
    userId,
    programId,
    routineData,
  }: {
    userId: string;
    programId: string;
    routineData: any;
  }) => {
    const newRoutine = await RoutineService.addRoutine(
      userId,
      programId,
      routineData
    );
    return newRoutine;
  }
);

export const updateRoutine = createAsyncThunk(
  "routines/update",
  async ({
    userId,
    programId,
    routineId,
    updatedData,
  }: {
    userId: string;
    programId: string;
    routineId: string;
    updatedData: any;
  }) => {
    await RoutineService.updateRoutine(
      userId,
      programId,
      routineId,
      updatedData
    );
    return { routineId, updatedData };
  }
);

export const deleteRoutine = createAsyncThunk(
  "routines/delete",
  async ({
    userId,
    programId,
    routineId,
  }: {
    userId: string;
    programId: string;
    routineId: string;
  }) => {
    await RoutineService.deleteRoutine(userId, programId, routineId);
    return routineId;
  }
);

// Slice
export const routineSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //   // fetchRoutines
      //   .addCase(fetchRoutines.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      //   })
      //   .addCase(fetchRoutines.fulfilled, (state, action) => {
      //     state.programs.routines = action.payload;
      //     state.loading = false;
      //   })
      //   .addCase(fetchRoutines.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.error.message || "Failed to fetch routines";
      //   })
      //   // fetchPrograms
      //   .addCase(fetchPrograms.pending, (state) => {
      //     state.loading = true;
      //   })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.programs = action.payload;
        state.loading = false;
      })
      //   .addCase(fetchPrograms.rejected, (state, action) => {
      //     state.error = action.error.message || "Failed to fetch routines";
      //     state.loading = false;
      //   })
      //   // createRoutine
      //   .addCase(createRoutine.fulfilled, (state, action) => {
      //     state.routines.push(action.payload);
      //   })
      //   // updateRoutine
      //   .addCase(updateRoutine.fulfilled, (state, action) => {
      //     const { routineId, updatedData } = action.payload;
      //     const index = state.routines.findIndex((r) => r.id === routineId);
      //     if (index !== -1) {
      //       state.routines[index] = { ...state.routines[index], ...updatedData };
      //     }
      //   })
      // deleteRoutine
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.programs = state.programs.filter((p) =>
          p.routines.every((r) => r.id !== action.payload)
        );
      });
  },
});

export default routineSlice.reducer;
