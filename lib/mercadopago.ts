/**
 * Integração com Mercado Pago
 * 
 * Documentação: https://www.mercadopago.com.br/developers/pt/docs
 * 
 * Para usar:
 * 1. Criar conta no Mercado Pago: https://www.mercadopago.com.br
 * 2. Obter credenciais em: https://www.mercadopago.com.br/developers/panel/credentials
 * 3. Adicionar no .env.local:
 *    MERCADOPAGO_ACCESS_TOKEN=seu_access_token_aqui
 *    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=sua_public_key_aqui
 */

// Tipos
export interface CheckoutData {
  email: string
  name: string
  cpf: string
  items: Array<{
    title: string
    quantity: number
    unit_price: number
  }>
  payment_method: "credit_card" | "pix"
  card_data?: {
    number: string
    expiration_month: string
    expiration_year: string
    cvv: string
  }
}

export interface PaymentResponse {
  id: string
  status: "approved" | "pending" | "rejected"
  status_detail: string
  payment_method_id: string
  qr_code?: string // Para PIX
  qr_code_base64?: string // Para PIX
  ticket_url?: string
}

/**
 * Cria uma preferência de pagamento no Mercado Pago
 * Usado para redirecionar para checkout do Mercado Pago (opcional)
 */
export async function createPreference(data: CheckoutData): Promise<any> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado")
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      items: data.items,
      payer: {
        name: data.name,
        email: data.email,
        identification: {
          type: "CPF",
          number: data.cpf.replace(/\D/g, ""),
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
      },
      auto_return: "approved",
      statement_descriptor: "GRAVADOR MEDICO",
      external_reference: `ORDER-${Date.now()}`,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao criar preferência")
  }

  return response.json()
}

/**
 * Processa pagamento com cartão de crédito
 */
export async function processCardPayment(data: CheckoutData): Promise<PaymentResponse> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado")
  }

  // Calcula o total
  const amount = data.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": `${data.email}-${Date.now()}`, // Evita duplicação
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description: data.items.map((i) => i.title).join(", "),
      payment_method_id: "credit_card", // ou 'debit_card'
      payer: {
        email: data.email,
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" "),
        identification: {
          type: "CPF",
          number: data.cpf.replace(/\D/g, ""),
        },
      },
      // Token do cartão (precisa ser gerado no frontend com Mercado Pago SDK)
      token: "CARD_TOKEN_HERE", // Substituir pelo token gerado no frontend
      installments: 1,
      statement_descriptor: "GRAVADOR MEDICO",
      external_reference: `ORDER-${Date.now()}`,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao processar pagamento")
  }

  return response.json()
}

/**
 * Gera pagamento PIX
 */
export async function generatePixPayment(data: CheckoutData): Promise<PaymentResponse> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado")
  }

  // Calcula o total
  const amount = data.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": `${data.email}-${Date.now()}`,
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description: data.items.map((i) => i.title).join(", "),
      payment_method_id: "pix",
      payer: {
        email: data.email,
        first_name: data.name.split(" ")[0],
        last_name: data.name.split(" ").slice(1).join(" "),
        identification: {
          type: "CPF",
          number: data.cpf.replace(/\D/g, ""),
        },
      },
      statement_descriptor: "GRAVADOR MEDICO",
      external_reference: `ORDER-${Date.now()}`,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erro ao gerar PIX")
  }

  return response.json()
}

/**
 * Consulta status de um pagamento
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado")
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Erro ao consultar pagamento")
  }

  return response.json()
}

/**
 * Webhook handler para notificações do Mercado Pago
 * Adicionar em: app/api/webhook/mercadopago/route.ts
 */
export async function handleWebhook(body: any) {
  // Mercado Pago envia notificações de mudança de status
  const { type, data } = body

  if (type === "payment") {
    const paymentId = data.id
    const payment = await getPaymentStatus(paymentId)

    // Processar conforme status
    switch (payment.status) {
      case "approved":
        // Liberar acesso ao produto
        console.log("Pagamento aprovado:", paymentId)
        break
      case "pending":
        // Aguardando pagamento (PIX)
        console.log("Pagamento pendente:", paymentId)
        break
      case "rejected":
        // Pagamento recusado
        console.log("Pagamento recusado:", paymentId)
        break
    }

    return payment
  }

  return null
}
