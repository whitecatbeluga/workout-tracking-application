import { TouchableOpacity, Text } from "react-native";
import { useRouter, Stack } from "expo-router";

export default function Workout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="add-workout"
        options={{
          title: "Add Empty Workout",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="create-routine"
        options={{
          title: "Create Routine",
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
        }}
      />
    </Stack>
  );
}
