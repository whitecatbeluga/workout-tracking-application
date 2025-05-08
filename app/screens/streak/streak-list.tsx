import { useRegistrationInfo } from "@/hooks/useRegistrationInfo";
import { fetchMarkedDates } from "@/redux/slices/calendar-slice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { CalendarList } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";

const StreakList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { monthsSinceRegistered } = useRegistrationInfo();

  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const current = new Date().toISOString().split("T")[0];
    setCurrentDate(current);
  }, []);

  useEffect(() => {
    dispatch(fetchMarkedDates());
  }, [dispatch]);

  const markedDates = useSelector(
    (state: RootState) => state.calendar.markedDates
  );

  return (
    <View style={styles.container}>
      <CalendarList
        theme={{
          backgroundColor: "#F2F2F2",
          calendarBackground: "#F2F2F2",
        }}
        calendarStyle={styles.calendarContainer}
        current={currentDate}
        pastScrollRange={monthsSinceRegistered}
        futureScrollRange={0}
        dayComponent={({ date }) => {
          const dateString = date?.dateString;
          const matchedDate = markedDates.find(
            (mark) => mark.date === (dateString ?? "")
          );
          return (
            <View style={styles.dayContainer}>
              {matchedDate ? (
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/screens/home/view-post",
                      params: {
                        post_id: matchedDate.id,
                        name: matchedDate.username,
                        fullName: matchedDate.full_name,
                        email: matchedDate.email,
                        postTitle: matchedDate.title,
                        description: matchedDate.description,
                        time: matchedDate.duration,
                        volume: matchedDate.total_volume,
                        likes: matchedDate.like_count,
                        comments: matchedDate.comment_count,
                        date: matchedDate.created_at,
                        user_id: matchedDate.user_id,
                        sets: matchedDate.total_sets,
                        image_urls: matchedDate.image_urls,
                        // records: matchedDate.records,
                        isLiked: "false",
                      },
                    })
                  }
                >
                  {matchedDate.img_url ? (
                    <View style={styles.streakImageContainer}>
                      <Text style={styles.streakImageText}>{date?.day}</Text>
                      <Image
                        source={{ uri: matchedDate.img_url }}
                        style={styles.streakIcon}
                      />
                    </View>
                  ) : (
                    <View style={styles.streakCircle}>
                      <Text style={styles.dayTextStreak}>{date?.day}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ) : dateString === currentDate ? (
                <Text style={styles.currentDayText}>{date?.day}</Text>
              ) : (
                <Text style={styles.dayText}>{date?.day}</Text>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

export default StreakList;

const styles = StyleSheet.create({
  container: {
    flex: 10,
    paddingBottom: 50,
    backgroundColor: "#F2F2F2",
  },
  calendarContainer: {
    backgroundColor: "#F2F2F2",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  dayText: {
    fontSize: 18,
    color: "#777777",
  },
  currentDayText: {
    color: "#48A6A7",
    fontSize: 18,
    fontWeight: "bold",
  },
  dayTextStreak: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  streakCircle: {
    height: 50,
    width: 50,
    borderRadius: 15,
    backgroundColor: "#DC723D",
    justifyContent: "center",
    alignItems: "center",
  },
  streakImageContainer: {
    position: "relative",
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  streakIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#000000",
    opacity: 0.9,
  },
  streakImageText: {
    position: "absolute",
    color: "#FFFFFF",
    fontSize: 18,
    zIndex: 1,
    fontWeight: "bold",
  },
});
