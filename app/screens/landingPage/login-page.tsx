import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LoginFormData } from "@/custom-types/form-data-type";
import { ScrollView } from "react-native-gesture-handler";
import Input from "@/components/input-text";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { setUserFromFirebase, setUserToken } from "@/redux/auth-slice";
import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  //   setLoading(true);
  //   const { error, data } = await supabase.auth.signInWithPassword({
  //     email: formData.email,
  //     password: formData.password,
  //   });
  //   if (error) {
  //     setLoading(false);
  //     setError(error.message);
  //   }

  //   if (data.session) {
  //     const { access_token, refresh_token, expires_at } = data.session;
  //     await AsyncStorage.setItem("access_token", access_token);
  //     await AsyncStorage.setItem("refresh_token", refresh_token);
  //     if (expires_at !== undefined) {
  //       await AsyncStorage.setItem("expires_at", expires_at.toString());
  //     }
  //     // retrive user info
  //     const { data: userProfile } = await supabase
  //       .from("User")
  //       .select("*")
  //       .eq("auth_user_id", data.user.id)
  //       .single();

  //     dispatch(setUser(userProfile));
  //     dispatch(setAccessToken(access_token));
  //     router.replace("/(tabs)");
  //   }
  // };

  // async function signUpWithEmail() {
  //   setLoading(true);
  //   const {
  //     data: { session },
  //     error,
  //   } = await supabase.auth.signUp({
  //     email: formData.email,
  //     password: formData.password,
  //   });
  //   if (error) console.log("error login", error.message);
  //   if (!session) console.log("error login", "session is null");
  //   setLoading(false);
  // }

  // useEffect(() => {
  //   if (access_token) {
  //     router.replace("/(tabs)");
  //   }
  // }, [access_token]);

  const handleLogin = async () => {
    if (formData.email && formData.password) {
      setLoading(true);

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;

        const token = user.getIdToken();

        const userUID = userCredential.user.uid;

        const userDocRef = doc(db, "users", userUID);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const profileData = userDoc.data();

          const fullUser = {
            firebaseUid: userUID,
            email: userCredential.user.email || "",
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            username: profileData.username || "",
            address: profileData.address || "",
            birthday: profileData.birthday?.toDate().toISOString() || "",
            gender: profileData.gender || "",
            height: profileData.height || "",
            weight: profileData.weight || "",
            bmi: profileData.bmi || 0,
            activity_level: profileData.activity_level || "",
            workout_type: profileData.workout_type || [],
            provider: "firebase",
            displayName: `${profileData.first_name || ""} ${
              profileData.last_name || ""
            }`.trim(),
          };

          await dispatch(setUserFromFirebase(fullUser));
          await dispatch(setUserToken(await token));

          router.replace("/(tabs)/workout");
        } else {
          setError("Account data not found in database.");
        }
      } catch (error: any) {
        console.error("Login Error:", error);
        if (
          error.message?.includes("auth/invalid-credential") ||
          error.code === "auth/invalid-credential"
        ) {
          setError(
            "Invalid credentials. Please check your email and password."
          );
        } else if (
          error.message?.includes("auth/invalid-email") ||
          error.code === "auth/invalid-email"
        ) {
          setError("Invalid email format. Please enter a valid email.");
        } else if (error.code === "permission-denied") {
          setError("You don't have permission to access this data.");
        } else {
          setError("Error logging in. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Text style={styles.header}>Workout Tracking Application</Text>

            <View style={{ gap: 10 }}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Email Field */}
              <Input
                value={formData.email}
                icon="mail"
                placeholder="Email"
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
                // error={isFieldError("email")}
              />

              {/* Password Field */}
              <Input
                value={formData.password}
                icon="lock-closed"
                placeholder="Password"
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry={!showPassword}
                isSuffix={true}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword((prev) => !prev)}
                autoCapitalize="none"
                // error={isFieldError("password")}
              />
            </View>

            {/* Login Button */}
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Sign in</Text>
                )}
              </TouchableOpacity>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.lineText}>or</Text>
            <View style={styles.line} />
          </View>

          <View>
            <Text style={{ fontFamily: "Inter_400Regular", color: "#868686" }}>
              Don't have an account yet?{" "}
              <Text
                style={styles.registerButton}
                onPress={() =>
                  router.push("/screens/landingPage/register-page")
                }
              >
                Register here
              </Text>
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
    fontSize: 40,
    fontFamily: "Inter_800ExtraBold",
    letterSpacing: -2,
    color: "#323232",
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  errorText: {
    color: "#721c24",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    paddingLeft: 35,
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    height: 50,
  },
  inputPassword: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 8,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    paddingLeft: 35,
    borderWidth: 0.5,
    borderColor: "#CBD5E1",
    paddingRight: 35,
    height: 50,
  },
  loginButton: {
    backgroundColor: "#006A71",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
    width: "100%",
  },
  loginText: {
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  inputContainer: {
    paddingVertical: 16,
  },
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#868686",
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
  icon: {
    position: "absolute",
    top: 28,
    left: 8,
    zIndex: 1,
  },
  registerButton: {
    color: "#48A6A7",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 29,
  },

  lineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  lineText: {
    marginHorizontal: 10,
    color: "#555",
    fontWeight: "500",
  },
});
