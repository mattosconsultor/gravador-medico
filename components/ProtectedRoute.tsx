"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar sessão via cookie HttpOnly
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        })

        if (!response.ok) {
          router.push("/login")
          return
        }

        const data = await response.json()

        // Verificar se tem acesso
        if (!data.user?.has_access) {
          router.push("/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
