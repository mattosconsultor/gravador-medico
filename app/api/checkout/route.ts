import { NextRequest, NextResponse } from "next/server"
import { generatePixPayment, processCardPayment, type CheckoutData } from "@/lib/mercadopago"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação básica
    if (!body.email || !body.name || !body.cpf) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Monta os dados do checkout
    const checkoutData: CheckoutData = {
      email: body.email,
      name: body.name,
      cpf: body.cpf,
      payment_method: body.paymentMethod || "credit_card",
      items: body.items || [
        {
          title: "Método Gravador Médico Completo",
          quantity: 1,
          unit_price: body.total || 36,
        },
      ],
    }

    // Processa pagamento
    let payment
    if (body.paymentMethod === "pix") {
      payment = await generatePixPayment(checkoutData)
    } else {
      // Para cartão, precisaria passar card_data
      checkoutData.card_data = body.cardData
      payment = await processCardPayment(checkoutData)
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        qr_code: payment.qr_code,
        qr_code_base64: payment.qr_code_base64,
      },
    })
  } catch (error: any) {
    console.error("Erro no checkout:", error)
    return NextResponse.json(
      { error: error.message || "Erro ao processar pagamento" },
      { status: 500 }
    )
  }
}
