import { createContext, useContext } from "react";
import type { Usertbl } from "../@types/Usertbl";

interface UserContextType {
  user: Usertbl | null;
  setUser: React.Dispatch<React.SetStateAction<Usertbl | null>>
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useAuth must be used within UserProvider");
  return context;
};