import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase-config";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface PostCardProps {
  post_id: string;
  name: string;
  fullName: string;
  email: string;
  date: string;
  postTitle: string;
  description: string;
  time: string;
  volume: string;
  sets: string;
  records: string;
  user_id: string;
  likes: string;
  comments: string;
  liked: boolean;
  onLikePress?: () => void;
  onCheckLikes?: () => void;
  onCommentPress?: () => void;
}

const PostCard = ({
  post_id,
  name,
  fullName,
  email,
  date,
  postTitle,
  description,
  time,
  volume,
  sets,
  records,
  user_id,
  likes,
  comments,
  liked,
  onLikePress,
  onCheckLikes,
  onCommentPress,
}: PostCardProps) => {
  const [likeCount, setLikeCount] = useState<string>(likes);
  const [commentCount, setCommentCount] = useState<string>(comments);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [image_urls, setImage_urls] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const toggleLike = async (postId: string) => {
    console.log(postId);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No authenticated user found.");
      return;
    }

    const user_id = currentUser.uid;

    try {
      const likesRef = collection(db, "workouts", postId, "likes");

      const q = query(likesRef, where("liked_by", "==", user_id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User has liked, remove the like
        const likeDocId = querySnapshot.docs[0].id;
        await deleteDoc(querySnapshot.docs[0].ref);
        setLikedPosts((prev) => ({ ...prev, [postId]: false }));
      } else {
        await addDoc(likesRef, {
          liked_by: user_id,
        });
        setLikedPosts((prev) => ({ ...prev, [postId]: true }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  useEffect(() => {
    const unsubscribeFns: (() => void)[] = [];

    const fetchData = async () => {
      setLoading(true);
      try {
        if (user_id) {
          const userDocRef = doc(db, "users", user_id);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setProfilePicture(userData.profile_picture || "");
          } else {
            console.log("No such user!");
          }
        }

        if (post_id) {
          const postRef = doc(db, "workouts", post_id);
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const postData = postSnap.data();
            if (postData?.image_urls && Array.isArray(postData.image_urls)) {
              setImage_urls(postData.image_urls);
              console.log("Fetched image URLs: ", postData.image_urls);
            } else {
              console.log("No image_urls found or it's not an array.");
            }

            if (auth.currentUser) {
              const currentUserId = auth.currentUser.uid;
              const likesRef = collection(db, "workouts", post_id, "likes");
              const q = query(likesRef, where("liked_by", "==", currentUserId));
              const snapshot = await getDocs(q);
              setLikedPosts({ [post_id]: !snapshot.empty });
            }

            // Real-time likes listener
            const likesRef = collection(db, "workouts", post_id, "likes");
            const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
              setLikeCount(snapshot.size.toString());
            });

            // Real-time comments listener
            const commentsRef = collection(db, "workouts", post_id, "comments");
            const unsubscribeComments = onSnapshot(commentsRef, (snapshot) => {
              setCommentCount(snapshot.size.toString());
            });
            unsubscribeFns.push(unsubscribeLikes, unsubscribeComments);
          } else {
            console.log("Post not found");
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (user_id || post_id) {
      fetchData();
    }

    return () => {
      unsubscribeFns.forEach((unsub) => unsub());
    };
  }, [user_id, post_id]);

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
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/home/view-post",
            params: {
              post_id: post_id, // for fetching the posted images
              name: name,
              fullName: fullName,
              email: email,
              postTitle: postTitle,
              description: description,
              time: time,
              volume: volume,
              likes: likes,
              comments: comments,
              date: date,
              user_id: user_id, // for fetching the user profile picture
              sets: sets,
              // image_urls: item.image_urls,
              // records: item.records,
              isLiked: liked.toString(),
            },
          })
        }
      >
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={styles.profilePicContainer}
            onPress={() =>
              router.push({
                pathname: "/screens/home/visit-profile",
                params: {
                  post_id: post_id,
                  name: name,
                  postTitle: postTitle,
                  description: description,
                  time: time,
                  volume: volume,
                  likes: likes,
                  comments: comments,
                  date: date,
                  user_id: user_id,
                  // profilePicture: profilePicture,
                  sets: sets,
                  fullName: fullName,
                  email: email,
                  records: records,
                  isLiked: liked.toString(),
                },
              })
            }
          >
            <Image
              style={styles.profileImage}
              source={
                profilePicture
                  ? {
                      uri: profilePicture,
                    }
                  : require("../../../assets/images/image_placeholder.jpg")
              }
            />
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.active}>{date}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.postTitle}>{postTitle}</Text>
            <Text style={styles.postDescription}>{description}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 46 }}>
            <View>
              <Text style={styles.tvsr}>Time</Text>
              <Text>{time}</Text>
            </View>
            <View>
              <Text style={styles.tvsr}>Volume</Text>
              <Text>{volume}</Text>
            </View>
            <View>
              <Text style={styles.tvsr}>Sets</Text>
              <Text>{sets}</Text>
            </View>
            <View>
              <Text style={styles.tvsr}>Records</Text>
              <Text>{records}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 300 }}>
          <FlatList
            data={image_urls}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(url, index) => index.toString()}
            renderItem={({ item: url }) => (
              <Image
                source={{ uri: url }}
                style={styles.postedPicture}
                resizeMode="cover"
              />
            )}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );
              setCurrentImageIndex(index);
            }}
          />
        </View>

        {image_urls.length > 1 && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            {image_urls.map((_, index) => (
              <View
                key={index}
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 3,
                  backgroundColor:
                    currentImageIndex === index ? "#48A6A7" : "#ccc",
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={onCheckLikes}>
          <Text style={styles.likesText}>{likeCount} likes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentPress}>
          <Text style={styles.likesText}>{comments} comments</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.likeCommentShareContainer}>
        <TouchableOpacity onPress={() => toggleLike(post_id)}>
          <Ionicons
            style={styles.icons}
            name={
              likedPosts[post_id]
                ? "thumbs-up-sharp"
                : "thumbs-up-outline"
            }            size={24}
            color={likedPosts[post_id] ? "#48A6A7" : "#606060"}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentPress}>
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
  );
};

const styles = StyleSheet.create({
  profilePicContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
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
  postTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  postDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  tvsr: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#555555",
  },
  postedPicture: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
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

export default PostCard;
