import { useLayoutEffect, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetVisiblity from "./bottom-sheet-visibility";
import { formatTime } from "@/utils/format-time";
import { WorkoutSets } from "@/custom-types/exercise-type";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage, auth } from "@/utils/firebase-config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ActivityIndicator } from "react-native";
import { useAppSelector } from "@/hooks/use-app-selector";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { clearSelectedExercises } from "@/redux/slices/exercise-slice";
import {
  clearTotalVolumeSets,
  clearWorkoutSets,
  undraftWorkout,
} from "@/redux/slices/workout-slice";

const SaveWorkout = () => {
  const {
    workoutSets: workoutSetsParam,
    totalVolume,
    totalSets,
    totalDuration,
  } = useLocalSearchParams();
  const totalVolumeSets = useAppSelector(
    (state) => state.workout.totalVolumeSets
  );

  const parsedWorkoutSets: WorkoutSets = JSON.parse(workoutSetsParam as string);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<"private" | "everyone">(
    "everyone"
  );
  const [option, setOption] = useState<"photo" | "visibility">("photo");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [workoutTitle, setWorkoutTitle] = useState<string>("");
  const [workoutDescription, setWorkoutDescription] = useState<string>("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [triggerMissing, setTriggerMissing] = useState<boolean>(false);
  const [triggerMessage, setTriggerMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [timeSnapshot, setTimeSnapshot] = useState<number>(0);

  const duration = useAppSelector((state) => state.timer.duration);
  const dispatch = useAppDispatch();

  const handleVisibilityChange = (
    selectedVisibility: "private" | "everyone"
  ) => {
    setVisibility(selectedVisibility);
  };

  const handleOptionSelect = (selectedOption: "photo" | "visibility") => {
    setOption(selectedOption);
    bottomSheetRef.current?.expand();
  };

  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    setTimeSnapshot(duration);
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: "#48A6A7",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleExercises}
        >
          {!loading ? (
            <Text style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}>
              Save
            </Text>
          ) : (
            <ActivityIndicator size="small" color="#FFFFFF" />
          )}
        </TouchableOpacity>
      ),
    });
  });

  const handleAddImage = (uri: string) => {
    setSelectedImages((prevImages) => {
      if (prevImages.length < 3) {
        return [...prevImages, uri];
      } else {
        setErrorMessage("Maximum of 3 images only.");
      }
      return prevImages;
    });
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleRemoveImage = () => {
    if (selectedImageIndex !== null) {
      const updatedImages = selectedImages.filter(
        (_, index) => index !== selectedImageIndex
      );
      setSelectedImages(updatedImages);
      setSelectedImageIndex(null);
    }
  };

  const handleCancelRemove = () => {
    setSelectedImageIndex(null);
  };

  const deleteSubCollection = async (parentRef: any, subCollection: string) => {
    const subRef = collection(parentRef, subCollection);
    const snapshot = await getDocs(subRef);

    for (const docItem of snapshot.docs) {
      const setsRef = collection(docItem.ref, "sets");
      const setsSnapshot = await getDocs(setsRef);
      for (const set of setsSnapshot.docs) {
        await deleteDoc(set.ref);
      }
      await deleteDoc(docItem.ref);
    }
  };

  const uploadSelectedImages = async (
    selectedImages: string[],
    workoutId: string
  ) => {
    try {
      const downloadURLs: string[] = [];

      for (const uri of selectedImages) {
        const response = await fetch(uri);
        const blob = await response.blob();

        const filename = `${Date.now()}.jpg`;
        const imageRef = ref(storage, `workout_images/${filename}`);

        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        downloadURLs.push(downloadURL);
      }

      const workoutRef = doc(db, "workouts", workoutId);
      await updateDoc(workoutRef, { image_urls: downloadURLs });
    } catch (error) {
      console.error("Failed to upload images: ", error);
    }
  };

  const handleSaveToFirebase = async (workoutSets: WorkoutSets) => {
    if (workoutTitle) {
      setLoading(true);
      const userId = auth.currentUser?.uid;

      try {
        const workoutRef = doc(collection(db, "workouts"));
        const workoutSnapshot = await getDoc(workoutRef);

        if (workoutSnapshot.exists()) {
          await deleteSubCollection(workoutRef, "exercises");
          await deleteDoc(workoutRef);
          console.log(`Deleted existing workout with ID: ${workoutRef.id}`);
        }

        await setDoc(workoutRef, {
          workout_duration: "TBD",
          total_volume: totalVolumeSets.totalVolume,
          total_sets: totalVolumeSets.totalSets,
          workout_title: workoutTitle,
          created_at: serverTimestamp(),
          workout_description: workoutDescription,
          visible_to_everyone: visibility === "everyone" ? true : false,
          user_id: userId,
        });

        await uploadSelectedImages(selectedImages, workoutRef.id);

        for (const [exerciseId, exercise] of Object.entries(workoutSets)) {
          const { name, sets } = exercise;
          if (!name) {
            console.error(
              `Error: 'name' is missing in exercise with ID ${exerciseId}`
            );
            continue;
          }

          const exerciseRef = doc(collection(workoutRef, "exercises"));
          await setDoc(exerciseRef, {
            name,
            exerciseId,
          });

          if (sets && Array.isArray(sets)) {
            const checkedSets = sets.filter((set) => set.checked === true);

            for (const set of checkedSets) {
              const { reps, kg, checked, previous } = set;
              if (reps === undefined || kg === undefined) {
                console.error(`Error: reps or kg is undefined. Skipping set.`);
                continue;
              }

              await addDoc(collection(exerciseRef, "sets"), {
                reps,
                kg,
                checked: checked || false,
                previous: previous || "",
              });
            }
          }
        }
        console.log(`Workout saved`);
      } catch (error) {
        console.error("Error saving workout to Firestore: ", error);
      } finally {
        setLoading(false);
      }
    } else {
      setTriggerMissing(true);
      setTriggerMessage("Please input a workout title.");
      return;
    }
  };

  const handleExercises = async () => {
    if (parsedWorkoutSets) {
      handleSaveToFirebase(parsedWorkoutSets);
      dispatch(clearSelectedExercises());
      dispatch(undraftWorkout());
      dispatch(clearTotalVolumeSets());
      router.replace("/screens/workout/workout-confirmation");
    }
  };

  const discardWorkout = () => {
    setIsModalVisible((prev) => !prev);
    dispatch(clearSelectedExercises());
    dispatch(clearWorkoutSets());
    dispatch(undraftWorkout());
    router.replace("/(tabs)/workout");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={workoutTitle}
        onChangeText={(value) => setWorkoutTitle(value)}
        placeholder="Workout Title"
        style={
          !triggerMissing ? styles.workoutTitle : styles.workoutTitleMissing
        }
      />
      {triggerMessage && (
        <Text
          style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "red" }}
        >
          Please input a workout title.
        </Text>
      )}

      <View style={styles.durationVolumeSetsContainer}>
        <View>
          <Text style={styles.title}>Duration</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: "#48A6A7",
              width: "100%",
            }}
          >
            {formatTime(Number(timeSnapshot))}
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Volume</Text>
          {/* <Text style={styles.volumeSets}>50 kg</Text> */}
          <Text style={styles.volumeSets}>
            {totalVolumeSets.totalVolume} kg
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Sets</Text>
          {/* <Text style={styles.volumeSets}>1</Text> */}
          <Text style={styles.volumeSets}>{totalVolumeSets.totalSets}</Text>
        </View>
      </View>
      <View style={{ paddingVertical: 20 }}>
        <Text style={styles.title}>When</Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Inter_400Regular",
            color: "#48A6A7",
          }}
        >
          28, Apr 2025, 9:14 AM
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addPhotoContainer}
        onPress={() => handleOptionSelect("photo")}
        disabled={selectedImages.length === 3}
      >
        <View style={styles.brokenOutline}>
          <Ionicons name="image-outline" size={20} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
        >
          {selectedImages.length === 0 ? (
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
              Add a photo / video
            </Text>
          ) : (
            <View style={{ flexDirection: "row", gap: 10 }}>
              {selectedImages.map((uri, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleImagePress(index)}
                >
                  <Image
                    key={index}
                    source={{ uri }}
                    style={{ width: 80, height: 80, borderRadius: 8 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </TouchableOpacity>
      {selectedImages.length === 3 && (
        <Text
          style={{ fontFamily: "Inter_400Regular", fontSize: 12, color: "red" }}
        >
          {errorMessage}
        </Text>
      )}

      <View>
        <Text style={styles.title}>Description</Text>
        <TextInput
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 16,
            flexWrap: "wrap",
          }}
          placeholder="How did your workout go? Leave some notes here..."
          multiline={true}
          value={workoutDescription}
          onChangeText={(value) => setWorkoutDescription(value)}
        />
      </View>
      <TouchableOpacity
        style={{
          paddingVertical: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => handleOptionSelect("visibility")}
      >
        <Text style={styles.visibilityTitle}>Visibility</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: "#6A6A6A",
            }}
          >
            {visibility === "everyone" ? "Everyone" : "Private"}
          </Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#6A6A6A" />
        </View>
      </TouchableOpacity>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 15,
        }}
      >
        <TouchableOpacity
          style={styles.modalSettingsDiscardButton}
          onPress={discardWorkout}
        >
          <Text
            style={{
              fontFamily: "Inter_400Regular",
              fontSize: 16,
              color: "#ED1010",
            }}
          >
            Discard Workout
          </Text>
        </TouchableOpacity>
      </View>

      {isModalVisible ? (
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Are you sure you want to discard this workout?
            </Text>
            <View style={{ width: "100%", alignItems: "center", gap: 14 }}>
              <TouchableOpacity
                style={styles.modalSettingsDiscardButton}
                onPress={() => router.replace("/(tabs)/workout")}
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
      ) : selectedImageIndex !== null ? (
        <Modal
          isVisible={selectedImageIndex !== null}
          onBackdropPress={handleCancelRemove}
        >
          <View style={styles.modalContainer}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              Do you want to remove this image?
            </Text>
            <View style={{ width: "100%", alignItems: "center", gap: 14 }}>
              <TouchableOpacity
                style={styles.modalSettingsDiscardButton}
                onPress={handleRemoveImage}
              >
                <Text
                  style={{
                    fontFamily: "Inter_500Medium",
                    fontSize: 16,
                    color: "#ED1010",
                  }}
                >
                  Remove Image
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSettingsDiscardButton}
                onPress={handleCancelRemove}
              >
                <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <BottomSheetVisiblity
          title="sample"
          visibility={visibility}
          ref={bottomSheetRef}
          onSelect={handleVisibilityChange}
          option={option}
          onImageSelect={handleAddImage}
        />
      )}
    </View>
  );
};

export default SaveWorkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  workoutTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    borderBottomWidth: 0.5,
  },
  workoutTitleMissing: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "red",
  },
  durationVolumeSetsContainer: {
    flexDirection: "row",
    gap: 70,
    paddingVertical: 20,
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
  addPhotoContainer: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  brokenOutline: {
    borderWidth: 0.5,
    padding: 24,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  visibilityTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
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
});
