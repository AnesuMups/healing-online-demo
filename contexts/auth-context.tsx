"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export type UserRole = "patient" | "admin"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  membershipPlan?: "individual" | "family" | null
  membershipStatus?: "active" | "inactive" | "pending"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
}

const AUTH_STORAGE_KEY = "Global Healer-online-auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore auth state from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as User
        setUser(parsed)
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Persist auth state whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = useCallback(async (email: string, _password: string, role: UserRole): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000))
    const mockUser: User = {
      id: role === "admin" ? "admin-001" : "patient-001",
      name: role === "admin" ? "Dr. Admin" : "John Doe",
      email,
      role,
      membershipPlan: role === "patient" ? "individual" : null,
      membershipStatus: role === "patient" ? "active" : undefined,
      createdAt: "2025-01-15",
    }
    setUser(mockUser)
    return true
  }, [])

  const register = useCallback(async (name: string, email: string, _password: string, role: UserRole): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1200))
    const mockUser: User = {
      id: `${role}-${Date.now()}`,
      name,
      email,
      role,
      membershipPlan: null,
      membershipStatus: "inactive",
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUser(mockUser)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
