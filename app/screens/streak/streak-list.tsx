import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { CalendarList } from "react-native-calendars";
import { styles } from "./index";

export const StreakList = () => {
  const [currentDate, setcurrentDate] = useState("");

  useEffect(() => {
    let current = new Date();
    const offset = current.getTimezoneOffset();
    current = new Date(current.getTime() - offset * 60 * 1000);
    setcurrentDate(current.toISOString().split("T")[0]);
  }, []);

  return (
    <View style={styles.calendarContainer}>
      <CalendarList
        current={currentDate}
        pastScrollRange={2}
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
