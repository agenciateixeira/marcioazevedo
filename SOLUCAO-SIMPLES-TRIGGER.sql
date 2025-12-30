-- =====================================================
-- SOLUÇÃO SIMPLES E DIRETA
-- =====================================================
-- Remove trigger + Permite criar conta
-- =====================================================

-- 1. REMOVER TRIGGER PROBLEMÁTICO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. REMOVER FUNÇÃO DO TRIGGER
DROP FUNCTION IF EXISTS link_purchases_to_user();

-- 3. VERIFICAR SE FOI REMOVIDO
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✅ PRONTO! Agora pode criar conta normalmente'
    ELSE '❌ Ainda existe - execute novamente'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =====================================================
-- PRONTO!
-- =====================================================
-- Agora vá em /area-membros/primeiro-acesso e crie sua conta.
-- NÃO VAI DAR MAIS ERRO!
--
-- Depois de criar a conta, execute o comando abaixo
-- substituindo o EMAIL:
-- =====================================================

/*

-- DEPOIS DE CRIAR A CONTA, EXECUTE ISSO:
-- (Substitua o email pelo seu)

UPDATE purchases
SET user_id = (SELECT id FROM auth.users WHERE email = 'guisdomkt@gmail.com')
WHERE user_email = 'guisdomkt@gmail.com'
  AND user_id IS NULL;

UPDATE user_progress
SET user_id = (SELECT id FROM auth.users WHERE email = 'guisdomkt@gmail.com')
WHERE user_email = 'guisdomkt@gmail.com'
  AND user_id IS NULL;

-- Verificar se funcionou:
SELECT
  user_email,
  user_id,
  CASE WHEN user_id IS NOT NULL THEN '✅ Vinculado' ELSE '❌ Não vinculado' END as status
FROM purchases
WHERE user_email = 'guisdomkt@gmail.com';

*/
