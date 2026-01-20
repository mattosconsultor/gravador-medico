/**
 * =============================================
 * FUNÇÕES UTILITÁRIAS - Sincronização Appmax
 * =============================================
 * Helpers para processar webhooks da Appmax
 * e manter dados normalizados no banco
 * =============================================
 */

import { SupabaseClient } from '@supabase/supabase-js'

// ========================================
// 1. Sincronizar Cliente
// ========================================
export async function syncCustomerFromAppmax(
  supabase: SupabaseClient,
  appmaxData: {
    customer_id?: string
    name: string
    email: string
    phone?: string
    cpf?: string
    utm_source?: string
    utm_campaign?: string
    utm_medium?: string
  }
): Promise<{ customer_id: string | null; error: any }> {
  try {
    console.log('👤 Sincronizando cliente:', appmaxData.email)

    // 1. Tentar encontrar cliente existente por email ou appmax_customer_id
    let { data: existing, error: searchError } = await supabase
      .from('customers')
      .select('id, email, appmax_customer_id, phone, cpf, utm_source, utm_campaign, utm_medium')
      .or(`email.eq.${appmaxData.email},appmax_customer_id.eq.${appmaxData.customer_id || ''}`)
      .limit(1)
      .maybeSingle()

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar cliente:', searchError)
      return { customer_id: null, error: searchError }
    }

    // 2. Se já existe, atualizar dados
    if (existing) {
      console.log('✅ Cliente já existe, atualizando:', existing.id)

      const { data: updated, error: updateError } = await supabase
        .from('customers')
        .update({
          name: appmaxData.name,
          phone: appmaxData.phone || existing.phone,
          cpf: appmaxData.cpf || existing.cpf,
          appmax_customer_id: appmaxData.customer_id || existing.appmax_customer_id,
          utm_source: appmaxData.utm_source || existing.utm_source,
          utm_campaign: appmaxData.utm_campaign || existing.utm_campaign,
          utm_medium: appmaxData.utm_medium || existing.utm_medium,
        })
        .eq('id', existing.id)
        .select('id')
        .single()

      if (updateError) {
        console.error('❌ Erro ao atualizar cliente:', updateError)
        return { customer_id: existing.id, error: updateError }
      }

      return { customer_id: updated.id, error: null }
    }

    // 3. Se não existe, criar novo cliente
    console.log('➕ Criando novo cliente:', appmaxData.email)

    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({
        appmax_customer_id: appmaxData.customer_id,
        name: appmaxData.name,
        email: appmaxData.email,
        phone: appmaxData.phone,
        cpf: appmaxData.cpf,
        utm_source: appmaxData.utm_source,
        utm_campaign: appmaxData.utm_campaign,
        utm_medium: appmaxData.utm_medium,
        status: 'active',
        segment: 'new',
        first_purchase_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('❌ Erro ao criar cliente:', insertError)
      return { customer_id: null, error: insertError }
    }

    console.log('✅ Cliente criado:', newCustomer.id)
    return { customer_id: newCustomer.id, error: null }

  } catch (error) {
    console.error('❌ Erro ao sincronizar cliente:', error)
    return { customer_id: null, error }
  }
}

