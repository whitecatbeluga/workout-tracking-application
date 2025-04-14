import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const LandingPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>This is the landing page</Text>
      <TouchableOpacity onPress={() => router.push("/screens/landingPage/login-page")}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/screens/landingPage/register-page")}>
        <Text>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{marginTop: 50}}>
        <Text>Continue as guest</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
