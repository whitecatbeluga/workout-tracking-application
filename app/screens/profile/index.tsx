import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { Href, useRouter } from "expo-router";

// imported components
import BarGraph from "./components/bar-graph";
import BottomSheetFilter from "./components/drawer-filter";
import DashboardButtons from "./components/dashboard-buttons";
import ImageView from "react-native-image-viewing";
import Ionicons from "@expo/vector-icons/Ionicons";
import Styles from "@/app/screens/profile/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import WorkoutCard from "./components/workout-card";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { logout } from "@/redux/auth-slice";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useAppSelector } from "@/hooks/use-app-selector";

const routeNames: {
  routeName: string;
  routeUrl: Href;
  routeIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    routeName: "Statistics",
    routeUrl: "/screens/profile/statistics",
    routeIcon: "stats-chart",
  },
  {
    routeName: "Workouts",
    routeUrl: "/screens/profile/workouts",
    routeIcon: "barbell",
  },
  {
    routeName: "Measures",
    routeUrl: "/screens/profile/measures",
    routeIcon: "analytics",
  },
  {
    routeName: "Routines",
    routeUrl: "/screens/profile/routines",
    routeIcon: "book",
  },
  {
    routeName: "Calendar",
    routeUrl: "/screens/profile/calendar",
    routeIcon: "calendar",
  },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Duration");
  const user = useAppSelector((state) => state.auth.user);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const appDispatch = useAppDispatch();
  const router = useRouter();

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const handleLogout = async () => {
    try {
      await appDispatch(logout());
      router.replace("/screens/landingPage/login-page");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [visible, setIsVisible] = useState(false);

  const graphDataMap: Record<string, any> = {
    Duration: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{ data: [20, 45, 28] }],
      ySuffixLabel: " hrs",
    },
    Volume: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{ data: [60, 70, 30] }],
      ySuffixLabel: "k kg",
    },
    Reps: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{ data: [50, 40, 90] }],
      ySuffixLabel: " reps",
    },
  };

  const tabLabels = Object.keys(graphDataMap);

  const profileInfo = [
    { label: "Followers", count: 152 },
    { label: "Following", count: 52 },
  ];

  const cards = [
    { count: 56, label: "Total Exercises", unit: "exercises" },
    { count: 12, label: "Total Workouts", unit: "workouts" },
  ];

  // To hide bottom nav
  const offset = useRef(0);
  const { setTabVisible } = useTabVisibility();
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > offset.current ? "down" : "up";

    if (Math.abs(currentOffset - offset.current) > 10) {
      setTabVisible(direction !== "down");
    }

    offset.current = currentOffset;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        overScrollMode="never"
      >
        {/* profile avatar and info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Image
                source={{ uri: "https://avatar.iran.liara.run/public/41" }}
                style={Styles.profileImage}
              />
            </TouchableOpacity>
            <ImageView
              images={[{ uri: "https://avatar.iran.liara.run/public/41" }]}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
              onLongPress={() => setIsVisible(false)}
              swipeToCloseEnabled={true}
              doubleTapToZoomEnabled={true}
              backgroundColor="rgba(0, 0, 0, 0.5)"
            />
            <View style={{ flexDirection: "column" }}>
              <Text style={{ fontSize: 16, fontFamily: "Inter_700Bold" }}>
                {user?.first_name + " " + user?.last_name}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular" }}>
                {user?.email}
              </Text>
            </View>
          </View>
          <View style={{ gap: 10, flexDirection: "row" }}>
            {profileInfo.map((info, index) => (
              <View key={index}>
                <Text style={Styles.profileInfoCount}>{info.count}</Text>
                <Text style={Styles.profileInfo}>{info.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* exercises and workout */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginVertical: 20,
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            {cards.map((card, index) => (
              <WorkoutCard key={index} card={card} />
            ))}
          </View>
        </View>

        {/* drawer filter */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold" }}>
              Graph Progress
            </Text>
          </View>
          <TouchableOpacity
            style={Styles.drawerButton}
            onPress={handleOpenBottomSheet}
          >
            <Text
              style={{
                color: "#006A71",
                fontSize: 14,
                fontFamily: "Inter_700Bold",
              }}
            >
              Last 3 Months
            </Text>
            <Ionicons name="chevron-down" size={20} color="#006A71" />
          </TouchableOpacity>
        </View>

        {/* chart */}
        <BarGraph
          graphData={graphDataMap[activeTab]}
          ySuffixLabel={graphDataMap[activeTab].ySuffixLabel}
        />

        {/* filter graph buttons */}
        <View style={Styles.tabContainer}>
          {tabLabels.map((label) => (
            <TouchableOpacity
              key={label}
              style={[
                Styles.tabButton,
                activeTab === label && Styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab(label)}
            >
              <Text
                style={[
                  Styles.tabText,
                  activeTab === label && Styles.tabTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* dashboard */}
        <View style={Styles.dashboardContainer}>
          {routeNames.map((routes) => (
            <DashboardButtons
              key={routes.routeName}
              routeName={routes.routeName}
              routeUrl={routes.routeUrl}
              routeIcon={routes.routeIcon}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* dashboard buttons */}
      </ScrollView>
      <BottomSheetFilter title="Sample" ref={bottomSheetRef} />
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 80,
  },
  button: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
