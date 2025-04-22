import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import ContainerSettings from "./container";

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

const TermsOfService = () => {
  return (
    <ContainerSettings>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Terms of Service</Text>
        <Text style={styles.date}>Effective Date: April 15, 2025</Text>

        <Section title="1. Acceptance of Terms">
          By accessing or using the [Your App Name] mobile application (the
          “App”), you agree to be bound by these Terms of Service (“Terms”). If
          you do not agree, please do not use the App.
        </Section>

        <Section title="2. Description of Service">
          [Your App Name] is a mobile app designed to help users track workouts,
          monitor progress, and manage fitness routines. The app may include
          features such as exercise logging, statistics tracking, calendar
          planning, and body measurements.
        </Section>

        <Section title="3. User Accounts">
          To use certain features of the App, you may be required to create an
          account. You agree to:
          {"\n"}- Provide accurate and complete information
          {"\n"}- Keep your login credentials secure
          {"\n"}- Be responsible for all activity under your account
          {"\n\n"}We reserve the right to suspend or terminate your account if
          we suspect any misuse or breach of these Terms.
        </Section>

        <Section title="4. Use of the App">
          You agree to use the App only for lawful purposes and in a way that
          does not infringe on the rights of others. You may not:
          {"\n"}- Attempt to reverse-engineer or tamper with the app's code
          {"\n"}- Use the app for commercial purposes without permission
          {"\n"}- Upload any harmful, misleading, or offensive content
        </Section>

        <Section title="5. Data & Privacy">
          Your privacy is important to us. Please refer to our Privacy Policy
          for information on how we collect, use, and protect your data.
        </Section>

        <Section title="6. Health Disclaimer">
          [Your App Name] does not provide medical advice. Always consult with a
          qualified healthcare provider before starting any new fitness program.
          Use the app at your own risk.
        </Section>

        <Section title="7. Limitation of Liability">
          We strive to provide a reliable service, but we make no guarantees
          that the app will always be available or error-free. [Your App Name]
          is provided “as is,” and we are not liable for any damages resulting
          from your use of the app.
        </Section>

        <Section title="8. Updates & Changes">
          We may update these Terms from time to time. If we make significant
          changes, we'll notify you through the app or by email. Continued use
          of the app after changes means you accept the new terms.
        </Section>

        <Section title="9. Contact Us">
          If you have any questions or concerns about these Terms, feel free to
          reach out at your-support@email.com.
        </Section>
      </ScrollView>
    </ContainerSettings>
  );
};

export default TermsOfService;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
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