// ========================================
// 2. Sincronizar Produto
// ========================================
export async function syncProductFromAppmax(
  supabase: SupabaseClient,
  productData: {
    sku: string
    product_id?: string
    name: string
    price: number
    type?: 'main' | 'bump' | 'upsell'
  }
): Promise<{ product_id: string | null; error: any }> {
  try {
    console.log('📦 Sincronizando produto:', productData.sku)

    // 1. Tentar encontrar produto existente por SKU ou appmax_product_id
    const { data: existing, error: searchError } = await supabase
      .from('products')
      .select('id, sku, appmax_product_id, type')
      .or(`sku.eq.${productData.sku},appmax_product_id.eq.${productData.product_id || ''}`)
      .limit(1)
      .maybeSingle()

    if (searchError && searchError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar produto:', searchError)
      return { product_id: null, error: searchError }
    }

    // 2. Se já existe, atualizar
    if (existing) {
      console.log('✅ Produto já existe, atualizando:', existing.id)

      const { data: updated, error: updateError } = await supabase
        .from('products')
        .update({
          name: productData.name,
          price: productData.price,
          appmax_product_id: productData.product_id || existing.appmax_product_id,
          type: productData.type || existing.type,
        })
        .eq('id', existing.id)
        .select('id')
        .single()

      if (updateError) {
        console.error('❌ Erro ao atualizar produto:', updateError)
        return { product_id: existing.id, error: updateError }
      }

      return { product_id: updated.id, error: null }
    }

    // 3. Se não existe, criar novo produto
    console.log('➕ Criando novo produto:', productData.sku)

    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert({
        sku: productData.sku,
        appmax_product_id: productData.product_id,
        name: productData.name,
        price: productData.price,
        type: productData.type || 'main',
        category: 'subscription',
        is_active: true,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('❌ Erro ao criar produto:', insertError)
      return { product_id: null, error: insertError }
    }

    console.log('✅ Produto criado:', newProduct.id)
    return { product_id: newProduct.id, error: null }

  } catch (error) {
    console.error('❌ Erro ao sincronizar produto:', error)
    return { product_id: null, error }
  }
}

// ========================================
// 3. Criar/Atualizar Venda
// ========================================
export async function createOrUpdateSaleFromAppmax(
  supabase: SupabaseClient,
  saleData: {
    appmax_order_id: string
    customer_id: string | null
    customer_name: string
    customer_email: string
    customer_phone?: string
    customer_cpf?: string
    total_amount: number
    discount: number
    subtotal: number
    status: string
    payment_method: string
    utm_source?: string
    utm_campaign?: string
    utm_medium?: string
    ip_address?: string
    session_id?: string
    metadata?: any
  }
): Promise<{ sale: any; error: any }> {
  try {
    console.log('💰 Salvando venda:', saleData.appmax_order_id)

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .upsert({
        appmax_order_id: saleData.appmax_order_id,
        customer_id: saleData.customer_id,
        customer_name: saleData.customer_name,
        customer_email: saleData.customer_email,
        customer_phone: saleData.customer_phone,
        customer_cpf: saleData.customer_cpf,
        total_amount: saleData.total_amount,
        discount: saleData.discount,
        subtotal: saleData.subtotal,
        status: saleData.status,
        payment_method: saleData.payment_method,
        utm_source: saleData.utm_source,
        utm_campaign: saleData.utm_campaign,
        utm_medium: saleData.utm_medium,
        ip_address: saleData.ip_address,
        session_id: saleData.session_id,
        paid_at: saleData.status === 'approved' ? new Date().toISOString() : null,
        metadata: saleData.metadata,
      }, {
        onConflict: 'appmax_order_id',
      })
      .select()
      .single()

    if (saleError) {
      console.error('❌ Erro ao salvar venda:', saleError)
      return { sale: null, error: saleError }
    }

    console.log('✅ Venda salva:', sale.id)
    return { sale, error: null }

  } catch (error) {
    console.error('❌ Erro ao criar/atualizar venda:', error)
    return { sale: null, error }
  }
}

// ========================================
// 4. Salvar Itens da Venda
// ========================================
export async function saveSaleItems(
  supabase: SupabaseClient,
  saleId: string,
  products: Array<{
    sku: string
    product_id?: string
    name: string
    price: number
    quantity: number
    type?: 'main' | 'bump' | 'upsell'
  }>
): Promise<{ success: boolean; error: any }> {
  try {
    console.log('📦 Salvando', products.length, 'itens da venda...')

    // Para cada produto, garantir que ele existe e pegar o ID
    const salesItems = []

    for (let i = 0; i < products.length; i++) {
      const product = products[i]

      // Sincronizar produto (criar ou atualizar)
      const { product_id, error: prodError } = await syncProductFromAppmax(supabase, {
        sku: product.sku || product.product_id || `product_${i}`,
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        type: product.type || (i === 0 ? 'main' : 'bump'),
      })

      if (prodError) {
        console.warn('⚠️ Erro ao sincronizar produto:', prodError)
      }

      salesItems.push({
        sale_id: saleId,
        product_id: product_id,
        product_sku: product.sku || product.product_id || `product_${i}`,
        product_name: product.name,
        product_type: product.type || (i === 0 ? 'main' : 'bump'),
        price: product.price,
        quantity: product.quantity || 1,
        discount: 0,
      })
    }

    // Inserir itens (ou atualizar se já existirem)
    const { error: itemsError } = await supabase
      .from('sales_items')
      .upsert(salesItems, {
        onConflict: 'sale_id,product_sku'
      })

    if (itemsError) {
      console.error('❌ Erro ao salvar itens:', itemsError)
      return { success: false, error: itemsError }
    }

    console.log('✅ Itens salvos')
    return { success: true, error: null }

  } catch (error) {
    console.error('❌ Erro ao salvar itens da venda:', error)
    return { success: false, error }
  }
}

// ========================================
// 5. Criar Contato no CRM
// ========================================
export async function createCRMContactFromSale(
  supabase: SupabaseClient,
  saleData: {
    customer_id: string | null
    customer_name: string
    customer_email: string
    customer_phone?: string
    total_amount: number
    status: string
  }
): Promise<{ contact_id: string | null; error: any }> {
  try {
    console.log('📞 Criando contato CRM:', saleData.customer_email)

    // Verificar se já existe contato para este email
    const { data: existing } = await supabase
      .from('crm_contacts')
      .select('id, stage')
      .eq('email', saleData.customer_email)
      .maybeSingle()

    // Se já existe e foi convertido (won), não fazer nada
    if (existing && existing.stage === 'won') {
      console.log('✅ Contato já convertido anteriormente')
      return { contact_id: existing.id, error: null }
    }

    // Se a venda foi aprovada, marcar como "won"
    const stage = saleData.status === 'approved' ? 'won' : 'lead'
    const converted_at = saleData.status === 'approved' ? new Date().toISOString() : null

    // Atualizar ou criar contato
    const { data: contact, error: contactError } = await supabase
      .from('crm_contacts')
      .upsert({
        customer_id: saleData.customer_id,
        name: saleData.customer_name,
        email: saleData.customer_email,
        phone: saleData.customer_phone,
        stage: stage,
        source: 'appmax',
        estimated_value: saleData.total_amount,
        probability: saleData.status === 'approved' ? 100 : 50,
        converted_at: converted_at,
        last_contact_at: new Date().toISOString(),
      }, {
        onConflict: 'email',
        ignoreDuplicates: false,
      })
      .select('id')
      .single()

    if (contactError) {
      console.error('❌ Erro ao criar contato CRM:', contactError)
      return { contact_id: null, error: contactError }
    }

    // Criar atividade (nota da venda)
    await supabase
      .from('crm_activities')
      .insert({
        contact_id: contact.id,
        customer_id: saleData.customer_id,
        type: 'sale',
        title: `Venda ${saleData.status === 'approved' ? 'aprovada' : 'criada'}`,
        description: `Venda de R$ ${saleData.total_amount.toFixed(2)} via Appmax`,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })

    console.log('✅ Contato CRM criado/atualizado:', contact.id)
    return { contact_id: contact.id, error: null }

  } catch (error) {
    console.error('❌ Erro ao criar contato CRM:', error)
    return { contact_id: null, error }
  }
}

// ========================================
// 6. Atualizar Métricas do Cliente
// ========================================
export async function updateCustomerMetrics(
  supabase: SupabaseClient,
  customerId: string
): Promise<{ success: boolean; error: any }> {
  try {
    console.log('📊 Atualizando métricas do cliente:', customerId)

    // Buscar agregados de vendas aprovadas
    const { data: metrics, error: metricsError } = await supabase
      .from('sales')
      .select('total_amount, created_at')
      .eq('customer_id', customerId)
      .in('status', ['approved', 'paid', 'completed'])

    if (metricsError) {
      console.error('❌ Erro ao buscar métricas:', metricsError)
      return { success: false, error: metricsError }
    }

    if (!metrics || metrics.length === 0) {
      console.log('⚠️ Nenhuma venda aprovada para este cliente')
      return { success: true, error: null }
    }

    const total_orders = metrics.length
    const total_spent = metrics.reduce((sum, sale) => sum + Number(sale.total_amount), 0)
    const average_order_value = total_spent / total_orders
    const last_purchase_at = metrics[0].created_at // já vem ordenado desc
    const first_purchase_at = metrics[metrics.length - 1].created_at

    // Atualizar customer
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        total_orders,
        total_spent,
        average_order_value,
        last_purchase_at,
        first_purchase_at,
        segment: total_spent > 500 ? 'vip' : total_orders > 1 ? 'regular' : 'new',
      })
      .eq('id', customerId)

    if (updateError) {
      console.error('❌ Erro ao atualizar métricas:', updateError)
      return { success: false, error: updateError }
    }

    console.log('✅ Métricas atualizadas')
    return { success: true, error: null }

  } catch (error) {
    console.error('❌ Erro ao atualizar métricas:', error)
    return { success: false, error }
  }
}

