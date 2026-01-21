import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  return NextResponse.json({
    appmaxTokenConfigured: Boolean(process.env.APPMAX_API_TOKEN),
    appmaxWebhookSecretConfigured: Boolean(process.env.APPMAX_WEBHOOK_SECRET),
    supabaseServiceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    appmaxApiUrl: process.env.APPMAX_API_URL || 'https://admin.appmax.com.br/api/v3'
  })
}
