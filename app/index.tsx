import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const LandingPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={{ width: "100%", gap: 10, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={() => router.push("/screens/landingPage/login-page")}
          style={styles.getStartedButton}
        >
          <Text style={styles.text}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.guestButton}>
        <Text style={styles.text}>Continue as guest</Text>
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
    backgroundColor: "#F4F4F4",
    top: 150,
  },
  guestButton: {
    backgroundColor: "#A0A0A0",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 100,
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#48A6A7",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
