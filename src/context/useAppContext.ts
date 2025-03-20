import { useContext } from "react";
import { AppContext } from "./AppContext";

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("AppContext must be used within the provider");
  return context;
};
