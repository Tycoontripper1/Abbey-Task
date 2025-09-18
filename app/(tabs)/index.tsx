import { AuthService } from "@/services/AuthService";
import { ConnectionService } from "@/services/ConnectionService";
import { ConnectionRequest, User } from "@/types/User";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  MessageCircle,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [connections, setConnections] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const currentUser = await AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const requests = await ConnectionService.getPendingRequests(
        currentUser.id
      );
      const userConnections = await ConnectionService.getConnections(
        currentUser.id
      );
      setPendingRequests(requests);
      setConnections(userConnections);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    const success = await ConnectionService.acceptConnectionRequest(requestId);
    if (success) {
      Alert.alert("Success", "Connection request accepted!");
      loadData();
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    const success = await ConnectionService.declineConnectionRequest(requestId);
    if (success) {
      loadData();
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient colors={["#3B82F6", "#8B5CF6"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user.name.split(" ")[0]}!</Text>
          </View>
          <Pressable style={styles.notificationButton}>
            <Bell color="white" size={24} />
            {pendingRequests.length > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {pendingRequests.length}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users color="#3B82F6" size={20} />
            </View>
            <Text style={styles.statNumber}>{connections.length}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <UserPlus color="#10B981" size={20} />
            </View>
            <Text style={styles.statNumber}>{pendingRequests.length}</Text>
            <Text style={styles.statLabel}>Requests</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <TrendingUp color="#F59E0B" size={20} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        {/* Connection Requests */}
        {pendingRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connection Requests</Text>
            {pendingRequests.slice(0, 3).map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestInfo}>
                  <View style={styles.requestAvatar}>
                    <Text style={styles.requestAvatarText}>
                      {request.fromUserId.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.requestDetails}>
                    <Text style={styles.requestName}>
                      New connection request
                    </Text>
                    <Text style={styles.requestTime}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <Pressable
                    style={styles.acceptButton}
                    onPress={() => handleAcceptRequest(request.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </Pressable>
                  <Pressable
                    style={styles.declineButton}
                    onPress={() => handleDeclineRequest(request.id)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Connections */}
        {connections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Connections</Text>
            {connections.slice(0, 3).map((connection) => (
              <View key={connection.id} style={styles.connectionCard}>
                <View style={styles.connectionAvatar}>
                  <Text style={styles.connectionAvatarText}>
                    {connection.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.connectionInfo}>
                  <Text style={styles.connectionName}>{connection.name}</Text>
                  <Text style={styles.connectionUsername}>
                    @{connection.username}
                  </Text>
                  {connection.bio && (
                    <Text style={styles.connectionBio} numberOfLines={2}>
                      {connection.bio}
                    </Text>
                  )}
                </View>
                <Pressable style={styles.messageButton}>
                  <MessageCircle color="#3B82F6" size={20} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Pressable style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <UserPlus color="#3B82F6" size={24} />
              </View>
              <Text style={styles.quickActionText}>Find People</Text>
            </Pressable>
            <Pressable style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <Users color="#10B981" size={24} />
              </View>
              <Text style={styles.quickActionText}>My Network</Text>
            </Pressable>
            <Pressable style={styles.quickAction}>
              <View style={styles.quickActionIcon}>
                <MessageCircle color="#F59E0B" size={24} />
              </View>
              <Text style={styles.quickActionText}>Messages</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  notificationButton: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationCount: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requestAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#3B82F6",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requestAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  requestTime: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },
  connectionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  connectionAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#8B5CF6",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  connectionAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  connectionUsername: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  connectionBio: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  messageButton: {
    padding: 8,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
});
