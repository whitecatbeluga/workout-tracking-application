import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { BarChart } from "react-native-chart-kit";
import PostCard from "./post-card";
import { useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComments from "./components/comments-bottom-sheet";

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
  const [following, setFollowing] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Handle open comments
  const handleOpenComments = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Image style={styles.profilePicture} source={profilePicture} />
            <View>
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fcount}>123</Text>
            <Text style={styles.ftext}>Followers</Text>
          </View>
          <View>
            <Text style={styles.fcount}>52</Text>
            <Text style={styles.ftext}>Following</Text>
          </View>
        </View>
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 14 }}
        >
          <View style={styles.totalContainer}>
            <Text style={styles.totalTitle}>Total Exercises</Text>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
            >
              <Text style={styles.totalCount}>14</Text>
              <Text style={styles.totalName}>Exercises</Text>
            </View>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalTitle}>Total Exercises</Text>
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "flex-end" }}
            >
              <Text style={styles.totalCount}>12</Text>
              <Text style={styles.totalName}>Workouts</Text>
            </View>
          </View>
        </View>
        <View style={styles.followButtonContainer}>
          <TouchableOpacity
            style={!following ? styles.followButton : styles.followingButton}
            onPress={() => setFollowing(!following)}
          >
            <Text style={!following ? styles.followText : styles.followingText}>
              {!following ? "Follow" : "Following"}
            </Text>
          </TouchableOpacity>
        </View>
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
          <PostCard
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
            profilePicture={profilePicture}
            postedPicture={postedPicture}
            likes={toString(likes)}
            comments={toString(comments)}
            liked={liked}
            onLikePress={() => setLiked(!liked)}
            onCommentPress={handleOpenComments}
          />
        </View>
      </ScrollView>
      <BottomSheetComments title="sample" ref={bottomSheetRef} />
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
