import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Polygon } from "react-native-svg";

export const SkewShapes: Record<string, string> = {
  leftSkew: "0,10 100,0 100,30 0,40",
  rightSkew: "0,0 100,10 100,40 0,30",
  flat: "0,0 100,0 100,40 0,40",
  zigzagTop: "0,0 50,10 100,0 100,40 0,40",
  triangleLeft: "0,0 100,40 0,40",
  triangleRight: "100,0 100,40 0,40",
  steepLeft: "0,5 100,0 100,35 0,40",
  steepRight: "0,0 100,5 100,40 0,35",
  arrow: "0,0 70,0 100,20 70,40 0,40",
  slantedBox: "0,10 100,0 100,30 0,40",
};

const SkewedHighlightText = ({
  word,
  inheritStyles,
  color,
  direction = "leftSkew",
}: {
  word: string;
  inheritStyles?: any;
  color?: string;
  direction?: string;
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
        <Polygon points={SkewShapes[direction]} fill={color} />
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
