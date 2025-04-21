import React from "react";
import { View, StyleSheet, Animated } from "react-native";

const SkeletonLoader = () => {
  const pulseAnim = new Animated.Value(0.6);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: pulseAnim }]}>
      <View style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={styles.title} />
        <View style={styles.subtitle} />
      </View>
    </Animated.View>
  );
};

export default SkeletonLoader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E0E0",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    width: "80%",
    height: 16,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 8,
  },
  subtitle: {
    width: "60%",
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
});
