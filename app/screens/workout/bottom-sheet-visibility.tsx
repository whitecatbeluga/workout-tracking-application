import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface Props {
  title: string;
  visibility: "private" | "everyone";
  onSelect: (selectedVisibility: "private" | "everyone") => void;
  option: "photo" | "visibility";
  onImageSelect?: (imageUri: string) => void;
}

type RefType = BottomSheet | null;

const BottomSheetVisiblity = forwardRef<RefType, Props>((props, ref) => {
  const bottomSheetRef = ref as React.MutableRefObject<BottomSheet | null>;
  // snap points
  const snapPoints = useMemo(() => ["50%"], []);
  const [image, setImage] = useState<string | null>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSelect = (selected: "private" | "everyone") => {
    props.onSelect(selected);
    bottomSheetRef?.current?.close();
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
      props.onImageSelect?.(uri);
      bottomSheetRef.current?.close();
    }
  };

  const handleLibraryPhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImage(uri);
      props.onImageSelect?.(uri);
      bottomSheetRef.current?.close();
    }
  };

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
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          flex: 1,
          backgroundColor: "#F4F4F4",
        }}
      >
        {props.option === "visibility" ? (
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
              Visibility
            </Text>
            <View
              style={{
                flexDirection: "column",
                gap: 30,
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                padding: 14,
                marginTop: 30,
                overflow: "hidden",
                paddingHorizontal: 25,
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => handleSelect("everyone")}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View>
                    <Text
                      style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}
                    >
                      Everyone
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 14,
                        color: "#6A6A6A",
                      }}
                    >
                      This workout is public available to all users on Hevy.
                    </Text>
                  </View>
                  {props.visibility === "everyone" && (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="#48A6A7"
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => handleSelect("private")}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View>
                    <Text
                      style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}
                    >
                      Private
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 14,
                        color: "#6A6A6A",
                      }}
                    >
                      Keep this workout private and visible only to you for
                      personal use.
                    </Text>
                  </View>
                  {props.visibility === "private" && (
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color="#48A6A7"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "column",
              gap: 20,
              backgroundColor: "#FFFFFF",
              borderRadius: 8,
              padding: 14,
              marginTop: 30,
              overflow: "hidden",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons name="camera-outline" size={24} />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
                Take Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLibraryPhoto}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Ionicons name="image-outline" size={24} />
              <Text style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}>
                Select Library Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetVisiblity;
