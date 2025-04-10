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
import React, { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTabVisibility } from "@/app/(tabs)/_layout";

type PostItem = {
  id: string;
  name: string;
  active: string;
  postTitle: string;
  description: string;
  profilePicture: any;
  time: string;
  volume: string;
  postedPicture: any;
  likes: string;
  comments: string;
};

const data: PostItem[] = [
  {
    id: "1",
    name: "mima79",
    active: "2 hours ago",
    postTitle: "Leg Day!",
    description: "No skip leg day",
    profilePicture: require("../../../assets/images/guy1.png"),
    time: "42 min",
    volume: "3,780 kg",
    postedPicture: require("../../../assets/images/legday.png"),
    likes: "20 Likes",
    comments: "0 comments",
  },
  {
    id: "2",
    name: "luffy",
    active: "5 hours ago",
    postTitle: "Push day!",
    description: "No pain no gain",
    profilePicture: require("../../../assets/images/guy1.png"),
    time: "30 min",
    volume: "4,780 kg",
    postedPicture: require("../../../assets/images/legday.png"),
    likes: "25 Likes",
    comments: "4 comments",
  },
];

const HomeScreen = () => {
  const [activeButton, setActiveButton] = useState<"following" | "discover">("discover");
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [seeAllButton, setSeeAllButton] = useState(false);

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

  return (
    <View>
      <TouchableOpacity
        onPress={() => setSeeAllButton(!seeAllButton)}
        style={{ alignItems: "flex-end", marginRight: 10, marginTop: 10 }}
      >
        <Text style={styles.seeAllText}>{seeAllButton ? "Back" : "See All"}</Text>
      </TouchableOpacity>

      <View style={seeAllButton ? { paddingHorizontal: 40 } : null}>
        {seeAllButton ? (
          // Vertical scroll grid view (2 columns)
          <View style={{ flexGrow: 1, paddingBottom: 80 }}>
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} // replace with real data
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
            style={[styles.followingButton, activeButton === "following" && styles.activeButton]}
            onPress={() => setActiveButton("following")}
          >
            <Text style={[styles.buttonText, activeButton === "following" && styles.activeText]}>
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.discoverButton, activeButton === "discover" && styles.activeButton]}
            onPress={() => setActiveButton("discover")}
          >
            <Text style={[styles.buttonText, activeButton === "discover" && styles.activeText]}>
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
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 6 }}>
                <View style={{ paddingHorizontal: 16 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                      style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                    >
                      <Image style={styles.profileImage} source={item.profilePicture} />
                      <View>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.active}>{item.active}</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: "row" }}>
                      <Ionicons name="add-outline" size={20} color="#48A6A7" />
                      <Text style={styles.followButton}>Follow</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.postTitle}>{item.postTitle}</Text>
                  <Text style={styles.postDescription}>{item.description}</Text>
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
                  <Image style={styles.postedPicture} source={item.postedPicture} />
                </View>

                <View style={styles.likesContainer}>
                  <Text style={styles.likesText}>{item.likes}</Text>
                  <Text style={styles.likesText}>{item.comments}</Text>
                </View>

                <View style={styles.likeCommentShareContainer}>
                  <TouchableOpacity onPress={() => toggleLike(item.id)}>
                    <Ionicons
                      style={styles.icons}
                      name={likedPosts[item.id] ? "thumbs-up-sharp" : "thumbs-up-outline"}
                      size={24}
                      color={likedPosts[item.id] ? "#48A6A7" : "#606060"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons
                      style={styles.icons}
                      name="chatbubble-outline"
                      size={24}
                      color="#606060"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons style={styles.icons} name="share-outline" size={24} color="#606060" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ) : null}
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
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  activeButton: {
    backgroundColor: "#48A6A7",
    elevation: 1,
  },
  activeText: {
    color: "#FFFFFF",
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
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
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
