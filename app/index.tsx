import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const screenWidth = Dimensions.get("window").width;

const LandingPage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Workout Tracking Application</Text>
        <Image
          source={require("../assets/images/landing-page.jpg")}
          style={{ width: screenWidth - 40, height: screenWidth - 40 }}
        />
        <Text style={styles.description}>
          Your Personalized Fitness Companion – Plan Smarter, Train Harder,
          Progress Faster.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/screens/landingPage/login-page")}
          style={styles.getStartedButton}
        >
          <Text style={styles.text}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.guestButton}>
          <Text style={styles.guestText}>Continue as guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 40,
    fontFamily: "Inter_800ExtraBold",
    letterSpacing: -2,
    color: "#323232",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Inter_300Light",
    color: "#323232",
    textAlign: "center",
    letterSpacing: -1,
  },
  buttonContainer: {
    width: "100%",
  },
  guestButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
  },
  getStartedButton: {
    backgroundColor: "#006A71",
    paddingVertical: 14,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  guestText: {
    color: "#006A71",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
