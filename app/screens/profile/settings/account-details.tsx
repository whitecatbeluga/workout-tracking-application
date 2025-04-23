import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import ContainerSettings from "./container";
import { router } from "expo-router";
import Input from "@/components/input-text";
import { useAppSelector } from "@/hooks/use-app-selector";
import InputDropdown from "@/components/input-dropdown";

const AccountDetails = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    address: user?.address,
    gender: user?.gender,
    age: user?.age,
    height: user?.height,
    weight: user?.weight,
    bmi: user?.bmi,
    activity_level: user?.activity_level,
    user_type: user?.user_type,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ContainerSettings>
      <View style={{ paddingVertical: 20 }}>
        <Text
          style={{
            fontSize: 28,
            fontFamily: "Inter_700Bold",
            letterSpacing: -0.6,
            color: "#323232",
          }}
        >
          Personal Details
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        <Input
          inputLabel="First Name"
          value={formData.first_name}
          icon="person"
          placeholder="User name"
          onChangeText={(text) => handleInputChange("first_name", text)}
          autoCapitalize="none"
        />

        <Input
          inputLabel="Last Name"
          value={formData.last_name}
          icon="person"
          placeholder="Last name"
          onChangeText={(text) => handleInputChange("last_name", text)}
          autoCapitalize="none"
        />

        <Input
          inputLabel="Address"
          value={formData.address}
          icon="location"
          placeholder="Address"
          onChangeText={(text) => handleInputChange("address", text)}
          autoCapitalize="none"
        />

        <InputDropdown
          inputLabel="Gender"
          onChangeText={(text) => handleInputChange("gender", text)}
          value={formData.gender}
          icon="transgender"
          placeholder="Choose your Gender"
          data={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Others", value: "others" },
          ]}
        />

        <Input
          inputLabel="Age"
          value={formData.age?.toString() ?? ""}
          icon="analytics"
          placeholder="Age"
          onChangeText={(text) => handleInputChange("age", text)}
          keyboardType="numeric"
        />

        <View style={{ paddingVertical: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Inter_700Bold",
              letterSpacing: -0.6,
              color: "#323232",
            }}
          >
            Physical Data
          </Text>
        </View>

        <Input
          inputLabel="Height"
          value={formData.height?.toString() ?? ""}
          icon="man"
          placeholder="Height (cm)"
          onChangeText={(text) => handleInputChange("height", text)}
          keyboardType="numeric"
        />

        <Input
          inputLabel="Weight"
          value={formData.weight?.toString() ?? ""}
          icon="scale"
          placeholder="Weight (kg)"
          onChangeText={(text) => handleInputChange("weight", text)}
          keyboardType="numeric"
        />

        <Input
          inputLabel="Activity Level"
          value={formData.activity_level?.toString() ?? ""}
          icon="heart-circle"
          placeholder="Activity level"
          onChangeText={(text) => handleInputChange("activity_level", text)}
        />

        <Input
          inputLabel="Work Experience"
          value={formData.activity_level?.toString() ?? ""}
          icon="heart-circle"
          placeholder="Activity level"
          onChangeText={(text) => handleInputChange("activity_level", text)}
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

export default AccountDetails;
