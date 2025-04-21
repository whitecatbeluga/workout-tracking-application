import React, { forwardRef, useCallback, useMemo } from "react";
import { View, Text } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

interface Props {
  title: string;
  type: "comments" | "likes";
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
          {props.type === "comments" ? (
            <View>
              <Text>Comments here</Text>
            </View>
          ) : (
            <View>
              <Text>Likes here</Text>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default BottomSheetComments;
