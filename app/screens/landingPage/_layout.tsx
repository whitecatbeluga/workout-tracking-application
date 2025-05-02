import { useAppSelector } from "@/hooks/use-app-selector";
import { Stack, useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { useCallback } from "react";

export default function LandingLayout() {
  const user = useAppSelector((state) => state.auth.user);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (user == null) {
          return true;
        }
        return false;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [user])
  );

  return (
    <Stack>
      <Stack.Screen
        name="login-page"
        options={{
          title: "Login",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
          headerBackVisible: user !== null,
        }}
      />
      <Stack.Screen
        name="register-page"
        options={{
          title: "Register",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
          headerBackVisible: user !== null,
        }}
      />
    </Stack>
  );
}
