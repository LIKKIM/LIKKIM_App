import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useLikkimStore = create(
    persist(
        (set, get) => ({
            homeSelectCardName: "",
            setHomeSelectCardName: (_n) => set({ homeSelectCardName: _n })
        }),
        {
            name: 'LIKKIM', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)

export const useHomeSelectCardName = useLikkimStore((state) => state.homeSelectCardName)
export const setHomeSelectCardName = useLikkimStore((state) => state.setHomeSelectCardName)
