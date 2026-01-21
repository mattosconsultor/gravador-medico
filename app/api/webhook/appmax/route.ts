import { NextRequest } from 'next/server'
import { handleAppmaxWebhook } from '@/lib/appmax-webhook'

export async function POST(request: NextRequest) {
  const result = await handleAppmaxWebhook(request, '/api/webhook/appmax')
  return result.response
}

export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', endpoint: '/api/webhook/appmax' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
