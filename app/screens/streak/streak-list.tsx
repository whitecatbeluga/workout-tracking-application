import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { CalendarList } from "react-native-calendars";

import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { useAppSelector } from "@/hooks/use-app-selector";
import { auth } from "@/utils/firebase-config";

type MarkedDates = {
  date: string;
  img_url?: string | undefined;
};

const getWorkouts = async (user_id: string | undefined) => {
  try {
    const workoutsCollectionRef = collection(db, "workouts");
    const q = query(workoutsCollectionRef, where("user_id", "==", user_id));
    const workoutsSnapshot = await getDocs(q);

    const workouts = [];

    for (const workoutDoc of workoutsSnapshot.docs) {
      const workoutData = workoutDoc.data();
      const workoutId = workoutDoc.id;

      workouts.push({
        id: workoutId,
        ...workoutData,
      });
    }

    return workouts;
  } catch (error) {
    console.error("Error fetching workouts:", error);
  }
};

const StreakList = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [markedDates, setMarkedDates] = useState<Array<MarkedDates>>([]);
  const [monthsSinceRegistered, setMonthsSinceRegistered] = useState<number>(0);

  useEffect(() => {
    let current = new Date();
    const offset = current.getTimezoneOffset();
    current = new Date(current.getTime() - offset * 60 * 1000);
    setCurrentDate(current.toISOString().split("T")[0]);
    setMonthsSinceRegistered(1);

    const fetchWorkouts = async () => {
      try {
        const workouts: any = await getWorkouts(auth.currentUser?.uid);
        setMarkedDates(
          /*replace any later*/ workouts.map((workout: any) => {
            const date = workout?.created_at
              ?.toDate()
              .toISOString()
              .split("T")[0];
            const img_url = workout?.image_urls?.[0] ?? undefined;
            if (!date) return null;
            return { date, img_url };
          })
        );
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
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
