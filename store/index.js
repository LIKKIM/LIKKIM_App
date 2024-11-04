import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useLikkimStore = create(
    persist(
        (set, get) => ({
            homeSelectCardName: "",//默认选择卡片
            setHomeSelectCardName: (_n) => set({ homeSelectCardName: _n })
        }),
        {
            name: 'LIKKIM',
            storage: createJSONStorage(() => AsyncStorage)
        },
    ),
)

// export const useHomeSelectCardName = useLikkimStore((state) => state.homeSelectCardName)
// export const setHomeSelectCardName = useLikkimStore((state) => state.setHomeSelectCardName)
