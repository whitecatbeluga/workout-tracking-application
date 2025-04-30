// store/routineSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RoutineService } from "../../services/routine-service";
import { Exercise } from "@/custom-types/exercise-type";
import { Loading } from "@/custom-types/loading-type";

export type Routine = {
  id: string;
  routine_name?: string;
  exercises: Exercise[];
  createdAt?: string;
};

export type Program = {
  id: string;
  routine_ids?: string[];
  program_name?: string;
  createdAt?: string;
  routines: Routine[];
};

interface ProgramState {
  programs: Program[];
  loading: Loading;
  error: string | null;
}

const initialState: ProgramState = {
  programs: [],
  loading: Loading.Idle,
  error: null,
};

// Async thunks
// export const fetchRoutines = createAsyncThunk(
//   "routines/fetchAll",
//   async ({ userId, programId }: { userId: string; programId: string }) => {
//     const routines = await RoutineService.getRoutines(userId, programId);
//     return routines;
//   }
// );

export const fetchPrograms = createAsyncThunk(
  "programs/fetchAll",
  async ({ userId }: { userId: string }) => {
    const programs = await RoutineService.getPrograms(userId);

    return programs;
  }
);

export const createRoutineWithoutProgram = createAsyncThunk(
  "routines/create-without-program",
  async ({
    userId,
    programId,
    routineData,
    programData,
  }: {
    userId: string;
    programId?: string;
    routineData: any;
    programData: any;
  }) => {
    const newRoutine = await RoutineService.addRoutine(
      userId,
      programId ?? "",
      routineData,
      programData
    );

    console.log(newRoutine);
    // return newRoutine;
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
  "routines/delete-routine",
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

export const deleteProgram = createAsyncThunk(
  "routines/delete-program",
  async ({ userId, programId }: { userId: string; programId: string }) => {
    await RoutineService.deleteProgram(userId, programId);
    return programId;
  }
);

export const deleteProgramAndRoutines = createAsyncThunk(
  "routines/delete-program-and-routines",
  async ({
    userId,
    programId,
    routineIds,
  }: {
    userId: string;
    programId: string;
    routineIds: string[];
  }) => {
    await RoutineService.deleteProgramAndRoutines(
      userId,
      programId,
      routineIds
    );
    return routineIds;
  }
);

// Slice
export const routineSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    clearProgramsAndRoutines: (state) => {
      state.programs = [];
    },
  },
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
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = Loading.Pending;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.programs = action.payload;
        state.loading = Loading.Fulfilled;
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
      })
      // deleteProgram
      .addCase(deleteProgram.fulfilled, (state, action) => {
        state.programs = state.programs.filter((p) => p.id !== action.payload);
      })
      // deleteProgramAndRoutines
      .addCase(deleteProgramAndRoutines.fulfilled, (state, action) => {
        state.programs = state.programs.filter(
          (p) => !action.payload.includes(p.id)
        );
      });
  },
});

export const { clearProgramsAndRoutines } = routineSlice.actions;

export default routineSlice.reducer;
