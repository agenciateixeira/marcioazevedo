-- =====================================================
-- SINCRONIZAR TODAS AS COMPRAS DO STRIPE
-- =====================================================
-- Puxa TODAS as compras aprovadas da tabela 'responses'
-- e sincroniza com a tabela 'purchases' da área de membros
-- =====================================================

-- =====================================================
-- 1. VER TODAS AS COMPRAS PAGAS NO STRIPE
-- =====================================================

-- Ver TODAS as compras aprovadas (que têm payment_id do Stripe)
SELECT
  email,
  payment_id,
  payment_status,
  payment_amount,
  payment_date,
  result_unlocked,
  created_at
FROM responses
WHERE payment_status = 'approved'
  AND payment_id IS NOT NULL
ORDER BY created_at DESC;

-- Contar total de compras aprovadas
SELECT
  COUNT(*) as total_compras_aprovadas,
  COUNT(DISTINCT email) as total_emails_unicos,
  SUM(payment_amount) as valor_total_recebido
FROM responses
WHERE payment_status = 'approved'
  AND payment_id IS NOT NULL;

-- =====================================================
-- 2. COMPARAR: O QUE JÁ ESTÁ NA TABELA PURCHASES
-- =====================================================

-- Ver o que JÁ FOI migrado para purchases
SELECT
  p.user_email,
  p.payment_id,
  p.amount_paid,
  p.created_at,
  prod.name as produto
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
ORDER BY p.created_at DESC;

-- Contar o que já está em purchases
SELECT
  COUNT(*) as total_purchases_existentes,
  COUNT(DISTINCT user_email) as emails_com_purchase
FROM purchases;

-- =====================================================
-- 3. VER O QUE FALTA MIGRAR
-- =====================================================

-- Listar emails que TÊM compra aprovada MAS NÃO têm purchase
SELECT
  r.email,
  r.payment_id,
  r.payment_amount,
  r.payment_date,
  'FALTA MIGRAR' as status
FROM responses r
LEFT JOIN purchases p ON r.email = p.user_email
  AND p.product_id = (SELECT id FROM products WHERE slug = 'resultado')
WHERE r.payment_status = 'approved'
  AND r.payment_id IS NOT NULL
  AND p.id IS NULL
ORDER BY r.created_at DESC;

-- Contar quantos faltam migrar
SELECT
  COUNT(*) as total_faltando_migrar
FROM responses r
LEFT JOIN purchases p ON r.email = p.user_email
  AND p.product_id = (SELECT id FROM products WHERE slug = 'resultado')
WHERE r.payment_status = 'approved'
  AND r.payment_id IS NOT NULL
  AND p.id IS NULL;

-- =====================================================
-- 4. MIGRAR TODAS AS COMPRAS QUE FALTAM
-- =====================================================

-- Inserir TODAS as compras aprovadas que ainda não estão em purchases
INSERT INTO purchases (
  user_email,
  product_id,
  payment_id,
  payment_status,
  amount_paid,
  access_granted_at,
  created_at
)
SELECT
  r.email as user_email,
  (SELECT id FROM products WHERE slug = 'resultado') as product_id,
  r.payment_id,
  'approved' as payment_status,
  COALESCE(r.payment_amount, 7.00) as amount_paid,
  r.result_unlocked_at as access_granted_at,
  COALESCE(r.payment_date, r.created_at) as created_at
FROM responses r
WHERE r.payment_status = 'approved'
  AND r.payment_id IS NOT NULL
  AND NOT EXISTS (
    -- Não duplicar: só inserir se NÃO existe purchase para este email
    SELECT 1
    FROM purchases p
    WHERE p.user_email = r.email
      AND p.product_id = (SELECT id FROM products WHERE slug = 'resultado')
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. CRIAR PROGRESSO PARA OS NOVOS
-- =====================================================

-- Criar progresso inicial (0%) para purchases que não têm progresso
INSERT INTO user_progress (
  user_email,
  product_id,
  progress_percentage,
  completed
)
SELECT
  p.user_email,
  p.product_id,
  0 as progress_percentage,
  false as completed
FROM purchases p
WHERE NOT EXISTS (
  SELECT 1
  FROM user_progress up
  WHERE up.user_email = p.user_email
    AND up.product_id = p.product_id
)
ON CONFLICT (user_email, product_id) DO NOTHING;

-- =====================================================
-- 6. RELATÓRIO FINAL COMPLETO
-- =====================================================

-- Relatório de sincronização
SELECT
  'Total de compras aprovadas (Stripe)' as metrica,
  COUNT(*) as quantidade
FROM responses
WHERE payment_status = 'approved' AND payment_id IS NOT NULL

UNION ALL

SELECT
  'Total de purchases criadas (Área Membros)' as metrica,
  COUNT(*) as quantidade
FROM purchases

UNION ALL

SELECT
  'Total de emails únicos com purchase' as metrica,
  COUNT(DISTINCT user_email) as quantidade
FROM purchases

UNION ALL

SELECT
  'Total de progressos criados' as metrica,
  COUNT(*) as quantidade
FROM user_progress

UNION ALL

SELECT
  'Compras que faltam migrar' as metrica,
  COUNT(*) as quantidade
FROM responses r
LEFT JOIN purchases p ON r.email = p.user_email
WHERE r.payment_status = 'approved'
  AND r.payment_id IS NOT NULL
  AND p.id IS NULL;

-- =====================================================
-- 7. LISTA COMPLETA: QUEM PODE ACESSAR ÁREA DE MEMBROS
-- =====================================================

-- Ver TODOS os emails que podem acessar a área de membros agora
SELECT
  p.user_email,
  p.payment_id as stripe_payment_id,
  p.amount_paid,
  p.created_at as data_compra,
  p.user_id as tem_conta_criada,
  CASE
    WHEN p.user_id IS NOT NULL THEN 'JÁ TEM CONTA'
    ELSE 'PRECISA CRIAR SENHA'
  END as status_acesso,
  prod.name as produto
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
ORDER BY p.created_at DESC;

-- =====================================================
-- 8. VERIFICAR SE TEM DUPLICATAS
-- =====================================================

-- Ver se algum email tem múltiplas purchases do mesmo produto (duplicata)
SELECT
  user_email,
  COUNT(*) as total_purchases,
  ARRAY_AGG(payment_id) as payment_ids
FROM purchases
WHERE product_id = (SELECT id FROM products WHERE slug = 'resultado')
GROUP BY user_email
HAVING COUNT(*) > 1
ORDER BY total_purchases DESC;

-- =====================================================
-- PRONTO!
-- =====================================================
-- Agora TODOS os pagamentos do Stripe estão sincronizados
-- com a área de membros!
--
-- TODOS os emails que pagaram podem:
-- 1. Acessar /area-membros/primeiro-acesso
-- 2. Sistema reconhece que tem compra
-- 3. Criar senha e entrar no dashboard
-- =====================================================
