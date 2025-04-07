import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import React from "react";
import WorkoutHeader from "./workout-header";
import { AntDesign } from "@expo/vector-icons";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import SearchInput from "@/components/search-input";

const WorkoutPage = () => {
  const handlePress = () => {
    console.log("btn press");
  };
  const handleSearchChange = () => {
    console.log("search input change");
  };

  return (
    <SafeAreaView style={styles.container}>
      <WorkoutHeader />
      <View style={styles.routine}>
        <Text style={styles.routineTxt}>Routines</Text>
        <AntDesign name="addfolder" size={30} color="#48A6A7" />
      </View>
      <View style={styles.newRoutineSearch}>
        <CustomBtn
          onPress={() => console.log("Button Pressed")}
          buttonStyle={{ width: "46%", borderRadius: 10 }}
        >
          <Icon name="profile" iconLibrary="AntDesign" />
          <BtnTitle title="New Routine" />
        </CustomBtn>
        <SearchInput
          placeholder="Search..."
          value=""
          onChangeText={() => handleSearchChange}
          containerStyle={{ width: "46%" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default WorkoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  routine: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 30,
    alignItems: "center",
  },
  routineTxt: {
    fontWeight: "bold",
    fontSize: 15,
  },
  newRoutineSearch: {
    marginTop: 30,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
