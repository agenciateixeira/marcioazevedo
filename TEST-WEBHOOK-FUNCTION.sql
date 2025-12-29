-- =====================================================
-- TESTAR SE A FUNÇÃO create_purchase_from_payment FUNCIONA
-- =====================================================

-- 1. Verificar se a função existe
SELECT
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'create_purchase_from_payment';

-- Resultado esperado: 1 linha com routine_name = 'create_purchase_from_payment'
-- Se retornar VAZIO = A função NÃO FOI CRIADA!

-- =====================================================
-- 2. Testar a função manualmente
-- =====================================================

-- Teste 1: Criar purchase do resultado (R$ 7)
SELECT create_purchase_from_payment(
  'teste@webhook.com',      -- p_email
  'resultado',              -- p_product_type (slug do produto)
  'test_webhook_001',       -- p_payment_id
  7.00                      -- p_amount
) as purchase_id_criado;

-- Deve retornar um UUID (purchase_id)
-- Se der ERRO, a função tem problema!

-- =====================================================
-- 3. Verificar se a purchase foi criada
-- =====================================================

SELECT
  user_email,
  payment_id,
  amount_paid,
  prod.name as produto
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
WHERE user_email = 'teste@webhook.com';

-- Deve mostrar 1 linha com a purchase de teste

-- =====================================================
-- 4. Verificar se o progresso foi criado automaticamente
-- =====================================================

SELECT
  user_email,
  progress_percentage,
  prod.name as produto
FROM user_progress up
LEFT JOIN products prod ON up.product_id = prod.id
WHERE user_email = 'teste@webhook.com';

-- Deve mostrar 1 linha com progresso 0%

-- =====================================================
-- 5. Limpar teste (OPCIONAL)
-- =====================================================

-- Descomentar para remover os dados de teste
/*
DELETE FROM user_progress WHERE user_email = 'teste@webhook.com';
DELETE FROM purchases WHERE user_email = 'teste@webhook.com';
*/

-- =====================================================
-- DIAGNÓSTICO:
-- =====================================================

-- ❌ Se a função NÃO EXISTE (passo 1 retornou vazio):
--    → Execute novamente o arquivo: supabase-area-membros.sql

-- ❌ Se a função DEU ERRO ao executar (passo 2):
--    → Me envie o erro completo para eu corrigir

-- ✅ Se a função funcionou e criou purchase + progresso:
--    → O problema está no webhook ou nas variáveis de ambiente

-- =====================================================
-- PRÓXIMOS PASSOS SE A FUNÇÃO FUNCIONA:
-- =====================================================

-- 1. Verificar variáveis de ambiente no Vercel:
--    - STRIPE_WEBHOOK_SECRET está configurado?
--    - Começa com whsec_?

-- 2. Verificar logs do webhook no Vercel:
--    - Vercel Dashboard → Logs
--    - Procurar por erros no /api/webhook/stripe

-- 3. Verificar webhook no Stripe:
--    - Stripe Dashboard → Developers → Webhooks
--    - Ver eventos recentes
--    - Ver se há erros
