import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  created_at: string
}

/**
 * Criar conta com email e senha
 */
export async function signUp(email: string, password: string, fullName?: string) {
  console.log('🔵 [auth.ts] signUp chamado para:', email)

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    console.log('🔵 [auth.ts] signUp resposta:', {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      session: data.session ? 'exists' : 'null',
      error: error
    })

    if (error) {
      console.error('🔴 [auth.ts] signUp erro:', error)
    }

    return { user: data.user, error }
  } catch (err: any) {
    console.error('🔴 [auth.ts] signUp exception:', err)
    return { user: null, error: err }
  }
}

/**
 * Login com email e senha
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { user: data.user, session: data.session, error }
}

/**
 * Logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Pegar usuário atual
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Verificar se usuário tem acesso a um produto
 */
export async function userHasAccess(email: string, productSlug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      id,
      products(slug)
    `)
    .eq('user_email', email)
    .eq('payment_status', 'approved')

  if (error || !data) return false

  return data.some((purchase: any) => purchase.products?.slug === productSlug)
}

/**
 * Listar produtos que o usuário comprou
 */
export async function getUserPurchases(email: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      id,
      created_at,
      amount_paid,
      payment_status,
      products (
        id,
        slug,
        name,
        description,
        content_type,
        content_url,
        thumbnail_url
      )
    `)
    .eq('user_email', email)
    .eq('payment_status', 'approved')
    .order('created_at', { ascending: false })

  // Transformar o retorno para o formato esperado
  const purchases = data?.map((purchase: any) => ({
    id: purchase.id,
    created_at: purchase.created_at,
    amount_paid: purchase.amount_paid,
    payment_status: purchase.payment_status,
    product: purchase.products
  })) || []

  return { purchases, error }
}

/**
 * Pegar progresso do usuário em um produto
 */
export async function getUserProgress(email: string, productId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_email', email)
    .eq('product_id', productId)
    .single()

  return { progress: data, error }
}

/**
 * Atualizar progresso do usuário
 */
export async function updateUserProgress(
  email: string,
  productId: string,
  progressPercentage: number,
  completed: boolean = false
) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({
      user_email: email,
      product_id: productId,
      progress_percentage: progressPercentage,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      last_accessed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_email,product_id'
    })

  return { data, error }
}
