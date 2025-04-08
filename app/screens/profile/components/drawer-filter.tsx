import React, { forwardRef, useCallback, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Styles from "@/app/screens/profile/styles";

interface Props {
  title: string;
}

type RefType = BottomSheet | null;

const BottomSheetFilter = forwardRef<RefType, Props>((props, ref) => {
  // snap points
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <BottomSheet
      ref={ref}
      index={-1} // default hidden
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={Styles.bottomSheetContentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default BottomSheetFilter;
