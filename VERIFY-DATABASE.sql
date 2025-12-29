-- =====================================================
-- VERIFICAR SE O BANCO ESTÁ CONFIGURADO CORRETAMENTE
-- =====================================================

-- 1. Verificar se as tabelas existem
SELECT
  tablename,
  'existe' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('products', 'purchases', 'user_progress', 'user_metadata')
ORDER BY tablename;

-- Resultado esperado: 4 linhas (products, purchases, user_progress, user_metadata)

-- =====================================================

-- 2. Verificar se os produtos foram criados
SELECT
  slug,
  name,
  price,
  content_type,
  is_active
FROM products
ORDER BY price;

-- Resultado esperado: 4 produtos
-- - resultado (R$ 7.00)
-- - ebook_simples (R$ 47.00)
-- - ebook_completo (R$ 97.00)
-- - mentoria (R$ 497.00)

-- =====================================================

-- 3. Verificar se a função create_purchase_from_payment existe
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'create_purchase_from_payment';

-- Resultado esperado: 1 linha com routine_name = 'create_purchase_from_payment'

-- =====================================================

-- 4. Verificar se o trigger link_purchases_to_user existe
SELECT
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name = 'on_auth_user_created';

-- Resultado esperado: 1 linha com trigger_name = 'on_auth_user_created'

-- =====================================================

-- 5. Verificar RLS (Row Level Security)
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('products', 'purchases', 'user_progress', 'user_metadata')
ORDER BY tablename;

-- Resultado esperado: rls_enabled = true para todas as 4 tabelas

-- =====================================================

-- 6. Ver todas as purchases (se houver)
SELECT
  p.id,
  p.user_email,
  p.user_id,
  p.payment_status,
  p.amount_paid,
  p.created_at,
  prod.name as product_name
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
ORDER BY p.created_at DESC
LIMIT 10;

-- =====================================================
-- RESUMO DO QUE VERIFICAR:
-- =====================================================
-- ✅ 4 tabelas existem
-- ✅ 4 produtos cadastrados
-- ✅ Função create_purchase_from_payment existe
-- ✅ Trigger on_auth_user_created existe
-- ✅ RLS está habilitado em todas as tabelas
-- ✅ Purchases (pode estar vazio se ainda não testou)
