-- =====================================================
-- SOLUÇÃO TEMPORÁRIA: DESABILITAR TRIGGER
-- =====================================================
-- O trigger está causando erro mesmo com tratamento de exceção.
-- Vamos desabilitá-lo TEMPORARIAMENTE para permitir criação de usuários.
-- Depois vinculamos as purchases MANUALMENTE.
-- =====================================================

-- =====================================================
-- 1. DESABILITAR O TRIGGER
-- =====================================================

-- Remover completamente o trigger problemático
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Confirmar que foi removido
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✅ Trigger removido com sucesso'
    ELSE '❌ Trigger ainda existe'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- =====================================================
-- 2. CRIAR FUNÇÃO PARA VINCULAR PURCHASES MANUALMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION vincular_purchases_manualmente()
RETURNS TABLE (
  user_email_result TEXT,
  user_id_result UUID,
  purchases_vinculadas INTEGER,
  progresso_vinculado INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user RECORD;
  v_purchases_count INTEGER;
  v_progress_count INTEGER;
BEGIN
  -- Para cada usuário que existe no auth.users
  FOR v_user IN
    SELECT u.id, u.email FROM auth.users u
  LOOP
    -- Vincular purchases
    UPDATE purchases
    SET user_id = v_user.id,
        updated_at = NOW()
    WHERE user_email = v_user.email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_purchases_count = ROW_COUNT;

    -- Vincular user_progress
    UPDATE user_progress
    SET user_id = v_user.id,
        updated_at = NOW()
    WHERE user_email = v_user.email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_progress_count = ROW_COUNT;

    -- Retornar resultado
    RETURN QUERY
    SELECT
      v_user.email::TEXT,
      v_user.id,
      v_purchases_count,
      v_progress_count;
  END LOOP;
END;
$$;

-- =====================================================
-- 3. EXECUTAR VINCULAÇÃO MANUAL AGORA
-- =====================================================

-- Vincular todas as purchases existentes
SELECT * FROM vincular_purchases_manualmente();

-- =====================================================
-- 4. VERIFICAR RESULTADO
-- =====================================================

-- Ver purchases vinculadas
SELECT
  user_email,
  user_id,
  CASE
    WHEN user_id IS NOT NULL THEN '✅ Vinculada'
    ELSE '❌ Faltando'
  END as status
FROM purchases
ORDER BY created_at DESC;

-- Contar vinculadas vs faltando
SELECT
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) as vinculadas,
  COUNT(*) FILTER (WHERE user_id IS NULL) as faltando
FROM purchases;

-- =====================================================
-- INSTRUÇÕES:
-- =====================================================
--
-- AGORA VOCÊ PODE:
-- 1. Criar conta normalmente em /area-membros/primeiro-acesso
-- 2. O trigger NÃO VAI MAIS causar erro
-- 3. Após criar a conta, execute:
--
--    SELECT * FROM vincular_purchases_manualmente();
--
-- 4. Isso vincula as purchases ao user_id automaticamente
--
-- OU faça manualmente:
--
--    UPDATE purchases
--    SET user_id = (SELECT id FROM auth.users WHERE email = 'SEU_EMAIL@gmail.com')
--    WHERE user_email = 'SEU_EMAIL@gmail.com';
--
-- =====================================================

-- =====================================================
-- VERIFICAÇÃO RÁPIDA:
-- =====================================================

-- Deve mostrar: ✅ Trigger removido com sucesso
SELECT
  CASE
    WHEN COUNT(*) = 0 THEN '✅ Trigger removido - pode criar conta agora!'
    ELSE '❌ Trigger ainda existe - execute este SQL novamente'
  END as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
