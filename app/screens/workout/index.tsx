import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
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
import { AntDesign } from "@expo/vector-icons";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import SearchInput from "@/components/search-input";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { getWorkout } from "@/redux/slices/workout-slice";
import { useAppSelector } from "@/hooks/use-app-selector";
import WorkoutCard from "./workout-card";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { getExercise } from "@/redux/slices/exercise-slice";
import { WorkoutExercise } from "@/custom-types/workout-type";

const { height: screenHeight } = Dimensions.get("window");

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
        >
          <WorkoutHeader />

          <View style={styles.routine}>
            <Text style={styles.routineTxt}>Routines</Text>
            <AntDesign name="addfolder" size={30} color="#48A6A7" />
          </View>

          <View style={styles.newRoutineSearch}>
            <CustomBtn
              onPress={handlePress}
              buttonStyle={{ width: "46%", borderRadius: 10 }}
            >
              <Icon name="profile" iconLibrary="AntDesign" />
              <BtnTitle title="New Routine" textStyle={{ fontSize: 15 }} />
            </CustomBtn>

            <SearchInput
              placeholder="Explore"
              value=""
              onChangeText={handleSearchChange}
              containerStyle={{ width: "46%" }}
            />
          </View>

          <View style={styles.cardList}>
            {workout?.map((item) => (
              <WorkoutCard
                key={item.id}
                id={item.id!}
                name={item.name}
                description={item.description}
                duration={item.duration}
                intensity={item.intensity}
                exercises={item.exercises}
                onMenuPress={openWorkoutMenu}
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
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  routine: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 30,
    alignItems: "center",
  },
  routineTxt: {
    fontWeight: "bold",
    fontSize: 15,
  },
  newRoutineSearch: {
    marginTop: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: "#F4F4F4",
          }}
        >
          {workoutDetails ? (
            <>
              <Text style={overlayStyles.workoutTitle}>
                {workoutDetails.name}
              </Text>
              <Text style={overlayStyles.workoutDescription}>
                {workoutDetails.description}
              </Text>
              <Text style={overlayStyles.workoutDuration}>
                Duration: {workoutDetails.duration}
              </Text>
              <Text style={overlayStyles.workoutIntensity}>
                Intensity: {workoutDetails.intensity}
              </Text>

              <Text style={[overlayStyles.sectionTitle, { marginTop: 20 }]}>
                Exercise Details
              </Text>
            </>
          ) : (
            <Text>Loading workout details...</Text>
          )}
        </View>

        <BottomSheetScrollView
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            backgroundColor: "#F4F4F4",
          }}
          showsVerticalScrollIndicator={false}
        >
          {workoutDetails?.exercises?.map((item: WorkoutExercise) => (
            <View key={item.id} style={overlayStyles.exerciseCard}>
              <Text style={overlayStyles.exerciseName}>
                {item.exercise.name}
              </Text>
              <Text style={overlayStyles.exerciseCategory}>
                Category: {item.exercise.category}
              </Text>
              <Text style={overlayStyles.exerciseDescription}>
                {item.exercise.description}
              </Text>
              <Text style={overlayStyles.exerciseEquipment}>
                Equipment Required:{" "}
                {item.exercise.with_out_equipment ? "No" : "Yes"}
              </Text>
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const overlayStyles = StyleSheet.create({
  workoutTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontWeight: "600",
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
    fontWeight: "600",
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
