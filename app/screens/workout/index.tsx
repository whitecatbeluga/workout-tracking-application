import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WorkoutHeader from "./workout-header";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import {
  clearWorkoutSets,
  getWorkout,
  undraftWorkout,
} from "@/redux/slices/workout-slice";
import { useAppSelector } from "@/hooks/use-app-selector";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import WorkoutCard from "@/components/workout-card";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { WorkoutExercise } from "@/custom-types/workout-type";
import ExerciseCard from "@/components/exercise-card";
import Input from "@/components/input-text";
import { Loading } from "@/custom-types/loading-type";
import { SkeletonLoader } from "@/components/workout-skeleton";
import { useRouter } from "expo-router";
import { BtnTitle, CustomBtn } from "@/components/custom-btn";
import Collapsible from "react-native-collapsible";
import RoutineFolderCard from "@/components/routine-folder-card";
import {
  fetchPrograms,
  deleteRoutine,
  Routine,
  Program,
  deleteProgram,
  deleteProgramAndRoutines,
  createProgram,
  updateProgramName,
  setRoutineParams,
  fetchRoutine,
  setSelectedRoutineExercises,
  setWorkoutRoutineSets,
  clearWorkoutRoutineSets,
  clearSelectedRoutineExercises,
} from "@/redux/slices/routine-slice";
import { auth } from "@/utils/firebase-config";
import CustomModal from "@/components/custom-modal";
import { seedFirestore } from "@/utils/seeders";
import { clearSelectedExercises } from "@/redux/slices/exercise-slice";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const WorkoutPage = () => {
  const offset = useRef(0);
  const { setTabVisible } = useTabVisibility();
  const dispatch = useAppDispatch();

  const userId = auth.currentUser?.uid;

  const draftWorkout = useAppSelector((state) => state.workout.draftWorkout);
  const loading = useAppSelector((state) => state.routine.loading);
  const programs = useAppSelector((state) => state.routine.programs);

  const [selectedRoutineDetails, setSelectedRoutineDetails] =
    useState<Routine | null>(null);
  const [selectedProgramDetails, setSelectedProgramDetails] =
    useState<Program | null>(null);

  const [programName, setProgramName] = useState<string>("");
  const [newProgramName, setNewProgramName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [isModalRoutineVisible, setIsModalRoutineVisible] =
    useState<boolean>(false);
  const [isModalProgramVisible, setIsModalProgramVisible] =
    useState<boolean>(false);
  const [isModalProgramRoutineVisible, setIsModalProgramRoutineVisible] =
    useState<boolean>(false);
  const [isModalCreateProgramVisible, setIsModalCreateProgramVisible] =
    useState<boolean>(false);
  const [isModalUpdateProgramVisible, setIsModalUpdateProgramVisible] =
    useState<boolean>(false);

  const [isModalResetWorkoutVisible, setIsModalResetWorkoutVisible] =
    useState<boolean>(false);
  const [modalResetWorkoutType, setModalResetWorkoutType] =
    useState<string>("");

  const [refreshing, setRefreshing] = useState(false);

  const routineRef = useRef<BottomSheet>(null);
  const programRef = useRef<BottomSheet>(null);
  const createNewRoutineRef = useRef<BottomSheet>(null);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchPrograms({ userId: userId as string }));
  }, [fetchPrograms]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > offset.current ? "down" : "up";

    if (Math.abs(currentOffset - offset.current) > 10) {
      setTabVisible(direction !== "down");
    }

    offset.current = currentOffset;
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const result = await dispatch(fetchPrograms({ userId: userId as string }));
    if (result.type === "programs/fetchAll/fulfilled") {
      setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // modal functions
  const openRoutineMenu = (id: string) => {
    const program = programs.find((p) =>
      p.routines.some((routine) => routine.id === id)
    );

    if (program) {
      setSelectedProgramDetails(program);
    }

    const selectedRoutine = program?.routines.find(
      (routine) => routine.id === id
    );

    if (selectedRoutine) {
      setSelectedRoutineDetails(selectedRoutine);

      routineRef.current?.expand();
    }
  };

  const openProgramMenu = (id: string) => {
    const program = programs.find((p) => p.id === id);

    if (program) {
      setSelectedProgramDetails(program);

      programRef.current?.expand();
    }
  };

  const openCreateNewRoutine = () => {
    if (draftWorkout) {
      setIsModalResetWorkoutVisible(true);
      setModalResetWorkoutType("create-routine");
      return;
    }

    router.push({
      pathname: "/screens/workout/create-routine",
      params: { type: "create-routine" },
    });
  };

  const openCreateNewRoutineBottomSheet = () => {
    createNewRoutineRef.current?.expand();
  };

  // handle functions
  const handleDeleteRoutine = async (
    userId: string,
    programId: string,
    routineId: string
  ) => {
    await dispatch(deleteRoutine({ userId, programId, routineId }));

    dispatch(fetchPrograms({ userId: userId as string }));
  };

  const handleDeleteProgram = async (userId: string, programId: string) => {
    await dispatch(deleteProgram({ userId, programId }));

    dispatch(fetchPrograms({ userId: userId as string }));
  };

  const handleDeleteProgramRoutine = async (
    userId: string,
    programId: string,
    routineIds: string[]
  ) => {
    await dispatch(deleteProgramAndRoutines({ userId, programId, routineIds }));

    dispatch(fetchPrograms({ userId: userId as string }));
  };

  const handleCreateProgram = async (userId: string, programName: string) => {
    if (programName === "") {
      setError("Please enter a program name.");
      return;
    }

    await dispatch(createProgram({ userId, programName }));

    dispatch(fetchPrograms({ userId: userId as string }));

    setError("");
    setProgramName("");

    setIsModalCreateProgramVisible(false);
  };

  const handleUpdateProgramName = async (
    userId: string,
    programId: string,
    programName: string
  ) => {
    if (programName === "") {
      setError("Please enter a program name.");
      return;
    }

    await dispatch(updateProgramName({ userId, programId, programName }));

    dispatch(fetchPrograms({ userId: userId as string }));

    setError("");
    setNewProgramName("");
    setIsModalUpdateProgramVisible(false);
  };

  const handleAddRoutineInProgram = (programId: string) => {
    dispatch(setRoutineParams({ programId: programId }));

    if (draftWorkout) {
      setIsModalResetWorkoutVisible(true);
      setModalResetWorkoutType("create-routine");
      return;
    }

    router.push({
      pathname: "/screens/workout/create-routine",
      params: { type: "create-routine" },
    });
  };

  const handleEditRoutine = async () => {
    const resultAction = await dispatch(
      fetchRoutine({
        routineId: selectedRoutineDetails?.id as string,
      })
    );

    if (fetchRoutine.fulfilled.match(resultAction)) {
      const routine = resultAction.payload;

      dispatch(setRoutineParams({ routineId: routine.id }));
      dispatch(setSelectedRoutineExercises(routine.exercises));

      router.push({
        pathname: "/screens/workout/edit-routine",
      });
    } else {
      console.error("Failed to fetch routine");
    }
  };

  const handleResetWorkout = () => {
    if (modalResetWorkoutType === "create-routine") {
      // clear workouts
      dispatch(clearWorkoutSets());
      dispatch(clearWorkoutRoutineSets());

      // clear exercises
      dispatch(clearSelectedRoutineExercises());
      dispatch(clearSelectedExercises());

      // reset draft workout
      dispatch(undraftWorkout());

      router.push({
        pathname: "/screens/workout/create-routine",
        params: { type: "create-routine" },
      });

      return;
    }

    if (modalResetWorkoutType === "start-routine") {
      router.push({
        pathname: "/screens/workout/add-workout",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView
          stickyHeaderIndices={[0]}
          scrollEventThrottle={16}
          onScroll={onScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 20,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <View style={{ gap: 20, width: "100%" }}>
              <View style={{ gap: 10 }}>
                <WorkoutHeader />
              </View>

              <TouchableOpacity onPress={seedFirestore}>
                <Text>Seeders</Text>
              </TouchableOpacity>

              <View style={styles.routine}>
                <Text style={styles.routineTxt}>Routines</Text>
                <View style={styles.routineIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalCreateProgramVisible(true);
                    }}
                  >
                    <MaterialIcons
                      name="create-new-folder"
                      size={32}
                      color="#323232"
                    />
                    {/* <Ionicons name="folder-outline" size={28} color="#323232" /> */}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.newRoutineSearch}>
                {/* new routine button */}
                <CustomBtn
                  onPress={
                    programs.length === 0
                      ? openCreateNewRoutine
                      : openCreateNewRoutineBottomSheet
                  }
                  buttonStyle={{
                    borderRadius: 6,
                    width: "48.5%",
                    backgroundColor: "#48A6A7",
                  }}
                >
                  <Ionicons name="grid-outline" size={18} color="white" />

                  <BtnTitle title="New Routine" textStyle={{ fontSize: 14 }} />
                </CustomBtn>

                {/* explore button */}
                <CustomBtn
                  onPress={() => {
                    router.push("/screens/workout/explore-routines");
                  }}
                  buttonStyle={{
                    borderRadius: 6,
                    width: "48.5%",
                    backgroundColor: "#48A6A7",
                  }}
                >
                  <Ionicons name="search" size={18} color="white" />

                  <BtnTitle title="Explore" textStyle={{ fontSize: 14 }} />
                </CustomBtn>
              </View>
            </View>
          </View>

          {loading == Loading.Pending ? (
            <View
              style={{
                marginTop: 20,
                width: "100%",
                gap: 8,
                alignItems: "center",
              }}
            >
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </View>
          ) : programs.length == 0 ? (
            <View
              style={{
                marginTop: 20,
                width: "100%",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/empty-state.png")}
                style={{ width: 250, height: 200, alignSelf: "center" }}
              />
              <Text
                style={{
                  fontFamily: "Inter_400Regular",
                  fontSize: 16,
                  textAlign: "center",
                  color: "#323232",
                }}
              >
                It looks like you don't have any routines yet. Create a new one
                to get started!
              </Text>
            </View>
          ) : (
            <View style={{ marginTop: 20, width: "100%", gap: 8 }}>
              {programs.map((program, index) => (
                <RoutineFolderCard
                  openRoutineMenu={openRoutineMenu}
                  openProgramMenu={openProgramMenu}
                  openResetWorkoutModal={setIsModalResetWorkoutVisible}
                  resetWorkoutType={setModalResetWorkoutType}
                  program={program}
                  key={index}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* modals */}
        {isModalRoutineVisible ||
        isModalProgramVisible ||
        isModalProgramRoutineVisible ||
        isModalCreateProgramVisible ||
        isModalUpdateProgramVisible ||
        isModalResetWorkoutVisible ? (
          <>
            {/* routine deletion modal */}
            <CustomModal
              isModalVisible={isModalRoutineVisible}
              setIsModalVisible={setIsModalRoutineVisible}
              modalTitle="Delete Routine"
              modalDescription="Are you sure you want to delete this routine?"
              modalActionButtonText="Confirm Deletion"
              modalActionButton={() => {
                handleDeleteRoutine(
                  userId as string,
                  selectedProgramDetails?.id as string,
                  selectedRoutineDetails?.id as string
                );
              }}
            />

            {/* create program modal */}
            <CustomModal
              isModalVisible={isModalCreateProgramVisible}
              setIsModalVisible={setIsModalCreateProgramVisible}
              modalTitle="Create Program"
              modalActionButtonText="Create Program"
              modalActionButtonColor="#48A6A7"
              allowInput
            >
              <Input
                placeholder="Program Name"
                value={programName}
                onChangeText={setProgramName}
                icon={"folder-outline"}
                error={error}
              />
              <CustomBtn
                onPress={() =>
                  handleCreateProgram(userId as string, programName)
                }
                buttonStyle={{
                  borderRadius: 6,
                  width: "100%",
                  backgroundColor: "#48A6A7",
                }}
              >
                <Ionicons name="add" size={18} color="white" />

                <BtnTitle
                  title="Create Program"
                  textStyle={{ fontSize: 14, color: "white" }}
                />
              </CustomBtn>
            </CustomModal>

            {/* update program modal */}
            <CustomModal
              isModalVisible={isModalUpdateProgramVisible}
              setIsModalVisible={setIsModalUpdateProgramVisible}
              modalTitle="Update Program"
              modalActionButtonText="UpdateProgram"
              modalActionButtonColor="#48A6A7"
              allowInput
            >
              <Input
                placeholder="Update Program Name"
                value={newProgramName}
                onChangeText={setNewProgramName}
                icon={"folder-outline"}
                error={error}
              />
              <CustomBtn
                onPress={() =>
                  handleUpdateProgramName(
                    userId as string,
                    selectedProgramDetails?.id as string,
                    newProgramName
                  )
                }
                buttonStyle={{
                  borderRadius: 6,
                  width: "100%",
                  backgroundColor: "#48A6A7",
                }}
              >
                <Ionicons name="pencil" size={18} color="white" />

                <BtnTitle
                  title="Update Program Name"
                  textStyle={{ fontSize: 14, color: "white" }}
                />
              </CustomBtn>
            </CustomModal>

            {/* program deletion modal */}
            <CustomModal
              isModalVisible={isModalProgramVisible}
              setIsModalVisible={setIsModalProgramVisible}
              modalTitle="Delete Program"
              modalDescription="Are you sure you want to delete this program?"
              modalActionButtonText="Confirm Deletion"
              modalActionButton={() => {
                handleDeleteProgram(
                  userId as string,
                  selectedProgramDetails?.id as string
                );
              }}
            />

            {/* program and routines modal */}
            <CustomModal
              isModalVisible={isModalProgramRoutineVisible}
              setIsModalVisible={setIsModalProgramRoutineVisible}
              modalTitle="Delete Program and Routines"
              modalDescription="Are you sure you want to delete this program and routines"
              modalActionButtonText="Confirm Deletion"
              modalActionButton={() => {
                handleDeleteProgramRoutine(
                  userId as string,
                  selectedProgramDetails?.id as string,
                  selectedProgramDetails?.routine_ids as string[]
                );
              }}
            />

            {/* reset workout modal */}
            <CustomModal
              isModalVisible={isModalResetWorkoutVisible}
              setIsModalVisible={setIsModalResetWorkoutVisible}
              modalTitle="Reset Workout"
              modalDescription="You have a pending workout, are you sure you want to reset your workout?"
              modalActionButtonText="Confirm Reset"
              modalActionButton={handleResetWorkout}
            />
          </>
        ) : (
          <>
            {/* routine menu */}
            <BottomSheetOverlay ref={routineRef}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {selectedRoutineDetails?.routine_name}
              </Text>
              <CustomBtn
                onPress={handleEditRoutine}
                buttonStyle={{
                  borderRadius: 6,
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <Ionicons name="pencil" size={18} color="black" />

                <BtnTitle
                  title="Edit Routine"
                  textStyle={{ fontSize: 14, color: "black" }}
                />
              </CustomBtn>
              <CustomBtn
                onPress={() => {
                  setIsModalRoutineVisible((prev) => !prev);
                  routineRef.current?.close();
                }}
                buttonStyle={{
                  borderRadius: 6,
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <Ionicons name="trash" size={18} color="#991B1B" />

                <BtnTitle
                  title="Delete Routine"
                  textStyle={{ fontSize: 14, color: "#991B1B" }}
                />
              </CustomBtn>
            </BottomSheetOverlay>

            {/* program menu */}
            <BottomSheetOverlay ref={programRef}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {selectedProgramDetails?.program_name}
              </Text>
              <CustomBtn
                onPress={() => {
                  setIsModalUpdateProgramVisible((prev) => !prev);
                  setNewProgramName(
                    selectedProgramDetails?.program_name as string
                  );
                  programRef.current?.close();
                }}
                buttonStyle={{
                  borderRadius: 6,
                  width: "100%",
                  backgroundColor: "white",
                }}
              >
                <Ionicons name="pencil" size={18} color="black" />

                <BtnTitle
                  title="Edit Program"
                  textStyle={{ fontSize: 14, color: "black" }}
                />
              </CustomBtn>
              {selectedProgramDetails?.routines.length === 0 ? (
                <CustomBtn
                  onPress={() => {
                    setIsModalProgramVisible((prev) => !prev);
                    routineRef.current?.close();
                  }}
                  buttonStyle={{
                    borderRadius: 6,
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  <Ionicons name="trash" size={18} color="#991B1B" />

                  <BtnTitle
                    title="Delete Program"
                    textStyle={{ fontSize: 14, color: "#991B1B" }}
                  />
                </CustomBtn>
              ) : (
                <CustomBtn
                  onPress={() => {
                    setIsModalProgramRoutineVisible((prev) => !prev);
                    routineRef.current?.close();
                  }}
                  buttonStyle={{
                    borderRadius: 6,
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  <Ionicons name="trash" size={18} color="#991B1B" />

                  <BtnTitle
                    title="Delete Program and Routines"
                    textStyle={{ fontSize: 14, color: "#991B1B" }}
                  />
                </CustomBtn>
              )}
            </BottomSheetOverlay>

            {/* new routine */}
            <BottomSheetOverlay ref={createNewRoutineRef}>
              {programs.map((program, index) => (
                <CustomBtn
                  key={index}
                  onPress={() => handleAddRoutineInProgram(program.id)}
                  buttonStyle={{
                    borderRadius: 6,
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  <BtnTitle
                    title={program.program_name as string}
                    textStyle={{ fontSize: 14, color: "black" }}
                  />
                </CustomBtn>
              ))}
            </BottomSheetOverlay>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default WorkoutPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  routine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  routineTxt: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  routineIcon: {
    flexDirection: "row",
    gap: 10,
    alignContent: "center",
  },
  newRoutineSearch: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  cardList: {
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
});

interface BottomSheetProps {
  children: React.ReactNode;
}

const BottomSheetOverlay = forwardRef<BottomSheet, BottomSheetProps>(
  ({ children }, ref) => {
    const snapPoints = useMemo(() => [screenHeight * 0.65, "50%"], []);

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

const overlayStyles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
});
