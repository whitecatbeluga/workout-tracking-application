import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { useAppDispatch } from "./use-app-dispatch";
import { WorkoutSets } from "@/custom-types/exercise-type";
import { updateWorkoutSets } from "@/redux/slices/workout-slice";
import { updateWorkoutRoutineSets } from "@/redux/slices/routine-slice";
import { useAppSelector } from "./use-app-selector";

const useDebouncedWorkoutSetUpdate = (setsByExercise: WorkoutSets) => {
  const dispatch = useAppDispatch();

  const workoutRoutineSets = useAppSelector(
    (state) => state.routine.workoutRoutineSets
  );
  const workoutSets = useAppSelector((state) => state.workout.workoutSets);

  const debouncedDispatch = useRef(
    debounce((sets) => {
      const setsObject: WorkoutSets = Object.keys(sets).reduce(
        (acc, exerciseId) => {
          acc[exerciseId] = {
            name: sets[exerciseId].name,
            sets: sets[exerciseId].sets,
          };

          console.log(sets[exerciseId].sets);

          return acc;
        },
        {} as WorkoutSets
      );

      if (workoutSets != null) {
        dispatch(updateWorkoutSets(setsObject));
      }

      if (workoutRoutineSets != null) {
        dispatch(updateWorkoutRoutineSets(setsObject));
      }
    }, 300)
  ).current;

  useEffect(() => {
    if (setsByExercise) {
      debouncedDispatch(setsByExercise);
    }
  }, [setsByExercise]);
};

export default useDebouncedWorkoutSetUpdate;
