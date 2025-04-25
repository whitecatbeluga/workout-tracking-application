import { Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Styles from "./screens/profile/styles";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import Toast from "react-native-toast-message";
import { clearUser, setUserFromFirebase } from "@/redux/auth-slice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/FirebaseConfig";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // useEffect(() => {
  //   const restoreSession = async () => {
  //     const { data, error } = await supabase.auth.getSession();

  //     if (error) {
  //       console.error("Error restoring session:", error.message);
  //       return;
  //     }

  //     const session = data?.session;
  //     console.log("layout", session);

  //     if (session) {
  //       const { access_token, refresh_token, expires_at } = session;

  //       await AsyncStorage.setItem("access_token", access_token);
  //       await AsyncStorage.setItem("refresh_token", refresh_token);
  //       await AsyncStorage.setItem("expires_at", (expires_at ?? "").toString());

  //       store.dispatch(setAccessToken(access_token));

  //       console.log("Session restored.");
  //     } else {
  //       console.log("No active session.");
  //     }
  //   };
  //   restoreSession();
  // }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const sanitizedUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          emailVerified: user.emailVerified,
        };
        store.dispatch(setUserFromFirebase(sanitizedUser));
      } else {
        store.dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, []);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={Styles.bottomSheetContainer}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screens/home" options={{ headerShown: false }} />
          <Stack.Screen
            name="screens/profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screens/landingPage"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="screens/workout"
            options={{ headerShown: false }}
          />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
}
