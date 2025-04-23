import { Stack, useRouter } from "expo-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Styles from "./screens/profile/styles";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { supabase } from "@/utils/supabase";
import { setAccessToken, setUser } from "@/redux/auth-slice";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const router = useRouter();

  const [loaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error restoring session:", error.message);
        return;
      }

      const session = data?.session;
      if (
        session &&
        session.expires_at &&
        session.expires_at * 1000 > Date.now()
      ) {
        const { access_token, refresh_token, expires_at } = session;
        const { data: userProfile } = await supabase
          .from("User")
          .select("*")
          .eq("auth_user_id", data.session?.user.id)
          .single();
        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("refresh_token", refresh_token);
        await AsyncStorage.setItem("expires_at", expires_at.toString());
        store.dispatch(setAccessToken(access_token));
        store.dispatch(setUser(userProfile));
        router.replace("/(tabs)");
      } else {
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("refresh_token");
        await AsyncStorage.removeItem("expires_at");
        store.dispatch(setAccessToken(null));

        router.replace("/");
      }
    };

    if (loaded) {
      SplashScreen.hideAsync();
      restoreSession();
    }
  }, [loaded]);

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
