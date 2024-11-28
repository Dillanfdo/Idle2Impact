// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { loginUser } from "../apis/apiFunctions";

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    debugger;
    const userData = await loginUser(email, password);
    if(userData.status==1){
      const parsedData = JSON.parse(userData.data).Table;
      setUser(parsedData);
      return true;
    }else{
      return false;
    }

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
