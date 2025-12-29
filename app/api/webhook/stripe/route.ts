import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

// Stripe Webhook Handler
// Este endpoint recebe notificações do Stripe quando um pagamento é completado

export async function POST(request: NextRequest) {
  try {
    const body = await request.text() // Precisa ser text() para verificação de assinatura
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event

    try {
      // Verificar assinatura do webhook
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Processar evento de pagamento bem-sucedido (Payment Intent)
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Extrair informações do cliente e metadata
      const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customer_email
      const productType = paymentIntent.metadata?.product_type

      if (!customerEmail) {
        console.error('No customer email found in Payment Intent')
        return NextResponse.json({ error: 'No email found' }, { status: 400 })
      }

      // Se for pagamento do resultado (R$ 7), desbloquear acesso
      if (productType === 'resultado') {
        const { error } = await supabase
          .from('responses')
          .update({
            payment_status: 'approved',
            payment_id: paymentIntent.id,
            payment_amount: paymentIntent.amount / 100, // Converter de centavos
            payment_date: new Date().toISOString(),
            result_unlocked: true,
            result_unlocked_at: new Date().toISOString()
          })
          .eq('email', customerEmail)
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Error updating payment status:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`Result unlocked for ${customerEmail}`)
      }

      // Para outros produtos (upsells), você pode adicionar lógica específica aqui
      // Por exemplo, enviar e-mail com o e-book, agendar mentoria, etc.
      if (productType === 'ebook_completo') {
        console.log(`E-book completo vendido para ${customerEmail}`)
        // TODO: Enviar e-mail com link do e-book
      }

      if (productType === 'ebook_simples') {
        console.log(`E-book simples vendido para ${customerEmail}`)
        // TODO: Enviar e-mail com link do e-book
      }

      if (productType === 'mentoria') {
        console.log(`Mentoria vendida para ${customerEmail}`)
        // TODO: Enviar e-mail com instruções para agendar
      }

      return NextResponse.json({ received: true, updated: true })
    }

    // Processar evento de checkout session completed (para compatibilidade)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      const customerEmail = session.customer_details?.email || session.customer_email || session.metadata?.customer_email
      const productType = session.metadata?.product_type

      if (!customerEmail) {
        console.error('No customer email found in Stripe session')
        return NextResponse.json({ error: 'No email found' }, { status: 400 })
      }

      // Se for pagamento do resultado (R$ 7), desbloquear acesso
      if (productType === 'resultado') {
        const { error } = await supabase
          .from('responses')
          .update({
            payment_status: 'approved',
            payment_id: session.payment_intent as string || session.id,
            payment_amount: session.amount_total ? session.amount_total / 100 : 7.00,
            payment_date: new Date().toISOString(),
            result_unlocked: true,
            result_unlocked_at: new Date().toISOString()
          })
          .eq('email', customerEmail)
          .order('created_at', { ascending: false })
          .limit(1)

        if (error) {
          console.error('Error updating payment status:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log(`Result unlocked for ${customerEmail}`)
      }

      return NextResponse.json({ received: true, updated: true })
    }

    // Processar falha de pagamento
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const customerEmail = paymentIntent.receipt_email

      if (customerEmail) {
        await supabase
          .from('responses')
          .update({ payment_status: 'refused' })
          .eq('email', customerEmail)
          .order('created_at', { ascending: false })
          .limit(1)

        console.log(`Payment failed for ${customerEmail}`)
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
