import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Input from "@/components/input-text";

// dropdown
import InputDropdown from "@/components/input-dropdown";

// stepper
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { Ionicons } from "@expo/vector-icons";

// redux
import { setUserFromFirebase, setUserToken } from "@/redux/auth-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";

// type
import { RegisterFormData } from "@/custom-types/form-data-type";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/utils/firebase-config";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { router } from "expo-router";

import DateTimePicker from "@react-native-community/datetimepicker";
import Badge from "@/components/badge";

const initialFormData: RegisterFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  first_name: "",
  last_name: "",
  birthdate: "",
  address: "",
  gender: "",
  height: 0,
  weight: 0,
  bmi: 0,
  activity_level: "",
  workout_type: [],
};

const lowercaseRegex = /^(?=.*[a-z]).*$/;
const uppercaseRegex = /^(?=.*[A-Z]).*$/;
const digitRegex = /^(?=.*\d).*$/;
const specialCharRegex = /^(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]*$/;

type FieldErrors = {
  birthdate?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
  height?: string[];
  weight?: string[];
};

const Header = ({ desc }: { desc: string }) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 28,
          fontFamily: "Inter_700Bold",
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
  const getBMIInfo = () => {
    if (label == "BMI") {
      if (data < 18.5) return { label: "Underweight", color: "blue" };
      if (data < 25) return { label: "Normal", color: "green" };
      if (data < 30) return { label: "Overweight", color: "orange" };
      if (data < 35) return { label: "Obese I", color: "red" };
      if (data < 40) return { label: "Obese II", color: "darkred" };
    }
    return { label: "Obese III", color: "maroon" };
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Ionicons name={icon} size={16} color="#6F7A88" />
        <Text style={{ fontSize: 16, color: "#6b7280" }}>{label}</Text>
      </View>
      <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
        {label == "Workout Experience" ? (
          <View style={{ gap: 5 }}>
            {data.map((item: string, index: number) => (
              <Text
                key={index}
                style={{
                  fontSize: 16,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {index + 1}. {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            ))}
          </View>
        ) : label == "Birthdate" ? (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {new Date(data).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {data}
          </Text>
        )}
        {label == "BMI" && (
          <Badge
            label={getBMIInfo().label}
            backgroundColor={getBMIInfo().color}
          />
        )}
      </View>
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const { password, confirmPassword, email } = formData;
    const newErrors: FieldErrors = {};

    const validateForm = async () => {
      // Password validations
      if (password) {
        const passwordErrors: string[] = [];

        if (password.length < 8) {
          passwordErrors.push("Password must be at least 8 characters.");
        }

        if (passwordErrors.length > 0) {
          newErrors.password = passwordErrors;
        }
      }

      // Confirm password match
      if (password && confirmPassword && password !== confirmPassword) {
        newErrors.confirmPassword = ["Passwords do not match."];
      }

      // Email validations
      if (email) {
        const emailErrors: string[] = [];

        // Email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          emailErrors.push("Invalid email format.");
        } else {
          const q = query(
            collection(db, "users"),
            where("email", "==", formData.email)
          );
          const querySnapshot = await getDocs(q);
          const emailExists = !querySnapshot.empty; // true if at least one found

          if (emailExists) {
            emailErrors.push("Email already exists.");
          }
        }

        if (emailErrors.length > 0) {
          newErrors.email = emailErrors;
        }
      }

      setErrors(newErrors);
    };

    validateForm();
  }, [formData.password, formData.confirmPassword, formData.email]);

  return (
    <View>
      <Header desc="Let's get you set up" />
      <Input
        value={formData.username}
        icon="person"
        placeholder="Username"
        onChangeText={onChangeText("username")}
        autoCapitalize="none"
      />
      <Input
        value={formData.email}
        icon="mail"
        placeholder="Email"
        onChangeText={onChangeText("email")}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
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
        autoCapitalize="none"
        error={errors.password}
      />
      <Input
        value={formData.confirmPassword}
        icon="lock-closed"
        placeholder="Confirm Password"
        onChangeText={onChangeText("confirmPassword")}
        secureTextEntry={!showConfirmPassword}
        isSuffix={true}
        showPassword={showConfirmPassword}
        toggleShowPassword={toggleShowConfirmPassword}
        autoCapitalize="none"
        error={errors.confirmPassword}
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
  const [openDatePickerModal, setOpenDatePickerModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    formData.birthdate ? new Date(formData.birthdate) : new Date()
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const { birthdate } = formData;
    const newErrors: FieldErrors = {};

    if (birthdate) {
      const birthDate = new Date(selectedDate);

      if (!isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 9) {
          newErrors.birthdate = ["Must be at least 9 years old."];
        }
      } else {
        newErrors.birthdate = ["Invalid date."];
      }
    }

    setErrors(newErrors);
  }, [formData.birthdate]);

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
      <TouchableOpacity onPress={() => setOpenDatePickerModal(true)}>
        <Input
          editable={false}
          value={
            formData.birthdate
              ? new Date(formData.birthdate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""
          }
          icon="calendar"
          placeholder="Birthdate"
          onChangeText={(text) => onChangeText("birthdate")(text)}
          keyboardType="numeric"
          error={errors.birthdate}
        />
      </TouchableOpacity>
      {openDatePickerModal && (
        <View style={{ backgroundColor: "red", borderRadius: 10 }}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setOpenDatePickerModal(false);
              if (event.type === "set" && date) {
                setSelectedDate(date);
                onChangeText("birthdate")(date.toISOString().split("T")[0]);
              }
            }}
            maximumDate={new Date()}
          />
        </View>
      )}
    </View>
  );
};

