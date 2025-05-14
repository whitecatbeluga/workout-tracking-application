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
import { Href } from "expo-router";

// imported components
import BarGraph from "./components/bar-graph";
import BottomSheetFilter from "./components/drawer-filter";
import DashboardButtons from "./components/dashboard-buttons";
import ImageView from "react-native-image-viewing";
import Ionicons from "@expo/vector-icons/Ionicons";
import Styles from "@/app/screens/profile/styles";
import BottomSheet from "@gorhom/bottom-sheet";
import WorkoutCard from "./components/workout-card";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useAppSelector } from "@/hooks/use-app-selector";
import { db, auth } from "@/utils/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import PostCard from "../home/post-card";
import BottomSheetComments from "../home/components/comments-bottom-sheet";

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
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [routineCount, setRoutineCount] = useState<number>(0);
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [sheetType, setSheetType] = useState<"likes" | "comments">("comments");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenSheet = (type: "likes" | "comments", postId: string) => {
    setSheetType(type);
    setSelectedPostId(postId);
    bottomSheetRef.current?.expand();
  };

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: `${user?.username}`,
  //     headerTitleAlign: "center",
  //     headerTitleStyle: {
  //       fontFamily: "Inter_400Regular",
  //       fontSize: 18,
  //     },
  //   });
  // }, [navigation]);

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

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const fetchWorkouts = async () => {
      try {
        setLoading(true);

        const workoutsRef = collection(db, "workouts");
        const q = query(
          workoutsRef,
          where("user_id", "==", currentUser.uid),
          orderBy("created_at", "desc")
        );
        const snapshot = await getDocs(q);

        const postsData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const workoutId = docSnap.id;

            const likesSnapshot = await getDocs(
              collection(db, "workouts", workoutId, "likes")
            );
            const commentsSnapshot = await getDocs(
              collection(db, "workouts", workoutId, "comments")
            );

            return {
              id: workoutId,
              user_id: data.user_id,
              created_at: formatDistanceToNow(
                data.created_at.toDate?.() || data.created_at,
                { addSuffix: true }
              ),
              workout_title: data.workout_title,
              workout_description: data.workout_description,
              workout_duration: data.workout_duration,
              total_volume: data.total_volume,
              total_sets: data.total_sets,
              records: data.records,
              likes: likesSnapshot.size,
              comments: commentsSnapshot.size,
              liked: false,
            };
          })
        );

        setUserPosts(postsData);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
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

  let fullName = `${user?.first_name} ${user?.last_name}`;
  let username = `${user?.username}`;
  let email = `${user?.email}`;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 20 }}
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
            paddingHorizontal: 20,
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
                {fullName}
              </Text>
              <Text style={{ fontSize: 14, fontFamily: "Inter_400Regular" }}>
                {email}
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
            paddingHorizontal: 20,
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
            paddingHorizontal: 20,
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
        <View style={{ paddingHorizontal: 20 }}>
          <BarGraph
            graphData={graphDataMap[activeTab]}
            ySuffixLabel={graphDataMap[activeTab].ySuffixLabel}
          />
        </View>

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
        {userPosts.map((post) => (
          <PostCard
            key={post.id}
            post_id={post.id}
            name={String(username)}
            fullName={String(fullName)}
            email={String(email)}
            date={String(post.created_at)}
            postTitle={String(post.workout_title)}
            description={String(post.workout_description)}
            time={String(post.workout_duration)}
            volume={post.total_volume}
            sets={post.total_sets}
            records={String(post.records)}
            likes={String(post.likes)}
            comments={String(post.comments)}
            liked={post.liked}
            user_id={String(post.user_id)}
            onLikePress={() =>
              setUserPosts((prevPosts) =>
                prevPosts.map((p) =>
                  p.id === post.id ? { ...p, liked: !p.liked } : p
                )
              )
            }
            onCheckLikes={() => handleOpenSheet("likes", post.id)}
            onCommentPress={() => handleOpenSheet("comments", post.id)}
          />
        ))}
      </ScrollView>
      <BottomSheetFilter title="Sample" ref={bottomSheetRef} />
      <BottomSheetComments
        title="sample"
        type={sheetType}
        postId={selectedPostId}
        ref={bottomSheetRef}
      />
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
