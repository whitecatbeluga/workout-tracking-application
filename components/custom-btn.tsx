import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";

type IconType =
  | keyof typeof Ionicons.glyphMap
  | keyof typeof AntDesign.glyphMap;

type CustomBtnProps = {
  onPress: () => void;
  buttonStyle?: ViewStyle;
  activeOpacity?: number;
  children: ReactNode;
};

type IconProps = {
  name: IconType;
  size?: number;
  color?: string;
  iconLibrary?: "Ionicons" | "AntDesign";
};

type BtnTitleProps = {
  textStyle?: TextStyle;
  title: string;
};

const CustomBtn = ({
  onPress,
  buttonStyle,
  activeOpacity = 0.8,
  children,
}: CustomBtnProps) => {
  return (
    <TouchableOpacity
      style={[styles.btn, buttonStyle]}
      onPress={onPress}
      activeOpacity={activeOpacity}
    >
      {children}
    </TouchableOpacity>
  );
};

const Icon = ({
  name,
  size = 27,
  color = "#FFFFFF",
  iconLibrary = "Ionicons",
}: IconProps) => {
  if (iconLibrary === "Ionicons") {
    return (
      <Ionicons
        name={name as keyof typeof Ionicons.glyphMap}
        size={size}
        color={color}
        style={styles.icon}
      />
    );
  } else if (iconLibrary === "AntDesign") {
    return (
      <AntDesign
        name={name as keyof typeof AntDesign.glyphMap}
        size={size}
        color={color}
        style={styles.icon}
      />
    );
  }
  return null;
};

const BtnTitle = ({ title, textStyle }: BtnTitleProps) => {
  return <Text style={[styles.txt, textStyle]}>{title}</Text>;
};

export { CustomBtn, Icon, BtnTitle };

const styles = StyleSheet.create({
  btn: {
    height: 48,
    backgroundColor: "#48A6A7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    color: "#FFFFFF",
    fontSize: 19,
    marginLeft: 10,
  },
  icon: {
    fontWeight: "bold",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
