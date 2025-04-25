import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Exercise } from "@/custom-types/exercise-type";

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [active, setActive] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!exercise) {
      setIsLoading(true);
    }
    setIsLoading(false);
  }, []);

  const handlePress = () => {
    const toValue = active ? 0 : 20;
    setActive(!active);

    Animated.timing(translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      {isLoading ? (
        <Text>Loading exercises</Text>
      ) : (
        <Pressable onPress={handlePress}>
          <View style={styles.card}>
            <Animated.View
              style={[styles.content, { transform: [{ translateX }] }]}
            >
              <View
                style={[styles.iconContainer, active && styles.activeBorder]}
              >
                <Ionicons
                  name="barbell-outline"
                  size={60}
                  color="#333"
                  style={styles.icon}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{exercise.name}</Text>
                <Text style={styles.subtitle}>{exercise.description}</Text>
              </View>
            </Animated.View>
          </View>
        </Pressable>
      )}
    </>
  );
};

export default ExerciseCard;

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    margin: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
    paddingRight: 10,
  },
  activeBorder: {
    borderRightWidth: 3,
    borderRightColor: "#48A6A7",
  },
  icon: {},
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    marginTop: 4,
  },
});
