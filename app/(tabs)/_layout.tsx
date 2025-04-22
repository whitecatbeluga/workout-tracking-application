import React, {
  useState,
  useMemo,
  useContext,
  createContext,
  useRef,
  useEffect,
} from "react";
import { Tabs, useRouter } from "expo-router";
import { TabBar } from "@/components/tab-bar";
import { Ionicons } from "@expo/vector-icons"; // Importing icons from Expo
import {
  Image,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native"; // Importing Image and View for styling
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useAppSelector } from "@/hooks/use-app-selector";

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
  const user = useAppSelector((state) => state.auth.user);
  const contextValue = useMemo(
    () => ({ isTabVisible, setTabVisible }),
    [isTabVisible]
  );

  const router = useRouter();

  return (
    <TabVisibilityContext.Provider value={contextValue}>
      <Tabs
        tabBar={(props: React.JSX.IntrinsicAttributes & BottomTabBarProps) => (
          <CustomTabBar {...props} />
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerTitle: user?.first_name,
            headerTitleStyle: {
              fontSize: 18,
              fontFamily: "Inter_400Regular",
            },
            tabBarLabel: "Home",
            tabBarLabelStyle: { fontFamily: "Inter_400Regular" },
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
                <TouchableOpacity
                  onPress={() => router.push("/screens/home/search")}
                >
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>

                {/* Bell Icon */}
                <TouchableOpacity
                  onPress={() => router.push("/screens/home/notifications")}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ),
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: "Workout",
            tabBarLabel: "Workout",
            tabBarLabelStyle: { fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontSize: 18,
              fontFamily: "Inter_400Regular",
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarLabelStyle: { fontFamily: "Inter_400Regular" },
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontSize: 18,
              fontFamily: "Inter_400Regular",
            },
            headerRight: () => (
              <React.Fragment>
                {/* Bell Icon */}
                <TouchableOpacity>
                  <Ionicons
                    name="settings-outline"
                    size={24}
                    color="black"
                    style={{ marginRight: 20 }}
                    onPress={() =>
                      router.push("/screens/profile/settings/settings-layout")
                    }
                  />
                </TouchableOpacity>
              </React.Fragment>
            ),
          }}
        />
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
