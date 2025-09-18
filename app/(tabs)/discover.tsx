import { AuthService } from "@/services/AuthService";
import { ConnectionService } from "@/services/ConnectionService";
import { User } from "@/types/User";
import { Check, Clock, Search, UserPlus, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Discover() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatuses, setConnectionStatuses] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadData = async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const allUsers = await AuthService.getAllUsers();
      const otherUsers = allUsers.filter((u) => u.id !== user.id);
      setUsers(otherUsers);

      // Load connection statuses
      const statuses: { [key: string]: string } = {};
      for (const otherUser of otherUsers) {
        const status = await ConnectionService.getConnectionStatus(
          user.id,
          otherUser.id
        );
        statuses[otherUser.id] = status;
      }
      setConnectionStatuses(statuses);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        (user.bio && user.bio.toLowerCase().includes(query))
    );
    setFilteredUsers(filtered);
  };

  const handleConnect = async (userId: string) => {
    if (!currentUser) return;

    const success = await ConnectionService.sendConnectionRequest(
      currentUser.id,
      userId
    );
    if (success) {
      Alert.alert("Success", "Connection request sent!");
      setConnectionStatuses((prev) => ({
        ...prev,
        [userId]: "sent",
      }));
    } else {
      Alert.alert("Error", "Unable to send connection request");
    }
  };

  const getButtonProps = (userId: string) => {
    const status = connectionStatuses[userId];

    switch (status) {
      case "connected":
        return {
          text: "Connected",
          icon: <Users color="#10B981" size={16} />,
          style: styles.connectedButton,
          textStyle: styles.connectedButtonText,
          disabled: true,
        };
      case "sent":
        return {
          text: "Sent",
          icon: <Clock color="#F59E0B" size={16} />,
          style: styles.sentButton,
          textStyle: styles.sentButtonText,
          disabled: true,
        };
      case "pending":
        return {
          text: "Pending",
          icon: <Check color="#3B82F6" size={16} />,
          style: styles.pendingButton,
          textStyle: styles.pendingButtonText,
          disabled: true,
        };
      default:
        return {
          text: "Connect",
          icon: <UserPlus color="white" size={16} />,
          style: styles.connectButton,
          textStyle: styles.connectButtonText,
          disabled: false,
        };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover People</Text>
        <Text style={styles.subtitle}>Find and connect with new people</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, username, or interests..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Users color="#9CA3AF" size={48} />
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? "No users found matching your search"
                : "No users to discover yet"}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => {
            const buttonProps = getButtonProps(user.id);

            return (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userAvatarText}>
                      {user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userUsername}>@{user.username}</Text>
                    {user.bio && (
                      <Text style={styles.userBio} numberOfLines={2}>
                        {user.bio}
                      </Text>
                    )}
                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <Users color="#6B7280" size={14} />
                        <Text style={styles.statText}>
                          {user.connectionsCount} connections
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Pressable
                  style={[styles.actionButton, buttonProps.style]}
                  onPress={() => handleConnect(user.id)}
                  disabled={buttonProps.disabled}
                >
                  {buttonProps.icon}
                  <Text style={buttonProps.textStyle}>{buttonProps.text}</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  usersList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userInfo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  userAvatar: {
    width: 56,
    height: 56,
    backgroundColor: "#3B82F6",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  userUsername: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  userBio: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 8,
    lineHeight: 20,
  },
  userStats: {
    flexDirection: "row",
    marginTop: 8,
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 8,
  },
  connectButton: {
    backgroundColor: "#3B82F6",
  },
  connectButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  connectedButton: {
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#10B981",
  },
  connectedButtonText: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
  sentButton: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  sentButtonText: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 14,
  },
  pendingButton: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  pendingButtonText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },
});
