export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  first_name: string;
  last_name: string;
  address: string;
  gender: string;
  birthdate: string;
  height: number;
  weight: number;
  bmi: number;
  activity_level: string;
  workout_type: string[];
}

export interface User {
  id: number;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  address: string;
  age: number;
  height: number;
  gender: string;
  bmi: number;
  activity_level: number;
  user_type: string;
}
