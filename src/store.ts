import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Tenant{
  id:number;
  name:string;
  adress:string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant?:Tenant
}

interface AuthState {
  user: null | User;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  //this useAuthStore will return a hook that we can use in app
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
