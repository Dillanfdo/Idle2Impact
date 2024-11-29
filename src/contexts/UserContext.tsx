// src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { loginUser } from "../apis/apiFunctions";

type User = {
  created_at: string;  // ISO date string format
  email: string;
  name: string;
  password: string;
  role: string;
  status: string;
  updated_at: string;  // ISO date string format
  user_id: number;
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
    // const validEmail = "dillan.fernando@ideas2it.com";
    // const mockUser: User = {
    //   id: 1,
    //   name: "Dillan Fernando",
    //   email: validEmail,
    //   posts: 5,
    //   solutions: 3,
    //   favorites: [1, 3, 5],
    // };
    // setUser(mockUser);
    const userData = await loginUser(email, password);
    if(userData.status==1){
      const parsedData = JSON.parse(userData.data).Table;
      const user = parsedData[0];
      if (user) {
        setUser({
          created_at: user.created_at,
          email: user.email,
          name: user.name,
          password: user.password,  // You may want to omit or hash this in production
          role: user.role,
          status: user.status,
          updated_at: user.updated_at,
          user_id: user.user_id
        });
        return true;  // Successfully logged in
      } else {
        console.error("No user found in the data.");
        return false;  // No user in the response
      }
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
