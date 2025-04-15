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
  volumn: number;
  set: number;
  exercises: Exercise[];
}

export interface WorkoutFormData {
  id?: number;
  name: string;
  description: string;
  duration: number;
  intensity: number;
  volumn: number;
  set: number;
  exerciseIds: number[];
}
