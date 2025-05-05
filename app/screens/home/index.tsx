import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComments from "./components/comments-bottom-sheet";
import { auth, db } from "@/utils/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

type PostItem = {
  id: string;
  name: string;
  fullName: string;
  email: string;
  active: string;
  postTitle: string;
  description: string;
  profilePicture: any;
  time: string;
  volume: string;
  postedPicture: any;
  likes: string;
  comments: string;
  date: string;
  sets: string;
  records: string;
};

type Workout = {
  id: string;
  created_at: any;
  image_urls: string[];
  total_sets: string;
  total_volume: string;
  user_id: string;
  visible_to_everyone: boolean;
  workout_description: string;
  workout_duration: string;
  workout_title: string;
  userProfile?: UserProfile;
  like_count: number;
  comment_count: number;
};

type UserProfile = {
  address: string;
  birthdate: string;
  created_at: any;
  email: string;
  first_name: string;
  gender: string;
  height: string;
  last_name: string;
  profile_picture: string;
  username: string;
  weight: string;
};

const HomeScreen = () => {
  const [activeButton, setActiveButton] = useState<"following" | "discover">(
    "discover"
  );
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [sheetType, setSheetType] = useState<"likes" | "comments">("comments");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const verifyRefreshToken = async () => {
  //     const isLoggedIn = AsyncStorage.getItem("loggedIn");
  //     if (await isLoggedIn) {
  //       await appDispatch(refreshToken());
  //     }
  //   };
  //   void verifyRefreshToken();
  // }, []);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const {
  //       data: { user: currentUser },
  //     } = await supabase.auth.getUser();

  //     if (currentUser) {
  //       const { data: userProfile, error: profileError } = await supabase
  //         .from("User")
  //         .select("*")
  //         .eq("auth_user_id", currentUser.id)
  //         .single();

  //       if (profileError) {
  //         console.error("Profile error:", profileError.message);
  //       } else {
  //         setUserSupa(userProfile); // your state setter
  //       }
  //     } else {
  //       console.log("No user is currently logged in");
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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

  // Handle open comments
  const handleOpenSheet = (type: "likes" | "comments") => {
    setSheetType(type);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const workoutsRef = collection(db, "workouts");
        const q = query(
          workoutsRef,
          where("visible_to_everyone", "==", true),
          orderBy("created_at", "desc")
        );

        const querySnapshot = await getDocs(q);
        const workoutDocs = querySnapshot.docs;

        const currentUserId = auth.currentUser?.uid;
        const userIds = Array.from(
          new Set(workoutDocs.map((doc) => doc.data().user_id))
        );

        const userMap: Record<string, UserProfile> = {};

        // Fetch user profiles
        await Promise.all(
          userIds.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              userMap[uid] = userDoc.data() as UserProfile;
            }
          })
        );

        // Build workouts array with user profiles and like count
        const workoutsWithUsers: Workout[] = await Promise.all(
          workoutDocs
            .filter((doc) => doc.data().user_id !== currentUserId)
            .map(async (doc) => {
              const data = doc.data();

              // Get likes count from subcollection
              const likesRef = collection(db, "workouts", doc.id, "likes");
              const likesSnapshot = await getDocs(likesRef);
              const likeCount = likesSnapshot.size;

              // Get comments count from subcollection
              const commentsRef = collection(
                db,
                "workouts",
                doc.id,
                "comments"
              );
              const commentsSnapshot = await getDocs(commentsRef);
              const commentsCount = commentsSnapshot.size;

              const workout: Workout = {
                id: doc.id,
                created_at: formatDistanceToNow(
                  data.created_at.toDate?.() || data.created_at,
                  { addSuffix: true }
                ),
                image_urls: data.image_urls,
                total_sets: data.total_sets,
                total_volume: data.total_volume,
                user_id: data.user_id,
                visible_to_everyone: data.visible_to_everyone,
                workout_description: data.workout_description,
                workout_duration: data.workout_duration,
                workout_title: data.workout_title,
                userProfile: userMap[data.user_id],
                like_count: likeCount,
                comment_count: commentsCount,
              };

              return workout;
            })
        );

        setWorkouts(workoutsWithUsers);
      } catch (error) {
        console.error("Error fetching workouts and users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.followingButton,
            activeButton === "following" && styles.activeButton,
          ]}
          onPress={() => setActiveButton("following")}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton === "following" && styles.activeText,
            ]}
          >
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.discoverButton,
            activeButton === "discover" && styles.activeButton,
          ]}
          onPress={() => setActiveButton("discover")}
        >
          <Text
            style={[
              styles.buttonText,
              activeButton === "discover" && styles.activeText,
            ]}
          >
            Discover
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexGrow: 1,
          paddingTop: 16,
          paddingBottom: 120,
        }}
      >
        {!loading ? (
          <FlatList
            data={workouts}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/screens/home/view-post",
                      params: {
                        id: item.id,
                        name: item.userProfile?.username,
                        fullName: `${item.userProfile?.first_name} ${item.userProfile?.last_name}`,
                        email: item.userProfile?.email,
                        postTitle: item.workout_title,
                        description: item.workout_description,
                        time: item.workout_duration,
                        volume: item.total_volume,
                        // likes: item.likes,
                        // comments: item.comments,
                        date: item.created_at,
                        profilePicture: item.userProfile?.profile_picture,
                        // postedPicture: item.postedPicture,
                        sets: item.total_sets,
                        // records: item.records,
                        isLiked: likedPosts[item.id] ? "true" : "false",
                      },
                    })
                  }
                >
                  <View style={{ paddingHorizontal: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                        onPress={() =>
                          router.push({
                            pathname: "/screens/home/visit-profile",
                            params: {
                              id: item.id,
                              name: item.userProfile?.username,
                              postTitle: item.workout_title,
                              description: item.workout_description,
                              time: item.created_at,
                              volume: item.total_volume,
                              // likes: item.likes,
                              // comments: item.comments,
                              date: item.created_at,
                              profilePicture: item.userProfile?.profile_picture,
                              // postedPicture: item.postedPicture,
                              sets: item.total_sets,
                              // records: item.records,
                              fullName: `${item.userProfile?.first_name} ${item.userProfile?.last_name}`,
                              email: item.userProfile?.email,
                              isLiked: likedPosts[item.id] ? "true" : "false",
                            },
                          })
                        }
                      >
                        <Image
                          style={styles.profileImage}
                          source={
                            item.userProfile?.profile_picture
                              ? { uri: item.userProfile.profile_picture }
                              : require("../../../assets/images/image_placeholder.jpg")
                          }
                        />
                        <View>
                          <Text style={styles.name}>
                            {item.userProfile?.username}
                          </Text>
                          <Text style={styles.active}>{item.created_at}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ flexDirection: "row" }}>
                        <Ionicons
                          name="add-outline"
                          size={20}
                          color="#48A6A7"
                        />
                        <Text style={styles.followButton}>Follow</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.postTitle}>{item.workout_title}</Text>
                    <Text style={styles.postDescription}>
                      {item.workout_description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 40 }}>
                      <View>
                        <Text style={styles.timevolume}>Time</Text>
                        <Text style={styles.itemTimeVolume}>
                          {item.workout_duration}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.timevolume}>Volume</Text>
                        <Text style={styles.itemTimeVolume}>
                          {item.total_volume}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ height: 300 }}>
                    <FlatList
                      data={item.image_urls}
                      keyExtractor={(url, index) => index.toString()}
                      renderItem={({ item: url }) => (
                        <Image
                          source={{ uri: url }}
                          style={styles.postedPicture}
                          resizeMode="cover"
                        />
                      )}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                </TouchableOpacity>

                <View style={styles.likesContainer}>
                  <TouchableOpacity onPress={() => handleOpenSheet("likes")}>
                    <Text style={styles.likesText}>
                      {item.like_count} likes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleOpenSheet("comments")}>
                    <Text style={styles.likesText}>
                      {item.comment_count} comments
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.likeCommentShareContainer}>
                  <TouchableOpacity onPress={() => toggleLike(item.id)}>
                    <Ionicons
                      style={styles.icons}
                      name={
                        likedPosts[item.id]
                          ? "thumbs-up-sharp"
                          : "thumbs-up-outline"
                      }
                      size={24}
                      color={likedPosts[item.id] ? "#48A6A7" : "#606060"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleOpenSheet("comments")}>
                    <Ionicons
                      style={styles.icons}
                      name="chatbubble-outline"
                      size={24}
                      color="#606060"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      style={styles.icons}
                      name="share-outline"
                      size={24}
                      color="#606060"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        ) : (
          <ActivityIndicator size="large" color="#48A6A7" />
        )}
      </View>

      <BottomSheetComments
        title="sample"
        type={sheetType}
        ref={bottomSheetRef}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  seeAllText: {
    color: "#ACACAC",
    alignItems: "flex-end",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    elevation: 1,
  },
  scrollViewContainer: {
    paddingHorizontal: 15,
    gap: 15,
  },
  scrollView: {
    marginTop: 10,
  },
  card: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  cardImg: {
    width: 140,
    height: 140,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    position: "absolute",
    color: "#000000",
    backgroundColor: "rgba(221, 220, 220, 0.8)",
    textAlign: "center",
    padding: 6,
    borderRadius: 10,
  },
  cardTitleSmall: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    position: "absolute",
    color: "#000000",
    backgroundColor: "rgba(221, 220, 220, 0.8)",
    textAlign: "center",
    padding: 6,
    borderRadius: 10,
    width: 130,
    top: 45,
  },
  gridCard: {
    flex: 1,
    alignItems: "center",
    gap: 50,
    marginVertical: 10,
    elevation: 1,
  },
  gridCardImg: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  buttonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "#D9D9D9",
    width: 180,
    height: 50,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  discoverButton: {
    backgroundColor: "#D9D9D9",
    width: 180,
    height: 50,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  activeButton: {
    backgroundColor: "#48A6A7",
    elevation: 1,
  },
  activeText: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  name: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000000",
  },
  active: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#A7A7A7",
  },
  followButton: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: "#48A6A7",
  },
  postTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  postDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  timevolume: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#555555",
  },
  itemTimeVolume: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  postedPicture: {
    width: Dimensions.get("window").width,
    height: 300,
    borderRadius: 10,
  },
  likesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  likesText: {
    fontFamily: "Inter_400Regular",
    color: "#555555",
    fontSize: 12,
  },
  likeCommentShareContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#898989",
    borderTopWidth: 0.5,
    borderTopColor: "#898989",
    marginBottom: 10,
  },
  icons: {
    elevation: 1,
  },
});
