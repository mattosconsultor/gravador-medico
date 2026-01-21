import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: abandonedCount } = await supabaseAdmin
      .from('abandoned_carts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'abandoned')

    const { count: pendingCount } = await supabaseAdmin
      .from('sales')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .gte('created_at', yesterday.toISOString())

    const { count: approvedCount } = await supabaseAdmin
      .from('sales')
      .select('*', { count: 'exact', head: true })
      .in('status', ['approved', 'paid'])
      .gte('created_at', yesterday.toISOString())

    return NextResponse.json({
      abandonedCarts: abandonedCount || 0,
      pendingOrders: pendingCount || 0,
      approvedOrders: approvedCount || 0
    })
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json({ error: 'Erro ao buscar notificações' }, { status: 500 })
  }
}
