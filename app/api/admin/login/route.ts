import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Chamar a função do Supabase para verificar login
    const { data, error } = await supabase
      .rpc('verify_admin_login', {
        p_email: email,
        p_password: password
      })

    if (error) {
      console.error('Erro ao verificar login:', error)
      return NextResponse.json(
        { error: 'Erro ao processar login' },
        { status: 500 }
      )
    }

    // data é um array com 1 registro (ou vazio se falhou)
    const result = data && data.length > 0 ? data[0] : null

    if (!result || !result.success) {
      return NextResponse.json(
        { error: 'Email ou senha incorretos' },
        { status: 401 }
      )
    }

    // Login bem-sucedido
    return NextResponse.json({
      success: true,
      user: {
        id: result.user_id,
        email: result.email,
        fullName: result.full_name,
        role: result.role
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
