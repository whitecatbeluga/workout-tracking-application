import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useAppSelector } from "@/hooks/use-app-selector";
import { db, auth } from "@/utils/firebase-config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

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
  // {
  //   routeName: "Workouts",
  //   routeUrl: "/screens/profile/workouts",
  //   routeIcon: "barbell",
  // },
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
  const access_token = useAppSelector((state) => state.auth.access_token);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [routineCount, setRoutineCount] = useState<number>(0);
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        // Followers & following
        const followersSnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "followers")
        );
        const followingSnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "following")
        );

        // Programs - routine_ids count
        const programsRef = collection(
          db,
          "users",
          currentUser.uid,
          "programs"
        );
        const snapshot = await getDocs(programsRef);

        let total = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (Array.isArray(data.routine_ids)) {
            total += data.routine_ids.length;
          }
        });

        // Workouts count
        const workoutsRef = collection(db, "workouts");
        const workoutsSnapshot = await getDocs(workoutsRef);

        let userWorkoutCount = 0;
        workoutsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.user_id === currentUser.uid) {
            userWorkoutCount++;
          }
        });

        // Fetch profile picture
        const usersRef = doc(db, "users", currentUser.uid);
        const usersSnap = await getDoc(usersRef);

        if (usersSnap.exists()) {
          const data = usersSnap.data();
          setProfilePicture(data.profile_picture);
        }

        setFollowerCount(followersSnapshot.size);
        setFollowingCount(followingSnapshot.size);
        setRoutineCount(total);
        setWorkoutCount(userWorkoutCount);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
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
    { label: "Followers", count: followerCount },
    { label: "Following", count: followingCount },
  ];

  const cards = [
    { count: routineCount, label: "Total Routines", unit: "routines" },
    { count: workoutCount, label: "Total Workouts", unit: "workouts" },
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

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#48A6A7" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Image
                source={{
                  uri:
                    profilePicture || "https://avatar.iran.liara.run/public/41",
                }}
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
