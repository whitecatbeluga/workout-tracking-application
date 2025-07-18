import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-chart-kit";
import PostCard from "./post-card";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComments from "./components/comments-bottom-sheet";
import { db, auth } from "@/utils/firebase-config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [40, 55, 30, 75, 90, 60],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: "transparent",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "transparent",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 106, 113, ${opacity})`, // bar color
  labelColor: (opacity = 1) => `rgba(0, 106, 113, ${opacity})`, // label color
  strokeWidth: 2,
  useShadowColorFromDataset: false,
  propsForBackgroundLines: {
    stroke: "#e3e3e3", // subtle gridlines
  },
  propsForLabels: {
    fontSize: 12,
  },
  decimalPlaces: 0,
};

const VisitProfile = () => {
  const {
    post_id,
    name,
    postTitle,
    description,
    time,
    volume,
    likes,
    comments,
    date,
    user_id,
    sets,
    records,
    fullName,
    email,
    isLiked,
  } = useLocalSearchParams();

  const toString = (value: string | string[] | undefined): string =>
    typeof value === "string" ? value : value?.[0] || "";

  const [liked, setLiked] = useState(isLiked === "true");
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [routineCount, setRoutineCount] = useState<number>(0);
  const [workoutCount, setWorkoutCount] = useState<number>(0);
  const [sheetType, setSheetType] = useState<"likes" | "comments">("comments");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Handle open comments
  const handleOpenSheet = (type: "likes" | "comments", postId: string) => {
    setSheetType(type);
    setSelectedPostId(postId);
    bottomSheetRef.current?.expand();
  };

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user_id) return;

        // Fetch user profile
        const userDocRef = doc(db, "users", toString(user_id));
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setProfilePicture(userData.profile_picture || "");
        } else {
          console.log("No such user!");
        }

        // Fetch public workouts for this user
        const workoutsRef = collection(db, "workouts");
        const q = query(
          workoutsRef,
          where("user_id", "==", toString(user_id)),
          where("visible_to_everyone", "==", true),
          orderBy("created_at", "desc")
        );

        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            total_volume: data.total_volume,
            created_at: formatDistanceToNow(
              data.created_at.toDate?.() || data.created_at,
              { addSuffix: true }
            ),
          };
        });

        // Followers & following
        const followersSnapshot = await getDocs(
          collection(db, "users", toString(user_id), "followers")
        );
        const followingSnapshot = await getDocs(
          collection(db, "users", toString(user_id), "following")
        );

        // Programs - routine_ids count
        const programsRef = collection(
          db,
          "users",
          toString(user_id),
          "programs"
        );
        const programsSnapshot = await getDocs(programsRef);

        let total = 0;

        programsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (Array.isArray(data.routine_ids)) {
            total += data.routine_ids.length;
          }
        });

        // Workouts count
        const workoutCountRef = collection(db, "workouts");
        const workoutCountSnapshot = await getDocs(workoutCountRef);

        let userWorkoutCount = 0;
        workoutCountSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.user_id === user_id) {
            userWorkoutCount++;
          }
        });

        setFollowerCount(followersSnapshot.size);
        setFollowingCount(followingSnapshot.size);
        setRoutineCount(total);
        setWorkoutCount(userWorkoutCount);
        setUserPosts(posts);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
        console.log("Fetched user ID:", user_id);
        console.log("Profile picture:", profilePicture);
      }
    };

    fetchData();
  }, [user_id]);

  // check following status
  useEffect(() => {
    const checkFollowingStatus = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const followingRef = doc(
        db,
        "users",
        currentUser.uid,
        "following",
        toString(user_id)
      );
      const docSnap = await getDoc(followingRef);

      setFollowing(docSnap.exists());
    };

    if (user_id) {
      checkFollowingStatus();
    }
  }, [user_id]);

  const handleFollowToggle = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !user_id) return;

    const followingRef = doc(
      db,
      "users",
      currentUser.uid,
      "following",
      toString(user_id)
    );
    const followersRef = doc(
      db,
      "users",
      toString(user_id),
      "followers",
      currentUser.uid
    );

    try {
      setFollowLoading(true);
      if (!following) {
        await setDoc(followingRef, {
          followed_at: serverTimestamp(),
        });
        await setDoc(followersRef, {
          followed_at: serverTimestamp(),
        });
        setFollowing(true);
      } else {
        await deleteDoc(followingRef);
        await deleteDoc(followersRef);
        setFollowing(false);
      }
    } catch (error) {
      console.error("Error toggling follow: ", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color="#48A6A7" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <View style={styles.profileContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Image
              style={styles.profilePicture}
              source={{
                uri:
                  profilePicture || "https://avatar.iran.liara.run/public/41",
              }}
            />
            <View>
              <Text style={styles.name}>
                {fullName}
                {auth.currentUser?.uid && user_id === auth.currentUser.uid && (
                  <Text style={{ fontWeight: "normal", color: "#888" }}>
                    {" "}
                    (You)
                  </Text>
                )}
              </Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fcount}>{followerCount}</Text>
            <Text style={styles.ftext}>Followers</Text>
          </View>
          <View>
            <Text style={styles.fcount}>{followingCount}</Text>
            <Text style={styles.ftext}>Following</Text>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 14 }}
        >
          <View style={styles.totalContainer}>
            <Text style={styles.totalTitle}>Total Routines</Text>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
            >
              <Text style={styles.totalCount}>{routineCount}</Text>
              <Text style={styles.totalName}>Routines</Text>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalTitle}>Total Workouts</Text>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
            >
              <Text style={styles.totalCount}>{workoutCount}</Text>
              <Text style={styles.totalName}>Workouts</Text>
            </View>
          </View>
        </View>
        {auth.currentUser?.uid && user_id !== auth.currentUser.uid && (
          <View style={styles.followButtonContainer}>
            <TouchableOpacity
              style={!following ? styles.followButton : styles.followingButton}
              onPress={handleFollowToggle}
            >
              {!followLoading ? (
                <Text
                  style={!following ? styles.followText : styles.followingText}
                >
                  {!following ? "Follow" : "Following"}
                </Text>
              ) : (
                <ActivityIndicator size="small" color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.barChartContainer}>
          <BarChart
            data={data}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            yAxisLabel=""
            yAxisSuffix="h"
            style={{
              marginHorizontal: 16,
              borderRadius: 16,
            }}
          />
        </View>
        <View>
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={styles.recentWorkoutText}>Recent Workouts</Text>
          </View>
          {userPosts.map((post) => (
            <PostCard
              key={post.id}
              post_id={post.id}
              name={toString(name)}
              fullName={toString(fullName)}
              email={toString(email)}
              date={toString(post.created_at)}
              postTitle={toString(post.workout_title)}
              description={toString(post.workout_description)}
              time={toString(post.workout_duration)}
              volume={post.total_volume}
              sets={post.total_sets}
              records={toString(post.records)}
              likes={toString(likes)}
              comments={toString(comments)}
              liked={liked}
              user_id={toString(user_id)}
              onLikePress={() => setLiked(!liked)}
              onCheckLikes={() => handleOpenSheet("likes", post.id)}
              onCommentPress={() => handleOpenSheet("comments", post.id)}
            />
          ))}

          {/* <PostCard
            post_id={toString(post_id)}
            name={toString(name)}
            fullName={toString(fullName)}
            email={toString(fullName)}
            date={toString(date)}
            postTitle={toString(postTitle)}
            description={toString(description)}
            time={toString(time)}
            volume={toString(volume)}
            sets={toString(sets)}
            records={toString(records)}
            // profilePicture={profilePicture}
            // postedPicture={postedPicture}
            likes={toString(likes)}
            comments={toString(comments)}
            liked={liked}
            user_id={toString(user_id)}
            onLikePress={() => setLiked(!liked)}
            onCheckLikes={() => handleOpenSheet("likes")}
            onCommentPress={() => handleOpenSheet("comments")}
          /> */}
        </View>
      </ScrollView>
      <BottomSheetComments
        title="sample"
        type={sheetType}
        postId={selectedPostId}
        ref={bottomSheetRef}
      />
    </View>
  );
};

export default VisitProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 10,
  },
  profilePicture: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  email: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  fcount: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  ftext: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
  },
  totalContainer: {
    width: 185,
    height: 75,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 17,
    elevation: 1,
  },
  totalTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: "#626262",
  },
  totalCount: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: "#323232",
  },
  totalName: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: "#626262",
  },
  followButtonContainer: {
    padding: 16,
  },
  followButton: {
    backgroundColor: "#48A6A7",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 1,
  },
  followingButton: {
    backgroundColor: "#DDDCDC",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    elevation: 1,
  },
  followText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
  },
  followingText: {
    color: "#000000",
    fontFamily: "Inter_400Regular",
  },
  barChartContainer: {
    paddingVertical: 12,
  },
  recentWorkoutText: {
    color: "#626262",
    fontFamily: "Inter_400Regular",
  },
});
