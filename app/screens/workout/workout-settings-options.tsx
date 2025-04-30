import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";

const titleMap = {
  timerSound: "Select Timer Sound",
  timerVolume: "Timer Sound Volume",
  workoutValues: "Previous Workout Values",
};

const WorkoutSettingsOptions = () => {
  const { setting } = useLocalSearchParams();
  const navigation = useNavigation();

  type SettingKey = keyof typeof titleMap;

  const settingTitle =
    typeof setting === "string" && (setting as SettingKey) in titleMap
      ? titleMap[setting as SettingKey]
      : "Settings";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: settingTitle,
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontFamily: "Inter_400Regular",
        fontSize: 18,
      },
    });
  }, [navigation, settingTitle]);

  return (
    <View style={styles.container}>
      {setting === "timerSound" ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Default</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Alarm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Futuristic</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Ting Ting</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Boxing Bell</Text>
          </TouchableOpacity>
        </View>
      ) : setting === "timerVolume" ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Off</Text>
          </TouchableOpacity>
        </View>
      ) : setting === "workoutValues" ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Any Workout</Text>
            <Text style={styles.description}>
              Your previous exercise values will be fetched from the last time
              you did that exercise, regardless of routines.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Same Routine</Text>
            <Text style={styles.description}>
              Your previous exercise values will be fetched from the last time
              you did that exercise in the current routine you are performing.
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Normal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>Off</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WorkoutSettingsOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  button: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7D7D7",
    paddingVertical: 5,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 15,
  },
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#6A6A6A",
  },
});
