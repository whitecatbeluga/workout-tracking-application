import { Text, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo, useRef } from "react";
import { Card as WorkoutCard } from "./workouts";
import Badge from "@/components/badge";

type CardProps = {
  card: any;
  handleWorkoutSheet: () => void;
  handleExerciseSheet: () => void;
};

const Card = ({ card, handleWorkoutSheet, handleExerciseSheet }: CardProps) => {
  return (
    <View
      style={{
        marginTop: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 14,
        gap: 16,
        elevation: 1,
      }}
    >
      <View style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter_700Bold",
              fontSize: 14,
            }}
          >
            {card.name}
          </Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#323232" />
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12 }}>
          {card.desc}
        </Text>
      </View>
      <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
        <TouchableOpacity
          style={{
            width: "48.5%",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 24,
            backgroundColor: "#F2EFE7",
            borderRadius: 6,
          }}
          onPress={handleWorkoutSheet}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 16,
              color: "#626262",
            }}
          >
            See Workouts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "48.5%",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 24,
            backgroundColor: "#9ACBD0",
            borderRadius: 6,
          }}
          onPress={handleExerciseSheet}
        >
          <Text
            style={{
              fontFamily: "Inter_700Bold",
              fontSize: 16,
              color: "white",
            }}
          >
            See Exercises
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ExerciseCard = ({ card }: { card: any }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 14,
        elevation: 1,
      }}
    >
      <View style={{ gap: 8 }}>
        <View style={{ gap: 4 }}>
          <Text
            style={{
              color: "#323232",
              fontFamily: "Inter_700Bold",
              fontSize: 24,
            }}
          >
            {card.name}
          </Text>
          <Badge
            backgroundColor="#48A6A7"
            label={
              card.with_out_equipment ? "Without Equipment" : "With Equipment"
            }
          />
        </View>
        <View style={{ flexDirection: "row", gap: 4 }}>
          <Text
            style={{
              color: "#323232",
              fontFamily: "Inter_700Bold",
              fontSize: 14,
            }}
          >
            Exercise Category:
          </Text>
          <Text style={{ fontSize: 14 }}>{card.category}</Text>
        </View>
        <Text style={{ fontFamily: "Inter_500Medium", fontSize: 14 }}>
          {card.desc}
        </Text>
      </View>
      <View style={{ flexDirection: "column", gap: 8 }}></View>
    </View>
  );
};

interface Props {
  title: string;
}

type RefType = BottomSheet | null;

// workout bottom sheet
const SeeWorkoutBottomSheet = forwardRef<RefType, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "100%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1} // default hidden
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
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 20,
          backgroundColor: "#F4F4F4",
        }}
        overScrollMode="never"
      >
        {workoutCardDetails.map((card, index) => (
          <WorkoutCard key={index} card={card} isEditable={false} />
        ))}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

// exercises bottom sheet
const SeeExercisesBottomSheet = forwardRef<RefType, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "85%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={ref}
      index={-1} // default hidden
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
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 20,
          backgroundColor: "#F4F4F4",
        }}
        overScrollMode="never"
      >
        {dummyExercises.map((card, index) => (
          <ExerciseCard key={index} card={card} />
        ))}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const RoutinesScreen = () => {
  const workoutRef = useRef<BottomSheet>(null);
  const exerciseRef = useRef<BottomSheet>(null);

  const handleWorkoutSheet = () => {
    workoutRef.current?.expand();
  };

  const handleExerciseSheet = () => {
    exerciseRef.current?.expand();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Text
          style={{
            fontFamily: "Inter_700Bold",
            fontSize: 24,
            color: "#323232",
          }}
        >
          Your Routines
        </Text>
        {dummyRoutines.map((card, index) => (
          <Card
            key={index}
            card={card}
            handleWorkoutSheet={handleWorkoutSheet}
            handleExerciseSheet={handleExerciseSheet}
          />
        ))}
      </ScrollView>
      <SeeWorkoutBottomSheet title="Sample" ref={workoutRef} />
      <SeeExercisesBottomSheet title="Sample" ref={exerciseRef} />
    </View>
  );
};

export default RoutinesScreen;

const dummyExercises = [
  {
    name: "Calf Press (Machine)",
    desc: "A comprehensive workout targeting all major muscle groups. A comprehensive workout targeting all major muscle groups.",
    category: "Upper Body",
    with_out_equipment: true,
  },
  {
    name: "Floor Press",
    desc: "A comprehensive workout targeting all major muscle groups. A comprehensive workout targeting all major muscle groups.",
    category: "Lower Body",
    with_out_equipment: false,
  },
  {
    name: "Glue Kickback",
    desc: "A comprehensive workout targeting all major muscle groups. A comprehensive workout targeting all major muscle groups.",
    category: "Core",
    with_out_equipment: true,
  },
  {
    name: "Pull Up",
    desc: "A comprehensive workout targeting all major muscle groups. A comprehensive workout targeting all major muscle groups.",
    category: "Upper Body",
    with_out_equipment: false,
  },
];

const workoutCardDetails = [
  {
    name: "Full Body Workout",
    description: "A comprehensive workout targeting all major muscle groups.",
    duration: 60,
    intensity: "High",
    volume: 5,
    sets: 3,
    exercises: [
      "1 Set Air Bike",
      "2 Set Burpees",
      "3 Set Jumping Jacks",
      "4 Set Mountain Climbers",
      "5 Set Plank Jacks",
      "6 Set High Knees",
      "7 Set Squat Jumps",
      "8 Set Push-Ups",
    ],
  },
  {
    name: "Cardio Blast",
    description: "A high-intensity cardio workout to improve endurance.",
    duration: 45,
    intensity: "Medium",
    volume: 3,
    sets: 4,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "Strength Training",
    description: "Focus on building muscle strength with compound movements.",
    duration: 75,
    intensity: "High",
    volume: 4,
    sets: 5,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "Yoga Flow",
    description:
      "A relaxing yoga session to improve flexibility and mindfulness.",
    duration: 30,
    intensity: "Low",
    volume: 6,
    sets: 2,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
  {
    name: "HIIT Challenge",
    description: "A short but intense workout to maximize calorie burn.",
    duration: 20,
    intensity: "Very High",
    volume: 8,
    sets: 3,
    exercises: ["1 Set Air Bike", "2 Set Burpees", "3 Set Jumping Jacks"],
  },
];

const dummyRoutines = [
  {
    name: "Beginner Routine",
    desc: "A routine designed for beginners to ease into fitness and build foundational strength.",
  },
  {
    name: "Strength Routine",
    desc: "A routine focused on building muscle strength and improving overall power.",
  },
  {
    name: "Cardio Routine",
    desc: "A routine tailored for individuals who enjoy cardiovascular exercises to boost endurance.",
  },
  {
    name: "Stretch Routine",
    desc: "A routine aimed at improving flexibility and promoting muscle recovery through stretching.",
  },
];
