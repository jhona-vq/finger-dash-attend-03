
import { createContext, useContext, useState, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { toast } from "sonner";

// Sample users for demo
const DEMO_USERS: User[] = [
  { 
    id: "1", 
    name: "John Smith", 
    email: "teacher@example.com", 
    isTeacher: true 
  },
  { 
    id: "2", 
    name: "Jane Doe", 
    email: "student@example.com", 
    isTeacher: false 
  }
];

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = DEMO_USERS.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // In a real app, you would verify the password here
      
      setUser(foundUser);
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, isTeacher: boolean) => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (DEMO_USERS.some(u => u.email === email)) {
        throw new Error("User already exists with this email");
      }
      
      // In a real app, you would create a new user in the database
      const newUser: User = {
        id: String(DEMO_USERS.length + 1),
        name,
        email,
        isTeacher
      };
      
      // For demo purpose, we're just logging in the user
      setUser(newUser);
      toast.success("Registered successfully");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const authenticateWithFingerprint = async () => {
    try {
      // Simulate fingerprint authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, we'll just log in as the teacher
      setUser(DEMO_USERS[0]);
      toast.success("Fingerprint authentication successful");
    } catch (error: any) {
      toast.error("Fingerprint authentication failed");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        authenticateWithFingerprint
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
