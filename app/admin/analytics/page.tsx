'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card } from '@/components/ui/card'
import { BarChart3, Users, TrendingUp, Eye } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8 flex items-center justify-center">
        <p className="text-gray-400">Carregando Analytics...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-brand-400" />
            Analytics & Atribuição
          </h1>
          <p className="text-gray-400 mt-2">
            Revenue Attribution • De onde vem o dinheiro e onde ele trava?
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 text-center">
          <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Analytics Avançado</h3>
          <p className="text-gray-400 mb-6">Execute o SQL para ativar as métricas profissionais</p>
          <div className="max-w-2xl mx-auto text-left space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">📋 Passo 1: Executar SQL</p>
              <code className="text-xs text-brand-400">supabase-analytics-advanced.sql</code>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">📋 Passo 2: Ativar Hook</p>
              <code className="text-xs text-brand-400">useAnalytics() no app/layout.tsx</code>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-sm text-gray-300">📋 Passo 3: Ver ANALYTICS-QUICK-START.md</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
