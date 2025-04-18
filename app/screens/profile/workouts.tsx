import React, {
  useState,
  useRef,
  useMemo,
  forwardRef,
  useCallback,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Input from "@/components/input-text";
import { WorkoutFormData } from "@/custom-types/workout-type";
import Collapsible from "react-native-collapsible";
import WorkoutCard from "./components/workout-card";

interface Props {
  title: string;
}

type RefType = BottomSheet | null;

const EditWorkout = ({
  handleEditWorkout,
}: {
  handleEditWorkout: () => void;
}) => {
  return (
    <TouchableOpacity onPress={handleEditWorkout}>
      <View
        style={{
          backgroundColor: "#006A71",
          padding: 16,
          paddingHorizontal: 24,
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontFamily: "Inter_700Bold" }}>
          Edit Workout
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const EditWorkoutBottomSheet = forwardRef<RefType, Props>((props, ref) => {
  const snapPoints = useMemo(() => ["25%", "50%", "85%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [formData, setFormData] = useState<WorkoutFormData>({
    name: "",
    description: "",
    duration: 0,
    intensity: 0,
    volume: 0,
    set: 0,
    exerciseIds: [],
  });

  const onChangeText = (name: keyof WorkoutFormData) => (text: string) => {
    setFormData({
      ...formData,
      [name]: text,
    });
  };

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
          flex: 1,
          backgroundColor: "#F4F4F4",
        }}
        overScrollMode="never"
      >
        <View style={{ marginVertical: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold" }}>
            Edit this Workout
          </Text>
        </View>
        <Input
          value={formData.name}
          icon="bicycle"
          placeholder="Workout name"
          onChangeText={onChangeText("name")}
        />
        <Input
          value={formData.description}
          icon="document-text"
          placeholder="Workout description"
          onChangeText={onChangeText("description")}
          multiline={true}
          numberOfLines={4}
        />
        <Input
          value={formData.duration}
          icon="alarm"
          placeholder="Workout duration"
          onChangeText={onChangeText("duration")}
          keyboardType="numeric"
        />
        <Input
          value={formData.intensity}
          icon="heart-circle"
          placeholder="Workout intensity"
          onChangeText={onChangeText("intensity")}
          keyboardType="numeric"
        />
        <Input
          value={formData.volume}
          icon="book"
          placeholder="Workout volume"
          onChangeText={onChangeText("volume")}
          keyboardType="numeric"
        />
        <Input
          value={formData.set}
          icon="list"
          placeholder="Workout sets"
          onChangeText={onChangeText("set")}
          keyboardType="numeric"
        />
        <EditWorkout handleEditWorkout={() => {}} />
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const WorkoutsScreen = () => {
  const [text, setText] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {/* search input */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Ionicons
            style={{ position: "absolute", left: 11, top: 13, zIndex: 1 }}
            name="search"
            size={24}
            color="#6F7A88"
          />
          <TextInput
            style={{
              backgroundColor: "white",
              height: 50,
              borderColor: "#CBD5E1",
              borderWidth: 1,
              paddingHorizontal: 8,
              paddingLeft: 40,
              borderRadius: 10,
              fontSize: 16,
              fontFamily: "Inter_400Regular",
            }}
            inputMode="search"
            placeholder="Search exercises..."
            placeholderTextColor="#94A3B8"
            value={text}
            onChangeText={setText}
          />
        </View>

        <View style={{ gap: 20, marginTop: 20 }}>
          {/* workout cards */}
          {workoutCardDetails.map((card, index) => (
            <WorkoutCard
              key={index}
              card={card}
              handleOpenBottomSheet={handleOpenBottomSheet}
              isEditable={true}
            />
          ))}
        </View>
      </ScrollView>
      <EditWorkoutBottomSheet title="Sample" ref={bottomSheetRef} />
    </View>
  );
};

export default WorkoutsScreen;

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
