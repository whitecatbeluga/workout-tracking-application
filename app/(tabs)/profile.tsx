import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ProfilePage from "../screens/profile";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <ProfilePage />
        </SafeAreaView>
      </SafeAreaProvider>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
