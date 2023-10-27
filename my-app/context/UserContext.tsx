import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the user data type
type UserData = {
  id: string;
  username: string;
  email: string;
  // Add other user properties as needed
};

// Create a context
type UserContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
type UserContextProviderProps = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Create a custom hook to access the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}
