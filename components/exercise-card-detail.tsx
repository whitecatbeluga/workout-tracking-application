import { Swipeable, RectButton } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  FlatList,
} from "react-native";
import { Exercise, WorkoutSets } from "@/custom-types/exercise-type";
import Icon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";

import {
  updateWorkoutSets,
  updateTotalVolumeSets,
} from "@/redux/slices/workout-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useLocalSearchParams, usePathname } from "expo-router";
import { useAppSelector } from "@/hooks/use-app-selector";
import { updateWorkoutRoutineSets } from "@/redux/slices/routine-slice";

interface ExerciseDetailCardProps {
  exercise: Exercise;
  openRoutine?: () => void;
}

interface SetData {
  set: number;
  previous: string;
  kg: string;
  reps: string;
  checked: boolean;
}

const ExerciseDetailCard = ({
  exercise,
  openRoutine,
}: ExerciseDetailCardProps) => {
  const workoutSets = useAppSelector((state) => state.workout.workoutSets);
  const workoutRoutineSets = useAppSelector(
    (state) => state.routine.workoutRoutineSets
  );
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);
  const [isRestModalVisible, setIsRestModalVisible] = useState(false);
  const [restTimer, setRestTimer] = useState<number>(34);

  const dispatch = useAppDispatch();
  const { type } = useLocalSearchParams();
  const [setsByExercise, setSetsByExercise] = useState<{
    [key: string]: { name: string; sets: SetData[] };
  }>({
    [exercise.id]: {
      name: exercise.name,
      sets: [
        {
          set: 1,
          previous: "",
          kg: "",
          reps: "",
          checked: false,
        },
      ],
    },
  });

  useEffect(() => {
    if (workoutSets != null) {
      const saveSets = workoutSets[exercise.id];
      if (saveSets) {
        setSetsByExercise({
          [exercise.id]: saveSets,
        });
      }
    }

    if (workoutRoutineSets != null) {
      const saveSets = workoutRoutineSets[exercise.id];
      if (saveSets) {
        setSetsByExercise({
          [exercise.id]: saveSets,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (workoutSets != null) {
      const setsObject: WorkoutSets = Object.keys(setsByExercise).reduce(
        (acc, exerciseId) => {
          acc[exerciseId] = {
            name: setsByExercise[exerciseId].name,
            sets: setsByExercise[exerciseId].sets,
          };
          return acc;
        },
        {} as WorkoutSets
      );
      dispatch(updateWorkoutSets(setsObject));
    }

    if (workoutRoutineSets != null) {
      const setsObject: WorkoutSets = Object.keys(setsByExercise).reduce(
        (acc, exerciseId) => {
          acc[exerciseId] = {
            name: setsByExercise[exerciseId].name,
            sets: setsByExercise[exerciseId].sets,
          };
          return acc;
        },
        {} as WorkoutSets
      );
      dispatch(updateWorkoutRoutineSets(setsObject));
    }
  }, [setsByExercise]);

  const calculateTotalVolumeSets = (allWorkoutSets: WorkoutSets) => {
    let totalVolume = 0;
    let totalSets = 0;

    Object.values(allWorkoutSets).forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.checked) {
          const kg = parseFloat(set.kg) || 0;
          const reps = parseFloat(set.reps) || 0;
          totalVolume += kg * reps;
          totalSets += 1;
        }
      });
    });

    return { totalVolume, totalSets };
  };

  useEffect(() => {
    dispatch(updateTotalVolumeSets(calculateTotalVolumeSets(workoutSets)));
  }, [workoutSets]);

  const handleInputChange = (
    exerciseId: string,
    index: number,
    field: keyof SetData,
    value: string
  ) => {
    setSetsByExercise((prevSetsByExercise) => {
      const exerciseData = prevSetsByExercise[exerciseId];
      const updatedSets = [...exerciseData.sets];
      updatedSets[index] = { ...updatedSets[index], [field]: value || "" };
      return {
        ...prevSetsByExercise,
        [exerciseId]: { ...exerciseData, sets: updatedSets },
      };
    });
  };

  const handleToggleCheck = (exerciseId: string, index: number) => {
    setSetsByExercise((prevSetsByExercise) => {
      const exerciseData = prevSetsByExercise[exerciseId];
      const updatedSets = [...exerciseData.sets];
      updatedSets[index] = {
        ...updatedSets[index],
        checked: !updatedSets[index].checked,
      };
      return {
        ...prevSetsByExercise,
        [exerciseId]: { ...exerciseData, sets: updatedSets },
      };
    });
  };

  const handleAddSet = (exerciseId: string) => {
    setSetsByExercise((prevSetsByExercise) => {
      const exerciseData = prevSetsByExercise[exerciseId];
      const updatedSets = [
        ...exerciseData.sets,
        {
          set: exerciseData.sets.length + 1,
          previous: "",
          kg: "",
          reps: "",
          checked: false,
        },
      ];
      return {
        ...prevSetsByExercise,
        [exerciseId]: { ...exerciseData, sets: updatedSets },
      };
    });
  };

  const handleSelectRestTime = (seconds: number) => {
    setRestTimer(seconds);
    setIsRestModalVisible(false);
  };

  const handleDeleteSet = (exerciseId: string, index: number) => {
    setSetsByExercise((prevSetsByExercise) => {
      const exerciseData = prevSetsByExercise[exerciseId];
      const updatedSets = exerciseData.sets.filter((_, i) => i !== index);
      return {
        ...prevSetsByExercise,
        [exerciseId]: { ...exerciseData, sets: updatedSets },
      };
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 10,
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>
          {exercise.name}
        </Text>
        <TouchableOpacity onPress={openRoutine}>
          <Feather name="more-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => setIsRestModalVisible(true)}
        style={styles.restTimerContainer}
      >
        <Icon
          name="clock-o"
          size={20}
          color="#007bff"
          style={{ marginRight: 5 }}
        />
        <Text style={{ fontSize: 16, color: "#007bff" }}>
          Rest timer: {restTimer}s
        </Text>
      </TouchableOpacity>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Set</Text>
          <Text style={styles.tableHeaderText}>Previous</Text>
          <Text style={styles.tableHeaderText}>KG</Text>
          <Text style={styles.tableHeaderText}>REPS</Text>
          {pathname === "/screens/workout/add-workout" && (
            <Text style={styles.tableHeaderText}>CHECK</Text>
          )}
        </View>

        {setsByExercise[exercise.id].sets.map((set, index) => (
          <Swipeable
            key={set.set}
            renderRightActions={() => (
              <RectButton
                style={styles.deleteButton}
                onPress={() => handleDeleteSet(exercise.id, index)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </RectButton>
            )}
          >
            <View
              style={[
                styles.tableRow,
                focusedRowIndex === index && styles.selectedRow,
                set.checked && styles.checkedRow,
              ]}
            >
              <Text style={styles.tableCell}>{set.set}</Text>

              <TextInput
                style={[styles.tableCell, styles.inputTextCenter]}
                value={set.previous}
                onChangeText={(text) =>
                  handleInputChange(exercise.id, index, "previous", text)
                }
                onFocus={() => setFocusedRowIndex(index)}
                placeholder="-"
              />
              <TextInput
                style={[styles.tableCell, styles.inputTextCenter]}
                value={set.kg}
                onChangeText={(text) =>
                  handleInputChange(exercise.id, index, "kg", text)
                }
                onFocus={() => setFocusedRowIndex(index)}
                placeholder="0"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.tableCell, styles.inputTextCenter]}
                value={set.reps}
                onChangeText={(text) =>
                  handleInputChange(exercise.id, index, "reps", text)
                }
                onFocus={() => setFocusedRowIndex(index)}
                placeholder="0"
                keyboardType="numeric"
              />

              {pathname === "/screens/workout/add-workout" && (
                <TouchableOpacity
                  style={styles.tableCell}
                  onPress={() => handleToggleCheck(exercise.id, index)}
                >
                  <Text style={{ fontSize: 16, textAlign: "center" }}>
                    {set.checked ? "✔️" : ""}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </Swipeable>
        ))}
      </View>

      <Button
        title="+ Add Set"
        onPress={() => handleAddSet(exercise.id)}
        color="#48A6A7"
      />

      <Modal
        visible={isRestModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsRestModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsRestModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Rest Time</Text>
                <FlatList
                  data={[15, 30, 45, 60, 90, 120]}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.restTimeOption}
                      onPress={() => handleSelectRestTime(item)}
                    >
                      <Text style={styles.restTimeText}>{item} seconds</Text>
                    </Pressable>
                  )}
                />
                <Button
                  title="Cancel"
                  onPress={() => setIsRestModalVisible(false)}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 1,
    marginTop: 3,
    width: "100%",
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#333",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    // marginBottom: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    // paddingTop: 5,
    // paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedRow: {
    backgroundColor: "#e0f7fa",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    minWidth: 50,
    height: 40,
    justifyContent: "center",
  },
  inputTextCenter: {
    textAlign: "center",
    textAlignVertical: "center",
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  restTimeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  restTimeText: {
    fontSize: 16,
    textAlign: "center",
  },
  restTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 76,
    marginTop: 4,
    height: "78%",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkedRow: {
    backgroundColor: "#E6FBEF",
  },
});

export default ExerciseDetailCard;
