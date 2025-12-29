-- =====================================================
-- INSERIR PURCHASE DE TESTE MANUALMENTE
-- =====================================================
-- Use este SQL para testar a área de membros antes de configurar o webhook

-- IMPORTANTE: Substitua 'seu@email.com' pelo email que você quer testar!

-- 1. Inserir purchase do resultado (R$ 7)
INSERT INTO purchases (user_email, product_id, payment_status, amount_paid, payment_id)
VALUES (
  'seu@email.com',  -- <<<< MUDE AQUI
  (SELECT id FROM products WHERE slug = 'resultado'),
  'approved',
  7.00,
  'test_payment_001'
);

-- 2. Inserir purchase do ebook completo (R$ 97) - OPCIONAL
-- Descomente as linhas abaixo se quiser testar com mais produtos
/*
INSERT INTO purchases (user_email, product_id, payment_status, amount_paid, payment_id)
VALUES (
  'seu@email.com',  -- <<<< MUDE AQUI
  (SELECT id FROM products WHERE slug = 'ebook_completo'),
  'approved',
  97.00,
  'test_payment_002'
);
*/

-- 3. Inserir purchase do ebook simples (R$ 47) - OPCIONAL
/*
INSERT INTO purchases (user_email, product_id, payment_status, amount_paid, payment_id)
VALUES (
  'seu@email.com',  -- <<<< MUDE AQUI
  (SELECT id FROM products WHERE slug = 'ebook_simples'),
  'approved',
  47.00,
  'test_payment_003'
);
*/

-- 4. Inserir purchase da mentoria (R$ 497) - OPCIONAL
/*
INSERT INTO purchases (user_email, product_id, payment_status, amount_paid, payment_id)
VALUES (
  'seu@email.com',  -- <<<< MUDE AQUI
  (SELECT id FROM products WHERE slug = 'mentoria'),
  'approved',
  497.00,
  'test_payment_004'
);
*/

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================

-- Ver todas as purchases
SELECT
  p.id,
  p.user_email,
  p.payment_status,
  p.amount_paid,
  prod.name as product_name,
  prod.slug as product_slug
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
ORDER BY p.created_at DESC;

-- Ver purchases de um email específico
-- SELECT * FROM purchases WHERE user_email = 'seu@email.com';
