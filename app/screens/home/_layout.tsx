import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="view-post"
        options={{
          title: "Workout Detail",
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
