import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  userId: string | null
  fullName: string | null
  email: string | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (payload: {
    userId: string; fullName: string; email: string
    accessToken: string; refreshToken: string
  }) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      fullName: null,
      email: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (payload) => set({
        ...payload,
        isAuthenticated: true,
      }),

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),

      logout: () => set({
        userId: null, fullName: null, email: null,
        accessToken: null, refreshToken: null, isAuthenticated: false,
      }),
    }),
    { name: 'fleetearn-auth', partialize: (s) => ({
        userId: s.userId, fullName: s.fullName, email: s.email,
        accessToken: s.accessToken, refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      })
    }
  )
)
