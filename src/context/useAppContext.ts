import { useContext } from "react";
import { AppContext } from "./AppContext";
import type { AppContextType } from "../utils/types"; // Ensure this matches the actual type of your AppContext

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within the provider");
  return context;
};
