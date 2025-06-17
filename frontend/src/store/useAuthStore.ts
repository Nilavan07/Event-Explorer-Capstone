import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5050/api"
    : "https://event-explorer-capstone.onrender.com/api";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  favorites: string[];
  tickets: any[];
}

interface AuthState {
  currentUser: User | null;
  users: User[];
  isLoggedIn: boolean;
  fetchUsers: () => void;
  login: (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<boolean>;

  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToFavorites: (eventId: string) => void;
  removeFromFavorites: (eventId: string) => void;
  updateUserProfile: (userData: Partial<User>) => void;
  addUser: (userData: Omit<User, "id">) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        {
          _id: "admin",
          name: "Admin User",
          email: "admin@example.com",
          password: "admin123",
          role: "admin",
          favorites: [],
          tickets: [],
        },
      ],
      isLoggedIn: false,

      fetchUsers: async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/users`);
          if (!response.ok) throw new Error("Failed to fetch users");

          const users: User[] = await response.json();
          set({ users });
        } catch (error) {
          console.error("Fetch users error:", error);
        }
      },

      login: async (
        email: string,
        password: string,
        role: "user" | "admin"
      ) => {
        try {
          const response = await fetch(`${API_BASE_URL}/users`);
          let users: User[] = [];

          if (response.ok) {
            users = await response.json();
          }

          const hasAdmin = users.some((u) => u.role === "admin");
          if (!hasAdmin) {
            users.push({
              _id: "admin",
              name: "Admin User",
              email: "admin@example.com",
              password: "admin123",
              role: "admin",
              favorites: [],
              tickets: [],
            });
          }

          set({ users });

          const user = users.find(
            (u) =>
              u.email === email && u.password === password && u.role === role
          );

          if (user) {
            set({ currentUser: user, isLoggedIn: true });
            return true;
          }

          return false;
        } catch (error) {
          console.error("Login error:", error);
          return false;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/users/register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ name, email, password }),
            }
          );

          if (!response.ok) {
            return false;
          }

          const data = await response.json();

          const newUser: User = {
            ...data,
            favorites: data.favorites || [],
            tickets: data.tickets || [],
            role: "user",
          };

          set((state) => ({
            users: [...state.users, newUser],
            currentUser: newUser,
            isLoggedIn: true,
          }));

          return true;
        } catch (error) {
          console.error("Register error:", error);
          return false;
        }
      },

      logout: () => {
        const { currentUser, users } = get();

        if (currentUser) {
          const updatedUser = { ...currentUser, favorites: [] };
          const updatedUsers = users.map((user) =>
            user._id === currentUser._id ? updatedUser : user
          );

          set({
            currentUser: null,
            users: updatedUsers,
            isLoggedIn: false,
          });
        } else {
          set({
            currentUser: null,
            isLoggedIn: false,
          });
        }
      },

      addToFavorites: async (eventId: string) => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        try {
          const response = await fetch(
            `${API_BASE_URL}/users/${currentUser._id}/favorites`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ eventId }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to add to favorites");
          }

          const data = await response.json();

          const updatedUser = {
            ...currentUser,
            favorites: data.favorites,
          };

          const updatedUsers = users.map((user) =>
            user._id === currentUser._id ? updatedUser : user
          );

          set({ currentUser: updatedUser, users: updatedUsers });
        } catch (error) {
          console.error("Error adding to favorites:", error);
        }
      },

      removeFromFavorites: async (eventId: string) => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        try {
          const response = await fetch(
            `${API_BASE_URL}/users/${currentUser._id}/favorites/${eventId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to remove from favorites");
          }

          const data = await response.json();

          const updatedUser = {
            ...currentUser,
            favorites: data.favorites,
          };

          const updatedUsers = users.map((user) =>
            user._id === currentUser._id ? updatedUser : user
          );

          set({ currentUser: updatedUser, users: updatedUsers });
        } catch (error) {
          console.error("Error removing from favorites:", error);
        }
      },

      updateUserProfile: async (userData: Partial<User>) => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        try {
          const response = await fetch(
            `${API_BASE_URL}/users/${currentUser._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update user profile");
          }

          const updatedUserFromServer = await response.json();

          const updatedUsers = users.map((user) =>
            user._id === currentUser._id ? updatedUserFromServer : user
          );

          set({ currentUser: updatedUserFromServer, users: updatedUsers });
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      },

      addUser: async (userData: Omit<User, "id">) => {
        try {
          const response = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          if (!response.ok) throw new Error("Failed to add user");

          const newUser: User = await response.json();

          set((state) => ({
            users: [...state.users, newUser],
          }));
        } catch (error) {
          console.error("Add user error:", error);
        }
      },

      deleteUser: async (userId: string) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/users/${userId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) throw new Error("Failed to delete user");

          set((state) => ({
            users: state.users.filter((user) => user._id !== userId),
            ...(state.currentUser?._id === userId && {
              currentUser: null,
              isLoggedIn: false,
            }),
          }));
        } catch (error) {
          console.error("Delete user error:", error);
        }
      },

      updateUser: async (userId: string, userData: Partial<User>) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/users/${userId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            }
          );

          if (!response.ok) throw new Error("Failed to update user");

          const updatedUser = await response.json();

          set((state) => ({
            users: state.users.map((user) =>
              user._id === userId ? updatedUser : user
            ),
            ...(state.currentUser?._id === userId && {
              currentUser: updatedUser,
            }),
          }));
        } catch (error) {
          console.error("Update user error:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
