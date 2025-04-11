import { Stack } from "expo-router";

export default function DashboardScreensLayout() {
  return (
    <Stack>
      <Stack.Screen name="calendar" options={{ title: "Calendar" }} />
      <Stack.Screen name="workouts" options={{ title: "Workouts" }} />
      <Stack.Screen name="measures" options={{ title: "Measures" }} />
      <Stack.Screen name="routines" options={{ title: "Routines" }} />
      <Stack.Screen name="statistics" options={{ title: "Statistics" }} />
    </Stack>
  );
}
