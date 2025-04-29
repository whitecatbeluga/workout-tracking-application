import { TouchableOpacity, Text, View } from "react-native";
import { useRouter, Stack } from "expo-router";
import ExerciseProvider from "./context/exercise-content";

export default function Workout() {
  const router = useRouter();

  return (
    <ExerciseProvider>
      <Stack>
        <Stack.Screen
          name="add-workout"
          options={{
            title: "Log Workout",
            headerTitleStyle: {
              fontSize: 18,
              fontFamily: "Inter_400Regular",
            },
          }}
        />
        <Stack.Screen
          name="create-routine"
          options={{
            title: "Create Routine",
            headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push("/(tabs)/workout")}>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#48A6A7" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#48A6A7",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="add-exercise"
          options={{
            title: "Add Exercise",
            headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#48A6A7" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => router.push("/screens/workout/create-exercise")}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#48A6A7" }}
                >
                  Create
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="create-exercise"
          options={{
            title: "Create Exercise",
            headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity
                style={{
                  backgroundColor: "#48A6A7",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#48A6A7" }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="create-exercise-subscreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="workout-settings"
          options={{
            title: "Workout Settings",
            headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
            headerRight: () => (
              <TouchableOpacity>
                <Text
                  style={{ fontFamily: "Inter_400Regular", color: "#48A6A7" }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="save-workout"
          options={{
            title: "Save Workout",
            headerTitleStyle: { fontSize: 18, fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </ExerciseProvider>
  );
}
