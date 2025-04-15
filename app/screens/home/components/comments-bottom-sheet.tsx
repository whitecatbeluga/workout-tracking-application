import React, { forwardRef, useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

interface Props {
  title: string;
}

type RefType = BottomSheet | null;

const BottomSheetComments = forwardRef<RefType, Props>((props, ref) => {
  // snap points
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

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
      handleStyle={{ backgroundColor: "#F4F4F4", borderRadius: 50 }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          flex: 1,
          backgroundColor: "#F4F4F4",
        }}
      >
        <View>
          <Text>Text</Text>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetComments;
