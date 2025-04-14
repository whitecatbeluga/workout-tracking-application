import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LoginFormData } from "@/custom-types/form-data-type";
import { useRouter } from "expo-router";
import { login } from "../../../redux/auth-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";

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
    <View style={styles.container}>
      <Text style={styles.text}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Text style={styles.text}>Password</Text>
      <TextInput
        style={styles.input}
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        autoCapitalize="none"
        secureTextEntry
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    width: 350,
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: "#006A71",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  loginText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
});
