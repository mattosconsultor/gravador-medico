import { NextRequest } from 'next/server'
import { getUserFromToken } from './auth'
import type { User } from './supabase'

interface AuthResult {
  user?: User
  error?: string
  status?: number
}

export function getAuthTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  const cookieToken = request.cookies.get('auth_token')?.value
  return cookieToken || null
}

export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const token = getAuthTokenFromRequest(request)

  if (!token) {
    return { error: 'Token não fornecido', status: 401 }
  }

  const user = await getUserFromToken(token)

  if (!user) {
    return { error: 'Token inválido ou usuário não encontrado', status: 401 }
  }

  if (!user.has_access) {
    return { error: 'Sem acesso ao produto', status: 403 }
  }

  return { user }
}

export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const auth = await requireAuth(request)
  if (!auth.user) {
    return auth
  }

  if (auth.user.role !== 'admin') {
    return { error: 'Acesso restrito a administradores', status: 403 }
  }

  return auth
}
