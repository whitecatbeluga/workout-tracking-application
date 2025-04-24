import { Stack } from "expo-router";

export default function StreakLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="workout-detail"
        options={{ title: "Workout Detail" }}
      />
    </Stack>
  );
}
