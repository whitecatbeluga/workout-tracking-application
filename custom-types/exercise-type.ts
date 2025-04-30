export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  with_out_equipment: boolean;
  image_url: string;
  sets: WorkoutSets[];
}
export type WorkoutSets = {
  [exerciseId: string]: {
    name: string;
    sets: {
      set: number;
      previous: string;
      kg: string;
      reps: string;
      checked: boolean;
    }[];
  };
};
