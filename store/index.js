import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSecureStore = create(
  persist(
    (set, get) => ({
      homeSelectCardName: "", // 默认选择的卡片
      setHomeSelectCardName: (_n) => set({ homeSelectCardName: _n }),
    }),
    {
      name: "secure-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useHomeSelectCardName = () =>
  useSecureStore((state) => state.homeSelectCardName);

export const setHomeSelectCardName = () =>
  useSecureStore((state) => state.setHomeSelectCardName);
