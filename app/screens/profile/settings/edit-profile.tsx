import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ContainerSettings from "./container";
import Input from "@/components/input-text";
import { useAppSelector } from "@/hooks/use-app-selector";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EditProfile = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    username: user?.user_name || "",
    email: user?.email || "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ContainerSettings>
      {/* user info */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20,
        }}
      >
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/41" }}
          style={{ width: 140, height: 140 }}
        />
      </TouchableOpacity>

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
        onPress={() => {}}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
          }}
        >
          Update
        </Text>
      </TouchableOpacity>
    </ContainerSettings>
  );
};

export default EditProfile;
