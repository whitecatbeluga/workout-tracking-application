import { View, Text, StyleSheet, ViewStyle } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons"; // or any icon library you prefer
import { BtnTitle, CustomBtn, Icon } from "./custom-btn";

type RoutineCardProps = {
  title: string;
  style?: ViewStyle;
};

const addExerciseHandler = () => {
  console.log("added");
};

const RoutineCard = ({ title, style }: RoutineCardProps) => {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Entypo name="dots-three-vertical" size={18} color="#000" />
      </View>
      {/* You can add more card content here if needed */}
      <View style={styles.addExerciseBtn}>
        <CustomBtn onPress={addExerciseHandler} buttonStyle={styles.dottedBtn}>
          <Icon name="plus" iconLibrary="AntDesign" color="black" size={24}/>
          <BtnTitle
            title="Start new routine"
            textStyle={{ fontSize: 14, color: "black" }}
          />
        </CustomBtn>
      </View>
    </View>
  );
};

export default RoutineCard;

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    height: 120,
    backgroundColor: "#FFFFFF",
    padding: 16,
    width: "90%",
    justifyContent: "flex-start",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 13,
    fontWeight: "semibold",
  },
  addExerciseBtn: {
    marginTop: 27,
    justifyContent: "center",
    alignItems: "center",
  },
  dottedBtn: {
    width: "50%",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "black",
    borderStyle: "dotted",
    paddingVertical: 10,
    backgroundColor: "transparent",
  },
});
