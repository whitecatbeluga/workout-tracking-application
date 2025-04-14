import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";

// dropdown
import InputDropdown from "@/components/input-dropdown";

// stepper
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { AntDesign, Ionicons } from "@expo/vector-icons";

// redux
// import { useDispatch, useSelector } from "react-redux";

// type
import { RegisterFormData } from "@/custom-types/form-data-type";

const initialFormData: RegisterFormData = {
  email: "",
  password: "",
  user_name: "",
  first_name: "",
  last_name: "",
  address: "",
  gender: "",
  age: 0,
  height: 0,
  weight: 0,
  bmi: 0,
  activity_level: 0,
  user_type: "",
};

const Input = ({
  value,
  icon,
  suffixIcon,
  placeholder,
  onChangeText,
  keyboardType,
  secureTextEntry,
  isSuffix,
  showPassword,
  toggleShowPassword,
}: {
  value: any;
  icon: any;
  placeholder: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  isSuffix?: boolean;
  suffixIcon?: any;
  passwordToggle?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Ionicons
        style={{ position: "absolute", left: 11, top: 11, zIndex: 1 }}
        name={icon}
        size={24}
        color="#6F7A88"
      />
      <TextInput
        style={{
          backgroundColor: "white",
          borderColor: "#CBD5E1",
          borderWidth: 1,
          paddingHorizontal: 8,
          paddingLeft: 40,
          borderRadius: 10,
          fontSize: 16,
          marginBottom: 16,
        }}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />

      {isSuffix && (
        <Ionicons
          style={{ position: "absolute", right: 11, top: 11, zIndex: 1 }}
          name={
            typeof showPassword === "boolean"
              ? showPassword
                ? "eye-off"
                : "eye"
              : suffixIcon
          }
          size={24}
          color="#6F7A88"
          onPress={toggleShowPassword}
        />
      )}
    </View>
  );
};

const Header = ({ desc }: { desc: string }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          letterSpacing: -0.6,
          color: "#323232",
        }}
      >
        {desc}
      </Text>
    </View>
  );
};

const ReviewInfo = ({
  data,
  label,
  icon,
}: {
  data: any;
  label: string;
  icon: any;
}) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <Ionicons name={icon} size={16} color="#6F7A88" />
        <Text style={{ fontSize: 14, color: "#6b7280" }}>{label}</Text>
      </View>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>{data}</Text>
    </View>
  );
};

// step 1
const Step1 = ({
  formData,
  onChangeText,
}: {
  formData: RegisterFormData;
  onChangeText: (name: keyof RegisterFormData) => (text: string) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <Header desc="What shall we call you?" />
      <Input
        value={formData.user_name}
        icon="person"
        placeholder="Username"
        onChangeText={onChangeText("user_name")}
      />
      <Input
        value={formData.email}
        icon="mail"
        placeholder="Email"
        onChangeText={onChangeText("email")}
        keyboardType={"email"}
      />
      <Input
        value={formData.password}
        icon="lock-closed"
        placeholder="Password"
        onChangeText={onChangeText("password")}
        secureTextEntry={!showPassword}
        isSuffix={true}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
    </View>
  );
};

// step 2
const Step2 = ({
  formData,
  onChangeText,
}: {
  formData: RegisterFormData;
  onChangeText: (name: keyof RegisterFormData) => (text: string) => void;
}) => {
  return (
    <View>
      <Header desc="Tell us more about you" />
      <Input
        value={formData.first_name}
        icon="person"
        placeholder="First name"
        onChangeText={onChangeText("first_name")}
      />
      <Input
        value={formData.last_name}
        icon="person"
        placeholder="Last name"
        onChangeText={onChangeText("last_name")}
      />
      <Input
        value={formData.address}
        icon="location"
        placeholder="Address"
        onChangeText={onChangeText("address")}
      />
      <InputDropdown
        onChangeText={onChangeText("gender")}
        value={formData.gender}
        icon="transgender"
        placeholder="Choose your Gender"
        data={[
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Others", value: "Others" },
        ]}
      />
      <Input
        value={formData.age}
        icon="analytics"
        placeholder="Age"
        onChangeText={onChangeText("age")}
      />
    </View>
  );
};

