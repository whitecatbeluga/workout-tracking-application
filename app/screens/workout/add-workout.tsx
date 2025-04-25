import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useRouter, useNavigation } from "expo-router";

const AddWorkout = () => {
  const [timer, setTimer] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isClockModal, setIsClockModal] = useState<boolean>(false);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
          onPress={() => setIsModalVisible((prev) => !prev)}
        >
          <Ionicons name="arrow-back-outline" size={20} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity onPress={() => setIsClockModal((prev) => !prev)}>
            <Ionicons name="alarm-outline" size={34} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#48A6A7",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontFamily: "Inter_500Medium" }}>
              Finish
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  });

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View>
          <Text style={styles.title}>Duration</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: "#48A6A7",
            }}
          >
            {timer < 60
              ? `${timer}s`
              : `${Math.floor(timer / 60)}min ${timer % 60}s`}
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Volume</Text>
          <Text style={styles.volumeSets}>0 kg</Text>
        </View>
        <View>
          <Text style={styles.title}>Sets</Text>
          <Text style={styles.volumeSets}>0</Text>
        </View>
      </View>
      <View style={styles.getStartedContainer}>
        <Ionicons name="barbell-outline" size={50} color="#6A6A6A" />
        <Text style={styles.getStartedText}>Get started</Text>
        <Text style={styles.getStartedDescription}>
          Add an exercise to start your workout
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 12, paddingVertical: 20 }}>
        <View>
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => router.push("/screens/workout/add-exercise")}
          >
            <Ionicons name="add-outline" size={20} color="#FFFFFF" />
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: "#FFFFFF",
              }}
            >
              Add Exercise
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.settingsDiscardContainer}>
          <TouchableOpacity
            style={styles.settingsDiscardButton}
            onPress={() => router.push("/screens/workout/workout-settings")}
          >
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16 }}>
              Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingsDiscardButton}
            onPress={() => setIsModalVisible((prev) => !prev)}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: "#ED1010",
              }}
            >
              Discard Workout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Are you sure you want to discard this workout?
          </Text>
          <View style={{ width: "100%", alignItems: "center", gap: 14 }}>
            <TouchableOpacity
              style={styles.modalSettingsDiscardButton}
              onPress={() => router.back()}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: "#ED1010",
                }}
              >
                Discard Workout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSettingsDiscardButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isClockModal}
        onBackdropPress={() => setIsClockModal(false)}
      >
        <View style={styles.clockModalContainer}>
          <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 18 }}>
            Clock
          </Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles.timerButton}>
              <Text style={{ fontFamily: "Inter_400Regular" }}>Timer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stopwatchButton}>
              <Text style={{ fontFamily: "Inter_400Regular" }}>Stopwatch</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  topContainer: {
    flexDirection: "row",
    // justifyContent: "space-between"
    gap: 90,
  },
  title: {
    color: "#6A6A6A",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  volumeSets: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  getStartedContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    gap: 10,
  },
  getStartedText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  getStartedDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  addExerciseButton: {
    backgroundColor: "#48A6A7",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  settingsDiscardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsDiscardButton: {
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: 175,
    borderRadius: 8,
  },

  // Modal
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 20,
  },
  modalSettingsDiscardButton: {
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
  },

  // Clock Modal
  clockModalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  timerButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 100,
    padding: 6,
    alignItems: "center",
  },
  stopwatchButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: 100,
    padding: 6,
    alignItems: "center",
  },
});
