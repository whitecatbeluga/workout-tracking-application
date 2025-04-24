import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { CalendarList } from "react-native-calendars";
const StreakList = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [monthsSinceRegistered, setMonthsSinceRegistered] = useState(0);

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
        markingType="custom"
        markedDates={{
          [currentDate]: {
            marked: true,
            dotColor: "#dc713d",
            // dotColor: 'white',
            // selected: true,
            // selectedColor: "#dc713d",
            customStyles: {
              text: {
                color: "#dc713d",
              },
            },
          },
          "2025-03-01": { selected: true, selectedColor: "#dc713d" },
          "2025-03-03": { selected: true, selectedColor: "#dc713d" },
          "2025-03-05": { selected: true, selectedColor: "#dc713d" },
          "2025-03-07": { selected: true, selectedColor: "#dc713d" },
          "2025-03-10": { selected: true, selectedColor: "#dc713d" },
          "2025-03-12": { selected: true, selectedColor: "#dc713d" },
          "2025-03-14": { selected: true, selectedColor: "#dc713d" },
          "2025-03-19": { selected: true, selectedColor: "#dc713d" },
          "2025-03-21": { selected: true, selectedColor: "#dc713d" },
          "2025-03-24": { selected: true, selectedColor: "#dc713d" },
          "2025-03-26": { selected: true, selectedColor: "#dc713d" },
          "2025-03-28": { selected: true, selectedColor: "#dc713d" },
          "2025-03-31": { selected: true, selectedColor: "#dc713d" },
          "2025-04-01": { selected: true, selectedColor: "#dc713d" },
          "2025-04-02": { selected: true, selectedColor: "#dc713d" },
          "2025-04-04": { selected: true, selectedColor: "#dc713d" },
          "2025-04-07": { selected: true, selectedColor: "#dc713d" },
          "2025-04-09": { selected: true, selectedColor: "#dc713d" },
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
});
