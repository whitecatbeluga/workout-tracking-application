import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface PostCardProps {
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
  profilePicture: any;
  postedPicture: any;
  likes: string;
  comments: string;
  liked: boolean;
  onLikePress?: () => void;
  onCheckLikes?: () => void;
  onCommentPress?: () => void;
}

const PostCard = ({
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
  profilePicture,
  postedPicture,
  likes,
  comments,
  liked,
  onLikePress,
  onCheckLikes,
  onCommentPress,
}: PostCardProps) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/screens/home/view-post",
            params: {
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
              profilePicture: profilePicture,
              postedPicture: postedPicture,
              sets: sets,
              records: records,
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
                  profilePicture: profilePicture,
                  postedPicture: postedPicture,
                  sets: sets,
                  records: records,
                  isLiked: liked.toString(),
                },
              })
            }
          >
            <Image style={styles.profileImage} source={profilePicture} />
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
        <View>
          <Image style={styles.postedPicture} source={postedPicture} />
        </View>
      </TouchableOpacity>

      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={onCheckLikes}>
          <Text style={styles.likesText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCommentPress}>
          <Text style={styles.likesText}>{comments}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.likeCommentShareContainer}>
        <TouchableOpacity onPress={onLikePress}>
          <Ionicons
            style={styles.icons}
            name={liked ? "thumbs-up-sharp" : "thumbs-up-outline"}
            size={24}
            color={liked ? "#48A6A7" : "#606060"}
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

export default PostCard;
