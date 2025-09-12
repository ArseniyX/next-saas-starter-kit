"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "@/lib/auth-client"

interface AuthContextType {
  session: any
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ session: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending) {
      setLoading(false)
      
      // Handle redirects based on authentication status
      const isAuthPage = pathname.startsWith('/auth')
      const isDashboardPage = pathname.startsWith('/dashboard')
      
      if (!session && isDashboardPage) {
        // User is not authenticated but trying to access dashboard
        router.push('/auth/signin')
      } else if (session && isAuthPage) {
        // User is authenticated but on auth page
        router.push('/dashboard')
      }
    }
  }, [session, isPending, pathname, router])

  return (
    <AuthContext.Provider value={{ session, loading: isPending || loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)