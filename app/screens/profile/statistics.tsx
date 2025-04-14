import { Ionicons } from "@expo/vector-icons";
import React, { Text, View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import WorkoutCard from "./components/workout-card";
import ProgressRing from "./components/progress-ring";

type HeaderProps = {
  title: string;
  isFilter: boolean;
};

const Header = ({ title, isFilter }: HeaderProps) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{title}</Text>
        {isFilter && (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 16, color: "#006A71" }}
            >
              Filter
            </Text>
            <Ionicons name="chevron-down" size={20} color="#006A71" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const StatisticsScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* workout frequency cards*/}
        <Header title="Workout Frequency" isFilter={true} />
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginVertical: 10,
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            {workoutFrequencyCards.map((card, index) => (
              <WorkoutCard key={index} card={card} />
            ))}
          </View>
        </View>

        {/* workout summary card */}
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                alignItems: "flex-start",
                backgroundColor: "white",
                borderRadius: 8,
                width: "100%",

                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#626262" }}
              >
                Workout Summary
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <ProgressRing graphData={data} ySuffixLabel="" />
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "baseline",
                    gap: 5,
                    marginVertical: 10,
                  }}
                >
                  {workoutSummaryDetails.map((detail, index) => (
                    <View
                      key={index}
                      style={{
                        gap: 5,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="ellipse"
                        size={16}
                        color={detail.ellipse_color}
                      />

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#626262",
                        }}
                      >
                        {detail.label}:
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#323232",
                        }}
                      >
                        {typeof detail.count === "object"
                          ? `${detail.count.hours} ${
                              typeof detail.unit === "object"
                                ? detail.unit.hours
                                : ""
                            } ${detail.count.min} ${
                              typeof detail.unit === "object"
                                ? detail.unit.min
                                : ""
                            }`
                          : `${detail.count} ${detail.unit}`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Volume over time cards*/}
        <Header title="Volume over time" isFilter={false} />

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            {volumeOverTimeCards.map((card, index) => (
              <WorkoutCard key={index} card={card} />
            ))}
          </View>
        </View>

        {/* Routine usage table*/}
        <Header title="Routine usage stats" isFilter={false} />

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                alignItems: "flex-start",
                backgroundColor: "white",
                borderRadius: 8,
                width: "100%",

                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#626262" }}
              >
                Most Used Routines
              </Text>

              <View style={{ marginTop: 10, width: "100%" }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#606060",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>Routine Name</Text>
                  <Text style={{ fontWeight: "bold" }}>Time Used</Text>
                  <Text style={{ fontWeight: "bold" }}>Last Used</Text>
                </View>
                <View>
                  {routineUsageData.map((routine, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: "#323232",
                        }}
                      >
                        {routine.name}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          gap: 10,
                          width: "55%",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "400",
                            color: "#626262",
                          }}
                        >
                          {routine.total_uses}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "400",
                            color: "#626262",
                          }}
                        >
                          {new Date(routine.last_used).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StatisticsScreen;

const workoutFrequencyCards = [
  { count: 20, label: "This week", recentCount: 5, unit: "exercises" },
  { count: 45, label: "This week", recentCount: 10, unit: "workouts" },
];

const volumeOverTimeCards = [
  { count: 69, label: "Total Reps", recentCount: 5, unit: "reps", length: 3 },
  { count: 79, label: "Weight Lifted", recentCount: 2, unit: "kg", length: 3 },
  { count: 35, label: "Total Sets", recentCount: 23, unit: "sets", length: 3 },
];

const workoutSummaryDetails = [
  {
    count: 4,
    label: "Total Workouts",
    unit: "workouts",
    ellipse_color: "#006A71",
  },
  {
    count: { hours: 6, min: 24 },
    label: "Total Duration",
    unit: { hours: "hr", min: "min" },
    ellipse_color: "#449196",
  },
  {
    count: 59,
    label: "Total Volume",
    unit: "kg",
    ellipse_color: "#66A5A9",
  },
];

const data = {
  labels: ["Swim", "Bike", "Run"], // optional

  datasets: [{ data: [0.4, 0.6, 0.8] }],
  ySuffixLabel: "",
};

const routineUsageData = [
  { name: "Push Day", total_uses: 19, last_used: "2023-10-01" },
  { name: "Pull Day", total_uses: 15, last_used: "2023-10-01" },
  { name: "Legs & Core", total_uses: 6, last_used: "2023-10-01" },
  { name: "Mobility Flow", total_uses: 2, last_used: "2023-10-01" },
];
