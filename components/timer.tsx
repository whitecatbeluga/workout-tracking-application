import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/format-time";

const Timer = () => {
  const [displayTime, setDisplayTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDisplayTime((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <View>
      <Text style={styles.textSize}>{formatTime(displayTime)}</Text>
    </View>
  );
};

export default Timer;
const styles = StyleSheet.create({
  textSize: {
    fontSize: 16,
  },
});