// step 3
const Step3 = ({
  formData,
  onChangeText,
}: {
  formData: RegisterFormData;
  onChangeText: (name: keyof RegisterFormData) => (text: string) => void;
}) => {
  return (
    <View>
      <Header desc="What's your physical details?" />

      <Input
        value={formData.height}
        icon="man"
        placeholder="Height (cm)"
        onChangeText={onChangeText("height")}
        keyboardType="numeric"
      />
      <Input
        value={formData.weight}
        icon="scale"
        placeholder="Weight (kg)"
        onChangeText={onChangeText("weight")}
        keyboardType="numeric"
      />
      <Input
        value={formData.activity_level}
        icon="heart-circle"
        placeholder="Activity level"
        onChangeText={onChangeText("activity_level")}
      />

      <InputDropdown
        onChangeText={onChangeText("user_type")}
        value={formData.user_type}
        icon="barbell"
        placeholder="Workout Experience"
        data={[
          { label: "Beginner", value: "Beginner" },
          { label: "Intermediate", value: "Intermediate" },
          { label: "Expert", value: "Expert" },
        ]}
      />
    </View>
  );
};

// step 3
const Step4 = ({ formData }: { formData: RegisterFormData }) => {
  return (
    <View>
      <Header
        desc={`Almost done, ${formData.first_name}! Review your information below`}
      />
      <View style={{ backgroundColor: "white", padding: 20, borderRadius: 16 }}>
        <ReviewInfo icon="person" label="Username" data={formData.user_name} />
        <ReviewInfo icon="mail" label="Email" data={formData.email} />
        <ReviewInfo
          icon="person"
          label="First Name"
          data={formData.first_name}
        />
        <ReviewInfo icon="person" label="Last Name" data={formData.last_name} />
        <ReviewInfo icon="location" label="Address" data={formData.address} />
        <ReviewInfo icon="transgender" label="Gender" data={formData.gender} />
        <ReviewInfo
          icon="analytics"
          label="Age"
          data={formData.age.toString()}
        />
        <ReviewInfo icon="man" label="Height" data={`${formData.height} cm`} />
        <ReviewInfo
          icon="scale"
          label="Weight"
          data={`${formData.weight} kg`}
        />
        <ReviewInfo icon="medkit" label="BMI" data={formData.bmi.toString()} />
        <ReviewInfo
          icon="heart-circle"
          label="Activity Level"
          data={formData.activity_level.toString()}
        />
        <ReviewInfo
          icon="barbell"
          label="Workout Experience"
          data={formData.user_type}
        />
      </View>
    </View>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);

  const onChangeText = (name: keyof RegisterFormData) => (text: string) => {
    setFormData({
      ...formData,
      [name]: text,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ProgressSteps
        labelColor="black"
        progressBarColor="#48A6A7"
        completedLabelColor="#006A71"
        completedProgressBarColor="#006A71"
        completedStepIconColor="#006A71"
        disabledStepIconColor="#48A6A7"
        activeLabelColor="#006A71"
        activeStepIconBorderColor="#006A71"
        activeStepNumColor="#006A71"
      >
        <ProgressStep
          label="Account Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
        >
          <Step1 formData={formData} onChangeText={onChangeText} />
        </ProgressStep>
        <ProgressStep
          label="Personal Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
        >
          <Step2 formData={formData} onChangeText={onChangeText} />
        </ProgressStep>
        <ProgressStep
          label="Health Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
        >
          <Step3 formData={formData} onChangeText={onChangeText} />
        </ProgressStep>
        <ProgressStep
          label="Review Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
        >
          <Step4 formData={formData} />
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

export default RegisterPage;
