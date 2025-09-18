import { User } from "@/types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "user_data",
  SESSION: "user_session",
  ONBOARDING: "onboarding_complete",
  USERS: "all_users",
};

export class AuthService {
  static async login(email: string, password: string): Promise<User | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = await this.getAllUsers();
      const user = users.find((u) => u.email === email);

      if (user) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SESSION,
          JSON.stringify({
            userId: user.id,
            loginTime: new Date().toISOString(),
          })
        );
        return user;
      }

      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  static async register(
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<User | null> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = await this.getAllUsers();

      // Check if user already exists
      if (users.find((u) => u.email === email || u.username === username)) {
        return null;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        username,
        bio: "",
        joinDate: new Date().toISOString(),
        friendsCount: 0,
        connectionsCount: 0,
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      await AsyncStorage.setItem(
        STORAGE_KEYS.SESSION,
        JSON.stringify({
          userId: newUser.id,
          loginTime: new Date().toISOString(),
        })
      );

      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  }

  static async logout(): Promise<void> {
    await AsyncStorage.multiRemove([STORAGE_KEYS.SESSION, STORAGE_KEYS.USER]);
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const session = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      if (!session) return null;

      const { userId } = JSON.parse(session);
      const users = await this.getAllUsers();
      return users.find((u) => u.id === userId) || null;
    } catch (error) {
      return null;
    }
  }

  static async isOnboardingComplete(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
      return value === "true";
    } catch {
      return false;
    }
  }

  static async completeOnboarding(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, "true");
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      if (users) {
        return JSON.parse(users);
      }

      // Initialize with demo users
      const demoUsers: User[] = [
        {
          id: "1",
          email: "alice@example.com",
          name: "Alice Johnson",
          username: "alice_j",
          bio: "Love technology and design. Always learning something new!",
          joinDate: "2024-01-15T00:00:00.000Z",
          friendsCount: 12,
          connectionsCount: 25,
        },
        {
          id: "2",
          email: "bob@example.com",
          name: "Bob Smith",
          username: "bobsmith",
          bio: "Developer by day, gamer by night. Coffee enthusiast.",
          joinDate: "2024-02-01T00:00:00.000Z",
          friendsCount: 8,
          connectionsCount: 15,
        },
        {
          id: "3",
          email: "carol@example.com",
          name: "Carol Davis",
          username: "carol_d",
          bio: "Digital artist and creative director. Passionate about UI/UX.",
          joinDate: "2024-01-20T00:00:00.000Z",
          friendsCount: 18,
          connectionsCount: 32,
        },
      ];

      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
      return demoUsers;
    } catch (error) {
      return [];
    }
  }

  static async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return users[userIndex];
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}
