import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

const AddExercise = () => {
  const [searchExercise, setSearchExercise] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons style={styles.searchIcon} name="search-outline" size={20} />
        <TextInput
          placeholder="Search exercise"
          value={searchExercise}
          onChangeText={setSearchExercise}
          style={styles.searchInput}
          autoFocus
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <TouchableOpacity style={styles.buttonAllEquipment}>
          <Text style={styles.buttonText}>All Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonAllMuscle}>
          <Text style={styles.buttonText}>All Muscles</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 16 }}>
        <Text
          style={{
            color: "#555555",
            fontFamily: "Inter_500Medium",
            fontSize: 16,
          }}
        >
          All Exercises
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>List of exercises here</Text>
      </View>
    </View>
  );
};

export default AddExercise;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    paddingLeft: 32,
    paddingRight: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  searchIcon: {
    color: "#AAAAAA",
    position: "absolute",
    zIndex: 1,
    left: 10,
  },
  buttonAllEquipment: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 36,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonAllMuscle: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 46,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
  },
});
