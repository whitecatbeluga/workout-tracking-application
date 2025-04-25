import { View, Text, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import TabBarButton from "./tab-bar-button";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  let labelContent;

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        if (typeof label === "function") {
          labelContent = label({
            focused: isFocused,
            color: isFocused ? "#673ab7" : "#222",
            position: "below-icon",
            children: "",
          });
        } else {
          labelContent = (
            <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
              {label}
            </Text>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            // style={styles.tabBarItem}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? "#673ab7" : "#222"}
            label={labelContent}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#48A6A7",
    borderWidth: 1.5,
    marginHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 35,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});
