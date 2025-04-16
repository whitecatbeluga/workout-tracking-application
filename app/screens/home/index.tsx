import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { refreshToken } from "@/redux/auth-slice";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComments from "./components/comments-bottom-sheet";

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

const data: PostItem[] = [
  {
    id: "1",
    name: "mima79",
    fullName: "John Smith Doe",
    email: "mima@gmail.com",
    active: "2 hours ago",
    postTitle: "Leg Day!",
    description: "No skip leg day",
    profilePicture: require("../../../assets/images/guy1.png"),
    time: "42 min",
    volume: "3,780 kg",
    postedPicture: require("../../../assets/images/legday.png"),
    likes: "20 Likes",
    comments: "0 comments",
    date: "Tuesday, April 1, 2025 - 9:55am",
    sets: "2",
    records: "1",
  },
  {
    id: "2",
    name: "luffy",
    fullName: "Monkey D. Luffy",
    email: "luffykaizoku@gmail.com",
    active: "5 hours ago",
    postTitle: "Push day!",
    description: "No pain no gain",
    profilePicture: require("../../../assets/images/Pull day.png"),
    time: "30 min",
    volume: "4,780 kg",
    postedPicture: require("../../../assets/images/legday.png"),
    likes: "25 Likes",
    comments: "4 comments",
    date: "Wednesday, April 2, 2025 - 11:55am",
    sets: "4",
    records: "2",
  },
];

const HomeScreen = () => {
  const appDispatch = useAppDispatch();

  const [activeButton, setActiveButton] = useState<"following" | "discover">(
    "discover"
  );
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [seeAllButton, setSeeAllButton] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      const isLoggedIn = AsyncStorage.getItem("loggedIn");
      if (await isLoggedIn) {
        await appDispatch(refreshToken());
      }
    };
    void verifyRefreshToken();
  }, []);

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
  const handleOpenComments = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setSeeAllButton(!seeAllButton)}
        style={{ alignItems: "flex-end", marginRight: 10, marginTop: 10 }}
      >
        <Text style={styles.seeAllText}>
          {seeAllButton ? "Back" : "See All"}
        </Text>
      </TouchableOpacity>

      <View style={seeAllButton ? { paddingHorizontal: 40 } : null}>
        {seeAllButton ? (
          // Vertical scroll grid view (2 columns)
          <View style={{ flexGrow: 1, paddingBottom: 80 }}>
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // replace with real data
              overScrollMode="never"
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              onScroll={onScroll}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.gridCard}>
                  <Image
                    style={styles.gridCardImg}
                    source={require("../../../assets/images/Pull day.png")}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          // Horizontal scroll view
          <ScrollView
            horizontal
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContainer}
            showsHorizontalScrollIndicator={false}
            overScrollMode="never"
          >
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <TouchableOpacity key={index} style={styles.card}>
                <Image
                  style={styles.cardImg}
                  source={require("../../../assets/images/Pull day.png")}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {!seeAllButton ? (
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
      ) : null}

      {!seeAllButton ? (
        <View style={{ flexGrow: 1, paddingBottom: 485, paddingTop: 16 }}>
          <FlatList
            data={data}
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
                        name: item.name,
                        fullName: item.fullName,
                        email: item.email,
                        postTitle: item.postTitle,
                        description: item.description,
                        time: item.time,
                        volume: item.volume,
                        likes: item.likes,
                        comments: item.comments,
                        date: item.date,
                        profilePicture: item.profilePicture,
                        postedPicture: item.postedPicture,
                        sets: item.sets,
                        records: item.records,
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
                              name: item.name,
                              postTitle: item.postTitle,
                              description: item.description,
                              time: item.time,
                              volume: item.volume,
                              likes: item.likes,
                              comments: item.comments,
                              date: item.date,
                              profilePicture: item.profilePicture,
                              postedPicture: item.postedPicture,
                              sets: item.sets,
                              records: item.records,
                              fullName: item.fullName,
                              email: item.email,
                              isLiked: likedPosts[item.id] ? "true" : "false",
                            },
                          })
                        }
                      >
                        <Image
                          style={styles.profileImage}
                          source={item.profilePicture}
                        />
                        <View>
                          <Text style={styles.name}>{item.name}</Text>
                          <Text style={styles.active}>{item.active}</Text>
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
                    <Text style={styles.postTitle}>{item.postTitle}</Text>
                    <Text style={styles.postDescription}>
                      {item.description}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 40 }}>
                      <View>
                        <Text style={styles.timevolume}>Time</Text>
                        <Text style={styles.itemTimeVolume}>{item.time}</Text>
                      </View>
                      <View>
                        <Text style={styles.timevolume}>Volume</Text>
                        <Text style={styles.itemTimeVolume}>{item.volume}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      style={styles.postedPicture}
                      source={item.postedPicture}
                    />
                  </View>
                </TouchableOpacity>

                <View style={styles.likesContainer}>
                  <TouchableOpacity>
                    <Text style={styles.likesText}>{item.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleOpenComments}>
                    <Text style={styles.likesText}>{item.comments}</Text>
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
                  <TouchableOpacity onPress={handleOpenComments}>
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
        </View>
      ) : null}
      <BottomSheetComments title="sample" ref={bottomSheetRef} />
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
  gridCard: {
    flex: 1,
    alignItems: "center",
    gap: 50,
    marginVertical: 10,
  },
  gridCardImg: {
    width: 140,
    height: 140,
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
    width: "100%",
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
