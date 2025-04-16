import { StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import WorkoutPage from "../screens/workout";

const Workout = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WorkoutPage />
    </SafeAreaView>
  );
};

export default Workout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
