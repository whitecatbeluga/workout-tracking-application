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
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LoginFormData } from "@/custom-types/form-data-type";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { login } from "@/redux/auth-slice";

import Input from "@/components/input-text";

const screenWidth = Dimensions.get("window").width;

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
          <View
            style={{
              width: "100%",
            }}
          >
            {typeof error === "string" && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Text style={styles.header}>Workout Tracking Application</Text>

            <View style={{ gap: 10 }}>
              {/* Email Field */}
              <Input
                value={formData.email}
                icon="mail"
                placeholder="Email"
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                error={isFieldError("email")}
              />

              {/* Password Field */}
              <Input
                value={formData.password}
                icon="lock-closed"
                placeholder="Password"
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry={!showPassword}
                isSuffix={true}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword((prev) => !prev)}
                autoCapitalize="none"
                error={isFieldError("password")}
              />
            </View>

            {/* Login Button */}
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.lineText}>or</Text>
            <View style={styles.line} />
          </View>

          <View>
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
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
    fontSize: 40,
    fontFamily: "Inter_800ExtraBold",
    letterSpacing: -2,
    color: "#323232",
    textAlign: "center",
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
    backgroundColor: "#006A71",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
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
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#868686",
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

  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  lineText: {
    marginHorizontal: 10,
    color: "#555",
    fontWeight: "500",
  },
});
