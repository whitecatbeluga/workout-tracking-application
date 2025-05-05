import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
  ScrollView,
} from "react-native";
import React, { useRef, useState } from "react";
import { useTabVisibility } from "@/app/(tabs)/_layout";
import { router } from "expo-router";

const routines = [
  {
    id: 1,
    name: "Push (Chest, Shoulders, Triceps)",
    image: require("../../../assets/images/push-day.jpg"),
    imageKey: "push",
  },
  {
    id: 2,
    name: "Pull (Back, Biceps)",
    image: require("../../../assets/images/Pull day.png"),
    imageKey: "pull",
  },
  {
    id: 3,
    name: "Legs (Quads, Hamstrings, Glutes)",
    image: require("../../../assets/images/leg-day.jpg"),
    imageKey: "legs",
  },
  {
    id: 4,
    name: "Core Focus",
    image: require("../../../assets/images/core-focus.jpg"),
    imageKey: "core",
  },
  {
    id: 5,
    name: "HIIT Session",
    image: require("../../../assets/images/hiit-session.webp"),
    imageKey: "hiit",
  },
  {
    id: 6,
    name: "Stretch & Recovery",
    image: require("../../../assets/images/stretch-recovery.webp"),
    imageKey: "stretch",
  },
];

const ExploreRoutines = () => {
  return (
    <View>
      <View style={{ paddingHorizontal: 40 }}>
        <View style={{ flexGrow: 1, paddingBottom: 80 }}>
          <FlatList
            data={routines}
            overScrollMode="never"
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.gridCard}
                onPress={() =>
                  router.push({
                    pathname: "/screens/home/routine-screen",
                    params: {
                      id: item.id,
                      name: item.name,
                      image: item.image,
                      imageKey: item.imageKey,
                    },
                  })
                }
              >
                <Image style={styles.gridCardImg} source={item.image} />
                <Text style={styles.cardTitleSmall}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default ExploreRoutines;

const styles = StyleSheet.create({
  seeAllText: {
    color: "#ACACAC",
    alignItems: "flex-end",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    elevation: 1,
  },
  gridCard: {
    flex: 1,
    alignItems: "center",
    gap: 50,
    marginVertical: 10,
    elevation: 1,
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
  scrollViewContainer: {
    paddingHorizontal: 15,
    gap: 15,
  },
  scrollView: {
    marginTop: 10,
  },
  gridCardImg: {
    width: 150,
    height: 150,
    borderRadius: 12,
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
});
