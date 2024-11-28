// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  posts: number;
  solutions: number;
  favorites: number[];
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const validEmail = "dillan.fernando@ideas2it.com";
    const mockUser: User = {
      id: 1,
      name: "Dillan Fernando",
      email: validEmail,
      posts: 5,
      solutions: 3,
      favorites: [1, 3, 5],
    };
    setUser(mockUser);
    return true;
    // const validEmail = "dillan.fernando@ideas2it.com";
    const validPassword = "Dildish*10";

    if (email === validEmail && password === validPassword) {
      // Simulate fetching user data after successful login
      const mockUser: User = {
        id: 1,
        name: "Dillan Fernando",
        email: validEmail,
        posts: 5,
        solutions: 3,
        favorites: [1, 3, 5],
      };

      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser, UserContext };
