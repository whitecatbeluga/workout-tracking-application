import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/tab-bar";
import { Ionicons } from "@expo/vector-icons"; // Importing icons from Expo
import { Image, View, StyleSheet } from "react-native"; // Importing Image and View for styling

const TabLayout = () => {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "John Doe Smith",
          headerTitleStyle: {
            fontSize: 12,
          },
          headerLeft: () => (
            <View style={styles.avatarContainer}>
              {/* Circular Avatar Image */}
              <Image
                source={require("../../assets/images/profile-cat.webp")} // Direct image URL
                style={styles.avatar}
                alt="avatar"
              />
              {/* <Ionicons name="notifications-outline" size={24} color="black" /> */}
            </View>
          ),
          headerRight: () => (
            <React.Fragment>
              {/* Search Icon */}
              <Ionicons
                name="search-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              {/* Bell Icon */}
              <Ionicons
                name="notifications-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </React.Fragment>
          ),
        }}
      />
      <Tabs.Screen name="workout" options={{ headerShown:false}} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    marginLeft: 10, // Add margin to space it out a bit
    backgroundColor: "red",
    borderRadius: "50%",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20, // Creates the circular shape
  },
});

export default TabLayout;
