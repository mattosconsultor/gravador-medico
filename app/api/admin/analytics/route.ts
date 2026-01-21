import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const { data: health } = await supabaseAdmin
      .from('analytics_health')
      .select('*')
      .single()

    const { data: attribution } = await supabaseAdmin
      .from('marketing_attribution')
      .select('*')
      .limit(10)

    const { data: funnel } = await supabaseAdmin
      .from('analytics_funnel')
      .select('*')
      .single()

    return NextResponse.json({
      health: health || null,
      attribution: attribution || [],
      funnel: funnel || null
    })
  } catch (error) {
    console.error('Erro ao carregar analytics admin:', error)
    return NextResponse.json({ error: 'Erro ao carregar analytics' }, { status: 500 })
  }
}
