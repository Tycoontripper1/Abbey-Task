import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Search, Shield, UserPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function Features() {
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

  return (
    <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={styles.container}>
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
          <Text style={styles.title}>Key Features</Text>
          <Text style={styles.subtitle}>
            Everything you need to build meaningful connections
          </Text>
        </View>

        <View style={styles.featuresList}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Search color="#8B5CF6" size={28} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Smart Discovery</Text>
              <Text style={styles.featureDescription}>
                Find people based on shared interests, location, and mutual
                connections
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <UserPlus color="#8B5CF6" size={28} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Easy Connections</Text>
              <Text style={styles.featureDescription}>
                Send connection requests and build your professional network
                effortlessly
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Shield color="#8B5CF6" size={28} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Privacy First</Text>
              <Text style={styles.featureDescription}>
                Your data is secure and you control who can see your profile
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/onboarding/privacy")}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>

          <Pressable
            style={styles.skipButton}
            onPress={() => router.push("/onboarding/privacy")}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
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
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  featuresList: {
    flex: 1,
    gap: 20,
  },
  featureCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  buttons: {
    gap: 12,
    marginTop: 40,
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
    color: "#8B5CF6",
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  skipButtonText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
});
