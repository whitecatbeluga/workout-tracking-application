import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { LoginFormData } from "@/custom-types/form-data-type";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { login } from "@/redux/auth-slice";

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { loading, error, access_token } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogin = async () => {
    await dispatch(login(formData));
  };

  useEffect(() => {
    if (access_token) {
      router.replace("/(tabs)");
    }
  }, [access_token]);

  const isFieldError = (field: string): string | null => {
    if (typeof error === "object" && error !== null && error[field]) {
      return error[field];
    }
    return null;
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <View style={{ width: "100%", paddingHorizontal: 30 }}>
            {typeof error === "string" && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Ionicons
                style={styles.icon}
                name="person"
                size={24}
                color="#6F7A88"
              />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
              />
              {isFieldError("email") && (
                <Text style={styles.errorText}>{isFieldError("email")}</Text>
              )}
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <Ionicons
                style={styles.icon}
                name="lock-closed"
                size={24}
                color="#6F7A88"
              />
              <TextInput
                style={styles.inputPassword}
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                placeholder="Password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#6F7A88"
                />
              </TouchableOpacity>
              {isFieldError("password") && (
                <Text style={styles.errorText}>{isFieldError("password")}</Text>
              )}
              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style={{ top: 100 }}>
            <Text style={{ fontFamily: "Inter_400Regular", color: "#868686" }}>
              Don't have an account yet?{" "}
              <Text
                style={styles.registerButton}
                onPress={() =>
                  router.push("/screens/landingPage/register-page")
                }
              >
                Register here
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: "#721c24",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    paddingLeft: 35,
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    height: 50,
  },
  inputPassword: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    paddingLeft: 35,
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    paddingRight: 35,
    height: 50,
  },
  loginButton: {
    backgroundColor: "#48A6A7",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 30,
    elevation: 1,
    width: "100%",
  },
  loginText: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  inputContainer: {
    paddingVertical: 16,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
  icon: {
    position: "absolute",
    top: 28,
    left: 8,
    zIndex: 1,
  },
  registerButton: {
    color: "#48A6A7",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 29,
  },
});
