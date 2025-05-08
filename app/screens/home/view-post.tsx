import { StyleSheet, Text, View, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import PostCard from "./post-card";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetComments from "./components/comments-bottom-sheet";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase-config";

type Exercise = {
  id: string;
  category: string;
  description: string;
  image_url: string;
  name: string;
  with_out_equipment: boolean;
  sets: { set: string; reps: string; kg: string }[];
};

const ViewPostScreen = () => {
  const {
    post_id,
    name,
    fullName,
    email,
    postTitle,
    description,
    time,
    volume,
    likes,
    comments,
    date,
    user_id,
    sets,
    records,
    isLiked,
  } = useLocalSearchParams();

  const toString = (value: string | string[] | undefined): string =>
    typeof value === "string" ? value : value?.[0] || "";

  const [liked, setLiked] = useState(isLiked === "true");
  const [sheetType, setSheetType] = useState<"likes" | "comments">("comments");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Handle open comments
  const handleOpenSheet = (type: "likes" | "comments", postId: string) => {
    setSheetType(type);
    setSelectedPostId(postId);
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const exercisesRef = collection(
          db,
          "workouts",
          post_id.toString(),
          "exercises"
        );

        const snapshot = await getDocs(exercisesRef);

        const exercisePromises = snapshot.docs.map(async (docSnap) => {
          const { exerciseId } = docSnap.data();
          if (!exerciseId) return null;

          const fullDocRef = doc(db, "exercises", exerciseId);
          const fullDocSnap = await getDoc(fullDocRef);

          if (!fullDocSnap.exists()) {
            console.warn(`Exercise with ID ${exerciseId} not found`);
            return null;
          }

          const setsRef = collection(docSnap.ref, "sets");
          const setsSnap = await getDocs(setsRef);

          const sets = setsSnap.docs.map((setDoc) => {
            const setData = setDoc.data();
            return {
              set: setData.set,
              reps: setData.reps,
              kg: setData.kg,
            };
          });

          return {
            id: docSnap.id,
            ...fullDocSnap.data(),
            sets,
          };
        });

        const results = await Promise.all(exercisePromises);
        setExercises(results.filter(Boolean) as Exercise[]);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    if (post_id) {
      fetchExercises();
    }
  }, [post_id]);

  // const workoutData = [
  //   {
  //     title: "Standing Military Press (Barbell)",
  //     sets: [
  //       { set: 1, reps: "20.41kg x 8 reps" },
  //       { set: 2, reps: "20.41kg x 8 reps" },
  //       { set: 3, reps: "20.41kg x 8 reps" },
  //       { set: 4, reps: "20.41kg x 8 reps" },
  //     ],
  //   },
  //   {
  //     title: "Knee Raise Parallel Bars",
  //     sets: [
  //       { set: 1, reps: "15 reps" },
  //       { set: 2, reps: "15 reps" },
  //       { set: 3, reps: "15 reps" },
  //     ],
  //   },
  // ];

  const renderWorkout = ({
    item,
  }: {
    item: { name: string; sets: { set: string; reps: string; kg: string }[] };
  }) => (
    <View>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.workoutTitle}>Workout</Text>
        <Text style={styles.workoutName}>{item.name}</Text>
        <View style={styles.setWeightRepsContainer}>
          <Text style={styles.setText}>SET</Text>
          <Text style={styles.setText}>WEIGHT & REPS</Text>
        </View>
      </View>

      {item.sets.map((set, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            gap: 40,
            paddingHorizontal: 20,
            paddingVertical: 8,
            backgroundColor: index % 2 === 0 ? "#9ACBD0" : "transparent",
          }}
        >
          <Text style={{ fontFamily: "Inter_400Regular" }}>{set.set}</Text>
          <Text style={{ fontFamily: "Inter_400Regular" }}>
            {set.kg}kg x {set.reps} reps
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", width: "100%" }}>
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        ListHeaderComponent={
          <>
            <PostCard
              post_id={toString(post_id)}
              name={toString(name)}
              fullName={toString(fullName)}
              email={toString(email)}
              date={toString(date)}
              postTitle={toString(postTitle)}
              description={toString(description)}
              time={toString(time)}
              volume={toString(volume)}
              sets={toString(sets)}
              records={toString(records)}
              likes={toString(likes)}
              comments={toString(comments)}
              liked={liked}
              user_id={toString(user_id)}
              onLikePress={() => setLiked(!liked)}
              onCheckLikes={() => handleOpenSheet("likes", toString(post_id))}
              onCommentPress={() =>
                handleOpenSheet("comments", toString(post_id))
              }
            />
          </>
        }
        renderItem={renderWorkout}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      />
      <BottomSheetComments
        title="sample"
        type={sheetType}
        postId={selectedPostId}
        ref={bottomSheetRef}
      />
    </View>
  );
};

export default ViewPostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  workoutTitle: {
    fontFamily: "Inter_400Regular",
    marginBottom: 6,
    fontSize: 14,
  },
  workoutName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#48A6A7",
  },
  setWeightRepsContainer: {
    flexDirection: "row",
    gap: 30,
    marginVertical: 10,
  },
  setText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
