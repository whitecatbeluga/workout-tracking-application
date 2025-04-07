import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import WorkoutHeader from "./workout-header";

const WorkoutPage = () => {
  return (
    <View style={styles.container}>
      <WorkoutHeader />
      <View style={styles.container}>
        <Text>WorkoutPage</Text>
      </View>
    </View >
  );
};

export default WorkoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
