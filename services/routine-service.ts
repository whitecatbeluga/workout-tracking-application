// services/routineService.ts
import { Exercise } from "@/custom-types/exercise-type";
import { db } from "@/utils/firebase-config";
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

export const RoutineService = {
  async getExercisesById(routine_id: string) {
    const exercisesRef = collection(db, "routines", routine_id, "exercises");
    const snapshot = await getDocs(exercisesRef);

    const exercises = await Promise.all(
      snapshot.docs.map(async (exerciseDoc) => {
        const exerciseData = exerciseDoc.data();

        // get exercise
        const exerciseRef = doc(db, "exercises", exerciseData.exercise_id);
        const exerciseSnapshot = await getDoc(exerciseRef);
        const fullData = exerciseSnapshot.data();

        // get sets
        const setsRef = collection(
          db,
          "routines",
          routine_id,
          "exercises",
          exerciseDoc.id,
          "sets"
        );
        const setsSnapshot = await getDocs(setsRef);

        return {
          id: exerciseDoc.id,
          exercise_id: exerciseData.exercise_id,
          name: fullData?.name,
          description: fullData?.description,
          category: fullData?.category,
          with_out_equipment: fullData?.with_out_equipment,
          image_url: fullData?.image_url,
          sets: setsSnapshot.docs.map((setDoc) => setDoc.data()),
        } as Exercise;
      })
    );

    return exercises;
  },

  async getRoutinesByIds(routineIds: string[]) {
    const routineRef = collection(db, "routines");
    const snapshot = await getDocs(routineRef);

    const routines = await Promise.all(
      snapshot.docs
        .filter((doc) => routineIds.includes(doc.id))
        .map(async (doc) => {
          const routineData = doc.data();
          const exercises = await this.getExercisesById(doc.id);

          return {
            id: doc.id,
            ...routineData,
            exercises,
          };
        })
    );

    return routines;
  },

  async getPrograms(userId: string) {
    const programsRef = collection(db, "users", userId, "programs");
    const snapshot = await getDocs(programsRef);

    const programs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const programData = doc.data();
        const routines = await this.getRoutinesByIds(programData.routine_ids);

        return {
          id: doc.id,
          ...programData,
          routines,
          createdAt:
            programData.createdAt instanceof Timestamp
              ? programData.createdAt.toDate().toISOString()
              : undefined,
        };
      })
    );

    return programs;
  },

  // routines
  async addRoutine(
    userId: string,
    routineData: any,
    programId?: string,
    programData?: any
  ) {
    let finalProgramId = programId;

    // Step 1: Create the routine
    const routinesRef = collection(db, "routines");
    const routineDoc = await addDoc(routinesRef, routineData);

    // Step 2: If no program exists, create one and add the routine ID
    if (!programId) {
      const programsRef = collection(db, "users", userId, "programs");
      const newProgramDoc = await addDoc(programsRef, {
        ...programData,
        routine_ids: [routineDoc.id],
      });
      finalProgramId = newProgramDoc.id;
    } else {
      finalProgramId = programId;

      // Step 3: Update the existing program with new routine ID
      const programRef = doc(db, "users", userId, "programs", finalProgramId);
      await updateDoc(programRef, {
        routine_ids: arrayUnion(routineDoc.id),
      });
    }

    return { id: routineDoc.id, ...routineData };
  },

  async updateRoutine(
    userId: string,
    programId: string,
    routineId: string,
    updatedData: any
  ) {
    const routineRef = doc(
      db,
      "users",
      userId,
      "programs",
      programId,
      "routines",
      routineId
    );
    await updateDoc(routineRef, updatedData);
  },

  async deleteRoutine(userId: string, programId: string, routineId: string) {
    const programRef = doc(db, "users", userId, "programs", programId);
    await updateDoc(programRef, {
      routine_ids: arrayRemove(routineId),
    });

    const routineRef = doc(db, "routines", routineId);
    await deleteDoc(routineRef);
  },

  async deleteProgram(userId: string, programId: string) {
    const programRef = doc(db, "users", userId, "programs", programId);
    await deleteDoc(programRef);
  },

  async deleteProgramAndRoutines(
    userId: string,
    programId: string,
    routineIds: string[]
  ) {
    const programRef = doc(db, "users", userId, "programs", programId);
    await deleteDoc(programRef);

    routineIds.forEach((routineId) => {
      const routineRef = doc(db, "routines", routineId);
      deleteDoc(routineRef);
    });
  },
};
