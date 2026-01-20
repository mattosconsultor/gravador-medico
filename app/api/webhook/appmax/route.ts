import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * =============================================
 * WEBHOOK APPMAX - VERSÃO SIMPLIFICADA
 * =============================================
 */

// Cliente Supabase ADMIN (ignora RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Mapeia status da Appmax
function mapStatus(status: string): string {
  const map: Record<string, string> = {
    'paid': 'approved',
    'approved': 'approved',
    'pending': 'pending',
    'canceled': 'refused',
    'refunded': 'refunded',
    'refused': 'refused',
  }
  return map[status?.toLowerCase()] || 'pending'
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  console.log('🔔 ========================================')
  console.log('🔔 WEBHOOK APPMAX RECEBIDO:', new Date().toISOString())
  console.log('🔔 ========================================')
  
  try {
    // Ler payload
    const body = await request.json()
    console.log('📦 Payload:', JSON.stringify(body, null, 2))

    // IP de origem
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    // 1️⃣ SALVAR LOG DO WEBHOOK
    const { data: webhookLog, error: logError } = await supabaseAdmin
      .from('webhooks_logs')
      .insert({
        source: 'appmax',
        event_type: body.event || body.status || 'unknown',
        ip_address: ipAddress,
        user_agent: request.headers.get('user-agent'),
        payload: body,
        processed: false,
      })
      .select()
      .single()

    if (logError) {
      console.error('❌ Erro ao salvar log:', logError)
    } else {
      console.log('✅ Log salvo:', webhookLog.id)
    }

    // 2️⃣ EXTRAIR DADOS DO PAYLOAD
    const data = body.data || body.order || body
    
    // Cliente
    const customer = data.customer || body.customer || {}
    const customerName = customer.firstname 
      ? `${customer.firstname} ${customer.lastname || ''}`.trim()
      : (customer.name || body.name || 'Cliente Desconhecido')
    
    const customerEmail = customer.email || body.email || `cliente-${Date.now()}@appmax.com`
    const customerPhone = customer.telephone || customer.phone || body.phone || null
    const customerCpf = customer.cpf || body.cpf || null
    const customerId = (customer.id || body.customer_id)?.toString() || null

    console.log('👤 Cliente:', { name: customerName, email: customerEmail })

    // Status e Valores
    const rawStatus = data.status || body.status || 'pending'
    const finalStatus = mapStatus(rawStatus)
    
    const totalAmount = parseFloat(data.total || data.full_payment_amount || body.total || body.amount || 0)
    const discount = parseFloat(data.discount || body.discount || 0)
    const paymentMethod = (data.payment_type || data.payment_method || body.payment_method || 'pix').toLowerCase()

    console.log('💰 Venda:', { total: totalAmount, status: finalStatus, payment: paymentMethod })

    // Produtos
    const products = data.products || body.products || data.items || body.items || []
    console.log('📦 Produtos:', products.length)

    // 3️⃣ UPSERT CLIENTE
    const { data: customerData, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert({
        email: customerEmail,
        name: customerName,
        phone: customerPhone,
        cpf: customerCpf,
        appmax_customer_id: customerId,
        status: 'active',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
      })
      .select()
      .single()

    if (customerError) {
      console.error('❌ Erro ao salvar cliente:', customerError)
      throw customerError
    }

    console.log('✅ Cliente salvo:', customerData.id)

    // 4️⃣ PROCESSAR PRODUTOS E CRIAR VENDA
    let saleId: string | null = null
    
    for (const product of products) {
      const productName = product.name || product.product_name || 'Produto Desconhecido'
      const productSku = product.sku || product.code || `SKU-${Date.now()}`
      const productPrice = parseFloat(product.price || product.unit_price || totalAmount || 0)

      console.log('� Produto:', { name: productName, sku: productSku, price: productPrice })

      // UPSERT PRODUTO
      const { data: productData, error: productError } = await supabaseAdmin
        .from('products')
        .upsert({
          sku: productSku,
          name: productName,
          price: productPrice,
          appmax_product_id: product.id?.toString() || null,
          category: 'Digital',
          is_active: true,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'sku',
        })
        .select()
        .single()

      if (productError) {
        console.error('⚠️ Erro ao salvar produto:', productError)
        continue
      }

      console.log('✅ Produto salvo:', productData.id)

      // CRIAR VENDA (apenas na primeira iteração)
      if (!saleId) {
        const { data: saleData, error: saleError } = await supabaseAdmin
          .from('sales')
          .insert({
            customer_id: customerData.id,
            total_amount: totalAmount,
            discount_amount: discount,
            final_amount: totalAmount - discount,
            payment_method: paymentMethod,
            payment_status: finalStatus === 'approved' ? 'paid' : 'pending',
            status: finalStatus,
            source: 'appmax',
            metadata: {
              raw_webhook: body,
              event_type: body.event,
              appmax_order_id: (data.id || body.order_id || body.id)?.toString(),
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (saleError) {
          console.error('❌ Erro ao salvar venda:', saleError)
          throw saleError
        }

        saleId = saleData.id
        console.log('✅ Venda criada:', saleId)
      }

      // CRIAR ITEM DA VENDA
      const quantity = parseInt(product.quantity || 1)
      const subtotal = productPrice * quantity

      const { error: itemError } = await supabaseAdmin
        .from('sales_items')
        .insert({
          sale_id: saleId,
          product_id: productData.id,
          quantity: quantity,
          unit_price: productPrice,
          subtotal: subtotal,
          created_at: new Date().toISOString(),
        })

      if (itemError) {
        console.error('⚠️ Erro ao salvar item:', itemError)
      } else {
        console.log('✅ Item salvo:', productName)
      }
    }

    // 5️⃣ ATUALIZAR MÉTRICAS DO CLIENTE
    if (finalStatus === 'approved' && customerData?.id) {
      const { data: metricsData } = await supabaseAdmin
        .from('sales')
        .select('final_amount')
        .eq('customer_id', customerData.id)
        .eq('status', 'approved')

      if (metricsData) {
        const totalOrders = metricsData.length
        const totalSpent = metricsData.reduce((sum, s) => sum + (s.final_amount || 0), 0)
        const avgOrderValue = totalSpent / totalOrders || 0

        await supabaseAdmin
          .from('customers')
          .update({
            total_orders: totalOrders,
            total_spent: totalSpent,
            average_order_value: avgOrderValue,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerData.id)

        console.log('✅ Métricas atualizadas:', { totalOrders, totalSpent })
      }
    }

    // 6️⃣ MARCAR LOG COMO PROCESSADO
    if (webhookLog) {
      await supabaseAdmin
        .from('webhooks_logs')
        .update({ processed: true })
        .eq('id', webhookLog.id)
    }

    const processingTime = Date.now() - startTime

    console.log('🎉 ========================================')
    console.log('🎉 WEBHOOK PROCESSADO COM SUCESSO')
    console.log(`🎉 Tempo: ${processingTime}ms`)
    console.log('🎉 ========================================')

    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso',
      data: {
        customer_id: customerData?.id,
        sale_id: saleId,
        processing_time_ms: processingTime,
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('❌ ========================================')
    console.error('❌ ERRO NO WEBHOOK:', error)
    console.error('❌ ========================================')

    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao processar webhook',
    }, { status: 500 })
  }
}

// GET para testar se a rota está ativa
export async function GET() {
  return NextResponse.json({
    message: 'Webhook Appmax está ativo',
    endpoint: '/api/webhook/appmax',
    methods: ['POST'],
    timestamp: new Date().toISOString(),
  })
}

    if (products && products.length > 0) {
      const productsFormatted = products.map((product: any, index: number) => ({
        sku: product.sku || product.id?.toString() || `product_${index}`,
        product_id: product.id?.toString(),
        name: product.name || 'Produto',
        price: parseFloat(product.price || 0),
        quantity: parseInt(product.qty || product.quantity || 1),
        type: index === 0 ? 'main' : 'bump',
      }))

      const { success: itemsSuccess, error: itemsError } = await saveSaleItems(
        supabaseAdmin,
        sale.id,
        productsFormatted
      )

      if (itemsError) {
        console.warn('⚠️ Erro ao salvar itens (continuando):', itemsError)
      }

      // Atualizar métricas dos produtos
      for (const prod of productsFormatted) {
        const { product_id } = await syncProductFromAppmax(supabaseAdmin, prod)
        if (product_id) {
          await updateProductMetrics(supabaseAdmin, product_id)
        }
      }
    }

    // 6️⃣ CRIAR/ATUALIZAR CONTATO CRM
    if (customer_id) {
      const { contact_id, error: crmError } = await createCRMContactFromSale(supabaseAdmin, {
        customer_id: customer_id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        total_amount: totalAmount,
        status: orderStatus,
      })

      if (crmError) {
        console.warn('⚠️ Erro ao criar contato CRM (continuando):', crmError)
      }

      // Atualizar métricas do cliente
      await updateCustomerMetrics(supabaseAdmin, customer_id)
    }

    // 7️⃣ ATUALIZAR LOG COMO SUCESSO
    if (webhookLog?.id) {
      await supabaseAdmin
        .from('webhooks_logs')
        .update({
          processed: true,
          success: true,
          processed_at: new Date().toISOString(),
        })
        .eq('id', webhookLog.id)
    }

    // 8️⃣ 🚀 ENVIAR EVENTO PARA META CAPI (Se venda aprovada)
    if (orderStatus === 'approved' && totalAmount > 0) {
      console.log('🚀 Enviando conversão para Meta CAPI...')
      
      // Buscar dados de tracking (fbp, fbc)
      let trackingData = { fbc: null, fbp: null, ipAddress, userAgent: null }
      
      if (customerEmail) {
        const { data: visits } = await supabaseAdmin
          .from('analytics_visits')
          .select('fbc, fbp, ip_address, user_agent')
          .ilike('referrer', `%${customerEmail}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        if (visits) {
          trackingData = {
            fbc: visits.fbc,
            fbp: visits.fbp,
            ipAddress: visits.ip_address || ipAddress,
            userAgent: visits.user_agent
          }
        }
      }

      const metaResult = await sendPurchaseEvent({
        orderId: orderId,
        customerEmail: customerEmail !== 'email@naoinformado.com' ? customerEmail : undefined,
        customerPhone: customerPhone || undefined,
        customerName: customerName !== 'Cliente Desconhecido' ? customerName : undefined,
        totalAmount: totalAmount,
        currency: 'BRL',
        productName: products[0]?.name || 'Gravador Médico',
        productIds: products.map((p: any) => p.sku || p.id?.toString()).filter(Boolean),
        fbc: trackingData.fbc || undefined,
        fbp: trackingData.fbp || undefined,
        ipAddress: trackingData.ipAddress || undefined,
        userAgent: trackingData.userAgent || undefined,
        eventSourceUrl: 'https://www.gravadormedico.com.br'
      })

      if (metaResult.success) {
        console.log('✅ Conversão enviada para Meta CAPI:', metaResult.fbTraceId)
      } else {
        console.error('⚠️ Falha ao enviar para Meta CAPI:', metaResult.error)
      }
    }

    console.log(`✅ Webhook processado em ${Date.now() - startTime}ms`)
    console.log('🎉 ============================================')

    return NextResponse.json({
      success: true,
      message: 'Venda registrada e sincronizada',
      sale_id: sale.id,
      customer_id: customer_id,
      processing_time_ms: Date.now() - startTime,
    })

  } catch (error: any) {
    console.error('❌ Erro crítico:', error)
    
    // Retorna 200 para Appmax não ficar reenviando
    return NextResponse.json(
      { 
        error: 'Erro processado', 
        message: error.message,
      },
      { status: 200 }
    )
  }
}

// Endpoint GET para testar
export async function GET() {
  return NextResponse.json({
    message: 'Webhook APPMAX v4.0 - Sincronização Completa',
    timestamp: new Date().toISOString(),
    status: 'operational',
    features: [
      'Customers sync',
      'Products sync',
      'Sales management',
      'CRM integration',
      'Metrics aggregation',
      'Meta CAPI',
    ],
  })
}
