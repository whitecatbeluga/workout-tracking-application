import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Exercise } from "@/custom-types/exercise-type";

interface ExerciseDetailCardProps {
  exercise: Exercise;
}

const ExerciseDetailCard = ({ exercise }: ExerciseDetailCardProps) => {
  return (
    <View>
      <Text>{exercise.name}</Text>
      <Text>{exercise.category}</Text>
      <Text>{exercise.description}</Text>
    </View>
  );
};

export default ExerciseDetailCard;

const styles = StyleSheet.create({});
 