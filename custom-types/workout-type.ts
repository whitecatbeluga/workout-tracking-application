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
  exercises: Exercise[];
}

export interface WorkoutFormData {
  id?: number;
  name: string;
  description: string;
  duration: number;
  intensity: number;
  volume: number;
  set: number;
  exerciseIds: number[];
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
