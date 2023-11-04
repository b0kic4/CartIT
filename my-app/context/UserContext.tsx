import React, { createContext, useContext, useState, ReactNode } from "react";

type UserData = {
  id: string;
  username: string;
  email: string;
  name: string;
  profilePicture: string; // Adding the profilePicture field
  // Add other user properties as needed
};

type UserContextType = {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  setProfilePicture: React.Dispatch<React.SetStateAction<string>>; // New function to set profile picture
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserContextProviderProps = {
  children: ReactNode;
};

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>(""); // State to manage profile picture

  return (
    <UserContext.Provider value={{ user, setUser, setProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
}
