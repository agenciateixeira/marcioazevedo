import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export async function POST(req: NextRequest) {
  try {
    const { priceId, email, name, productType } = await req.json()

    if (!priceId || !email || !name || !productType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // URLs de sucesso e cancelamento baseadas no tipo de produto
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    let successUrl = ''
    let cancelUrl = ''

    switch (productType) {
      case 'resultado':
        // Após pagamento do resultado, vai para oferta 1
        successUrl = `${baseUrl}/oferta-1?session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${baseUrl}/checkout`
        break

      case 'ebook_completo':
        // Após ebook completo, vai para oferta 3 (mentoria)
        successUrl = `${baseUrl}/oferta-3?session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${baseUrl}/oferta-1`
        break

      case 'ebook_simples':
        // Após ebook simples, vai para thank you page
        successUrl = `${baseUrl}/canal-whatsapp?session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${baseUrl}/oferta-2`
        break

      case 'mentoria':
        // Após mentoria, vai para thank you page
        successUrl = `${baseUrl}/canal-whatsapp?session_id={CHECKOUT_SESSION_ID}`
        cancelUrl = `${baseUrl}/oferta-3`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid product type' },
          { status: 400 }
        )
    }

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: email, // Para identificar o usuário
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        customer_name: name,
        customer_email: email,
        product_type: productType,
      },
      billing_address_collection: 'auto',
      payment_method_types: ['card'],
      locale: 'pt-BR',
    })

    return NextResponse.json({ sessionId: session.id })

  } catch (error) {
    console.error('Stripe Checkout Session Error:', error)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
