import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";

// imported components
import BarGraph from "./components/bar-graph";
import BottomSheetFilter from "./components/drawer-filter";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageView from "react-native-image-viewing";

import Styles from "@/app/screens/profile/styles";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Duration");

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const [visible, setIsVisible] = useState(false);

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
    <View style={{ padding: 20, flex: 1 }}>
      {/* profile avatar and info */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Image
            source={{ uri: "https://avatar.iran.liara.run/public/41" }}
            style={Styles.profileImage}
          />
        </TouchableOpacity>
        <ImageView
          images={[{ uri: "https://avatar.iran.liara.run/public/41" }]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
          onLongPress={() => setIsVisible(false)}
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled={true}
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
        <View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>John Doe</Text>
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            {profileInfo.map((info, index) => (
              <View key={index} style={{ marginRight: 20 }}>
                <Text style={Styles.profileInfo}>{info.label}</Text>
                <Text style={Styles.profileInfoCount}>{info.count}</Text>
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
          <Text style={Styles.profileName}>12 Hours</Text>
          <Text style={Styles.profileInfo}>Last Week</Text>
        </View>
        <TouchableOpacity
          style={Styles.drawerButton}
          onPress={handleOpenBottomSheet}
        >
          <Text
            style={{
              color: "#006A71",
            }}
          >
            Last 3 Months
          </Text>
          <AntDesign name="circledowno" size={18} color="#006A71" />
        </TouchableOpacity>
      </View>

      {/* chart */}
      <BarGraph
        graphData={graphDataMap[activeTab]}
        ySuffixLabel={graphDataMap[activeTab].ySuffixLabel}
      />

      {/* buttons */}
      <View style={Styles.tabContainer}>
        {tabLabels.map((label) => (
          <TouchableOpacity
            key={label}
            style={[
              Styles.tabButton,
              activeTab === label && Styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab(label)}
          >
            <Text
              style={[
                Styles.tabText,
                activeTab === label && Styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <BottomSheetFilter title="Sample" ref={bottomSheetRef} />
    </View>
  );
};

export default ProfilePage;
