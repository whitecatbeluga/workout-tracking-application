import { Timestamp } from "firebase/firestore";

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  address: string;
  birthday: Timestamp | string;
  gender: string;
  height: string;
  weight: string;
  bmi: number;
  activity_level: string;

  workout_type: string[];

  firebaseUid?: string;
  displayName?: string;
  provider?: "firebase" | "api";
}
