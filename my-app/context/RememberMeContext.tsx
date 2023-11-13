import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface RememberMeContextProps {
  rememberMe: boolean;
  toggleRememberMe: () => void;
  saveRememberMeChoice: (choice: boolean) => void;
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

  useEffect(() => {
    const loadRememberMeChoice = async () => {
      try {
        const storedChoice = await AsyncStorage.getItem("rememberMe");
        if (storedChoice) {
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error finding stored choice for remember me: ", error);
      }
    };
    loadRememberMeChoice();
  }, []);

  const toggleRememberMe = () => {
    setRememberMe((prevRememberMe) => !prevRememberMe);
    saveRememberMeChoice(!rememberMe);
  };

  const saveRememberMeChoice = async (choice: boolean) => {
    try {
      await AsyncStorage.setItem("rememberMe", choice.toString());
    } catch (error) {
      console.error("Error saving remember me choice: ", error);
    }
  };

  return (
    <RememberMeContext.Provider
      value={{ rememberMe, toggleRememberMe, saveRememberMeChoice }}
    >
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
