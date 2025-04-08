import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useRef } from "react";
import WorkoutHeader from "./workout-header";
import { AntDesign } from "@expo/vector-icons";
import { BtnTitle, CustomBtn, Icon } from "@/components/custom-btn";
import SearchInput from "@/components/search-input";
import RoutineCard from "@/components/routine-card";
import { useTabVisibility } from "@/app/(tabs)/_layout";

const WorkoutPage = () => {
  const offset = useRef(0);
  const { setTabVisible } = useTabVisibility();
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > offset.current ? "down" : "up";

    if (Math.abs(currentOffset - offset.current) > 10) {
      setTabVisible(direction !== "down");
    }

    offset.current = currentOffset;
  };

  const handlePress = () => {
    console.log("btn press");
  };
  const handleSearchChange = () => {
    console.log("search input change");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WorkoutHeader />

        <View style={styles.routine}>
          <Text style={styles.routineTxt}>Routines</Text>
          <AntDesign name="addfolder" size={30} color="#48A6A7" />
        </View>

        <View style={styles.newRoutineSearch}>
          <CustomBtn onPress={handlePress} buttonStyle={{ width: "46%", borderRadius: 10 }}>
            <Icon name="profile" iconLibrary="AntDesign" />
            <BtnTitle title="New Routine" textStyle={{ fontSize: 15 }} />
          </CustomBtn>

          <SearchInput
            placeholder="Explore"
            value=""
            onChangeText={handleSearchChange}
            containerStyle={{ width: "46%" }}
          />
        </View>

        {/* Repeat or map over RoutineCard as needed */}
        <View
          style={{
            gap: 5,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
          <RoutineCard title={"New Routine"} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 20,
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
    marginTop: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
