import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const CreateRoutine = () => {
  return (
    <View style={styles.container}>
      <TextInput placeholder="Routine Title" style={styles.routineTitleInput} />
      <View style={styles.addExerciseContainer}>
        <Ionicons name="barbell-outline" size={36} />
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          Get started by adding an exercise to your routine.
        </Text>
        <TouchableOpacity style={styles.addExerciseButton}>
          <Ionicons name="add-outline" size={20} color="#FFFFFF" />
          <Text
            style={{
              fontFamily: "Inter_500Medium",
              fontSize: 15,
              color: "#FFFFFF",
            }}
          >
            Add exercise
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateRoutine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  routineTitleInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  addExerciseContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  addExerciseButton: {
    backgroundColor: "#48A6A7",
    paddingHorizontal: 100,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 36,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
});
