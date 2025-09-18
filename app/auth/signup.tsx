import { AuthService } from "@/services/AuthService";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { AtSign, Eye, EyeOff, Lock, Mail, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    const user = await AuthService.register(
      formData.email.trim().toLowerCase(),
      formData.password,
      formData.name.trim(),
      formData.username.trim().toLowerCase()
    );

    if (user) {
      router.replace("/(tabs)/index");
    } else {
      Alert.alert("Error", "Account already exists or username is taken");
    }

    setLoading(false);
  };

  return (
    <LinearGradient colors={["#8B5CF6", "#EC4899"]} style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join the community and start connecting
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#9CA3AF"
              value={formData.name}
              onChangeText={(value) => updateField("name", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <AtSign color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              value={formData.username}
              onChangeText={(value) => updateField("username", value)}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Mail color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(value) => updateField("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="#9CA3AF"
              value={formData.password}
              onChangeText={(value) => updateField("password", value)}
              secureTextEntry={!showPassword}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff color="#6B7280" size={20} />
              ) : (
                <Eye color="#6B7280" size={20} />
              )}
            </Pressable>
          </View>

          <Pressable
            style={[
              styles.signupButton,
              loading && styles.signupButtonDisabled,
            ]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.push("./login")}
          >
            <Text style={styles.loginButtonText}>
              Already have an account? Sign In
            </Text>
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
    justifyContent: "center",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  signupButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
});
