import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin não configurado' },
        { status: 500 }
      )
    }

    // Buscar total de leads
    const { count: leadsCount } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })

    // Buscar total de responses
    const { count: responsesCount } = await supabaseAdmin
      .from('responses')
      .select('*', { count: 'exact', head: true })

    // Buscar responses com pagamento aprovado
    const { data: paidData, count: paidCount } = await supabaseAdmin
      .from('responses')
      .select('payment_amount', { count: 'exact' })
      .eq('payment_status', 'approved')

    // Buscar pagamentos pendentes
    const { count: pendingCount } = await supabaseAdmin
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('payment_status', 'pending')

    // Calcular receita total
    const totalRevenue = paidData?.reduce((sum, item) =>
      sum + (parseFloat(item.payment_amount?.toString() || '0')), 0
    ) || 0

    // Calcular taxa de conversão (responses / leads)
    const conversionRate = leadsCount && leadsCount > 0
      ? (responsesCount! / leadsCount) * 100
      : 0

    const stats = {
      totalLeads: leadsCount || 0,
      totalResponses: responsesCount || 0,
      paidResponses: paidCount || 0,
      pendingPayments: pendingCount || 0,
      conversionRate,
      totalRevenue
    }

    return NextResponse.json({ stats })

  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
