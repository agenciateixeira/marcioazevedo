-- ========================================
-- CONFIGURAÇÃO COMPLETA DO SUPABASE STORAGE
-- ========================================

-- ATENÇÃO: Execute este script no SQL Editor do Supabase
-- Dashboard → SQL Editor → New Query

-- ========================================
-- 1. VERIFICAR SE O BUCKET EXISTE
-- ========================================

SELECT * FROM storage.buckets WHERE name = 'content';

-- Se não retornar nada, o bucket NÃO existe!
-- Você precisa criar via interface:
-- Storage → Create bucket → Nome: "content" → Public: SIM

-- ========================================
-- 2. CRIAR POLÍTICAS DE ACESSO (RLS)
-- ========================================

-- Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;

-- Política 1: Leitura pública (qualquer pessoa pode ver os arquivos)
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content');

-- Política 2: Upload autenticado (admin pode fazer upload)
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content');

-- Política 3: Atualização autenticada
CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content')
WITH CHECK (bucket_id = 'content');

-- Política 4: Delete autenticado (admin pode deletar)
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content');

-- ========================================
-- 3. VERIFICAR PRODUTOS NO BANCO
-- ========================================

SELECT
  id,
  slug,
  name,
  content_type,
  content_url,
  is_active,
  created_at
FROM products
ORDER BY created_at DESC;

-- ========================================
-- 4. VERIFICAR PURCHASES (QUEM COMPROU O QUÊ)
-- ========================================

SELECT
  p.user_email,
  pr.name as product_name,
  p.amount_paid,
  p.payment_status,
  p.created_at
FROM purchases p
LEFT JOIN products pr ON p.product_id = pr.id
ORDER BY p.created_at DESC
LIMIT 10;

-- ========================================
-- 5. INSERIR PRODUTOS DE TESTE (OPCIONAL)
-- ========================================

-- Apenas execute se não tiver produtos ainda
-- Lembre-se de fazer upload dos PDFs depois!

INSERT INTO products (slug, name, description, price, content_type, is_active)
VALUES
  (
    'ebook-completo',
    'E-book Completo de Saúde Emocional',
    'Material completo sobre saúde emocional no relacionamento com análise psicanalítica profunda',
    97.00,
    'pdf',
    true
  ),
  (
    'ebook-simples',
    'E-book Introdutório',
    'Introdução à saúde emocional feminina e padrões relacionais',
    47.00,
    'pdf',
    true
  ),
  (
    'resultado-anamnese',
    'Resultado da Anamnese Completa',
    'Acesso ao resultado completo e personalizado da sua anamnese emocional',
    27.00,
    'pdf',
    true
  ),
  (
    'mentoria',
    'Mentoria Individual',
    'Sessão individual de 1 hora de mentoria emocional personalizada',
    297.00,
    'session',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 6. CRIAR PURCHASE DE TESTE
-- ========================================

-- Substitua 'seu-email@gmail.com' pelo seu email de teste
-- Substitua o product_id pelo ID real do produto (veja query #3)

/*
INSERT INTO purchases (user_email, product_id, stripe_payment_id, amount_paid, payment_status)
VALUES (
  'seu-email@gmail.com',
  (SELECT id FROM products WHERE slug = 'ebook-completo' LIMIT 1),
  'test_payment_' || gen_random_uuid(),
  97.00,
  'succeeded'
);
*/

-- ========================================
-- 7. VERIFICAR SE USER PODE VER O PRODUTO
-- ========================================

-- Substitua pelo email do cliente
/*
SELECT
  p.user_email,
  pr.slug,
  pr.name,
  pr.content_url,
  p.created_at as purchased_at
FROM purchases p
JOIN products pr ON p.product_id = pr.id
WHERE p.user_email = 'seu-email@gmail.com'
  AND p.payment_status = 'succeeded';
*/

-- ========================================
-- INSTRUÇÕES FINAIS
-- ========================================

/*
1. Criar bucket "content" na interface do Supabase:
   Storage → Create bucket → Name: content → Public: YES

2. Executar queries 2, 3 e 4 acima para verificar tudo

3. Se não tiver produtos, executar query 5

4. Ir no admin (/admin/produtos) e fazer upload dos PDFs

5. Criar uma compra de teste (query 6) OU fazer compra real via Stripe

6. Verificar se o produto aparece na área de membros
*/
