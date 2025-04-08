import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ProfilePage from "../screens/profile";

const Profile = () => {
  return (
    <View style={styles.container}>
      <ProfilePage />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    margin: 20,
  },
});
