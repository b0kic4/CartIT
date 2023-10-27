import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type StockContextType = {
  stock: number;
  setStock: Dispatch<SetStateAction<number>>;
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [stock, setStock] = useState(0);

  return (
    <StockContext.Provider value={{ stock, setStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = (): StockContextType => {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error("useStock must be used within a StockProvider");
  }
  return context;
};
