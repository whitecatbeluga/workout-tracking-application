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

interface TimerProps {
  shouldDispatch?: boolean; // Prop to check before dispatching
}

export interface TimerHandle {
  finish: () => number; // Method to trigger dispatch
}

const Timer = memo(
  forwardRef<TimerHandle, TimerProps>(({ shouldDispatch = true }, ref) => {
    const [displayTime, setDisplayTime] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const dispatch = useAppDispatch();

    // Expose the finish method to parent component
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
    }));

    useEffect(() => {
      intervalRef.current = setInterval(() => {
        setDisplayTime((prev) => prev + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, []);

    return (
      <View>
        <Text style={styles.textSize}>{formatTime(displayTime)}</Text>
      </View>
    );
  })
);

export default Timer;

const styles = StyleSheet.create({
  textSize: {
    fontSize: 16,
    width: 100,
  },
});
