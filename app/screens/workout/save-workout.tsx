import { useLayoutEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetVisiblity from "./bottom-sheet-visibility";

const SaveWorkout = () => {
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
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: "#48A6A7",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular", color: "#FFFFFF" }}>
            Save
          </Text>
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

  return (
    <View style={styles.container}>
      <TextInput placeholder="Workout Title" style={styles.workoutTitle} />
      <View style={styles.durationVolumeSetsContainer}>
        <View>
          <Text style={styles.title}>Duration</Text>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: "#48A6A7",
            }}
          >
            32min
          </Text>
        </View>
        <View>
          <Text style={styles.title}>Volume</Text>
          <Text style={styles.volumeSets}>50 kg</Text>
        </View>
        <View>
          <Text style={styles.title}>Sets</Text>
          <Text style={styles.volumeSets}>1</Text>
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
        <TouchableOpacity onPress={() => setIsModalVisible((prev) => !prev)}>
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
