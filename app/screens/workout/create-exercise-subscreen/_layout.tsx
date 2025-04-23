import { Stack } from "expo-router";

export default function Subscreen() {
  return (
    <Stack>
      <Stack.Screen
        name="equipment"
        options={{
          title: "Select Equipment Type",
          headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="primary-muscle-group"
        options={{
          title: "Select Muscle Group",
          headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="exercise-type"
        options={{
          title: "Select Exercise Type",
          headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="secondary-muscle-group"
        options={{
          title: "Secondary Muscle Groups",
          headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
