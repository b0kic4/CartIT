import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type QuantityContextType = {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
};

const QuantityContext = createContext<QuantityContextType | undefined>(
  undefined
);

export const QuantityProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <QuantityContext.Provider value={{ quantity, setQuantity }}>
      {children}
    </QuantityContext.Provider>
  );
};

export const useQuantity = (): QuantityContextType => {
  const context = useContext(QuantityContext);
  if (context === undefined) {
    throw new Error("useQuantity must be used within a QuantityProvider");
  }
  return context;
};
