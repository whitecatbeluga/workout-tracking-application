import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import ContainerSettings from "./container";
import Input from "@/components/input-text";
import { useAppSelector } from "@/hooks/use-app-selector";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/utils/firebase-config";
import { updateEmail, updateProfile } from "firebase/auth";
import { setUserFromFirebase } from "@/redux/auth-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    confirm_password: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("Permission to access camera roll is required.");
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
      setExerciseImage(uri);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);

    const getUser = auth.currentUser;

    if (!getUser?.uid) {
      console.log("No authenticated user");
      setLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", getUser.uid));

      const { password, ...data } = formData;

      if (userDoc.exists()) {
        const userData = userDoc.data();

        console.log(userData);

        // update from firestore
        await updateDoc(doc(db, "users", getUser.uid), data);

        // update from authentication
        await updateEmail(getUser, data.email);

        console.log("Profile updated successfully.");
      } else {
        console.log("No such user document.");
      }

      // update from redux
      dispatch(
        setUserFromFirebase({
          ...user,
          uid: getUser.uid,
          email: data.email,
          username: data.username,
        })
      );
    } catch (error) {
      console.log("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerSettings>
      {/* user info */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{ borderRadius: 50 }}
          onPress={handlePickImage}
        >
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              borderColor: "#000000",
              borderWidth: 0.5,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {!exerciseImage ? (
              <Image
                source={{ uri: "https://avatar.iran.liara.run/public/41" }}
                style={{ width: 140, height: 140 }}
              />
            ) : (
              <Image
                source={{ uri: exerciseImage }}
                style={{ width: "100%", height: "100%", resizeMode: "cover" }}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 10 }}>
        {/* Username Field */}
        <Input
          inputLabel="Username"
          value={formData.username}
          icon="person"
          placeholder="User name"
          onChangeText={(text) => handleInputChange("username", text)}
          autoCapitalize="none"
        />

        {/* Email Field */}
        <Input
          inputLabel="Email"
          value={formData.email}
          icon="mail"
          placeholder="Email"
          onChangeText={(text) => handleInputChange("email", text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Field */}
        <Input
          inputLabel="Password"
          value={formData.password}
          icon="lock-closed"
          placeholder="Password"
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={!showPassword}
          isSuffix={true}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword((prev) => !prev)}
          autoCapitalize="none"
        />

        {/* Password Field */}
        <Input
          inputLabel="Confirm Password"
          value={formData.password}
          icon="lock-closed"
          placeholder="Confirm Password"
          onChangeText={(text) => handleInputChange("confirm_password", text)}
          secureTextEntry={!showConfirmPassword}
          isSuffix={true}
          showPassword={showConfirmPassword}
          toggleShowPassword={() => setShowConfirmPassword((prev) => !prev)}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#006A71",
          alignItems: "center",
          paddingVertical: 10,
          borderRadius: 8,
          marginTop: 20,
          width: "100%",
        }}
        onPress={handleUpdateProfile}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "Inter_600SemiBold",
              fontSize: 16,
            }}
          >
            Update
          </Text>
        )}
      </TouchableOpacity>
    </ContainerSettings>
  );
};

export default EditProfile;
