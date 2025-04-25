import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import BarGraph from "./components/bar-graph";
import { useState } from "react";
import Styles from "./styles";

const graphDataMap: Record<string, any> = {
  Weight: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ data: [20, 45, 28] }],
    ySuffixLabel: " hrs",
  },
  Waist: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [{ data: [60, 70, 30] }],
    ySuffixLabel: "k kg",
  },
};

const tabLabels = Object.keys(graphDataMap);

const MeasuresScreen = () => {
  const [activeTab, setActiveTab] = useState("Weight");

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Progress Images
          </Text>
          <View
            style={{
              height: 150,
              width: 100,
              borderRadius: 10,
              borderColor: "#000000",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: "https://img.freepik.com/premium-photo/fit-body-strong-abs-belly-with-six-pack-ai-generated_1112329-50809.jpg",
              }}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>
          <View
            style={{
              height: 150,
              width: 100,
              borderRadius: 10,
              borderColor: "#000000",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: "https://img.freepik.com/premium-photo/fit-body-strong-abs-belly-with-six-pack-ai-generated_1112329-50809.jpg",
              }}
              style={{ width: "100%", height: "100%", resizeMode: "cover" }}
            />
          </View>
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Progress Bar
          </Text>
          {/* chart */}
          <BarGraph
            graphData={graphDataMap[activeTab]}
            ySuffixLabel={graphDataMap[activeTab].ySuffixLabel}
          />

          {/* filter graph buttons */}
          <View
            style={
              tabLabels.length === 2
                ? Styles.tabContainerTwoButtons
                : Styles.tabContainer
            }
          >
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
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Weight History
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 10,
              gap: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 16 }}>April 24</Text>
              <Text style={{ fontSize: 16 }}>36kg</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text style={{ fontSize: 16 }}>April 24</Text>
              <Text style={{ fontSize: 16 }}>36kg</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MeasuresScreen;
