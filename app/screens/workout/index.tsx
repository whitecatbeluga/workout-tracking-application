import {
  View,
  Text,
  StyleSheet,
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
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import SearchInput from "@/components/search-input";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { getWorkout } from "@/redux/slices/workout-slice";
import { useAppSelector } from "@/hooks/use-app-selector";
import { Ionicons } from "@expo/vector-icons";
import WorkoutCard, { CardWorkoutInfo } from "@/components/workout-card";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { getExercise } from "@/redux/slices/exercise-slice";
import { WorkoutExercise } from "@/custom-types/workout-type";
import ExerciseCard from "@/components/exercise-card";
import Input from "@/components/input-text";

const { height: screenHeight } = Dimensions.get("window");

const ActionButtons = () => {
  const buttonDetails = [
    { label: "Edit Workout", icon: "create", color: "green", onpress: "" },
    {
      label: "Delete Workout",
      icon: "close-circle",
      color: "red",
      onpress: "",
    },
  ];
  return (
    <View
      style={{
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
            backgroundColor: "white",
            paddingVertical: 14,
          }}
        >
          <Ionicons
            name={item.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={item.color}
          />

          <Text style={{ color: item.color }}>{item.label}</Text>
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
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );
  const [selectedWorkoutDetails, setSelectedWorkoutDetails] = useState<
    any | null
  >(null);

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

  const handlePress = () => {
    console.log("btn press");
  };

  const handleSearchChange = () => {
    console.log("search input change");
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
        <ScrollView
          scrollEventThrottle={16}
          onScroll={onScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
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

          <View style={styles.cardList}>
            {workout?.map((item) => (
              <WorkoutCard
                handleOpenWorkoutMenu={openWorkoutMenu}
                key={item.id}
                card={item}
                isEditable={false}
              />
            ))}
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
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    padding: 20,
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
    marginTop: 16,
  },
});
interface BottomSheetProps {
  workoutDetails: any | null;
}

const BottomSheetOverlay = forwardRef<BottomSheet, BottomSheetProps>(
  ({ workoutDetails }, ref) => {
    const snapPoints = useMemo(() => [screenHeight * 0.65, "90%"], []);

    const handleSheetChanges = useCallback((index: number) => {
      // console.log("BottomSheet index:", index);
    }, []);

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
          style={{
            backgroundColor: "#F4F4F4",
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          <ActionButtons />

          <View>
            {workoutDetails ? (
              <View style={{ gap: 10 }}>
                <View style={{ gap: 5 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 22 }}>
                    {workoutDetails.name}
                  </Text>
                  <Text style={{ fontWeight: "medium", fontSize: 14 }}>
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
  workoutTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  workoutDuration: {
    fontSize: 16,
    marginBottom: 4,
  },
  workoutIntensity: {
    fontSize: 16,
    marginBottom: 4,
  },
  workoutExercises: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  exerciseEquipment: {
    fontSize: 14,
    color: "#333",
  },
});
