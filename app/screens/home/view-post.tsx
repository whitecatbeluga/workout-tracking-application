import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const ViewPostScreen = () => {
  const {
    name,
    postTitle,
    description,
    time,
    volume,
    likes,
    comments,
    date,
    sets,
    records,
    profilePicture,
    postedPicture,
    isLiked,
  } = useLocalSearchParams();

  const liked = isLiked === "true";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity style={styles.profilePicContainer}>
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
      <View style={styles.likesContainer}>
        <TouchableOpacity>
          <Text style={styles.likesText}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.likesText}>{comments}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <View style={styles.likeCommentShareContainer}>
          <TouchableOpacity>
            <Ionicons
              style={styles.icons}
              name={liked ? "thumbs-up-sharp" : "thumbs-up-outline"}
              size={24}
              color={liked ? "#48A6A7" : "#606060"}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons style={styles.icons} name="chatbubble-outline" size={24} color="#606060" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons style={styles.icons} name="share-outline" size={24} color="#606060" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.workoutTitle}>Workout</Text>
        <Text style={styles.workoutName}>Standing Military Press (Barbell)</Text>
        <View style={styles.setWeightRepsContainer}>
          <Text style={styles.setText}>SET</Text>
          <Text style={styles.setText}>WEIGHT & REPS</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 42, paddingHorizontal: 20, paddingVertical: 8 }}>
        <Text style={{ fontFamily: "Inter_400Regular" }}>1</Text>
        <Text style={{ fontFamily: "Inter_400Regular" }}>20.41kg x 8 reps</Text>
      </View>
      <View style={{ backgroundColor: "#9ACBD0", paddingVertical: 8 }}>
        <View style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20 }}>
          <Text style={{ fontFamily: "Inter_400Regular" }}>2</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>20.41kg x 8 reps</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20, paddingVertical: 8 }}>
        <Text style={{ fontFamily: "Inter_400Regular" }}>3</Text>
        <Text style={{ fontFamily: "Inter_400Regular" }}>20.41kg x 8 reps</Text>
      </View>
      <View style={{ backgroundColor: "#9ACBD0", paddingVertical: 8, marginBottom: 30 }}>
        <View style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20 }}>
          <Text style={{ fontFamily: "Inter_400Regular" }}>4</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>20.41kg x 8 reps</Text>
        </View>
      </View>

      {/* Second workout */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.workoutName}>Knee Raise Parallel Bars</Text>
        <View style={styles.setWeightRepsContainer}>
          <Text style={styles.setText}>SET</Text>
          <Text style={styles.setText}>WEIGHT & REPS</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 42, paddingHorizontal: 20, paddingVertical: 8 }}>
        <Text style={{ fontFamily: "Inter_400Regular" }}>1</Text>
        <Text style={{ fontFamily: "Inter_400Regular" }}>15 reps</Text>
      </View>
      <View style={{ backgroundColor: "#9ACBD0", paddingVertical: 8 }}>
        <View style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20 }}>
          <Text style={{ fontFamily: "Inter_400Regular" }}>2</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>15 reps</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 40,
          paddingHorizontal: 20,
          paddingVertical: 8,
          marginBottom: 30,
        }}
      >
        <Text style={{ fontFamily: "Inter_400Regular" }}>3</Text>
        <Text style={{ fontFamily: "Inter_400Regular" }}>15 reps</Text>
      </View>
    </ScrollView>
  );
};

export default ViewPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
  profilePicContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
  workoutTitle: {
    fontFamily: "Inter_400Regular",
    marginBottom: 6,
    fontSize: 14,
  },
  workoutName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#48A6A7",
  },
  setWeightRepsContainer: {
    flexDirection: "row",
    gap: 30,
    marginVertical: 10,
  },
  setText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
