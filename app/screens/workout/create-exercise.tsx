import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useExerciseContext } from "../workout/context/exercise-content"; // Import context

const CreateExercise: React.FC = () => {
  const router = useRouter();
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);
  const {
    selectedEquipment,
    primaryMuscleGroup,
    secondaryMuscleGroups,
    exerciseType,
    resetExerciseData, // Import reset function from context
  } = useExerciseContext();

  useEffect(() => {
    return () => {
      resetExerciseData();
      setExerciseImage(null);
    };
  }, []);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setExerciseImage(uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Preview Image */}
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <TouchableOpacity
          style={{ alignItems: "center", gap: 16 }}
          onPress={handlePickImage}
        >
          <View style={styles.noPic}>
            {!exerciseImage ? (
              <Ionicons name="camera-outline" size={24} />
            ) : (
              <Image
                source={{ uri: exerciseImage }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            )}
          </View>
          {!exerciseImage ? (
            <Text style={styles.addImageText}>Add Image</Text>
          ) : null}
        </TouchableOpacity>
      </View>
      <View style={styles.exerciseContainer}>
        {/* Exercise Name Input */}
        <TextInput
          placeholder="Exercise Name"
          style={styles.exerciseNameInput}
        />

        {/* Equipment Selection */}
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() =>
            router.push("/screens/workout/create-exercise-subscreen/equipment")
          }
        >
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Equipment</Text>
            {selectedEquipment ? (
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}
              >
                {selectedEquipment}
              </Text>
            ) : (
              <Text style={styles.select}>Select</Text>
            )}
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>

        {/* Primary Muscle Group Selection */}
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() =>
            router.push(
              "/screens/workout/create-exercise-subscreen/primary-muscle-group"
            )
          }
        >
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Primary Muscle Group</Text>
            {primaryMuscleGroup ? (
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}
              >
                {primaryMuscleGroup}
              </Text>
            ) : (
              <Text style={styles.select}>Select</Text>
            )}
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>

        {/* Secondary Muscle Groups Selection */}
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() =>
            router.push(
              "/screens/workout/create-exercise-subscreen/secondary-muscle-group"
            )
          }
        >
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Secondary Muscle Groups</Text>
            {secondaryMuscleGroups.length > 0 ? (
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  color: "#6A6A6A",
                  paddingRight: 20,
                }}
              >
                {secondaryMuscleGroups.join(", ")}
              </Text>
            ) : (
              <Text style={styles.select}>Select</Text>
            )}
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>

        {/* Exercise Type Selection */}
        <TouchableOpacity
          style={styles.selectContainer}
          onPress={() =>
            router.push(
              "/screens/workout/create-exercise-subscreen/exercise-type"
            )
          }
        >
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Exercise Type</Text>
            {exerciseType ? (
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}
              >
                {exerciseType}
              </Text>
            ) : (
              <Text style={styles.select}>Select</Text>
            )}
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  noPic: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: "#000000",
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  addImageText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#48A6A7",
  },
  exerciseContainer: {
    padding: 12,
    marginTop: 20,
  },
  exerciseNameInput: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
  },
  title: {
    fontFamily: "Inter_400Regular",
  },
  select: {
    fontFamily: "Inter_400Regular",
    color: "#48A6A7",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
  },
});
