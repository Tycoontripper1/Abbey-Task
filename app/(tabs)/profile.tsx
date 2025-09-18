import { AuthService } from "@/services/AuthService";
import { ConnectionService } from "@/services/ConnectionService";
import { User } from "@/types/User";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  AtSign,
  Bell,
  Calendar,
  CreditCard as Edit3,
  LogOut,
  Mail,
  Save,
  Settings,
  Shield,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<User[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    username: "",
    bio: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setEditFormData({
        name: currentUser.name,
        username: currentUser.username,
        bio: currentUser.bio || "",
      });

      const userConnections = await ConnectionService.getConnections(
        currentUser.id
      );
      setConnections(userConnections);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!editFormData.name.trim() || !editFormData.username.trim()) {
      Alert.alert("Error", "Name and username are required");
      return;
    }

    const updatedUser = await AuthService.updateUser(user.id, {
      name: editFormData.name.trim(),
      username: editFormData.username.trim().toLowerCase(),
      bio: editFormData.bio.trim(),
    });

    if (updatedUser) {
      setUser(updatedUser);
      setEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully");
    } else {
      Alert.alert("Error", "Username might be already taken");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AuthService.logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  const updateEditField = (field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Pressable
              style={styles.settingsButton}
              onPress={() => setEditModalVisible(true)}
            >
              <Settings color="white" size={24} />
            </Pressable>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>

            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>

            {user.bio && <Text style={styles.profileBio}>{user.bio}</Text>}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{connections.length}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Mail color="#3B82F6" size={20} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <AtSign color="#8B5CF6" size={20} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>@{user.username}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Calendar color="#10B981" size={20} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Member since</Text>
                <Text style={styles.infoValue}>
                  {new Date(user.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.actionsList}>
            <Pressable
              style={styles.actionItem}
              onPress={() => setEditModalVisible(true)}
            >
              <View style={styles.actionIcon}>
                <Edit3 color="#3B82F6" size={20} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Edit Profile</Text>
                <Text style={styles.actionDescription}>
                  Update your profile information
                </Text>
              </View>
            </Pressable>

            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Shield color="#10B981" size={20} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Privacy Settings</Text>
                <Text style={styles.actionDescription}>
                  Control who can see your profile
                </Text>
              </View>
            </Pressable>

            <Pressable style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Bell color="#F59E0B" size={20} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Notifications</Text>
                <Text style={styles.actionDescription}>
                  Manage your notification preferences
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setEditModalVisible(false)}
            >
              <X color="#6B7280" size={24} />
            </Pressable>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Pressable
              style={styles.modalSaveButton}
              onPress={handleSaveProfile}
            >
              <Save color="#3B82F6" size={24} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.modalForm}>
              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editFormData.name}
                  onChangeText={(value) => updateEditField("name", value)}
                  placeholder="Your full name"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>Username</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editFormData.username}
                  onChangeText={(value) => updateEditField("username", value)}
                  placeholder="Your username"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.modalField}>
                <Text style={styles.modalFieldLabel}>Bio</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  value={editFormData.bio}
                  onChangeText={(value) => updateEditField("bio", value)}
                  placeholder="Tell people about yourself..."
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profileAvatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionsList: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  logoutSection: {
    marginBottom: 40,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalSaveButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalForm: {
    gap: 24,
  },
  modalField: {
    gap: 8,
  },
  modalFieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#F9FAFB",
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
