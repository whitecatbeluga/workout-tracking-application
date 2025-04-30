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
} from "firebase/firestore";

export const RoutineService = {
  async getRoutines(userId: string, programId: string) {
    const routinesRef = collection(
      db,
      "users",
      userId,
      "programs",
      programId,
      "routines"
    );
    const snapshot = await getDocs(routinesRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      exercise_id: doc.data().exercise_id,
      ...doc.data(),
    }));
  },

  async getExercisesByIds(exerciseIds: string[]) {
    if (!exerciseIds || exerciseIds.length === 0) return [];

    const exercisesRef = collection(db, "exercises");
    const snapshot = await getDocs(exercisesRef);

    return snapshot.docs
      .filter((doc) => exerciseIds.includes(doc.id))
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          category: data.category,
          with_out_equipment: data.with_out_equipment,
          image_url: data.image_url,
        } as Exercise;
      });
  },

  async getPrograms(userId: string) {
    const programsRef = collection(db, "users", userId, "programs");
    const snapshot = await getDocs(programsRef);

    const programs = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const routines = await this.getRoutines(userId, doc.id);

        const routinesWithExercises = await Promise.all(
          routines.map(async (routine) => {
            const exercises = await this.getExercisesByIds(routine.exercise_id);

            return {
              ...routine,
              exercises,
            };
          })
        );

        return {
          id: doc.id,
          ...doc.data(),
          routines: routinesWithExercises,
          createdAt:
            doc.data().createdAt instanceof Timestamp
              ? doc.data().createdAt.toDate().toISOString()
              : undefined,
        };
      })
    );

    return programs;
  },

  // routines
  async addRoutine(userId: string, programId: string, routineData: any) {
    const routinesRef = collection(
      db,
      "users",
      userId,
      "programs",
      programId,
      "routines"
    );
    const docRef = await addDoc(routinesRef, routineData);
    return { id: docRef.id, ...routineData };
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
    const routineRef = doc(
      db,
      "users",
      userId,
      "programs",
      programId,
      "routines",
      routineId
    );
    await deleteDoc(routineRef);
  },
};
