import React, {
  useState,
  useLayoutEffect,
  useMemo,
  forwardRef,
  useRef,
} from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { useRouter, useNavigation } from "expo-router";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useAppSelector } from "@/hooks/use-app-selector";
import ExerciseDetailCard from "@/components/exercise-card-detail";
import Timer from "@/components/timer";
import { WorkoutSets } from "@/custom-types/exercise-type";
import {
  clearWorkoutSets,
  drarfWorkout,
  undraftWorkout,
} from "@/redux/slices/workout-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { clearSelectedExercises } from "@/redux/slices/exercise-slice";
import { RootState } from "@/redux/store";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BtnTitle, CustomBtn } from "@/components/custom-btn";
import { resetDuration } from "@/redux/slices/timer-slice";
import { clearWorkoutRoutineSets } from "@/redux/slices/routine-slice";

const AddWorkout = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isClockModal, setIsClockModal] = useState<boolean>(false);
  const [addExerciseModal, setAddExerciseModal] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<"timer" | "stopwatch">(
    "timer"
  );
  const createNewRoutineRef = useRef<BottomSheet>(null);

  // const [duration, setDuration] = useState<number>(60);
  const duration = useAppSelector((state) => state.timer.duration);
  const [isTimerPlaying, setIsTimerPlaying] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  // For stopwatch
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const dispatch = useAppDispatch();
  const openCreateNewRoutine = () => {
    createNewRoutineRef.current?.expand();
  };
  // To be passed to save workout
  const workoutDuration = useAppSelector(
    (state: RootState) => state.timer.duration
  );

  const exercises = useAppSelector((state) => state.exercise.exercise);
  const workoutSets = useAppSelector((state) => state.workout.workoutSets);
  const selectedExercises = useAppSelector(
    (state) => state.exercise.selectedExercise
  );

  const totalVolumeSets = useAppSelector(
    (state) => state.workout.totalVolumeSets
  );

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
          onPress={() => {
            dispatch(drarfWorkout());
            router.replace("/(tabs)/workout");
          }}
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
            onPress={() => {
              handleFinish();
            }}
          >
            <Text style={{ color: "#FFFFFF", fontFamily: "Inter_500Medium" }}>
              Finish
            </Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [selectedExercises, duration, navigation, workoutSets]);

  const handleCancel = () => {
    setIsTimerPlaying(false);
    setKey((prev) => prev + 1);
  };

  const formatTime = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const calculateWorkoutStats = (workoutSets?: WorkoutSets | null) => {
    let totalVolume = 0;
    let totalSets = 0;

    if (!workoutSets) return { totalVolume, totalSets };

    for (const exercise of Object.values(workoutSets)) {
      for (const set of exercise.sets || []) {
        const kg = Number(set.kg) || 0;
        const reps = Number(set.reps) || 0;
        const volume = kg * reps;
        totalVolume += volume;
        totalSets += 1;
      }
    }
    return { totalVolume, totalSets };
  };

  const handleFinish = () => {
    if (!workoutSets) {
      setAddExerciseModal(true);
      console.error("Error: workoutSets is null or undefined");
      return;
    }

    const { totalVolume, totalSets } = calculateWorkoutStats(workoutSets);

    router.push({
      pathname: "/screens/workout/save-workout",
      params: {
        workoutSets: JSON.stringify(workoutSets),
        totalVolume: totalVolume.toString(),
        totalSets: totalSets.toString(),
        totalDuration: duration,
      },
    });
    console.log("Workout sets: ", JSON.stringify(workoutSets, null, 2));
    console.log("Total Volume: ", totalVolume);
    console.log("Total Sets: ", totalSets);
    console.log("Total Duration: ", workoutDuration);
    // dispatch(resetDuration());
  };

  const discardWorkout = () => {
    setIsModalVisible((prev) => !prev);
    dispatch(clearSelectedExercises());
    dispatch(clearWorkoutSets());
    dispatch(clearWorkoutRoutineSets());
    dispatch(undraftWorkout());
    router.replace("/(tabs)/workout");
  };
  // console.log("counter-add workout");
  // console.log("isModalVisible", isModalVisible);
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
            {/* <Timer /> */}
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Volume</Text>
          <Text style={styles.volumeSets}>{totalVolumeSets.totalVolume}kg</Text>
        </View>
        <View>
          <Text style={styles.title}>Sets</Text>
          <Text style={styles.volumeSets}>{totalVolumeSets.totalSets}</Text>
        </View>
      </View>
      {/* Show here the added exercise */}
      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {selectedExercises.length === 0 ? (
          <View style={styles.getStartedContainer}>
            <Ionicons name="barbell-outline" size={50} color="#6A6A6A" />
            <Text style={styles.getStartedText}>Get started</Text>
            <Text style={styles.getStartedDescription}>
              Add an exercise to start your workout
            </Text>
          </View>
        ) : (
          selectedExercises.map((selectedExercise) => (
            <ExerciseDetailCard
              key={selectedExercise.id}
              openRoutine={openCreateNewRoutine}
              exercise={selectedExercise}
            />
          ))
        )}
      </ScrollView>
      {/*  */}
      <View style={{ flexDirection: "column", gap: 12, paddingVertical: 20 }}>
        <View>
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() => router.replace("/screens/workout/add-exercise")}
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
        {/* Modal Add exercise */}
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

      {/* Clock Modal */}
      {isModalVisible || isClockModal ? (
        <>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setIsModalVisible(false)}
            backdropOpacity={0.5}
            style={{ margin: 0, justifyContent: "center" }}
          >
            <View
              style={[
                styles.modalContainer,
                { width: "80%", alignSelf: "center" },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Are you sure you want to discard this workout?
              </Text>
              <View style={{ width: "100%", gap: 14 }}>
                <TouchableOpacity
                  style={[
                    styles.modalSettingsDiscardButton,
                    { borderWidth: 1, borderColor: "#ED1010" },
                  ]}
                  onPress={discardWorkout}
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
              <View style={{ flexDirection: "row", width: "100%" }}>
                <TouchableOpacity
                  style={[
                    styles.timerButton,
                    activeButton === "timer" && styles.activeButton,
                  ]}
                  onPress={() => setActiveButton("timer")}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      activeButton === "timer" && styles.activeText,
                    ]}
                  >
                    Timer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.stopwatchButton,
                    activeButton === "stopwatch" && styles.activeButton,
                  ]}
                  onPress={() => setActiveButton("stopwatch")}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      activeButton === "stopwatch" && styles.activeText,
                    ]}
                  >
                    Stopwatch
                  </Text>
                </TouchableOpacity>
              </View>

              {activeButton === "timer" ? (
                <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
                  <View
                    style={{ flexDirection: "row", alignItems: "flex-end" }}
                  >
                    <TouchableOpacity
                    // onPress={() => setDuration((prev) => Math.max(prev - 15, 0))}
                    >
                      <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                        -15s
                      </Text>
                    </TouchableOpacity>
                    <CountdownCircleTimer
                      isPlaying={isTimerPlaying}
                      duration={duration}
                      key={key}
                      colors={["#48A6A7", "#F7B801", "#ED1010", "#000000"]}
                      colorsTime={[
                        duration,
                        duration * 0.66,
                        duration * 0.33,
                        0,
                      ]}
                      size={200}
                      strokeWidth={10}
                      onComplete={() => {
                        setIsTimerPlaying(false);
                        setKey((prev) => prev + 1);
                        return { shouldRepeat: false };
                      }}
                    >
                      {({ remainingTime }) => (
                        <Text
                          style={{
                            fontFamily: "Inter_600SemiBold",
                            fontSize: 22,
                          }}
                        >{`${Math.floor(remainingTime / 60)
                          .toString()
                          .padStart(2, "0")}:${(remainingTime % 60)
                          .toString()
                          .padStart(2, "0")}`}</Text>
                      )}
                    </CountdownCircleTimer>
                    <TouchableOpacity
                    // onPress={() => setDuration((prev) => prev + 15)}
                    >
                      <Text style={{ fontFamily: "Inter_600SemiBold" }}>
                        +15s
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {!isTimerPlaying ? (
                    <TouchableOpacity
                      style={styles.clockStartButton}
                      onPress={() => setIsTimerPlaying(true)}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 16,
                          color: "#FFFFFF",
                        }}
                      >
                        Start
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.clockCancelButton}
                      onPress={handleCancel}
                    >
                      <Text
                        style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
                  <Text style={styles.stopwatch}>
                    {formatTime(elapsedTime)}
                  </Text>
                  {!isRunning && elapsedTime === 0 ? (
                    <TouchableOpacity
                      style={styles.stopwatchStartButton}
                      onPress={() => setIsRunning(true)}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 16,
                          color: "#FFFFFF",
                        }}
                      >
                        Start
                      </Text>
                    </TouchableOpacity>
                  ) : isRunning ? (
                    <TouchableOpacity
                      style={styles.stopwatchStopButton}
                      onPress={() => setIsRunning(false)}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_500Medium",
                          fontSize: 16,
                          color: "#000000",
                        }}
                      >
                        Stop
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      <TouchableOpacity
                        style={styles.stopwatchResetButton}
                        onPress={handleReset}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_500Medium",
                            fontSize: 16,
                            color: "#000000",
                          }}
                        >
                          Reset
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.stopwatchStartButtonHalf}
                        onPress={() => setIsRunning(true)}
                      >
                        <Text
                          style={{
                            fontFamily: "Inter_500Medium",
                            fontSize: 16,
                            color: "#FFFFFF",
                          }}
                        >
                          Start
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          </Modal>
        </>
      ) : (
        <BottomSheetOverlay ref={createNewRoutineRef}>
          <CustomBtn
            // key=
            onPress={() => {}}
            buttonStyle={{
              borderRadius: 6,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <BtnTitle
              title={"Delete" as string}
              textStyle={{ fontSize: 14, color: "red" }}
            />
          </CustomBtn>
        </BottomSheetOverlay>
      )}

      <Modal
        isVisible={addExerciseModal}
        onBackdropPress={() => setAddExerciseModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Add an exercise
          </Text>
          <View style={{ width: "100%", alignItems: "center", gap: 14 }}>
            <TouchableOpacity
              style={styles.addExerciseModalButton}
              onPress={() => setAddExerciseModal((prev) => !prev)}
            >
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
              >
                Ok
              </Text>
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
    width: "49%",
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
  addExerciseModalButton: {
    backgroundColor: "#48A6A7",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
  },

  // Clock Modal
  clockModalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    alignItems: "center",
    borderRadius: 8,
    flexDirection: "column",
    gap: 16,
    height: 400,
  },
  timerButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: "50%",
    padding: 10,
    alignItems: "center",
  },
  stopwatchButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    width: "50%",
    padding: 10,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#48A6A7",
  },
  buttonText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  activeText: {
    fontFamily: "Inter_400Regular",
    color: "#FFFFFF",
  },
  clockStartButton: {
    padding: 10,
    backgroundColor: "#48A6A7",
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  clockCancelButton: {
    padding: 10,
    backgroundColor: "#EEEEEE",
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },

  // Stopwatch
  stopwatch: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 50,
    paddingVertical: 63.5,
  },
  stopwatchStartButton: {
    padding: 10,
    backgroundColor: "#48A6A7",
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  stopwatchStopButton: {
    padding: 10,
    backgroundColor: "#EEEEEE",
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
  },
  stopwatchResetButton: {
    padding: 10,
    backgroundColor: "#EEEEEE",
    width: "50%",
    borderRadius: 8,
    alignItems: "center",
  },
  stopwatchStartButtonHalf: {
    padding: 10,
    backgroundColor: "#48A6A7",
    width: "50%",
    borderRadius: 8,
    alignItems: "center",
  },
});
const BottomSheetOverlay = forwardRef<BottomSheet, BottomSheetProps>(
  ({ children }, ref) => {
    const snapPoints = useMemo(() => ["50%"], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleStyle={{
          backgroundColor: "#F4F4F4",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        <BottomSheetScrollView
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 20,
            backgroundColor: "#F4F4F4",
            gap: 10,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