// step 3
const Step3 = ({
  formData,
  onChangeText,
}: {
  formData: RegisterFormData;
  onChangeText: (
    name: keyof RegisterFormData
  ) => (text: string | string[]) => void;
}) => {
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const { height, weight } = formData;
    if (height && weight) {
      const bmiValue = (weight * 10000) / (height * height);
      onChangeText("bmi")(bmiValue.toFixed(2));
    }
  }, [formData.height, formData.weight]);

  useEffect(() => {
    const { height, weight } = formData;
    const newErrors: FieldErrors = {};

    if (height) {
      const heightErrors: string[] = [];

      if (height < 100) {
        heightErrors.push("Height must be at least 100cm.");
      }
      if (height > 250) {
        heightErrors.push("Height must be at most 250cm.");
      }

      if (heightErrors.length > 0) {
        newErrors.height = heightErrors;
      }
    }

    if (weight) {
      const weightErrors: string[] = [];

      if (weight < 30) {
        weightErrors.push("Weight must be at least 30kg.");
      }
      if (weight > 120) {
        weightErrors.push("Weight must be at most 120kg.");
      }

      if (weightErrors.length > 0) {
        newErrors.weight = weightErrors;
      }
    }

    setErrors(newErrors);
  }, [formData.height, formData.weight]);

  return (
    <View>
      <Header desc="What's your physical details?" />

      <Input
        value={formData.height}
        icon="man"
        placeholder="Height (cm)"
        onChangeText={onChangeText("height")}
        keyboardType="numeric"
        error={errors.height}
      />

      <Input
        value={formData.weight}
        icon="scale"
        placeholder="Weight (kg)"
        onChangeText={onChangeText("weight")}
        keyboardType="numeric"
        error={errors.weight}
      />

      <InputDropdown
        onChangeText={onChangeText("activity_level")}
        value={formData.activity_level}
        icon="heart-circle"
        placeholder="Activity Level"
        hasDescription
        data={[
          {
            label: "Fervid",
            value: "fervid",
            description: "Always moving, training intensely every day",
          },
          {
            label: "Active",
            value: "active",
            description: "Work out regularly and stay on your feet often",
          },
          {
            label: "Light",
            value: "light",
            description: "Occasional exercise with a mostly relaxed lifestyle",
          },
          {
            label: "Moderate",
            value: "moderate",
            description: "Exercise a few times a week and stay fairly active",
          },
          {
            label: "Sedentary",
            value: "sedentary",
            description: "Little to no regular physical activity",
          },
        ]}
      />

      <InputDropdown
        isMultiSelect
        multiSelectValue={formData.workout_type}
        setSelected={(val) => {
          onChangeText("workout_type")(val);
        }}
        onChangeText={onChangeText("workout_type")}
        icon="barbell"
        placeholder="Workout Type"
        hasDescription
        data={[
          {
            label: "Cardio",
            value: "cardio",
            description:
              "Boost your heart rate with endurance-focused training",
          },
          {
            label: "Flexibility",
            value: "flexibility",
            description:
              "Improve mobility with stretching and balance exercises",
          },
          {
            label: "Functional",
            value: "functional",
            description: "Train movements that mimic everyday activities",
          },
          {
            label: "HIIT",
            value: "hiit",
            description:
              "High-intensity bursts with short rest periods for fat-burning",
          },
          {
            label: "Mixed",
            value: "mixed",
            description:
              "A balanced blend of strength, cardio, and mobility work",
          },
          {
            label: "Rest",
            value: "rest",
            description: "Time to recover and let your body rebuild stronger",
          },
          {
            label: "Sports",
            value: "sports",
            description:
              "Activity focused on specific sports or athletic skills",
          },
          {
            label: "Strength",
            value: "strength",
            description: "Build muscle and power through resistance training",
          },
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
        desc={`Almost done, ${formData.username}! Review your information below`}
      />
      <View style={{ backgroundColor: "white", borderRadius: 16 }}>
        <ReviewInfo icon="person" label="Username" data={formData.username} />
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
          label="Birthdate"
          data={formData.birthdate.toString()}
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
          data={formData.workout_type}
        />
      </View>
    </View>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const q = query(
        collection(db, "users"),
        where("email", "==", formData.email)
      );
      const querySnapshot = await getDocs(q);
      setEmailExists(!querySnapshot.empty);
    };

    validate();
  }, [formData.email]);

  const onChangeText =
    (name: keyof RegisterFormData) => (value: string | string[]) => {
      const numericFields = ["bmi"];
      let newValue: any;

      // Check if it's a multi-select (array)
      if (Array.isArray(value)) {
        newValue = value;
      } else {
        // If it's a single value, handle as usual
        newValue = numericFields.includes(name) ? Number(value) : value;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return (
          formData.username.trim() != "" &&
          formData.email.trim() !== "" &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
          !emailExists &&
          formData.password.trim().length >= 8 &&
          formData.confirmPassword.trim().length >= 8 &&
          formData.password === formData.confirmPassword
        );
      case 1:
        return (
          formData.first_name.trim() != "" &&
          formData.last_name.trim() != "" &&
          formData.address.trim() != "" &&
          formData.gender.trim() != "" &&
          formData.birthdate.trim() != ""
        );
      case 2:
        return (
          formData.height > 0 &&
          formData.height < 250 &&
          formData.weight > 0 &&
          formData.weight < 120 &&
          formData.activity_level.trim() != "" &&
          formData.workout_type.length > 0
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const onNextStep = () => {
    const valid = isStepValid(currentStep);
    if (valid) setCurrentStep(currentStep + 1);
    setErrors(!valid);
  };

  const handleRegister = async () => {
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const token = user.getIdToken();

      try {
        const { confirmPassword, password, ...dataToStore } = formData;

        await setDoc(doc(db, "users", user.uid), {
          ...dataToStore,
          email: user.email,
          createdAt: serverTimestamp(),
        });

        await dispatch(setUserFromFirebase(dataToStore));
        await dispatch(setUserToken(await token));

        setLoading(false);
        router.replace("/screens/landingPage/login-page");
      } catch (error) {
        console.log("Error setting user document:", error);
      }

      return user.uid;
    } catch (error) {
      console.log("Error registering user:", error);
      return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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
          buttonNextDisabled={!isStepValid(0)}
          onNext={onNextStep}
        >
          <Step1 formData={formData} onChangeText={onChangeText} />
        </ProgressStep>
        <ProgressStep
          label="Personal Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
          buttonNextDisabled={!isStepValid(1)}
          onNext={onNextStep}
        >
          <Step2 formData={formData} onChangeText={onChangeText} />
        </ProgressStep>
        <ProgressStep
          label="Health Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
          buttonNextDisabled={!isStepValid(2)}
          onNext={onNextStep}
        >
          <Step3 formData={formData} onChangeText={onChangeText} />
        </ProgressStep>
        <ProgressStep
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          label="Review Information"
          buttonFillColor="#006A71"
          buttonPreviousTextColor="#006A71"
          buttonBorderColor="#006A71"
          onSubmit={handleRegister}
          buttonFinishDisabled={loading}
          buttonFinishText="Register"
        >
          <Step4 formData={formData} />
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

export default RegisterPage;
