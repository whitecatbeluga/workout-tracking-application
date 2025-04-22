import { View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import ContainerSettings from "./container";
import SkewedHighlightText from "@/components/SkewedHighlightText";

const AboutUs = () => {
  return (
    <ContainerSettings>
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: "Inter_800ExtraBold",
            letterSpacing: -2,
            color: "#323232",
            textAlign: "center",
          }}
        >
          The Story Behind the
          <SkewedHighlightText
            word="Sweat"
            inheritStyles={{
              fontSize: 32,
              fontFamily: "Inter_800ExtraBold",
              letterSpacing: -2,
              color: "#323232",
              textAlign: "center",
              zIndex: 1,
            }}
            color="yellow"
            direction="steepRight"
          />
        </Text>

        <Section title="Who We Are">
          We're a small team of fitness enthusiasts and developers on a mission
          to make fitness tracking simple, powerful, and motivating. [Your App
          Name] was born out of the frustration with overcomplicated or
          cluttered workout apps.
        </Section>

        <Section title="Why We Built This">
          We believe fitness progress should be easy to track and fun to follow.
          Whether you're lifting weights, running, or just getting started with
          a new routine, our goal is to give you the tools you need to stay
          consistent and celebrate your progress.
        </Section>

        <Section title="Our Philosophy">
          Fitness is personal. That's why our app is built to adapt to your
          journey—no matter your goals. We focus on clean design, smooth
          experience, and features that matter.
        </Section>

        <Section title="What's Next">
          We're constantly improving and adding new features based on your
          feedback. Expect updates that make tracking smarter, insights deeper,
          and workouts more rewarding.
        </Section>

        <Section title="Get in Touch">
          We'd love to hear from you! If you have suggestions, ideas, or just
          want to say hello, drop us a message through the app or email us at
          your-support@email.com.
        </Section>
      </ScrollView>
    </ContainerSettings>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionText}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
});

export default AboutUs;
