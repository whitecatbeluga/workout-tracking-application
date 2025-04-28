import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  FlatList,
} from "react-native";
import { Exercise } from "@/custom-types/exercise-type";
import Icon from "react-native-vector-icons/FontAwesome";

interface ExerciseDetailCardProps {
  exercise: Exercise;
}

interface SetData {
  set: number;
  previous: string;
  kg: string;
  reps: string;
  checked: boolean;
}

const ExerciseDetailCard = ({ exercise }: ExerciseDetailCardProps) => {
  const [sets, setSets] = useState<SetData[]>([
    { set: 1, previous: "", kg: "", reps: "", checked: false },
  ]);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);

  const [isRestModalVisible, setIsRestModalVisible] = useState(false);
  const [restTimer, setRestTimer] = useState<number>(34); // default 34s

  const handleInputChange = (
    index: number,
    field: keyof SetData,
    value: string
  ) => {
    setSets((prevSets) => {
      const updatedSets = [...prevSets];
      updatedSets[index] = {
        ...updatedSets[index],
        [field]: value || "",
      };
      return updatedSets;
    });
  };

  const handleToggleCheck = (index: number) => {
    setSets((prevSets) => {
      const updatedSets = [...prevSets];
      updatedSets[index].checked = !updatedSets[index].checked;
      return updatedSets;
    });
  };

  const handleAddSet = () => {
    setSets((prevSets) => [
      ...prevSets,
      {
        set: prevSets.length + 1,
        previous: "",
        kg: "",
        reps: "",
        checked: false,
      },
    ]);
  };

  const handleSelectRestTime = (seconds: number) => {
    setRestTimer(seconds);
    setIsRestModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ExerciseSetCardHeader />

      <View style={{ marginBottom: 10 }}>
        <Text>Title: {exercise.name}</Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsRestModalVisible(true)}
        style={styles.restTimerContainer}
      >
        <Icon
          name="clock-o"
          size={20}
          color="#007bff"
          style={{ marginRight: 5 }}
        />
        <Text style={{ fontSize: 16, color: "#007bff" }}>
          Rest timer: {restTimer}s
        </Text>
      </TouchableOpacity>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Set</Text>
          <Text style={styles.tableHeaderText}>Previous</Text>
          <Text style={styles.tableHeaderText}>KG</Text>
          <Text style={styles.tableHeaderText}>REPS</Text>
          <Text style={styles.tableHeaderText}>CHECK</Text>
        </View>

        {sets.map((set, index) => (
          <View
            key={set.set}
            style={[
              styles.tableRow,
              focusedRowIndex === index && styles.selectedRow,
            ]}
          >
            <Text style={styles.tableCell}>{set.set}</Text>

            <TextInput
              style={[styles.tableCell, styles.inputTextCenter]}
              value={set.previous}
              onChangeText={(text) =>
                handleInputChange(index, "previous", text)
              }
              onFocus={() => setFocusedRowIndex(index)}
              placeholder="-"
            />
            <TextInput
              style={[styles.tableCell, styles.inputTextCenter]}
              value={set.kg}
              onChangeText={(text) => handleInputChange(index, "kg", text)}
              onFocus={() => setFocusedRowIndex(index)}
              placeholder="0"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.tableCell, styles.inputTextCenter]}
              value={set.reps}
              onChangeText={(text) => handleInputChange(index, "reps", text)}
              onFocus={() => setFocusedRowIndex(index)}
              placeholder="0"
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={styles.tableCell}
              onPress={() => handleToggleCheck(index)}
            >
              <Text style={{ fontSize: 16, textAlign: "center" }}>
                {set.checked ? "✔️" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Button title="+ Add Set" onPress={handleAddSet} color="#48A6A7" />

      <Modal
        visible={isRestModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsRestModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsRestModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Rest Time</Text>
                <FlatList
                  data={[15, 30, 45, 60, 90, 120]}
                  keyExtractor={(item) => item.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.restTimeOption}
                      onPress={() => handleSelectRestTime(item)}
                    >
                      <Text style={styles.restTimeText}>{item} seconds</Text>
                    </Pressable>
                  )}
                />
                <Button
                  title="Cancel"
                  onPress={() => setIsRestModalVisible(false)}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ExerciseDetailCard;

const ExerciseSetCardHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Header</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: "#333",
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  selectedRow: {
    backgroundColor: "#e0f7fa",
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    minWidth: 50,
    height: 40,
    justifyContent: "center",
  },
  inputTextCenter: {
    textAlign: "center",
    textAlignVertical: "center",
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  restTimeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  restTimeText: {
    fontSize: 16,
    textAlign: "center",
  },
  restTimerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
