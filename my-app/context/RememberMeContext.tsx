import React, { ReactNode, createContext, useContext, useState } from "react";

interface RememberMeContextProps {
  rememberMe: boolean;
  toggleRememberMe: () => void;
}

const RememberMeContext = createContext<RememberMeContextProps | undefined>(
  undefined
);

type RememberMeProviderProps = {
  children: ReactNode;
};

export const RememberMeProvider: React.FC<RememberMeProviderProps> = ({
  children,
}: RememberMeProviderProps) => {
  const [rememberMe, setRememberMe] = useState(false);

  const toggleRememberMe = () => {
    setRememberMe((prevRememberMe) => !prevRememberMe);
  };

  return (
    <RememberMeContext.Provider value={{ rememberMe, toggleRememberMe }}>
      {children}
    </RememberMeContext.Provider>
  );
};

export const useRememberMe = (): RememberMeContextProps => {
  const context = useContext(RememberMeContext);

  if (!context) {
    throw new Error("useRememberMe must be used within a RememberMeProvider");
  }

  return context;
};
