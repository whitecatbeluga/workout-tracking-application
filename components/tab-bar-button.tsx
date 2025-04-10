import { Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { icon } from "@/constants/nav-bar-icon";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type TabBarButtonProps = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  routeName: string;
  color: string;
  label: string | React.ReactNode;
};

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  routeName,
  color,
  label,
}: TabBarButtonProps) => {
  const iconName = routeName as keyof typeof icon;
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused, {
      duration: 350,
    });
  }, [scale, isFocused]);

  const animateIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [{ scale: scaleValue }],
      top,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={styles.tabBarItem}>
      <Animated.View style={animateIconStyle}>
        {icon[iconName](isFocused, { color: isFocused ? "#48A6A7" : "#222" })}
      </Animated.View>
      <Animated.Text style={[{ color: isFocused ? "#48A6A7" : "#222" }, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
