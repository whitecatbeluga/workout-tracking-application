import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const CreateExercise = () => {
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("Permission to access camera roll is required.");
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
      {/* Preview image */}
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
        {/* Exercise name */}
        <TextInput
          placeholder="Exercise Name"
          style={styles.exerciseNameInput}
        />
        {/* Equipment select */}
        <TouchableOpacity style={styles.selectContainer}>
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Equipment</Text>
            <Text style={styles.select}>Select</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>
        {/* Primary muscle group select */}
        <TouchableOpacity style={styles.selectContainer}>
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Primary Muscle Group</Text>
            <Text style={styles.select}>Select</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>
        {/* Other muscles */}
        <TouchableOpacity style={styles.selectContainer}>
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Other Muscles</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text style={styles.select}>Select</Text>
              <Text
                style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}
              >
                (optional)
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} />
        </TouchableOpacity>
        {/* Exercise type select */}
        <TouchableOpacity style={styles.selectContainer}>
          <View style={{ gap: 5 }}>
            <Text style={styles.title}>Exercise Type</Text>
            <Text style={styles.select}>Select</Text>
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
