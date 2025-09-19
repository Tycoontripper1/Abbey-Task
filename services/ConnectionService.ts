import { Connection, ConnectionRequest, User } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from "./AuthService";

const STORAGE_KEYS = {
  CONNECTIONS: "user_connections",
  REQUESTS: "connection_requests",
};

export class ConnectionService {
  static async getConnections(userId: string): Promise<User[]> {
    try {
      const connections = await this.getAllConnections();
      const users = await AuthService.getAllUsers();

      const userConnections = connections
        .filter(
          (c) =>
            (c.userId === userId || c.connectedUserId === userId) &&
            c.status === "accepted"
        )
        .map((c) => (c.userId === userId ? c.connectedUserId : c.userId));

      return users.filter((u) => userConnections.includes(u.id));
    } catch (error) {
      return [];
    }
  }

  static async getPendingRequests(
    userId: string
  ): Promise<ConnectionRequest[]> {
    try {
      const requests = await this.getAllRequests();
      return requests.filter(
        (r) => r.toUserId === userId && r.status === "pending"
      );
    } catch (error) {
      return [];
    }
  }

  static async getSentRequests(userId: string): Promise<ConnectionRequest[]> {
    try {
      const requests = await this.getAllRequests();
      return requests.filter(
        (r) => r.fromUserId === userId && r.status === "pending"
      );
    } catch (error) {
      return [];
    }
  }

  static async sendConnectionRequest(
    fromUserId: string,
    toUserId: string
  ): Promise<boolean> {
    try {
      const requests = await this.getAllRequests();

      // Check if request already exists
      const existingRequest = requests.find(
        (r) =>
          (r.fromUserId === fromUserId && r.toUserId === toUserId) ||
          (r.fromUserId === toUserId && r.toUserId === fromUserId)
      );

      if (existingRequest) return false;

      const newRequest: ConnectionRequest = {
        id: Date.now().toString(),
        fromUserId,
        toUserId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      requests.push(newRequest);
      await AsyncStorage.setItem(
        STORAGE_KEYS.REQUESTS,
        JSON.stringify(requests)
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  static async acceptConnectionRequest(requestId: string): Promise<boolean> {
    try {
      const requests = await this.getAllRequests();
      const connections = await this.getAllConnections();

      const requestIndex = requests.findIndex((r) => r.id === requestId);
      if (requestIndex === -1) return false;

      const request = requests[requestIndex];

      // Update request status
      requests[requestIndex].status = "accepted";

      // Create connection
      const newConnection: Connection = {
        id: Date.now().toString(),
        userId: request.fromUserId,
        connectedUserId: request.toUserId,
        status: "accepted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      connections.push(newConnection);

      await AsyncStorage.setItem(
        STORAGE_KEYS.REQUESTS,
        JSON.stringify(requests)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.CONNECTIONS,
        JSON.stringify(connections)
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  static async declineConnectionRequest(requestId: string): Promise<boolean> {
    try {
      const requests = await this.getAllRequests();
      const requestIndex = requests.findIndex((r) => r.id === requestId);

      if (requestIndex >= 0) {
        requests[requestIndex].status = "declined";
        await AsyncStorage.setItem(
          STORAGE_KEYS.REQUESTS,
          JSON.stringify(requests)
        );
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  static async getConnectionStatus(
    userId: string,
    otherUserId: string
  ): Promise<"none" | "pending" | "sent" | "connected"> {
    try {
      const connections = await this.getAllConnections();
      const requests = await this.getAllRequests();

      // Check if connected
      const isConnected = connections.find(
        (c) =>
          ((c.userId === userId && c.connectedUserId === otherUserId) ||
            (c.userId === otherUserId && c.connectedUserId === userId)) &&
          c.status === "accepted"
      );

      if (isConnected) return "connected";

      // Check for pending requests
      const pendingRequest = requests.find(
        (r) =>
          r.status === "pending" &&
          ((r.fromUserId === userId && r.toUserId === otherUserId) ||
            (r.fromUserId === otherUserId && r.toUserId === userId))
      );

      if (pendingRequest) {
        return pendingRequest.fromUserId === userId ? "sent" : "pending";
      }

      return "none";
    } catch (error) {
      return "none";
    }
  }

  private static async getAllConnections(): Promise<Connection[]> {
    try {
      const connections = await AsyncStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      return connections ? JSON.parse(connections) : [];
    } catch {
      return [];
    }
  }

  private static async getAllRequests(): Promise<ConnectionRequest[]> {
    try {
      const requests = await AsyncStorage.getItem(STORAGE_KEYS.REQUESTS);
      return requests ? JSON.parse(requests) : [];
    } catch {
      return [];
    }
  }
}
