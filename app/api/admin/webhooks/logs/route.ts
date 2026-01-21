import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('webhooks_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Erro ao buscar webhooks:', error)
      return NextResponse.json({ error: 'Erro ao buscar webhooks' }, { status: 500 })
    }

    return NextResponse.json({ logs: data || [] })
  } catch (error) {
    console.error('Erro ao carregar webhooks:', error)
    return NextResponse.json({ error: 'Erro ao carregar webhooks' }, { status: 500 })
  }
}
