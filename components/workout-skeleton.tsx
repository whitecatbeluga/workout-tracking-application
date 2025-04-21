import { View, StyleSheet } from "react-native";

export const SkeletonLoader = () => {
  return (
    <View style={skeletonStyles.container}>
      <View style={skeletonStyles.avatar} />
      <View style={skeletonStyles.textContainer}>
        <View style={skeletonStyles.title} />
        <View style={skeletonStyles.subtitle} />
      </View>
    </View>
  );
};
const skeletonStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
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
