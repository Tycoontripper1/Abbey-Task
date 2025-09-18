import { AuthService } from "@/services/AuthService";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Check app state after animation
    const checkAppState = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const user = await AuthService.getCurrentUser();
      const onboardingComplete = await AuthService.isOnboardingComplete();

      if (user && onboardingComplete) {
        router.replace("/(tabs)");
      } else if (onboardingComplete) {
        router.replace("/auth/login");
      } else {
        router.replace("/onboarding/welcome");
      }
    };

    checkAppState();
  }, []);

  return (
    <LinearGradient
      colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <Text style={styles.appName}>Connect</Text>
          <Text style={styles.tagline}>Build meaningful connections</Text>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
});
