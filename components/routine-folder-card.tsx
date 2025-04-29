import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Collapsible from "react-native-collapsible";
import { Ionicons } from "@expo/vector-icons";
import { Program } from "@/redux/slices/routine-slice";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase-config";
import { BtnTitle, CustomBtn } from "./custom-btn";
import { router } from "expo-router";

type RoutineFolderCardProps = {
  program: Program;
  openRoutineMenu: (id: string) => void;
};

const RoutineFolderCard = ({
  program,
  openRoutineMenu,
}: RoutineFolderCardProps) => {
  const [collapsed, setCollapsed] = useState(true);

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
        <TouchableOpacity>
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
            <View key={index}>
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
                onPress={() => {}}
                buttonStyle={{
                  borderRadius: 6,
                  marginTop: 10,
                  backgroundColor: "#006A71",
                }}
              >
                <Ionicons name="grid-outline" size={18} color="white" />

                <BtnTitle title="Start Routine" textStyle={{ fontSize: 14 }} />
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
          ))
        ) : (
          <View>
            <CustomBtn
              onPress={() => router.push("/screens/workout/create-routine")}
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
