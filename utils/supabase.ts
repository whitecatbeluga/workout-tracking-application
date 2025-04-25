// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient } from "@supabase/supabase-js";
// import Constants from "expo-constants";
// import { AppState } from "react-native";

// const supabaseUrl = (
//   Constants.expoConfig?.extra as { REACT_NATIVE_SUPABASE_URL: string }
// ).REACT_NATIVE_SUPABASE_URL;
// const supabaseAnonKey = (
//   Constants.expoConfig?.extra as { REACT_NATIVE_SUPABASE_ANON_KEY: string }
// ).REACT_NATIVE_SUPABASE_ANON_KEY;

// if (supabaseUrl === undefined || supabaseAnonKey === undefined) {
//   throw new Error(
//     "Supabase URL or Anon Key is not defined in the environment variables."
//   );
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

// AppState.addEventListener("change", (state) => {
//   if (state === "active") {
//     supabase.auth.startAutoRefresh();
//   } else {
//     supabase.auth.stopAutoRefresh();
//   }
// });
