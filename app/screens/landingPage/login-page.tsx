import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { LoginFormData } from "@/custom-types/form-data-type";

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogin = () => {
    console.log("Login pressed", formData);
  };

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
