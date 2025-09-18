import { AuthService } from "@/services/AuthService";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Eye, Lock, UserX } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function Privacy() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleComplete = async () => {
    await AuthService.completeOnboarding();
    router.replace("/auth/login");
  };

  return (
    <LinearGradient colors={["#EC4899", "#F59E0B"]} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Privacy Matters</Text>
          <Text style={styles.subtitle}>
            We are committed to protecting your personal information and giving
            you control
          </Text>
        </View>

        <View style={styles.privacyList}>
          <View style={styles.privacyItem}>
            <View style={styles.privacyIcon}>
              <Lock color="#EC4899" size={24} />
            </View>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Secure Data Storage</Text>
              <Text style={styles.privacyDescription}>
                All your data is encrypted and stored securely
              </Text>
            </View>
          </View>

          <View style={styles.privacyItem}>
            <View style={styles.privacyIcon}>
              <Eye color="#EC4899" size={24} />
            </View>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Visibility Controls</Text>
              <Text style={styles.privacyDescription}>
                Choose who can see your profile and contact you
              </Text>
            </View>
          </View>

          <View style={styles.privacyItem}>
            <View style={styles.privacyIcon}>
              <UserX color="#EC4899" size={24} />
            </View>
            <View style={styles.privacyContent}>
              <Text style={styles.privacyTitle}>Block & Report</Text>
              <Text style={styles.privacyDescription}>
                Easily block unwanted contacts and report inappropriate behavior
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
            You can change your privacy settings anytime from your profile.
          </Text>
        </View>

        <View style={styles.buttons}>
          <Pressable style={styles.primaryButton} onPress={handleComplete}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </Pressable>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingVertical: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  privacyList: {
    flex: 1,
    gap: 20,
  },
  privacyItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  privacyIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#FDF2F8",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyContent: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  privacyDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  disclaimerText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 18,
    textAlign: "center",
  },
  buttons: {
    marginTop: 30,
  },
  primaryButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EC4899",
  },
});
