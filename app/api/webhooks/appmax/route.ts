import { NextRequest } from 'next/server'
import { handleAppmaxWebhook } from '@/lib/appmax-webhook'

export async function POST(request: NextRequest) {
  const result = await handleAppmaxWebhook(request, '/api/webhooks/appmax')
  return result.response
}

export async function GET() {
  return new Response(JSON.stringify({ status: 'ok', endpoint: '/api/webhooks/appmax' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
