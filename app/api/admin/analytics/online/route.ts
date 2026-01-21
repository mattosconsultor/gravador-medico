import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const { data } = await supabaseAdmin
      .from('analytics_visitors_online')
      .select('*')
      .single()

    return NextResponse.json({
      online_count: data?.online_count || 0,
      mobile_count: data?.mobile_count || 0,
      desktop_count: data?.desktop_count || 0,
      tablet_count: data?.tablet_count || 0
    })
  } catch (error) {
    console.error('Erro ao buscar visitantes online:', error)
    return NextResponse.json({ error: 'Erro ao buscar visitantes online' }, { status: 500 })
  }
}
