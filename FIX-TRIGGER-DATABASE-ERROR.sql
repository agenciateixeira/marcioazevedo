-- =====================================================
-- CORRIGIR TRIGGER QUE CAUSA "Database error saving new user"
-- =====================================================
-- Problema: Trigger on_auth_user_created está falhando e impedindo
-- criação de novos usuários
--
-- Solução: Recriar função com tratamento de erro robusto
-- =====================================================

-- =====================================================
-- 1. DROPAR TRIGGER E FUNÇÃO ANTIGA
-- =====================================================

-- Remover trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Remover função antiga
DROP FUNCTION IF EXISTS link_purchases_to_user();

-- =====================================================
-- 2. CRIAR NOVA FUNÇÃO COM TRATAMENTO DE ERRO
-- =====================================================

CREATE OR REPLACE FUNCTION link_purchases_to_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com permissões elevadas (bypassa RLS)
SET search_path = public
AS $$
DECLARE
  v_purchases_updated INTEGER := 0;
  v_progress_updated INTEGER := 0;
BEGIN
  -- Log da execução (aparece nos logs do Supabase)
  RAISE NOTICE 'Trigger executado para novo usuário: % (%)', NEW.email, NEW.id;

  -- Tentar atualizar purchases
  BEGIN
    UPDATE purchases
    SET user_id = NEW.id,
        updated_at = NOW()
    WHERE user_email = NEW.email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_purchases_updated = ROW_COUNT;
    RAISE NOTICE 'Purchases atualizadas: %', v_purchases_updated;
  EXCEPTION
    WHEN OTHERS THEN
      -- Logar erro mas NÃO falhar
      RAISE WARNING 'Erro ao atualizar purchases: %', SQLERRM;
  END;

  -- Tentar atualizar user_progress
  BEGIN
    UPDATE user_progress
    SET user_id = NEW.id,
        updated_at = NOW()
    WHERE user_email = NEW.email
      AND user_id IS NULL;

    GET DIAGNOSTICS v_progress_updated = ROW_COUNT;
    RAISE NOTICE 'User progress atualizados: %', v_progress_updated;
  EXCEPTION
    WHEN OTHERS THEN
      -- Logar erro mas NÃO falhar
      RAISE WARNING 'Erro ao atualizar user_progress: %', SQLERRM;
  END;

  -- SEMPRE retornar NEW para não bloquear a criação do usuário
  RETURN NEW;
END;
$$;

-- =====================================================
-- 3. RECRIAR TRIGGER
-- =====================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_purchases_to_user();

-- =====================================================
-- 4. ADICIONAR COLUNA updated_at SE NÃO EXISTIR
-- =====================================================

-- Adicionar coluna updated_at em purchases (se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE purchases ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END
$$;

-- =====================================================
-- 5. TESTAR SE A FUNÇÃO NÃO FALHA
-- =====================================================

-- Teste simples: a função está criada?
DO $$
BEGIN
  -- Verificar se função existe
  IF EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_name = 'link_purchases_to_user'
  ) THEN
    RAISE NOTICE '✅ Função link_purchases_to_user criada com sucesso!';
  ELSE
    RAISE WARNING '❌ Função link_purchases_to_user NÃO foi criada!';
  END IF;
END
$$;

-- =====================================================
-- 6. VERIFICAR SE O TRIGGER FOI CRIADO
-- =====================================================

SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Deve retornar 1 linha

-- =====================================================
-- 7. VERIFICAR PURCHASES QUE FALTAM VINCULAR
-- =====================================================

-- Ver quantas purchases ainda não têm user_id
SELECT
  COUNT(*) as total_sem_user_id,
  ARRAY_AGG(DISTINCT user_email) as emails
FROM purchases
WHERE user_id IS NULL;

-- =====================================================
-- 8. VINCULAR MANUALMENTE PURCHASES ANTIGAS
-- =====================================================

-- Para emails que já criaram conta mas purchases não foram vinculadas
UPDATE purchases p
SET user_id = u.id,
    updated_at = NOW()
FROM auth.users u
WHERE p.user_email = u.email
  AND p.user_id IS NULL;

-- Ver quantas foram atualizadas
SELECT
  COUNT(*) as total_vinculadas
FROM purchases
WHERE user_id IS NOT NULL;

-- =====================================================
-- 9. VINCULAR MANUALMENTE USER_PROGRESS ANTIGOS
-- =====================================================

UPDATE user_progress up
SET user_id = u.id,
    updated_at = NOW()
FROM auth.users u
WHERE up.user_email = u.email
  AND up.user_id IS NULL;

-- =====================================================
-- PRONTO!
-- =====================================================
-- Agora o trigger NÃO VAI FALHAR mesmo se houver erro.
-- Ele sempre retorna NEW para não bloquear a criação do usuário.
--
-- Teste criando uma conta em:
-- /area-membros/primeiro-acesso
-- =====================================================
