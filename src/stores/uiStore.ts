import { create } from 'zustand'

interface UiState {
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
