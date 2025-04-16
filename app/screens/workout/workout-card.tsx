import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MoreVertical } from "lucide-react-native";

type Exercise = {
  id: number;
  exercise: {
    name: string;
    category: string;
  };
};
type WorkoutCardProps = {
  id: number;
  name: string;
  description: string;
  duration: number;
  intensity: number;
  exercises: Exercise[];
  onMenuPress: (id: number) => void;
};

const WorkoutCard = ({
  id,
  name,
  description,
  duration,
  intensity,
  exercises,
  onMenuPress,
}: WorkoutCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity onPress={() => onMenuPress(id)}>
          <MoreVertical size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>{description}</Text>
      <Text style={styles.meta}>Duration: {duration} mins</Text>
      <Text style={styles.meta}>Intensity: {intensity}/5</Text>
      <Text style={styles.subHeading}>Exercises:</Text>
      {exercises?.map((e) => (
        <Text key={e.id} style={styles.exercise}>
          • {e.exercise.name} ({e.exercise.category})
        </Text>
      ))}
    </View>
  );
};

export default WorkoutCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    width: "90%",
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  meta: {
    fontSize: 13,
    color: "#666",
  },
  subHeading: {
    marginTop: 10,
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  exercise: {
    fontSize: 13,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    gap: 12,
  },
  menuItem: {
    padding: 8,
    alignItems: "center",
  },
});
