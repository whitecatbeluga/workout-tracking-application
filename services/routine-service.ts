// services/routineService.ts
import { Exercise, WorkoutSets } from "@/custom-types/exercise-type";
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
  writeBatch,
  setDoc,
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

  async getRoutinesByIds(routineId: string) {
    const routineRef = collection(db, "routines");
    const snapshot = await getDocs(routineRef);

    const routines = await Promise.all(
      snapshot.docs
        .filter((doc) => routineId.includes(doc.id))
        .map(async (doc) => {
          const routineData = doc.data();
          const exercises = await this.getExercisesById(doc.id);

          return {
            id: doc.id,
            ...routineData,
            exercises,
            createdAt:
              routineData.createdAt instanceof Timestamp
                ? routineData.createdAt.toDate().toISOString()
                : undefined,
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

  async getRoutine(routineId: string) {
    const routineRef = doc(db, "routines", routineId);
    const snapshot = await getDoc(routineRef);

    if (!snapshot.exists()) {
      throw new Error("Routine not found");
    }

    const routineData = snapshot.data();
    const exercises = await this.getExercisesById(routineId);

    return {
      id: snapshot.id,
      ...routineData,
      exercises,
    };
  },

  // program
  async createNewProgram(userId: string, programName: string) {
    const programsRef = collection(db, "users", userId, "programs");

    const newProgramData = {
      program_name: programName,
      createdAt: Timestamp.now(),
      routine_ids: [],
    };

    const newProgramRef = await addDoc(programsRef, newProgramData);

    return {
      id: newProgramRef.id,
      ...newProgramData,
      routines: [],
      createdAt: newProgramData.createdAt.toDate().toISOString(),
    };
  },

  // routines
  async createNewRoutine(
    userId: string,
    routineName: string,
    sets: WorkoutSets | null,
    programId?: string
  ) {
    let finalProgramId = programId;

    try {
      if (!finalProgramId) {
        const programsRef = collection(db, "users", userId, "programs");
        const programsSnap = await getDocs(programsRef);

        if (!programsSnap.empty) {
          finalProgramId = programsSnap.docs[0].id;
        } else {
          const newProgramRef = await addDoc(programsRef, {
            program_name: "Default Program",
            createdAt: Timestamp.now(),
            routine_ids: [],
          });
          finalProgramId = newProgramRef.id;
        }
      }

      const routineRef = await addDoc(collection(db, "routines"), {
        routine_name: routineName,
      });

      if (sets) {
        for (const [exerciseId, exercise] of Object.entries(sets)) {
          const { name, sets: exerciseSets } = exercise;
          if (!name) {
            console.warn(`Missing 'name' in exercise ID: ${exerciseId}`);
            continue;
          }

          const exerciseRef = doc(collection(routineRef, "exercises"));
          await setDoc(exerciseRef, {
            exercise_id: exerciseId,
          });

          if (Array.isArray(exerciseSets)) {
            for (const set of exerciseSets) {
              const { reps, kg, previous } = set;
              if (reps === undefined || kg === undefined) {
                console.warn("Skipping invalid set", set);
                continue;
              }

              await addDoc(collection(exerciseRef, "sets"), {
                reps,
                kg,
                previous: previous ?? "",
              });
            }
          }
        }
      }

      const programRef = doc(db, "users", userId, "programs", finalProgramId);
      await updateDoc(programRef, {
        routine_ids: arrayUnion(routineRef.id),
      });

      return this.getPrograms(userId);
    } catch (err) {
      console.error("Error in createNewRoutine:", err);
      throw err;
    }
  },

  async updateProgramName(
    userId: string,
    programId: string,
    programName: String
  ) {
    const programRef = doc(db, "users", userId, "programs", programId);
    await updateDoc(programRef, { program_name: programName });
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
    const exercisesSnap = await getDocs(collection(routineRef, "exercises"));

    for (const exerciseDoc of exercisesSnap.docs) {
      const setsRef = collection(exerciseDoc.ref, "sets");
      const setsSnap = await getDocs(setsRef);

      for (const setDoc of setsSnap.docs) {
        await deleteDoc(setDoc.ref);
      }

      await deleteDoc(exerciseDoc.ref); // delete exercise after its sets
    }

    await deleteDoc(routineRef); // finally delete the routine
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

    for (const routineId of routineIds) {
      const routineRef = doc(db, "routines", routineId);
      const exercisesSnap = await getDocs(collection(routineRef, "exercises"));

      for (const exerciseDoc of exercisesSnap.docs) {
        const setsSnap = await getDocs(collection(exerciseDoc.ref, "sets"));

        for (const setDoc of setsSnap.docs) {
          await deleteDoc(setDoc.ref);
        }

        await deleteDoc(exerciseDoc.ref);
      }

      await deleteDoc(routineRef);
    }
  },
};
