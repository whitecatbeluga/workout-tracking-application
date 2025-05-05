// seedFirestore.js
import { auth, db } from "../utils/firebase-config";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";

function generateId(length = 20) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomProgramName() {
  const adjectives = [
    "Exciting",
    "Innovative",
    "Dynamic",
    "Creative",
    "Inspirational",
  ];
  const nouns = ["Workout", "Challenge", "Routine", "Program", "Plan"];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
}

function randomRoutineName() {
  const verbs = ["Challenge", "Build", "Boost", "Revitalize", "Revive"];
  const nouns = ["Workout", "Challenge", "Routine", "Program", "Plan"];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomVerb} ${randomNoun}`;
}

export const seedFirestore = async () => {
  try {
    const programId = generateId();
    const numRoutines = Math.floor(Math.random() * 3) + 2; // 2 to 4 routines
    const routineIds: string[] = [];

    const exerciseIds = [
      "MrKjtuJciArnFhbcZiWw",
      "m9TgGQlKKLHOlILWwM1z",
      "vngIUKVCPg2e18xvBeCX",
    ];

    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User is not authenticated");

    // --- 1. Create Program First ---
    await setDoc(doc(db, "users", userId, "programs", programId), {
      program_name: randomProgramName(),
      createdAt: new Date("2025-04-28T06:08:35Z"),
      routine_ids: [], // We'll update after routines are added
    });

    // --- 2. Create Multiple Routines ---
    for (let i = 0; i < numRoutines; i++) {
      const routineId = generateId();
      routineIds.push(routineId);

      // Add routine doc
      await setDoc(doc(db, "routines", routineId), {
        routine_name: randomRoutineName(),
      });

      // Add exercises + sets to each routine
      for (const exercise_id of exerciseIds) {
        const exerciseRef = doc(
          db,
          `routines/${routineId}/exercises`,
          exercise_id
        );

        await setDoc(exerciseRef, {
          exercise_id,
        });

        const setsRef = collection(exerciseRef, "sets");
        const sets = [
          { set: 1, previous: 10, kg: 10, reps: 10 },
          { set: 2, previous: 10, kg: 10, reps: 10 },
          { set: 3, previous: 10, kg: 10, reps: 10 },
        ];

        const batch = writeBatch(db);
        sets.forEach((setData) => {
          const setDocRef = doc(setsRef);
          batch.set(setDocRef, setData);
        });

        await batch.commit();
      }
    }

    // --- 3. Update Program With Routine IDs ---
    await setDoc(
      doc(db, "users", userId, "programs", programId),
      {
        routine_ids: routineIds,
      },
      { merge: true }
    );

    console.log(
      `Seeded programId: ${programId} with ${routineIds.length} routine(s).`
    );
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
};
