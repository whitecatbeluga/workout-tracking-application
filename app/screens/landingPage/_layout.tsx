import { Stack } from "expo-router";

export default function LandingLayout() {
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
        }}
      />
    </Stack>
  );
}
