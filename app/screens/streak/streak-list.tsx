import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { CalendarList } from "react-native-calendars";

const StreakList = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [monthsSinceRegistered, setMonthsSinceRegistered] = useState(0);

  const markedDates = [
    { date: "2025-03-01", img: undefined },
    { date: "2025-03-03", img: require("../../../assets/images/Pull day.png") },
    { date: "2025-03-05", img: require("../../../assets/images/push-day.jpg") },
    { date: "2025-03-07", img: undefined },
    { date: "2025-03-10", img: require("../../../assets/images/guy1.png") },
    { date: "2025-03-12", img: undefined },
    { date: "2025-03-14", img: undefined },
    { date: "2025-03-19", img: undefined },
    {
      date: "2025-03-21",
      img: require("../../../assets/images/core-focus.jpg"),
    },
    { date: "2025-03-24", img: undefined },
    {
      date: "2025-03-26",
      img: require("../../../assets/images/stretch-recovery.webp"),
    },
    { date: "2025-03-28", img: undefined },
    {
      date: "2025-03-31",
      img: require("../../../assets/images/hiit-session.webp"),
    },
    { date: "2025-04-01", img: require("../../../assets/images/leg-day.jpg") },
    { date: "2025-04-02", img: undefined },
    { date: "2025-04-04", img: require("../../../assets/images/legday.png") },
    { date: "2025-04-07", img: undefined },
    { date: "2025-03-09", img: undefined },
  ];

  useEffect(() => {
    let current = new Date();
    const offset = current.getTimezoneOffset();
    current = new Date(current.getTime() - offset * 60 * 1000);
    setCurrentDate(current.toISOString().split("T")[0]);
    setMonthsSinceRegistered(1);
  }, []);

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
                        id: data[1].id,
                        name: data[1].name,
                        fullName: data[1].fullName,
                        email: data[1].email,
                        postTitle: data[1].postTitle,
                        description: data[1].description,
                        time: data[1].time,
                        volume: data[1].volume,
                        likes: data[1].likes,
                        comments: data[1].comments,
                        date: data[1].date,
                        profilePicture: data[1].profilePicture,
                        postedPicture: data[1].postedPicture,
                        sets: data[1].sets,
                        records: data[1].records,
                        isLiked: "false",
                      },
                    })
                  }
                >
                  {matchedDate.img ? (
                    <View style={styles.streakImageContainer}>
                      <Text style={styles.streakImageText}>{date?.day}</Text>
                      <Image
                        source={matchedDate.img}
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
  },
  currentDayText: {
    color: "#48A6A7",
    fontSize: 18,
  },
  currentDayDot: {
    height: 30,
    width: 30,
    borderRadius: 18,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  dayTextStreak: {
    color: "#FFFFFF",
    fontSize: 18,
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
  },
  streakImageText: {
    position: "absolute",
    color: "#FFFFFF",
    fontSize: 18,
    zIndex: 1,
    opacity: 0.8,
  },
});

type PostItem = {
  id: string;
  name: string;
  fullName: string;
  email: string;
  active: string;
  postTitle: string;
  description: string;
  profilePicture: any;
  time: string;
  volume: string;
  postedPicture: any;
  likes: string;
  comments: string;
  date: string;
  sets: string;
  records: string;
};

const data: PostItem[] = [
  {
    id: "1",
    name: "mima79",
    fullName: "John Smith Doe",
    email: "mima@gmail.com",
    active: "2 hours ago",
    postTitle: "Leg Day!",
    description: "No skip leg day",
    profilePicture: require("../../../assets/images/guy1.png"),
    time: "42 min",
    volume: "3,780 kg",
    postedPicture: require("../../../assets/images/legday.png"),
    likes: "20 Likes",
    comments: "0 comments",
    date: "Tuesday, April 1, 2025 - 9:55am",
    sets: "2",
    records: "1",
  },
  {
    id: "2",
    name: "luffy",
    fullName: "Monkey D. Luffy",
    email: "luffykaizoku@gmail.com",
    active: "5 hours ago",
    postTitle: "Push day!",
    description: "No pain no gain",
    profilePicture: require("../../../assets/images/Pull day.png"),
    time: "30 min",
    volume: "4,780 kg",
    postedPicture: require("../../../assets/images/legday.png"),
    likes: "25 Likes",
    comments: "4 comments",
    date: "Wednesday, April 2, 2025 - 11:55am",
    sets: "4",
    records: "2",
  },
];
