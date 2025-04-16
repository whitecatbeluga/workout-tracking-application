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
import { Ionicons } from "@expo/vector-icons";
// import WorkoutCard from "./workout-card";
import { Card as WorkoutCard } from "../profile/workouts";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

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
          <View style={{ gap: 10, flexDirection: "column", width: "100%" }}>
            <WorkoutHeader />

            <View style={styles.routine}>
              <Text style={styles.routineTxt}>Routines</Text>
              <Ionicons name="folder-open" size={28} color="#48A6A7" />
            </View>
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
              <WorkoutCard key={item.id} card={item} isEditable={false} />
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
    fontWeight: "bold",
    fontSize: 20,
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
    const snapPoints = useMemo(() => [screenHeight * 0.65, "95%"], []);

    const handleSheetChanges = useCallback((index: number) => {
      console.log("BottomSheet index:", index);
    }, []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        handleStyle={{ backgroundColor: "#F4F4F4", borderRadius: 50 }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior="close"
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
      >
        {workoutDetails ? (
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              backgroundColor: "#F4F4F4",
            }}
          >
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
            <Text style={overlayStyles.workoutExercises}>
              Exercises:{" "}
              {Array.isArray(workoutDetails.exercises)
                ? workoutDetails.exercises.join(", ")
                : "None"}
            </Text>
          </BottomSheetScrollView>
        ) : (
          <View style={{ padding: 20 }}>
            <Text>Loading workout details...</Text>
          </View>
        )}
      </BottomSheet>
    );
  }
);

const overlayStyles = StyleSheet.create({
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 16,
    marginBottom: 8,
  },
  workoutDuration: {
    fontSize: 14,
    marginBottom: 4,
  },
  workoutIntensity: {
    fontSize: 14,
    marginBottom: 4,
  },
  workoutExercises: {
    fontSize: 14,
    marginTop: 10,
    fontStyle: "italic",
  },
});
