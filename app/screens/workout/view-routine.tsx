import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  deleteRoutine,
  fetchRoutine,
  Program,
  setRoutineParams,
  setSelectedRoutineExercises,
} from "@/redux/slices/routine-slice";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import ContainerSettings from "../profile/settings/container";
import { Ionicons } from "@expo/vector-icons";
import { BtnTitle, CustomBtn } from "@/components/custom-btn";
import { Loading } from "@/custom-types/loading-type";
import { SkeletonLoader } from "@/components/workout-skeleton";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CustomModal from "@/components/custom-modal";
import { auth } from "@/utils/firebase-config";
import { setSelectExercises } from "@/redux/slices/exercise-slice";
import { updateWorkoutSets } from "@/redux/slices/workout-slice";

const { height: screenHeight, width: screenWidth } = Dimensions.get("window");

const ViewRoutine = () => {
  const { routineId, programId } = useLocalSearchParams();

  const user = useAppSelector((state) => state.auth.user);
  const userId = auth.currentUser?.uid;
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const routine = useAppSelector((state) => state.routine.singleRoutine);
  const loading = useAppSelector((state) => state.routine.loading);

  const [isModalRoutineVisible, setIsModalRoutineVisible] =
    useState<boolean>(false);

  const routineRef = useRef<BottomSheet>(null);

  useEffect(() => {
    dispatch(fetchRoutine({ routineId: routineId as string }));
  }, [dispatch, routineId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={openRoutineMenu}
          style={{
            paddingVertical: 8,
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#323232" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const openRoutineMenu = () => {
    routineRef.current?.expand();
  };

  // handle functions
  const handleDeleteRoutine = async (
    userId: string,
    programId: string,
    routineId: string
  ) => {
    await dispatch(deleteRoutine({ userId, programId, routineId }));

    router.replace("/(tabs)/workout");
  };

  const handleEditRoutine = async () => {
    const resultAction = await dispatch(
      fetchRoutine({
        routineId: routineId as string,
      })
    );

    if (fetchRoutine.fulfilled.match(resultAction)) {
      const routine = resultAction.payload;

      dispatch(setRoutineParams({ routineId: routine.id }));
      dispatch(setSelectedRoutineExercises(routine.exercises));

      router.push({
        pathname: "/screens/workout/edit-routine",
      });
    } else {
      console.error("Failed to fetch routine");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {loading == Loading.Pending ? (
          <View
            style={{
              marginTop: 20,
              width: "100%",
              gap: 8,
              alignItems: "center",
            }}
          >
            <Text>Loading...</Text>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </View>
        ) : (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  color: "#323232",
                  fontFamily: "Inter_700Bold",
                }}
              >
                {routine?.routine_name}
              </Text>
            </View>
            <View>
              <Text>
                Created By: {`${user?.first_name} ${user?.last_name}`}
              </Text>
            </View>

            <CustomBtn
              onPress={() => {
                dispatch(setSelectExercises(routine?.exercises));
                dispatch(updateWorkoutSets(routine?.exercises));
                router.push({
                  pathname: "/screens/workout/add-workout",
                });
              }}
              buttonStyle={{
                borderRadius: 6,
                marginTop: 10,
                backgroundColor: "#006A71",
              }}
            >
              <Ionicons name="grid-outline" size={18} color="white" />

              <BtnTitle title="Start Routine" textStyle={{ fontSize: 14 }} />
            </CustomBtn>

            <View style={{ marginTop: 20 }}>
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    color: "#323232",
                    fontFamily: "Inter_700Bold",
                  }}
                >
                  Exercises
                </Text>
              </View>

              <View>
                {routine?.exercises.map((exercise, exerciseIndex) => (
                  <View key={exercise.id || exerciseIndex}>
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#333333",
                          fontFamily: "Inter_600SemiBold",
                          marginBottom: 8,
                        }}
                      >
                        {exercise.name}
                      </Text>

                      {/* Table Header */}
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderBottomWidth: 1,
                          borderBottomColor: "#ccc",
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            fontWeight: "bold",
                            fontSize: 14,
                            fontFamily: "Inter_600SemiBold",
                          }}
                        >
                          Set
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            fontWeight: "bold",
                            fontSize: 14,
                            fontFamily: "Inter_600SemiBold",
                          }}
                        >
                          Weight
                        </Text>
                        <Text
                          style={{
                            flex: 1,
                            fontWeight: "bold",
                            fontSize: 14,
                            fontFamily: "Inter_600SemiBold",
                          }}
                        >
                          Reps
                        </Text>
                      </View>

                      {/* Table Rows */}
                      {exercise.sets.map((set, index) => {
                        const setNumber = set.set ? `Set ${index + 1}` : "";
                        const weight = set.kg ? `${set.kg}kg` : "";
                        const reps = set.reps ? `${set.reps} reps` : "";

                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              paddingHorizontal: 8,
                              paddingVertical: 6,
                              backgroundColor:
                                index % 2 === 0 ? "#f9f9f9" : "#fff",
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 14,
                                fontFamily: "Inter_400Regular",
                              }}
                            >
                              {setNumber}
                            </Text>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 14,
                                fontFamily: "Inter_400Regular",
                              }}
                            >
                              {weight}
                            </Text>
                            <Text
                              style={{
                                flex: 1,
                                fontSize: 14,
                                fontFamily: "Inter_400Regular",
                              }}
                            >
                              {reps}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {isModalRoutineVisible ? (
        <>
          {/* routine deletion modal */}
          <CustomModal
            isModalVisible={isModalRoutineVisible}
            setIsModalVisible={setIsModalRoutineVisible}
            modalTitle="Delete Routine"
            modalDescription="Are you sure you want to delete this routine?"
            modalActionButtonText="Confirm Deletion"
            modalActionButton={() => {
              handleDeleteRoutine(
                userId as string,
                programId as string,
                routineId as string
              );
            }}
          />
        </>
      ) : (
        <>
          {/* routine menu */}
          <BottomSheetOverlay ref={routineRef}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                fontFamily: "Inter_600SemiBold",
              }}
            >
              {routine?.routine_name}
            </Text>
            <CustomBtn
              onPress={handleEditRoutine}
              buttonStyle={{
                borderRadius: 6,
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <Ionicons name="pencil" size={18} color="black" />

              <BtnTitle
                title="Edit Routine"
                textStyle={{ fontSize: 14, color: "black" }}
              />
            </CustomBtn>
            <CustomBtn
              onPress={() => {
                setIsModalRoutineVisible((prev) => !prev);
                routineRef.current?.close();
              }}
              buttonStyle={{
                borderRadius: 6,
                width: "100%",
                backgroundColor: "white",
              }}
            >
              <Ionicons name="trash" size={18} color="#991B1B" />

              <BtnTitle
                title="Delete Routine"
                textStyle={{ fontSize: 14, color: "#991B1B" }}
              />
            </CustomBtn>
          </BottomSheetOverlay>
        </>
      )}
    </View>
  );
};

export default ViewRoutine;

interface BottomSheetProps {
  children: React.ReactNode;
}

const BottomSheetOverlay = forwardRef<BottomSheet, BottomSheetProps>(
  ({ children }, ref) => {
    const snapPoints = useMemo(() => [screenHeight * 0.65, "50%"], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleStyle={{
          backgroundColor: "#F4F4F4",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
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
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 20,
            backgroundColor: "#F4F4F4",
            gap: 10,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);
