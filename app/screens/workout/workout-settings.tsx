import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";

const toggleKeys = [
  "keepAwake",
  "plateCalculator",
  "rpeTracking",
  "smartScrolling",
  "inlineTimer",
  "livePrNotification",
] as const;

const WorkoutSettings = () => {
  type ToggleKey = (typeof toggleKeys)[number];
  const router = useRouter();

  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    keepAwake: false,
    plateCalculator: false,
    rpeTracking: false,
    smartScrolling: false,
    inlineTimer: false,
    livePrNotification: false,
  });

  const toggleSwitch = (key: ToggleKey) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
        <TouchableOpacity
          style={styles.settingsContainer}
          onPress={() =>
            router.push({
              pathname: "/screens/workout/workout-settings-options",
              params: { setting: "timerSound" },
            })
          }
        >
          <Text style={styles.workoutTitle}>Timer Sound</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={styles.placeholder}>Default</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#6A6A6A"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsContainer}
          onPress={() =>
            router.push({
              pathname: "/screens/workout/workout-settings-options",
              params: { setting: "timerVolume" },
            })
          }
        >
          <Text style={styles.workoutTitle}>Timer Volume</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={styles.placeholder}>High</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#6A6A6A"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsContainer}>
          <Text style={styles.workoutTitle}>Default Rest Timer</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={styles.placeholder}>Off</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#6A6A6A"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsContainer}
          onPress={() =>
            router.push({
              pathname: "/screens/workout/workout-settings-options",
              params: { setting: "workoutValues" },
            })
          }
        >
          <Text style={styles.workoutTitle}>Previous Workout Values</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={styles.placeholder}>Default</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#6A6A6A"
            />
          </View>
        </TouchableOpacity>
        <View>
          <View style={styles.switch}>
            <Text style={styles.workoutTitle}>Keep Awake During Workout</Text>
            <Switch
              value={toggles.keepAwake}
              onValueChange={() => toggleSwitch("keepAwake")}
              trackColor={{ false: "#ccc", true: "#48A6A7" }}
              thumbColor={toggles.keepAwake ? "#fff" : "#fff"}
            />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}>
            Enable this if you don't want your phone to sleep while you're in a
            workout.
          </Text>
        </View>
        <View>
          <View style={styles.switch}>
            <Text style={styles.workoutTitle}>Plate Calculator</Text>
            <Switch
              value={toggles.plateCalculator}
              onValueChange={() => toggleSwitch("plateCalculator")}
              trackColor={{ false: "#ccc", true: "#48A6A7" }}
              thumbColor={toggles.plateCalculator ? "#fff" : "#fff"}
            />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}>
            A plate calculator calculates the plates needed on a bar to achieve
            a specific weight. When enabled, a Calculator button will appear
            when inputting weight for barbell exercises.
          </Text>
        </View>
        <View>
          <View style={styles.switch}>
            <Text style={styles.workoutTitle}>RPE Tracking</Text>
            <Switch
              value={toggles.rpeTracking}
              onValueChange={() => toggleSwitch("rpeTracking")}
              trackColor={{ false: "#ccc", true: "#48A6A7" }}
              thumbColor={toggles.rpeTracking ? "#fff" : "#fff"}
            />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}>
            RPE (Rated Perceived Exertion) is a measure of the intensity an
            exercise. Enabling RPE tracking will allow you to log it for each
            set in your workouts.
          </Text>
        </View>
        <View>
          <View style={styles.switch}>
            <Text style={styles.workoutTitle}>Smart Superset Scrolling</Text>
            <Switch
              value={toggles.smartScrolling}
              onValueChange={() => toggleSwitch("smartScrolling")}
              trackColor={{ false: "#ccc", true: "#48A6A7" }}
              thumbColor={toggles.smartScrolling ? "#fff" : "#fff"}
            />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}>
            When you complete a set, it'll automatically scroll to the next
            exercise in the superset.
          </Text>
        </View>
        <View>
          <View style={styles.switch}>
            <Text style={styles.workoutTitle}>Inline Timer</Text>
            <Switch
              value={toggles.inlineTimer}
              onValueChange={() => toggleSwitch("inlineTimer")}
              trackColor={{ false: "#ccc", true: "#48A6A7" }}
              thumbColor={toggles.inlineTimer ? "#fff" : "#fff"}
            />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}>
            Duration exercises have a built-in stopwatch for tracking time for
            each set.
          </Text>
        </View>
        <View>
          <View style={styles.switch}>
            <Text style={styles.workoutTitle}>
              Live Personal Record Notification
            </Text>
            <Switch
              value={toggles.livePrNotification}
              onValueChange={() => toggleSwitch("livePrNotification")}
              trackColor={{ false: "#ccc", true: "#48A6A7" }}
              thumbColor={toggles.livePrNotification ? "#fff" : "#fff"}
            />
          </View>
          <Text style={{ fontFamily: "Inter_400Regular", color: "#6A6A6A" }}>
            When enabled, it'll only notify you when you achieve a Personal
            Record upon checking the set.
          </Text>
        </View>
        <TouchableOpacity style={styles.settingsContainer} onPress={() =>
            router.push({
              pathname: "/screens/workout/workout-settings-options",
              params: { setting: "personalRecordVolume" },
            })
          }>
          <Text style={styles.workoutTitle}>Live Personal Record Volume</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={styles.placeholder}>High</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#6A6A6A"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default WorkoutSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 10,
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  workoutTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  placeholder: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#6A6A6A",
  },
  switch: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
