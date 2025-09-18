import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Heart, MessageCircle, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

export default function Welcome() {
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
    <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.heroSection}>
          <View style={styles.iconGrid}>
            <View style={styles.iconItem}>
              <Users color="white" size={32} />
            </View>
            <View style={styles.iconItem}>
              <Heart color="white" size={32} />
            </View>
            <View style={styles.iconItem}>
              <MessageCircle color="white" size={32} />
            </View>
          </View>

          <Text style={styles.title}>Welcome to Connect</Text>
          <Text style={styles.subtitle}>
            Build meaningful relationships and grow your network with people who
            share your interests and goals.
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Users color="rgba(255, 255, 255, 0.8)" size={24} />
            <Text style={styles.featureText}>Discover new people</Text>
          </View>
          <View style={styles.feature}>
            <Heart color="rgba(255, 255, 255, 0.8)" size={24} />
            <Text style={styles.featureText}>Build lasting connections</Text>
          </View>
          <View style={styles.feature}>
            <MessageCircle color="rgba(255, 255, 255, 0.8)" size={24} />
            <Text style={styles.featureText}>Engage meaningfully</Text>
          </View>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/onboarding/features")}
          >
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
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  heroSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  iconGrid: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 20,
  },
  iconItem: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  features: {
    gap: 20,
    marginVertical: 40,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  buttons: {
    gap: 12,
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
    color: "#3B82F6",
  },
});
