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
        >
          <View style={{ width: "100%", paddingHorizontal: 30 }}>
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
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                style={styles.icon}
                name="lock-closed"
                size={24}
                color="#6F7A88"
              />
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleInputChange("password", text)}
                autoCapitalize="none"
                secureTextEntry
                placeholder="Password"
              />
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
    top: 25,
    left: 8,
    zIndex: 1,
  },
  registerButton: {
    color: "#48A6A7",
  },
});
