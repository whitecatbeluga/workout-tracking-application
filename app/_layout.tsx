import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Styles from "./screens/profile/styles";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { setupAxiosInstance } from "@/utils/axios-instance";
import Toast from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    setupAxiosInstance(store);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Provider store={store}>
        <GestureHandlerRootView style={Styles.bottomSheetContainer}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="screens/home"
              options={{ headerShown: false }}
            />
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
        </GestureHandlerRootView>
        <StatusBar style="auto" />
        <Toast />
      </Provider>
    </>
  );
}
