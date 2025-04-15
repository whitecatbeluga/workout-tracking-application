import { Stack } from "expo-router";

export default function Workout() {
  return (
    <Stack>
      <Stack.Screen
        name="add-workout"
        options={{ title: "Add Empty Workout" }}
      />
    </Stack>
  );
}
