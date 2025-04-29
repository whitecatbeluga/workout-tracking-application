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
import { getWorkout } from "@/redux/slices/workout-slice";
import { useAppSelector } from "@/hooks/use-app-selector";
import { Ionicons } from "@expo/vector-icons";
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
} from "@/redux/slices/routine-slice";
import { auth } from "@/utils/firebase-config";
import CustomModal from "@/components/custom-modal";

const { height: screenHeight } = Dimensions.get("window");

const ActionButtons = () => {
  const buttonDetails = [
    { label: "Edit Workout", icon: "create", color: "#006A71", onpress: "" },
    {
      label: "Delete Workout",
      icon: "close-circle",
      color: "#991919",
      onpress: "",
    },
  ];
  const user = useAppSelector((state) => state.auth.user);
  const access_token = useAppSelector((state) => state.auth.access_token);

  return (
    <View
      style={{
        marginTop: 20,
        flexDirection: "row",
        gap: 5,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {buttonDetails.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={{
            width: "48%",
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: item.color,
            paddingVertical: 14,
          }}
        >
          <Ionicons
            name={item.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color="white"
          />
          <Text style={{ color: "white" }}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const WorkoutPage = () => {
  const offset = useRef(0);
  const { setTabVisible } = useTabVisibility();
  const dispatch = useAppDispatch();

  const userId = auth.currentUser?.uid;
  const workout = useAppSelector((state) => state.workout.workout);
  const loading = useAppSelector((state) => state.workout.loading);
  // const routines = useAppSelector((state) => state.routine.routines);

  const programs = useAppSelector((state) => state.routine.programs);

  const [selectedRoutineDetails, setSelectedRoutineDetails] =
    useState<Routine | null>(null);

  const [selectedProgramDetails, setSelectedProgramDetails] =
    useState<Program | null>(null);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);

  const routineRef = useRef<BottomSheet>(null);
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
    const result = await dispatch(getWorkout());
    // if (result.type === "workout/getWorkout/fulfilled") {
    //   setRefreshing(false);
    // }
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

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

  const handleDeleteRoutine = (
    userId: string,
    programId: string,
    routineId: string
  ) => {
    dispatch(deleteRoutine({ userId, programId, routineId }));

    dispatch(fetchPrograms({ userId: userId as string }));
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
            style={{ paddingTop: 20, width: "100%", backgroundColor: "white" }}
          >
            <View style={{ gap: 20, width: "100%" }}>
              <View style={{ gap: 10 }}>
                <WorkoutHeader />
              </View>

              <View style={styles.routine}>
                <Text style={styles.routineTxt}>Routines</Text>
                <View style={styles.routineIcon}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push("/screens/workout/create-routine")
                    }
                  ></TouchableOpacity>
                  <Ionicons name="folder-outline" size={28} color="#323232" />
                </View>
              </View>

              <View style={styles.newRoutineSearch}>
                {/* new routine button */}
                <CustomBtn
                  onPress={() => router.push("/screens/workout/create-routine")}
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
                  onPress={() => {}}
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

          <View style={{ marginTop: 20, width: "100%", gap: 8 }}>
            {programs.map((program, index) => (
              <RoutineFolderCard
                openRoutineMenu={openRoutineMenu}
                program={program}
                key={index}
              />
            ))}
          </View>

          {/* <View style={styles.cardList}>
            {loading == Loading.Pending ? (
              <>
                <Text>Loading...</Text>
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </>
            ) : (
              workout?.map((item) => (
                <WorkoutCard
                  handleOpenWorkoutMenu={openWorkoutMenu}
                  key={item.id}
                  card={item}
                  isEditable={false}
                />
              ))
            )}
          </View> */}
        </ScrollView>

        {isModalVisible ? (
          <CustomModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
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
        ) : (
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
              onPress={() => {}}
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
                setIsModalVisible((prev) => !prev);
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
