import { create } from "zustand";

export const useStore = create((set) => ({
    user: '',
    setUser: (user) => set(() => ({ user: user })),
    isLoading: true,
    setLoading: (is) => set(() => ({ isLoading: is })),
    isAdmin: false,
    setAdmin: (is) => set(() => ({ isAdmin: is })),
    // path: '',
    // setPath: (path) => set(() => ({ path: path })),
    // player: {},
    // setPlayer: (player) => set(() => ({ player: player })),
}));