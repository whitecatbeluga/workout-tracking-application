import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PostCard from "./post-card";
import { useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComments from "./components/comments-bottom-sheet";

const ViewPostScreen = () => {
  const {
    name,
    fullName,
    email,
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

  const toString = (value: string | string[] | undefined): string =>
    typeof value === "string" ? value : value?.[0] || "";

  const [liked, setLiked] = useState(isLiked === "true");
  const [sheetType, setSheetType] = useState<"likes" | "comments">("comments");
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Handle open comments
  const handleOpenSheet = (type: "likes" | "comments") => {
    setSheetType(type);
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <PostCard
          name={toString(name)}
          fullName={toString(fullName)}
          email={toString(email)}
          date={toString(date)}
          postTitle={toString(postTitle)}
          description={toString(description)}
          time={toString(time)}
          volume={toString(volume)}
          sets={toString(sets)}
          records={toString(records)}
          profilePicture={profilePicture}
          postedPicture={postedPicture}
          likes={toString(likes)}
          comments={toString(comments)}
          liked={liked}
          onLikePress={() => setLiked(!liked)}
          onCheckLikes={() => handleOpenSheet("likes")}
          onCommentPress={() => handleOpenSheet("comments")}
        />
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={styles.workoutTitle}>Workout</Text>
          <Text style={styles.workoutName}>
            Standing Military Press (Barbell)
          </Text>
          <View style={styles.setWeightRepsContainer}>
            <Text style={styles.setText}>SET</Text>
            <Text style={styles.setText}>WEIGHT & REPS</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 42,
            paddingHorizontal: 20,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular" }}>1</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>
            20.41kg x 8 reps
          </Text>
        </View>
        <View style={{ backgroundColor: "#9ACBD0", paddingVertical: 8 }}>
          <View
            style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20 }}
          >
            <Text style={{ fontFamily: "Inter_400Regular" }}>2</Text>
            <Text style={{ fontFamily: "Inter_400Regular" }}>
              20.41kg x 8 reps
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 40,
            paddingHorizontal: 20,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular" }}>3</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>
            20.41kg x 8 reps
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#9ACBD0",
            paddingVertical: 8,
            marginBottom: 30,
          }}
        >
          <View
            style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20 }}
          >
            <Text style={{ fontFamily: "Inter_400Regular" }}>4</Text>
            <Text style={{ fontFamily: "Inter_400Regular" }}>
              20.41kg x 8 reps
            </Text>
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
        <View
          style={{
            flexDirection: "row",
            gap: 42,
            paddingHorizontal: 20,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular" }}>1</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>15 reps</Text>
        </View>
        <View style={{ backgroundColor: "#9ACBD0", paddingVertical: 8 }}>
          <View
            style={{ flexDirection: "row", gap: 40, paddingHorizontal: 20 }}
          >
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
      <BottomSheetComments
        title="sample"
        type={sheetType}
        ref={bottomSheetRef}
      />
    </View>
  );
};

export default ViewPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
