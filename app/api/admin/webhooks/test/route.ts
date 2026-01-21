import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-server'
import { handleAppmaxWebhook } from '@/lib/appmax-webhook'

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status || 401 })
  }

  const payload = {
    event: 'order.approved',
    order_id: `TEST-${Date.now()}`,
    amount: 100.0,
    payment_method: 'pix',
    customer: {
      name: 'Teste Webhook',
      email: 'teste@gravadormedico.com'
    },
    timestamp: new Date().toISOString()
  }

  const rawBody = JSON.stringify(payload)
  const headers = new Headers({ 'content-type': 'application/json' })
  const secret = process.env.APPMAX_WEBHOOK_SECRET

  if (secret) {
    const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    headers.set('x-appmax-signature', `sha256=${signature}`)
    headers.set('x-appmax-timestamp', `${Date.now()}`)
  }

  const testRequest = new NextRequest(new URL('/api/webhook/appmax', request.url), {
    method: 'POST',
    headers,
    body: rawBody
  })

  const result = await handleAppmaxWebhook(testRequest, '/api/webhook/appmax')
  return result.response
}
