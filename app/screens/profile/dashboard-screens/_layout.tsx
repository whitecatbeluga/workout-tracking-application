// app/screens/profile/dashboard-screens/_layout.tsx
import { Stack } from "expo-router";

export default function DashboardScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#eee" },
        headerTintColor: "#333",
      }}
    >
      <Stack.Screen
        name="calendar"
        options={{ title: "Calendar", headerShown: false }}
      />
      <Stack.Screen
        name="exercises"
        options={{ title: "Exercises", headerShown: false }}
      />
      <Stack.Screen
        name="measures"
        options={{ title: "Measures", headerShown: false }}
      />
      <Stack.Screen
        name="routines"
        options={{ title: "Routines", headerShown: false }}
      />
      <Stack.Screen
        name="statistics"
        options={{ title: "Statistics", headerShown: false }}
      />
    </Stack>
  );
}
