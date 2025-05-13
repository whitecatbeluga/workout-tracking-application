import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { router, useNavigation } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/utils/firebase-config";
import { debounce } from "lodash";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type User = {
  id: string;
  profile_picture?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

const Search = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const [recents, setRecents] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            placeholder="Search..."
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons
                style={{ marginLeft: -35 }}
                name="close-circle"
                size={24}
                color="#6A6A6A"
              />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, searchText]);

  useEffect(() => {
    const debouncedSearch = debounce(async () => {
      if (searchText.trim().length === 0) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "users"));
        const users: User[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const lowerSearch = searchText.toLowerCase();
        const filtered = users.filter((user) =>
          [user.username, user.first_name, user.last_name].some((field) =>
            field?.toLowerCase().includes(lowerSearch)
          )
        );

        setResults(filtered);
      } catch (error) {
        console.error("Error searching users: ", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [searchText]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    let isMounted = true;

    const loadRecents = async () => {
      const recentsData = await fetchRecents(currentUser.uid);
      if (isMounted) setRecents(recentsData);
    };

    if (!searchText) {
      loadRecents();
    }

    return () => {
      isMounted = false;
    };
  }, [searchText]);

  const handleSelectUser = async (searchedUserId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const recentRef = doc(
        db,
        "users",
        currentUser.uid,
        "recents",
        searchedUserId
      );
      await setDoc(recentRef, {
        searched_at: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to record recent search: ", error);
    }
  };

  const fetchRecents = async (userId: string) => {
    try {
      setLoading(true);
      const recentsRef = collection(db, "users", userId, "recents");
      const q = query(recentsRef, orderBy("searched_at", "desc"));
      const snapshot = await getDocs(q);

      const recentUserIds = snapshot.docs.map((doc) => doc.id);

      const recentUsers = await Promise.all(
        recentUserIds.map(async (recentUserId) => {
          const userDoc = await getDoc(doc(db, "users", recentUserId));
          if (userDoc.exists()) {
            return {
              id: userDoc.id,
              ...userDoc.data(),
            };
          }
          return null;
        })
      );

      const filteredUsers = recentUsers.filter((user) => user !== null);

      return filteredUsers;
    } catch (error) {
      console.error("Failed to fetch recents:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setLoading(true);
      const recentsRef = collection(db, "users", currentUser.uid, "recents");
      const snapshot = await getDocs(recentsRef);

      const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setRecents([]);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => {
          handleSelectUser(item.id);
          router.push({
            pathname: "/screens/home/visit-profile",
            params: {
              name: item.username,
              fullName: `${item.first_name} ${item.last_name}`,
              user_id: item.id,
              email: item.email,
            },
          });
        }}
      >
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Image
            source={{
              uri:
                item.profile_picture ||
                "https://avatar.iran.liara.run/public/41",
            }}
            style={{ height: 40, width: 40, borderRadius: 20 }}
          />
          <View>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.fullName}>
              {item.first_name} {item.last_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleSelectUser]
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.recentTitle}>
          {searchText ? "Results" : "Recent"}
        </Text>
        {recents.length > 0 && searchText === "" && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text
              style={{
                fontFamily: "Inter_400Regular",
                fontSize: 14,
                color: "#48A6A7",
              }}
            >
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={searchText ? results : recents}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} />
          ) : (
            <Text
              style={{
                paddingVertical: 20,
                color: "#999",
                textAlign: "center",
              }}
            >
              {searchText ? "No results found." : "No recent searches."}
            </Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    width: "100%",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginLeft: -10,
  },
  recentTitle: {
    fontFamily: "Inter_600SemiBold",
    color: "#000000",
    fontSize: 16,
  },
  resultItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#e0e0e0",
  },
  username: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#000",
  },
  fullName: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#555",
  },
});

export default Search;
