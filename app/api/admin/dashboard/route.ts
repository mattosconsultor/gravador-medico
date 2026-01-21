import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth-server'
import {
  fetchDashboardMetrics,
  fetchSalesChartData,
  fetchFunnelData
} from '@/lib/dashboard-queries'

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  try {
    const [metricsRes, chartRes, funnelRes] = await Promise.all([
      fetchDashboardMetrics(supabaseAdmin),
      fetchSalesChartData(supabaseAdmin),
      fetchFunnelData(supabaseAdmin)
    ])

    return NextResponse.json({
      metrics: metricsRes.data || null,
      chartData: chartRes.data || [],
      funnelData: funnelRes || [],
      errors: {
        metrics: metricsRes.error ? 'Erro ao buscar métricas' : null,
        chart: chartRes.error ? 'Erro ao buscar gráfico' : null
      }
    })
  } catch (error) {
    console.error('Erro ao carregar dashboard admin:', error)
    return NextResponse.json({ error: 'Erro ao carregar dashboard' }, { status: 500 })
  }
}
