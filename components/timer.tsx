import { View, Text, StyleSheet } from "react-native";
import {
  useEffect,
  useRef,
  useState,
  memo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { formatTime } from "../utils/format-time";
import { setDuration } from "@/redux/slices/timer-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";

interface TimerProps {
  shouldDispatch?: boolean;
  resetTimer?: boolean;
}

export interface TimerHandle {
  finish: () => number;
  reset: () => void;
}

const Timer = memo(
  forwardRef<TimerHandle, TimerProps>(
    ({ shouldDispatch = true, resetTimer = false }, ref) => {
      const duration = useAppSelector((state) => state.timer.duration);
      const [displayTime, setDisplayTime] = useState<number>(duration || 0);
      const intervalRef = useRef<NodeJS.Timeout | null>(null);
      const dispatch = useAppDispatch();

      useEffect(() => {
        if (resetTimer) {
          setDisplayTime(0);
        }
      }, [resetTimer]);

      useImperativeHandle(ref, () => ({
        finish: () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (shouldDispatch) {
            dispatch(setDuration(displayTime));
          }
          return displayTime;
        },
        reset: () => {
          setDisplayTime(0);
        },
      }));

      useEffect(() => {
        const initialTime = duration > 0 ? duration : 0;
        setDisplayTime(initialTime);

        intervalRef.current = setInterval(() => {
          setDisplayTime((prev) => prev + 1);
        }, 1000);

        return () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      }, [duration]);

      return (
        <View>
          <Text style={styles.textSize}>{formatTime(displayTime)}</Text>
        </View>
      );
    }
  )
);

export default Timer;

const styles = StyleSheet.create({
  textSize: {
    fontSize: 16,
    width: 100,
  },
});
