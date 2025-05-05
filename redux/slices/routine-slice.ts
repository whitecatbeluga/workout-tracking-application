// store/routineSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RoutineService } from "../../services/routine-service";
import { Exercise, WorkoutSets } from "@/custom-types/exercise-type";
import { Loading } from "@/custom-types/loading-type";

type Params = {
  routineId?: string;
  programId?: string;
};

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
  singleRoutine: Routine | null;
  programs: Program[];
  loading: Loading;
  params: Params;
  error: string | null;
}

const initialState: ProgramState = {
  singleRoutine: null,
  programs: [],
  params: { routineId: "", programId: "" },
  loading: Loading.Idle,
  error: null,
};

// Async thunks
export const fetchRoutine = createAsyncThunk(
  "routines/fetch",
  async ({ routineId }: { routineId: string }) => {
    const routine = await RoutineService.getRoutine(routineId);

    return routine;
  }
);

export const fetchPrograms = createAsyncThunk(
  "programs/fetchAll",
  async ({ userId }: { userId: string }) => {
    const programs = await RoutineService.getPrograms(userId);

    return programs;
  }
);

export const createProgram = createAsyncThunk(
  "programs/create-program",
  async ({ userId, programName }: { userId: string; programName: string }) => {
    const program = await RoutineService.createNewProgram(userId, programName);

    return program;
  }
);

export const createRoutineWithoutProgram = createAsyncThunk(
  "routines/create-without-program",
  async ({
    userId,
    routineName,
    sets,
    programId,
  }: {
    userId: string;
    routineName: string;
    sets: WorkoutSets | null;
    programId?: string;
  }) => {
    const newRoutine = await RoutineService.createNewRoutine(
      userId,
      routineName,
      sets,
      programId ?? ""
    );

    return newRoutine;
  }
);

export const updateProgramName = createAsyncThunk(
  "routines/update-program-name",
  async ({
    userId,
    programId,
    programName,
  }: {
    userId: string;
    programId: string;
    programName: string;
  }) => {
    await RoutineService.updateProgramName(userId, programId, programName);
    return { programId, programName };
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
    setRoutineParams: (state, action) => {
      state.params = action.payload;
    },
    clearRoutineParams: (state) => {
      state.params = { routineId: "", programId: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProgram
      .addCase(fetchRoutine.pending, (state) => {
        state.loading = Loading.Pending;
      })
      .addCase(fetchRoutine.fulfilled, (state, action) => {
        state.singleRoutine = action.payload;
        state.loading = Loading.Fulfilled;
      })
      .addCase(fetchRoutine.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch routines";
        state.loading = Loading.Rejected;
      })

      //   // fetchPrograms
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = Loading.Pending;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.programs = action.payload;
        state.loading = Loading.Fulfilled;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch routines";
        state.loading = Loading.Rejected;
      })

      // createProgram
      .addCase(createProgram.fulfilled, (state, action) => {
        state.programs.push(action.payload);
      })

      // createRoutineWithoutProgram
      .addCase(createRoutineWithoutProgram.pending, (state) => {
        state.loading = Loading.Pending;
      })
      .addCase(createRoutineWithoutProgram.fulfilled, (state, action) => {
        state.programs = action.payload;
        state.loading = Loading.Fulfilled;
      })
      .addCase(createRoutineWithoutProgram.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create routine";
        state.loading = Loading.Rejected;
      })

      // updateProgramName
      .addCase(updateProgramName.fulfilled, (state, action) => {
        const { programId, programName } = action.payload;
        const index = state.programs.findIndex((p) => p.id === programId);
        if (index !== -1) {
          state.programs[index] = {
            ...state.programs[index],
            program_name: programName,
          };
        }
      })

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

export const {
  clearProgramsAndRoutines,
  setRoutineParams,
  clearRoutineParams,
} = routineSlice.actions;

export default routineSlice.reducer;
