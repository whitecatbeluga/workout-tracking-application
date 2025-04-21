// app/_layout.tsx

import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Styles from "./screens/profile/styles"; // or your own style
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { refreshToken } from "@/redux/auth-slice";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      const isLoggedIn = await AsyncStorage.getItem("loggedIn");
      if (isLoggedIn != null) {
        store.dispatch(refreshToken());
      }
    };
    void verifyRefreshToken();
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
