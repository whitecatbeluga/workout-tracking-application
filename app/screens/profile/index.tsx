import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

// imported components
import BarGraph from "./components/bar-graph";
import DrawerFilter from "./components/drawer-filter";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Duration");

  const graphDataMap: Record<string, any> = {
    Duration: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{ data: [20, 45, 28] }],
      ySuffixLabel: " hrs",
    },
    Volume: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{ data: [60, 70, 30] }],
      ySuffixLabel: "k kg",
    },
    Reps: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{ data: [50, 40, 90] }],
      ySuffixLabel: " reps",
    },
  };

  const tabLabels = Object.keys(graphDataMap);

  const profileInfo = [
    { label: "Workouts", count: 2 },
    { label: "Routines", count: 10 },
    { label: "Followers", count: 5 },
    { label: "Following", count: 5 },
  ];

  return (
    <View>
      {/* profile avatar and info */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: "https://avatar.iran.liara.run/public/41" }}
          style={styles.profileImage}
        />
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>John Doe</Text>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            {profileInfo.map((info, index) => (
              <View key={index} style={{ marginRight: 20 }}>
                <Text style={styles.profileInfo}>{info.label}</Text>
                <Text style={styles.profileInfoCount}>{info.count}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* drawer filter */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ marginVertical: 20 }}>
          <Text style={styles.profileName}>12 Hours</Text>
          <Text style={styles.profileInfo}>Last Week</Text>
        </View>
        <DrawerFilter />
      </View>

      {/* chart */}
      <BarGraph
        graphData={graphDataMap[activeTab]}
        ySuffixLabel={graphDataMap[activeTab].ySuffixLabel}
      />

      {/* buttons */}
      <View style={styles.tabContainer}>
        {tabLabels.map((label) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.tabButton,
              activeTab === label && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(label)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === label && styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileInfo: {
    fontSize: 12,
    color: "gray",
  },
  profileInfoCount: {
    fontSize: 14,
    color: "black",
  },

  // bar tabs
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#006A71",
  },
  tabText: {
    color: "#333",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ProfilePage;
