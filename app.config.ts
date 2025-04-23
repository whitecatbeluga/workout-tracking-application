import "dotenv/config";

export default {
  expo: {
    name: "workout-tracking-app",
    slug: "workout-tracking-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: process.env.API_URL,
      REACT_NATIVE_SUPABASE_URL: process.env.REACT_NATIVE_SUPABASE_URL,
      REACT_NATIVE_SUPABASE_ANON_KEY:
        process.env.REACT_NATIVE_SUPABASE_ANON_KEY,
    },
  },
};
