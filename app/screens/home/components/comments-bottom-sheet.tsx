import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase-config";
import { useRouter } from "expo-router";
import { format } from "date-fns";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  type: "comments" | "likes";
  postId: string | null;
}

type RefType = BottomSheet | null;

const BottomSheetComments = forwardRef<RefType, Props>((props, ref) => {
  const { postId, type } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const { setTabVisible } = useTabVisibility();
  // snap points
  const snapPoints = useMemo(() => ["75%"], []);
  const router = useRouter();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    setTabVisible(index === -1);
  }, []);

  useEffect(() => {
    if (!postId) return;

    const subcollectionName = type === "likes" ? "likes" : "comments";
    const subCollectionRef = collection(
      db,
      "workouts",
      postId,
      subcollectionName
    );

    const unsubscribe = onSnapshot(subCollectionRef, async (snapshot) => {
      try {
        setLoading(true);
        const itemsWithUserData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const itemData = docSnap.data();
            const created_at = itemData.created_at || null;
            const userId = type === "likes" ? itemData.liked_by : itemData.from;

            let fullName = "Unknown User";
            let profile_picture = "";
            let email = "";
            let username = "";

            try {
              const userDoc = await getDoc(doc(db, "users", userId));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                fullName = `${userData.first_name ?? ""} ${
                  userData.last_name ?? ""
                }`.trim();
                profile_picture = userData.profile_picture || "";
                email = userData.email || "";
                username = userData.username;
              }
            } catch (error) {
              console.error(`Failed to fetch user (${userId}): `, error);
            }

            return {
              id: docSnap.id,
              created_at,
              description: itemData.description,
              ...itemData,
              fullName,
              profile_picture,
              email,
              username,
            };
          })
        );

        const sortedData =
          type === "comments"
            ? itemsWithUserData.sort(
                (a, b) => a.created_at?.seconds - b.created_at?.seconds
              )
            : itemsWithUserData;

        setData(sortedData);
      } catch (error) {
        console.error(`Error processing ${type}: `, error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [postId, type]);

  const sendComment = async () => {
    if (!comment.trim() || !postId) return;
    try {
      setSending(true);
      const newComment = {
        description: comment.trim(),
        from: auth.currentUser?.uid,
        created_at: serverTimestamp(),
      };
      await addDoc(collection(db, "workouts", postId, "comments"), newComment);
      setComment("");
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setSending(false);
    }
  };

  // renders
  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      enableContentPanningGesture={false}
      handleStyle={{ backgroundColor: "#F4F4F4", borderRadius: 50 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <BottomSheetView
          style={{ flex: 1, backgroundColor: "#F4F4F4" }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 18,
                marginBottom: 10,
                paddingHorizontal: 16,
              }}
            >
              {props.type === "comments" ? "Comments" : "People who liked"}
            </Text>
          </View>

          <BottomSheetScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 20,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
          >
            {props.type === "comments" ? (
              !loading ? (
                data.length === 0 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ fontFamily: "Inter_400Regular", fontSize: 14 }}
                    >
                      Be the first to comment!
                    </Text>
                  </View>
                ) : (
                  data.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        marginBottom: 15,
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/screens/home/visit-profile",
                            params: {
                              user_id: item.from,
                              fullName: item.fullName,
                              email: item.email,
                              name: item.username,
                            },
                          })
                        }
                      >
                        <Image
                          source={{
                            uri:
                              item.profile_picture ||
                              "https://avatar.iran.liara.run/public/41",
                          }}
                          style={{ height: 40, width: 40, borderRadius: 20 }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontFamily: "Inter_500Medium",
                            fontSize: 14,
                            marginBottom: 2,
                          }}
                        >
                          {item.fullName}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Inter_400Regular",
                            fontSize: 14,
                            color: "#444",
                          }}
                        >
                          {item.description}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Inter_300Light",
                            fontSize: 12,
                            color: "#888",
                            marginTop: 4,
                          }}
                        >
                          {item.created_at?.seconds
                            ? format(
                                new Date(item.created_at.seconds * 1000),
                                "MMM d, yyyy h:mm a"
                              )
                            : "Just now"}
                        </Text>
                      </View>
                    </View>
                  ))
                )
              ) : (
                <ActivityIndicator size="small" color="#48A6A7" />
              )
            ) : !loading ? (
              data.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontFamily: "Inter_400Regular", fontSize: 14 }}
                  >
                    This post hasn't received any likes yet.
                  </Text>
                </View>
              ) : (
                data.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      marginBottom: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/screens/home/visit-profile",
                        params: {
                          user_id: item.liked_by,
                          fullName: item.fullName,
                          email: item.email,
                          name: item.username,
                        },
                      })
                    }
                  >
                    <Image
                      source={{
                        uri:
                          item.profile_picture ||
                          "https://avatar.iran.liara.run/public/41",
                      }}
                      style={{ height: 50, width: 50, borderRadius: 25 }}
                      resizeMode="cover"
                    />
                    <Text
                      style={{ fontFamily: "Inter_400Regular", fontSize: 16 }}
                    >
                      {item.fullName}{" "}
                      {item.liked_by === auth.currentUser?.uid && (
                        <Text style={{ fontWeight: "normal", color: "#888" }}>
                          (You)
                        </Text>
                      )}
                    </Text>
                  </TouchableOpacity>
                ))
              )
            ) : (
              <ActivityIndicator size="small" color="#48A6A7" />
            )}
          </BottomSheetScrollView>

          {/* Input for comments */}
          {props.type === "comments" && (
            <View
              style={{
                padding: 10,
                backgroundColor: "#F4F4F4",
                flexDirection: "row",
                alignItems: "center",
                borderTopColor: "#ddd",
                borderTopWidth: 1,
              }}
            >
              <TextInput
                value={comment}
                onChangeText={setComment}
                placeholder="Add a comment..."
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#fff",
                  borderRadius: 20,
                  borderColor: "#ddd",
                  borderWidth: 1,
                  fontFamily: "Inter_400Regular",
                }}
              />
              <TouchableOpacity
                onPress={sendComment}
                disabled={sending || !comment.trim()}
                style={{
                  marginLeft: 10,
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  backgroundColor:
                    sending || !comment.trim() ? "#ccc" : "#48A6A7",
                  borderRadius: 20,
                }}
              >
                {/* <Text style={{ color: "#fff", fontFamily: "Inter_500Medium" }}>
                  Send
                </Text> */}
                <Ionicons name="send-outline" color="#FFFFFF" size={20} />
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetView>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
});

export default BottomSheetComments;
