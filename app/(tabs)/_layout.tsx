import React, { useState, useMemo, useContext, createContext, useRef, useEffect } from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/tab-bar";
import { Ionicons } from "@expo/vector-icons"; // Importing icons from Expo
import { Image, View, StyleSheet, Animated } from "react-native"; // Importing Image and View for styling
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TabVisibilityContext = createContext({
  isTabVisible: true,
  setTabVisible: (visible: boolean) => {},
});

export const useTabVisibility = () => useContext(TabVisibilityContext);

const CustomTabBar = (props: BottomTabBarProps) => {
  const { isTabVisible } = useTabVisibility();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isTabVisible ? 0 : 100, // slide down when hidden
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isTabVisible]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        backgroundColor: "white", // adjust if needed
      }}
    >
      <TabBar {...props} />
    </Animated.View>
  );
};

const TabLayout = () => {
  const [isTabVisible, setTabVisible] = useState(true);
  const contextValue = useMemo(() => ({ isTabVisible, setTabVisible }), [isTabVisible]);

  return (
    <TabVisibilityContext.Provider value={contextValue}>
      <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
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
        <Tabs.Screen name="workout" options={{ headerShown: false }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </TabVisibilityContext.Provider>
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
