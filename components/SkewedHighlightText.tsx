import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const SkewedHighlightText = ({
  word,
  inheritStyles,
  color,
}: {
  word: string;
  inheritStyles?: any;
  color?: string;
}) => {
  return (
    <View style={styles.highlightWrapper}>
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 100 40"
        style={StyleSheet.absoluteFill}
        preserveAspectRatio="none"
      >
        <Polygon points="0,10 100,0 100,30 0,40" fill={color} />
      </Svg>
      <Text style={inheritStyles}>{word}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 22,
    fontFamily: "Inter_500Bold",
    fontWeight: "500",
    lineHeight: 32,
    flexWrap: "wrap",
  },
  highlightWrapper: {
    paddingVertical: 2,
    alignSelf: "flex-start",
    position: "relative",
  },
});

export default SkewedHighlightText;
