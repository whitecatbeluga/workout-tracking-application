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
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "@/utils/firebase-config";
import { useRouter } from "expo-router";

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
  // snap points
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);
  const router = useRouter();

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        const subcollectionName = type === "likes" ? "likes" : "comments";
        const subCollectionRef = collection(
          db,
          "workouts",
          postId,
          subcollectionName
        );
        const snapshot = await getDocs(subCollectionRef);

        const itemsWithUserData = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const itemData = docSnap.data();
            const userId = itemData.liked_by;

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
              ...itemData,
              fullName,
              profile_picture,
              email,
              username,
            };
          })
        );
        setData(itemsWithUserData);
      } catch (error) {
        console.error(`Error fetching ${type}: `, error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [postId, type]);

  // renders
  return (
    <BottomSheet
      ref={ref}
      index={-1} // default hidden
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
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
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          flex: 1,
          backgroundColor: "#F4F4F4",
        }}
      >
        <View>
          {props.type === "comments" ? (
            <View>
              <Text>Comments here</Text>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  fontFamily: "Inter_500Medium",
                  fontSize: 18,
                  marginBottom: 10,
                }}
              >
                People who liked
              </Text>
              {!loading ? (
                data.length === 0 ? (
                  <View
                    style={{
                      height: "80%",
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
                        style={{
                          zIndex: 5,
                          height: 50,
                          width: 50,
                          borderRadius: 25,
                        }}
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
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetComments;
