import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  calculateStreakAndRest,
  fetchMarkedDates,
} from "@/redux/slices/calendar-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const StreakHeader = () => {
  const [streakModal, setStreakModal] = useState(false);
  const [restModal, setRestModal] = useState(false);
  const dispatch = useAppDispatch();

  const streakCount = useSelector(
    (state: RootState) => state.calendar.streakCount
  );
  const restCount = useSelector((state: RootState) => state.calendar.restCount);

  useEffect(() => {
    dispatch(fetchMarkedDates())
      .unwrap()
      .then(() => {
        dispatch(calculateStreakAndRest());
      })
      .catch((err) => {
        console.error("Failed to fetch marked dates:", err);
      });
  }, [dispatch]);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.streakContainer}
        onPress={() => setStreakModal(true)}
      >
        <MaterialCommunityIcons name="fire" size={45} color="#DC723D" />
        <View>
          <Text style={styles.streakText}>
            {`${streakCount} ${streakCount === 1 ? "Week" : "Weeks"}`}
          </Text>
          <Text style={styles.streakLabel}>Streak</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.streakContainer}
        onPress={() => setRestModal(true)}
      >
        <MaterialCommunityIcons name="power-sleep" size={45} color="#48A6A7" />
        <View>
          <Text style={styles.streakText}>{`${restCount} ${
            restCount === 1 ? "Day" : "Days"
          }`}</Text>
          <Text style={styles.streakLabel}>Rest</Text>
        </View>
      </TouchableOpacity>
      <Modal
        isVisible={streakModal}
        onBackdropPress={() => setStreakModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            You have a streak of{" "}
            {`${streakCount} ${streakCount === 1 ? "week" : "weeks"}`}.{"\n\n"}
            Make sure to log a workout at least once a week to keep the streak
            going.
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setStreakModal(false)}
          >
            <Text style={styles.modalButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={restModal} onBackdropPress={() => setRestModal(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            It has been {`${restCount} ${restCount === 1 ? "day" : "days"}`}{" "}
            since your last workout.
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setRestModal(false)}
          >
            <Text style={styles.modalButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default StreakHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  streakContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
  },
  streakText: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
  },
  streakLabel: {
    color: "#808080",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 20,
  },
  modalText: {
    textAlign: "center",
    fontFamily: "Inter_600",
    fontSize: 18,
  },
  modalButton: {
    backgroundColor: "#48A6A7",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
  },
  modalButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
});
