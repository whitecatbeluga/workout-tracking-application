import { View, Text, StyleSheet } from "react-native";
import { useEffect, useRef, useState, memo } from "react";
import { formatTime } from "../utils/format-time";
import { setDuration } from "@/redux/slices/timer-slice";
import { useDispatch } from "react-redux";

const Timer = memo(() => {
  const [displayTime, setDisplayTime] = useState<number>(0);
  const dispatch = useDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDisplayTime((prev) => {
        const updated = prev + 1;
        dispatch(setDuration(updated));
        return updated;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch]);

  return (
    <View>
      <Text style={styles.textSize}>{formatTime(displayTime)}</Text>
    </View>
  );
});

export default Timer;

const styles = StyleSheet.create({
  textSize: {
    fontSize: 16,
    width: 100,
  },
});
