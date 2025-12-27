import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Stripe Webhook Handler
// Este endpoint recebe notificações do Stripe quando um pagamento é completado

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Adicionar verificação de assinatura do Stripe
    // const sig = request.headers.get('stripe-signature')
    // const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    // Verify signature here...

    const event = body

    // Processar evento de pagamento bem-sucedido
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      // Extrair email do cliente
      const customerEmail = session.customer_details?.email || session.customer_email

      if (!customerEmail) {
        console.error('No customer email found in Stripe session')
        return NextResponse.json({ error: 'No email found' }, { status: 400 })
      }

      // Atualizar no Supabase
      const { data, error } = await supabase
        .from('responses')
        .update({
          payment_status: 'approved',
          payment_id: session.payment_intent || session.id,
          payment_amount: session.amount_total ? session.amount_total / 100 : 7.00, // Stripe usa centavos
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

      console.log(`Payment approved for ${customerEmail}`)
      return NextResponse.json({ received: true, updated: true })
    }

    // Outros eventos do Stripe (opcional)
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object
      const customerEmail = paymentIntent.receipt_email

      if (customerEmail) {
        await supabase
          .from('responses')
          .update({ payment_status: 'refused' })
          .eq('email', customerEmail)
          .order('created_at', { ascending: false })
          .limit(1)
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