// ========================================
// 7. Atualizar Métricas do Produto
// ========================================
export async function updateProductMetrics(
  supabase: SupabaseClient,
  productId: string
): Promise<{ success: boolean; error: any }> {
  try {
    console.log('📊 Atualizando métricas do produto:', productId)

    // Buscar agregados de vendas aprovadas
    const { data: metrics, error: metricsError } = await supabase
      .from('sales_items')
      .select(`
        quantity,
        total,
        sales!inner(status)
      `)
      .eq('product_id', productId)
      .in('sales.status', ['approved', 'paid', 'completed'])

    if (metricsError) {
      console.error('❌ Erro ao buscar métricas do produto:', metricsError)
      return { success: false, error: metricsError }
    }

    if (!metrics || metrics.length === 0) {
      console.log('⚠️ Nenhuma venda aprovada para este produto')
      return { success: true, error: null }
    }

    const total_sales = metrics.length
    const total_revenue = metrics.reduce((sum, item) => sum + Number(item.total), 0)

    // Atualizar product
    const { error: updateError } = await supabase
      .from('products')
      .update({
        total_sales,
        total_revenue,
      })
      .eq('id', productId)

    if (updateError) {
      console.error('❌ Erro ao atualizar métricas do produto:', updateError)
      return { success: false, error: updateError }
    }

    console.log('✅ Métricas do produto atualizadas')
    return { success: true, error: null }

  } catch (error) {
    console.error('❌ Erro ao atualizar métricas do produto:', error)
    return { success: false, error }
  }
}
