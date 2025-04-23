type Exercise = {
  id: number;
  exercise: {
    name: string;
    category: string;
  };
};

export interface Workout {
  id?: number;
  name: string;
  description: string;
  duration: number;
  intensity: number;
  volume: number;
  set: number;
  exercise_ids: number[];
}

export interface WorkoutFormData {
  id?: number;
  name: string;
  description: string;
  duration: number;
  intensity: number;
  volume: number;
  set: number;
  user_id?: number;
  exercise_ids: number[];
}

export interface WorkoutExercise {
  id: number;
  exerciseId: number;
  workoutId: number;
  exercise: {
    id: number;
    name: string;
    description: string;
    category: string;
    with_out_equipment: boolean;
  };
}
