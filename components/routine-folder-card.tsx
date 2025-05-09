import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";
import {
  Program,
  Routine,
  setRoutineParams,
} from "@/redux/slices/routine-slice";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { BtnTitle, CustomBtn } from "./custom-btn";
import { router } from "expo-router";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { setSelectExercises } from "@/redux/slices/exercise-slice";
import { updateWorkoutSets } from "@/redux/slices/workout-slice";
import { useAppSelector } from "@/hooks/use-app-selector";

type RoutineFolderCardProps = {
  program: Program;
  openRoutineMenu: (id: string) => void;
  openProgramMenu: (id: string) => void;

  openResetWorkoutModal: (value: boolean) => void;
  resetWorkoutType: (value: string) => void;
};

const RoutineFolderCard = ({
  program,
  openRoutineMenu,
  openProgramMenu,

  openResetWorkoutModal,
  resetWorkoutType,
}: RoutineFolderCardProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const dispatch = useAppDispatch();

  const draftWorkout = useAppSelector((state) => state.workout.draftWorkout);

  const handleAddExercise = (programId: string) => {
    dispatch(setRoutineParams({ programId: programId }));
    router.push({
      pathname: "/screens/workout/create-routine",
      params: { type: "create-routine" },
    });
  };

  const handleStartRoutine = async (routine: Routine) => {
    dispatch(setSelectExercises(routine?.exercises));
    dispatch(updateWorkoutSets(routine?.exercises));

    if (draftWorkout) {
      openResetWorkoutModal(true);
      resetWorkoutType("start-routine");
      return;
    }

    router.push({
      pathname: "/screens/workout/add-workout",
    });
  };

  return (
    <View style={{ width: "100%", gap: 8, marginBottom: collapsed ? 0 : 10 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: 3,
            alignItems: "center",
          }}
          onPress={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <Ionicons name="chevron-forward" size={16} color="#323232" />
          ) : (
            <Ionicons name="chevron-up" size={16} color="#323232" />
          )}

          <Text
            style={{
              fontSize: 14,
              color: "#626262",
              fontWeight: "medium",
            }}
          >
            {program.program_name}{" "}
            {program.routines.length >= 1 && `(${program.routines.length})`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openProgramMenu(program.id)}>
          <Ionicons name="create-outline" size={20} color="#323232" />
        </TouchableOpacity>
      </View>

      <Collapsible
        collapsed={collapsed}
        style={{
          flexDirection: "column",
          gap: program.routines.length > 0 ? 8 : 0,
          paddingTop: program.routines.length > 0 ? 10 : 0,
          borderRadius: program.routines.length > 0 ? 8 : 0,
          padding: program.routines.length > 0 ? 14 : 0,
          borderColor: program.routines.length > 0 ? "#CBD5E1" : "transparent",
          borderWidth: program.routines.length > 0 ? 1 : 0,
        }}
      >
        {program.routines.length > 0 ? (
          program.routines.map((routine, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                router.push({
                  pathname: "/screens/workout/view-routine",
                  params: { routineId: routine.id, programId: program.id },
                })
              }
            >
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "#626262",
                      fontFamily: "Inter_700Bold",
                    }}
                  >
                    {routine.routine_name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      openRoutineMenu(routine.id);
                    }}
                  >
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={24}
                      color="#323232"
                    />
                  </TouchableOpacity>
                </View>
                {routine.exercises.map((exercise, index) => (
                  <View key={index}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#626262",
                        fontFamily: "Inter_400Regular",
                      }}
                    >
                      {exercise.name}
                    </Text>
                  </View>
                ))}
                <CustomBtn
                  onPress={() => {
                    handleStartRoutine(routine);
                  }}
                  buttonStyle={{
                    borderRadius: 6,
                    marginTop: 10,
                    backgroundColor: "#006A71",
                  }}
                >
                  <Ionicons name="grid-outline" size={18} color="white" />

                  <BtnTitle
                    title="Start Routine"
                    textStyle={{ fontSize: 14 }}
                  />
                </CustomBtn>

                {index !== program.routines.length - 1 && (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#CCC",
                      marginVertical: 15,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View>
            <CustomBtn
              onPress={() => handleAddExercise(program.id)}
              buttonStyle={{
                borderRadius: 6,
                marginTop: 10,
                backgroundColor: "transparent",
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: "#555555",
              }}
            >
              <Ionicons name="add-outline" size={20} color="#006A71" />

              <BtnTitle
                title="Add New Routine"
                textStyle={{
                  fontSize: 14,
                  color: "#006A71",
                  fontFamily: "Inter_400Regular",
                }}
              />
            </CustomBtn>
          </View>
        )}
      </Collapsible>
    </View>
  );
};

export default RoutineFolderCard;
