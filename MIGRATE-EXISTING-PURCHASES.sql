-- =====================================================
-- MIGRAR COMPRAS EXISTENTES DA TABELA RESPONSES
-- =====================================================
-- Este script pega TODAS as compras aprovadas da tabela 'responses'
-- e cria registros correspondentes na tabela 'purchases' para área de membros

-- =====================================================
-- 1. VERIFICAR QUANTAS COMPRAS EXISTEM
-- =====================================================

-- Ver quantas compras aprovadas existem na tabela responses
SELECT
  COUNT(*) as total_compras_aprovadas,
  COUNT(DISTINCT email) as total_emails_unicos
FROM responses
WHERE payment_status = 'approved'
  AND result_unlocked = true;

-- Ver detalhes das compras
SELECT
  email,
  payment_status,
  payment_amount,
  payment_id,
  payment_date,
  created_at
FROM responses
WHERE payment_status = 'approved'
  AND result_unlocked = true
ORDER BY created_at DESC;

-- =====================================================
-- 2. MIGRAR COMPRAS DO RESULTADO (R$ 7.00)
-- =====================================================

-- Inserir na tabela purchases TODAS as compras aprovadas do resultado
-- Isso vai pegar TODOS os emails que compraram o resultado
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
  r.payment_date as created_at
FROM responses r
WHERE r.payment_status = 'approved'
  AND r.result_unlocked = true
  AND r.email NOT IN (
    -- Não duplicar se já existe na tabela purchases
    SELECT user_email FROM purchases WHERE product_id = (SELECT id FROM products WHERE slug = 'resultado')
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. VERIFICAR SE A MIGRAÇÃO FUNCIONOU
-- =====================================================

-- Contar quantas purchases foram criadas
SELECT COUNT(*) as total_purchases_criadas
FROM purchases
WHERE product_id = (SELECT id FROM products WHERE slug = 'resultado');

-- Ver todas as purchases criadas
SELECT
  p.user_email,
  p.payment_status,
  p.amount_paid,
  p.payment_id,
  p.created_at,
  prod.name as produto
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
ORDER BY p.created_at DESC;

-- =====================================================
-- 4. COMPARAR: RESPONSES vs PURCHASES
-- =====================================================

-- Ver se todos os emails da responses agora têm purchase
SELECT
  r.email,
  r.payment_status as status_responses,
  CASE
    WHEN p.id IS NOT NULL THEN 'SIM'
    ELSE 'NÃO'
  END as tem_purchase
FROM responses r
LEFT JOIN purchases p ON r.email = p.user_email
  AND p.product_id = (SELECT id FROM products WHERE slug = 'resultado')
WHERE r.payment_status = 'approved'
  AND r.result_unlocked = true
ORDER BY r.created_at DESC;

-- =====================================================
-- 5. CRIAR PROGRESSO INICIAL PARA TODOS
-- =====================================================

-- Criar registro de progresso (0%) para cada purchase
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
  -- Não duplicar se já existe progresso
  SELECT 1
  FROM user_progress up
  WHERE up.user_email = p.user_email
    AND up.product_id = p.product_id
)
ON CONFLICT (user_email, product_id) DO NOTHING;

-- Ver progresso criado
SELECT
  up.user_email,
  prod.name as produto,
  up.progress_percentage,
  up.completed
FROM user_progress up
LEFT JOIN products prod ON up.product_id = prod.id
ORDER BY up.created_at DESC;

-- =====================================================
-- RESUMO FINAL
-- =====================================================

SELECT
  'Total de compras na responses' as descricao,
  COUNT(*) as quantidade
FROM responses
WHERE payment_status = 'approved'
  AND result_unlocked = true

UNION ALL

SELECT
  'Total de purchases criadas' as descricao,
  COUNT(*) as quantidade
FROM purchases

UNION ALL

SELECT
  'Total de progressos criados' as descricao,
  COUNT(*) as quantidade
FROM user_progress;

-- =====================================================
-- PRONTO!
-- =====================================================
-- Agora TODOS os emails que compraram podem:
-- 1. Acessar /area-membros/primeiro-acesso
-- 2. Sistema vai reconhecer que tem compra
-- 3. Podem criar senha e entrar
-- =====================================================
