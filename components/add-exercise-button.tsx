import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const AddExercise = () => {
  return (
    <TouchableOpacity style={styles.btn} activeOpacity={0.8}>
        <Ionicons name="add" size={27} color="#FFFFFF"/>
      <Text style={styles.txt}>Start an Empty Workout</Text>
    </TouchableOpacity>
  );
};

export default AddExercise;

const styles = StyleSheet.create({
  btn: {
    height: 48,
    width: "90%",
    borderRadius: 50,
    backgroundColor: "#48A6A7",
    flexDirection:"row",
    alignItems: "center",
    justifyContent:'center'
  },
  txt: {
    color: "#FFFFFF",
    fontSize:19
  },
});
