import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useExerciseContext } from "../../workout/context/exercise-content";

const Equipment: React.FC = () => {
  const router = useRouter();
  const { setSelectedEquipment } = useExerciseContext();

  const equipmentOptions = [
    "None",
    "Barbell",
    "Dumbbell",
    "Kettlebell",
    "Machine",
    "Plate",
    "Resistance Band",
    "Suspension Band",
    "Other",
  ];

  const handleSelectEquipment = (equipment: string) => {
    setSelectedEquipment(equipment);
    router.push("/screens/workout/create-exercise");
  };

  return (
    <View style={styles.container}>
      {equipmentOptions.map((equipment) => (
        <TouchableOpacity
          key={equipment}
          style={styles.equipmentContainer}
          onPress={() => handleSelectEquipment(equipment)}
        >
          <Text style={styles.text}>{equipment}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Equipment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  equipmentContainer: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});
