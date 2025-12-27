import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Kiwify Webhook Handler
// Este endpoint recebe notificações da Kiwify quando um pagamento é completado

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('Kiwify webhook received:', body)

    // Kiwify envia diferentes eventos
    // Eventos: order.paid, order.refunded, order.chargeback, etc.

    const { order_status, Customer, order_id, Payment } = body

    const customerEmail = Customer?.email
    const paymentStatus = order_status // "paid", "refunded", "chargeback", etc.

    if (!customerEmail) {
      console.error('No customer email in Kiwify webhook')
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    // Mapear status da Kiwify para nosso schema
    let dbStatus: 'pending' | 'approved' | 'refused' | 'refunded' | 'chargeback' = 'pending'
    let shouldUnlock = false

    switch(paymentStatus?.toLowerCase()) {
      case 'paid':
      case 'complete':
      case 'approved':
        dbStatus = 'approved'
        shouldUnlock = true
        break
      case 'refunded':
        dbStatus = 'refunded'
        shouldUnlock = false
        break
      case 'chargeback':
        dbStatus = 'chargeback'
        shouldUnlock = false
        break
      case 'refused':
      case 'failed':
        dbStatus = 'refused'
        shouldUnlock = false
        break
    }

    // Atualizar no Supabase
    const updateData: any = {
      payment_status: dbStatus,
      kiwify_order_id: order_id,
      kiwify_customer_id: Customer?.id
    }

    if (shouldUnlock) {
      updateData.payment_amount = Payment?.value ? parseFloat(Payment.value) : 7.00
      updateData.payment_date = new Date().toISOString()
      updateData.result_unlocked = true
      updateData.result_unlocked_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('responses')
      .update(updateData)
      .eq('email', customerEmail)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error updating payment status from Kiwify:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Kiwify payment ${dbStatus} for ${customerEmail}`)
    return NextResponse.json({ received: true, status: dbStatus })
  } catch (error) {
    console.error('Kiwify webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Kiwify também pode enviar GET para validação
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Kiwify webhook endpoint active' })
}
