import { AuthService } from "@/services/AuthService";
import { ConnectionService } from "@/services/ConnectionService";
import { ConnectionRequest, User } from "@/types/User";
import {
  Clock,
  MessageCircle,
  Search,
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
  TextInput,
  View,
} from "react-native";

export default function Connections() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<ConnectionRequest[]>(
    []
  );
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "connections" | "pending" | "sent"
  >("connections");

  useEffect(() => {
    loadData();
  }, []);

  // In loadData() function
  const loadData = async () => {
    const user = await AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const userConnections = await ConnectionService.getConnections(user.id);
      const pending = await ConnectionService.getPendingRequests(user.id);
      const sent = await ConnectionService.getSentRequests(user.id);
      console.log(sent);
      const allUsers = await AuthService.getAllUsers();

      // Add user data to requests
      const pendingWithUsers = pending.map((request) => ({
        ...request,
        fromUser: allUsers.find((u) => u.id === request.fromUserId),
      }));

      const sentWithUsers = sent.map((request) => ({
        ...request,
        toUser: allUsers.find((u) => u.id === request.toUserId),
      }));

      setConnections(userConnections);
      setPendingRequests(pendingWithUsers);
      setSentRequests(sentWithUsers);
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

  const filterConnections = (connections: User[]) => {
    if (!searchQuery.trim()) return connections;

    const query = searchQuery.toLowerCase();
    return connections.filter(
      (connection) =>
        connection.name.toLowerCase().includes(query) ||
        connection.username.toLowerCase().includes(query) ||
        (connection.bio && connection.bio.toLowerCase().includes(query))
    );
  };

  const TabButton = ({
    title,
    count,
    isActive,
    onPress,
  }: {
    title: string;
    count: number;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}
      >
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
          <Text
            style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}
          >
            {count}
          </Text>
        </View>
      )}
    </Pressable>
  );

  const renderConnections = () => {
    const filteredConnections = filterConnections(connections);

    if (filteredConnections.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Users color="#9CA3AF" size={48} />
          <Text style={styles.emptyStateText}>
            {searchQuery
              ? "No connections found matching your search"
              : "No connections yet"}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {!searchQuery &&
              "Start discovering and connecting with new people!"}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.connectionsList}>
        {filteredConnections.map((connection) => (
          <View key={connection.id} style={styles.connectionCard}>
            <View style={styles.connectionInfo}>
              <View style={styles.connectionAvatar}>
                <Text style={styles.connectionAvatarText}>
                  {connection.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.connectionDetails}>
                <Text style={styles.connectionName}>{connection.name}</Text>
                <Text style={styles.connectionUsername}>
                  @{connection.username}
                </Text>
                {connection.bio && (
                  <Text style={styles.connectionBio} numberOfLines={2}>
                    {connection.bio}
                  </Text>
                )}
                <View style={styles.connectionStats}>
                  <View style={styles.statItem}>
                    <Users color="#6B7280" size={14} />
                    <Text style={styles.statText}>
                      {connections?.length} connections
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.connectionActions}>
              <Pressable style={styles.messageButton}>
                <MessageCircle color="#3B82F6" size={20} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPendingRequests = () => {
    if (pendingRequests.length === 0) {
      return (
        <View style={styles.emptyState}>
          <UserPlus color="#9CA3AF" size={48} />
          <Text style={styles.emptyStateText}>No pending requests</Text>
          <Text style={styles.emptyStateSubtext}>
            Connection requests will appear here
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.requestsList}>
        {pendingRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestInfo}>
              <View style={styles.requestAvatar}>
                <Text style={styles.requestAvatarText}>
                  {request.fromUser
                    ? request.fromUser.name.charAt(0).toUpperCase()
                    : "?"}
                </Text>
              </View>
              <View style={styles.requestDetails}>
                <Text style={styles.requestName}>Connection Request</Text>
                <Text style={styles.requestUsername}>
                  From{" "}
                  {request.fromUser
                    ? request.fromUser.username
                    : "Unknown User"}
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
    );
  };

  const renderSentRequests = () => {
    if (sentRequests.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Clock color="#9CA3AF" size={48} />
          <Text style={styles.emptyStateText}>No sent requests</Text>
          <Text style={styles.emptyStateSubtext}>
            Requests you send will appear here
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.requestsList}>
        {sentRequests.map((request) => (
          <View key={request.id} style={styles.sentRequestCard}>
            <View style={styles.requestInfo}>
              <View style={styles.requestAvatar}>
                <Text style={styles.requestAvatarText}>
                  {request.fromUser
                    ? request.fromUser.name.charAt(0).toUpperCase()
                    : "?"}
                </Text>
              </View>
              <View style={styles.requestDetails}>
                <Text style={styles.requestName}>Request Sent</Text>
                <Text style={styles.requestUsername}>
                  To{" "}
                  {request.fromUser
                    ? request.fromUser.username
                    : "Unknown User"}
                </Text>
                <Text style={styles.requestTime}>
                  {new Date(request.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.sentRequestStatus}>
              <Clock color="#F59E0B" size={16} />
              <Text style={styles.sentRequestStatusText}>Pending</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Network</Text>
        <Text style={styles.subtitle}>
          Manage your connections and requests
        </Text>
      </View>

      <View style={styles.tabsContainer}>
        <TabButton
          title="Connections"
          count={connections.length}
          isActive={activeTab === "connections"}
          onPress={() => setActiveTab("connections")}
        />
        <TabButton
          title="Pending"
          count={pendingRequests.length}
          isActive={activeTab === "pending"}
          onPress={() => setActiveTab("pending")}
        />
        <TabButton
          title="Sent"
          count={sentRequests.length}
          isActive={activeTab === "sent"}
          onPress={() => setActiveTab("sent")}
        />
      </View>

      {activeTab === "connections" && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search connections..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "connections" && renderConnections()}
        {activeTab === "pending" && renderPendingRequests()}
        {activeTab === "sent" && renderSentRequests()}
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: "#3B82F6",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabButtonText: {
    color: "white",
  },
  tabBadge: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  activeTabBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  activeTabBadgeText: {
    color: "white",
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
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  connectionsList: {
    gap: 16,
  },
  connectionCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  connectionInfo: {
    flex: 1,
    flexDirection: "row",
  },
  connectionAvatar: {
    width: 56,
    height: 56,
    backgroundColor: "#8B5CF6",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  connectionAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  connectionDetails: {
    flex: 1,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  connectionUsername: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  connectionBio: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 8,
    lineHeight: 20,
  },
  connectionStats: {
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
  connectionActions: {
    flexDirection: "row",
    gap: 8,
  },
  messageButton: {
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  requestsList: {
    gap: 16,
  },
  requestCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sentRequestCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  requestAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  requestAvatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  requestDetails: {
    // flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  requestUsername: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  requestTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  requestActions: {
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 10,
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
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 14,
  },
  sentRequestStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
  },
  sentRequestStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F59E0B",
  },
});
