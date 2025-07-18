import { Audio } from "expo-av";
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
import { usePathname } from "expo-router";
import { useAppSelector } from "@/hooks/use-app-selector";
import { updateWorkoutRoutineSets } from "@/redux/slices/routine-slice";
import useDebouncedWorkoutSetUpdate from "@/hooks/use-debounce-workout";

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
  const [restTimer, setRestTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentRestTime, setCurrentRestTime] = useState(restTimer);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);

  const swipeableRefs = React.useRef<{ [key: number]: Swipeable | null }>({});

  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [setsByExercise, setSetsByExercise] = useState<{
    [key: string]: { name: string; sets: SetData[] };
  }>({
    [exercise.id]: {
      name: exercise.name,
      sets:
        Array.isArray(exercise.sets) && exercise.sets.length > 0
          ? exercise.sets
              .map((s, index) => ({
                set: typeof s.set === "number" ? s.set : index + 1,
                previous: typeof s.previous === "string" ? s.previous : "",
                kg: typeof s.kg === "string" ? s.kg : "",
                reps: typeof s.reps === "string" ? s.reps : "",
                checked: typeof s.checked === "boolean" ? s.checked : false,
              }))
              .sort((a, b) => a.set - b.set)
          : [
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
    async function loadSound() {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/peep.mp3"),
        { isLooping: true }
      );
      setSound(sound);
    }

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && currentRestTime > 0) {
      interval = setInterval(() => {
        setCurrentRestTime((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && currentRestTime === 0) {
      setIsTimerRunning(false);
      playAlarm();
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, currentRestTime]);

  useEffect(() => {
    const { totalVolume, totalSets } = calculateTotalVolumeSets(workoutSets);
    dispatch(updateTotalVolumeSets({ totalVolume, totalSets }));
  }, [workoutSets, dispatch]);

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

  useDebouncedWorkoutSetUpdate(setsByExercise);

  const playAlarm = async () => {
    if (sound) {
      await sound.playAsync();
      setIsAlarmPlaying(true);
    }
  };

  const stopAlarm = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsAlarmPlaying(false);
    }
  };

  const startTimer = () => {
    if (isAlarmPlaying) {
      stopAlarm();
    }
    setCurrentRestTime(restTimer);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleSelectRestTime = (seconds: number) => {
    setRestTimer(seconds);
    setCurrentRestTime(seconds);
    setIsRestModalVisible(false);
  };

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
    setTimeout(() => setFocusedRowIndex(null), 0);
  };

  const handleToggleCheck = (exerciseId: string, index: number) => {
    setSetsByExercise((prev) => {
      const updated = {
        ...prev,
        [exerciseId]: {
          ...prev[exerciseId],
          sets: prev[exerciseId].sets.map((set, i) =>
            i === index ? { ...set, checked: !set.checked } : set
          ),
        },
      };
      if (workoutSets != null) {
        dispatch(updateWorkoutSets(updated));
        dispatch(updateTotalVolumeSets(calculateTotalVolumeSets(updated)));
      }

      if (workoutRoutineSets != null) {
        dispatch(updateWorkoutRoutineSets(updated));
      }

      return updated;
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

  const handleDeleteSet = (exerciseId: string, index: number) => {
    if (swipeableRefs.current[index]) {
      swipeableRefs.current[index]?.close();
    }

    setSetsByExercise((prevSetsByExercise) => {
      const exerciseData = prevSetsByExercise[exerciseId];
      const filteredSets = exerciseData.sets.filter((_, i) => i !== index);
      const renumberedSets = filteredSets.map((set, i) => ({
        ...set,
        set: i + 1,
      }));
      const updatedState = {
        ...prevSetsByExercise,
        [exerciseId]: {
          ...exerciseData,
          sets: renumberedSets,
        },
      };
      if (workoutSets != null) {
        dispatch(updateWorkoutSets(updatedState));
        dispatch(updateTotalVolumeSets(calculateTotalVolumeSets(updatedState)));
      }
      if (workoutRoutineSets != null) {
        dispatch(updateWorkoutRoutineSets(updatedState));
      }
      return updatedState;
    });
  };

  const calculateTotalVolumeSets = (allWorkoutSets: WorkoutSets) => {
    let totalVolume = 0;
    let totalSets = 0;

    Object.values(allWorkoutSets).forEach((exercise) => {
      exercise.sets.forEach((set) => {
        if (set.checked) {
          const kg = parseFloat(set.kg) || 0;
          const reps = parseFloat(set.reps) || 0;
          if (kg > 0 && reps > 0) {
            totalVolume += kg * reps;
            totalSets += 1;
          }
        }
      });
    });

    return { totalVolume, totalSets };
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <TouchableOpacity onPress={openRoutine}>
          <Feather name="more-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      {pathname === "/screens/workout/add-workout" && (
        <TouchableOpacity
          onPress={() => setIsRestModalVisible(true)}
          style={[
            styles.restTimerContainer,
            isAlarmPlaying && styles.alarmActiveContainer,
          ]}
        >
          <View style={styles.timerDisplay}>
            {
              <Icon
                name="clock-o"
                size={20}
                color={isAlarmPlaying ? "#ff3b30" : "#007bff"}
                style={{ marginRight: 5 }}
              />
            }
            <Text
              style={[
                styles.timerText,
                isAlarmPlaying && styles.alarmActiveText,
              ]}
            >
              {isAlarmPlaying
                ? "TIME'S UP!"
                : `Rest timer: ${currentRestTime}s`}
            </Text>
          </View>

          {isAlarmPlaying ? (
            <TouchableOpacity
              onPress={stopAlarm}
              style={[styles.timerControl, styles.alarmControl]}
            >
              <Icon name="bell-slash" size={20} color="#ff3b30" />
            </TouchableOpacity>
          ) : isTimerRunning ? (
            <TouchableOpacity onPress={stopTimer} style={styles.timerControl}>
              <Icon name="stop" size={20} color="#ff3b30" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startTimer} style={styles.timerControl}>
              <Icon name="play" size={20} color="#007bff" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}

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
            ref={(ref) => (swipeableRefs.current[index] = ref)}
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
    marginTop: 3,
    width: "100%",
  },
  headerContainer: {
    marginBottom: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 24,
  },
  restTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 10,
  },
  alarmActiveContainer: {
    backgroundColor: "#ffebee",
    borderColor: "#ff3b30",
    borderWidth: 1,
  },
  timerDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  timerText: {
    fontSize: 16,
    color: "#007bff",
  },
  alarmActiveText: {
    color: "#ff3b30",
    fontWeight: "bold",
  },
  timerControl: {
    padding: 5,
  },
  alarmControl: {
    backgroundColor: "#ffcdd2",
    borderRadius: 20,
    padding: 8,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
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
