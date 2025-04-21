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
  const workout = useAppSelector((state) => state.workout.workout);
  const loading = useAppSelector((state) => state.workout.loading);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );
  const [selectedWorkoutDetails, setSelectedWorkoutDetails] = useState<
    any | null
  >(null);
  const [refreshing, setRefreshing] = useState(false);

  const workoutRef = useRef<BottomSheet>(null);

  useEffect(() => {
    dispatch(getWorkout());
  }, []);

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
    if (result.type === "workout/getWorkout/fulfilled") {
      setRefreshing(false);
    }
  };

  const openWorkoutMenu = (id: number) => {
    setSelectedWorkoutId(id);
    const selectedWorkout = workout?.find((item) => item.id === id);
    if (selectedWorkout) {
      setSelectedWorkoutDetails(selectedWorkout);
      workoutRef.current?.expand();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <View style={{ gap: 20, flexDirection: "column", width: "100%" }}>
            <WorkoutHeader />

            <View style={styles.routine}>
              <Text style={styles.routineTxt}>Routines</Text>
              <View style={styles.routineIcon}>
                <Ionicons name="add" size={28} color="#48A6A7" />
                <Ionicons name="folder-open" size={28} color="#48A6A7" />
              </View>
            </View>
          </View>

          <View style={styles.newRoutineSearch}>
            <Input
              value={""}
              icon="search-circle"
              placeholder="Explore"
              onChangeText={(value) => {}}
            />
          </View>
        </View>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={onScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <View style={styles.cardList}>
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
          </View>
        </ScrollView>

        <BottomSheetOverlay
          ref={workoutRef}
          workoutDetails={selectedWorkoutDetails}
        />
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
    marginTop: 10,
    width: "100%",
  },
  cardList: {
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
});

interface BottomSheetProps {
  workoutDetails: any | null;
}

const BottomSheetOverlay = forwardRef<BottomSheet, BottomSheetProps>(
  ({ workoutDetails }, ref) => {
    const snapPoints = useMemo(() => [screenHeight * 0.65, "90%"], []);

    const handleSheetChanges = useCallback((index: number) => {}, []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
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
        <BottomSheetView
          style={{ backgroundColor: "#F4F4F4", paddingHorizontal: 20, gap: 20 }}
        >
          <ActionButtons />
          <View>
            {workoutDetails ? (
              <View style={{ gap: 10 }}>
                <View style={{ gap: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                    {workoutDetails.name}
                  </Text>
                  <Text style={{ fontWeight: "500", fontSize: 14 }}>
                    {workoutDetails.description}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    Duration: {workoutDetails.duration}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    Intensity: {workoutDetails.intensity}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    Volume: {workoutDetails.intensity}
                  </Text>
                  <Text style={{ fontSize: 14 }}>
                    Set: {workoutDetails.intensity}
                  </Text>
                </View>

                <Text style={overlayStyles.sectionTitle}>Exercise Details</Text>
              </View>
            ) : (
              <Text>Loading workout details...</Text>
            )}
          </View>
        </BottomSheetView>

        <BottomSheetScrollView
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            backgroundColor: "#F4F4F4",
            gap: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {workoutDetails?.exercises?.map((item: WorkoutExercise) => (
            <ExerciseCard key={item.id} card={item} />
          ))}
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
