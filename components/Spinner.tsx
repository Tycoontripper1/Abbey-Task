import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface SpinnerProps {
  message?: string;
  width?: number;
  height?: number;
}

const Spinner = ({ message, width, height }: SpinnerProps) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.overlay}>
      <View
        style={[
          styles.card,
          { width: width ?? 120, ...(height ? { height } : {}) },
        ]}
      >
        <Animated.View style={{ opacity: pulseAnim }}>
          <LinearGradient
            colors={["#3B82F6", "#8B5CF6", "#EC4899"]}
            style={styles.circle}
          >
            <Text style={styles.stylizedText}>C</Text>
          </LinearGradient>
        </Animated.View>

        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  stylizedText: {
    fontSize: 36,
    color: "white",
    fontWeight: "600",
    fontFamily: "serif", // you can replace with a custom font
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});

export default Spinner;
