-- =====================================================
-- CORRIGIR VERIFICAÇÃO DE EMAIL NO PRIMEIRO ACESSO
-- =====================================================
-- Problema: RLS bloqueia verificação de purchases quando usuário
-- não está autenticado (criando senha pela primeira vez)
--
-- Solução: Criar função RPC que bypassa RLS de forma segura
-- =====================================================

-- =====================================================
-- CRIAR FUNÇÃO PARA VERIFICAR SE EMAIL TEM COMPRAS
-- =====================================================

CREATE OR REPLACE FUNCTION check_email_has_purchases(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com permissões do dono (bypassa RLS)
AS $$
BEGIN
  -- Retorna TRUE se o email tem pelo menos 1 purchase aprovada
  RETURN EXISTS (
    SELECT 1
    FROM purchases
    WHERE user_email = p_email
      AND payment_status = 'approved'
    LIMIT 1
  );
END;
$$;

-- =====================================================
-- TESTAR A FUNÇÃO
-- =====================================================

-- Teste 1: Email que TEM compra (deve retornar TRUE)
-- Substitua pelo email real que você sabe que tem compra
SELECT check_email_has_purchases('seu_email_com_compra@gmail.com') as tem_compra;

-- Teste 2: Email que NÃO TEM compra (deve retornar FALSE)
SELECT check_email_has_purchases('email_inexistente_123456@gmail.com') as tem_compra;

-- Teste 3: Ver quantos emails têm compras
SELECT
  user_email,
  check_email_has_purchases(user_email) as pode_criar_conta
FROM purchases
GROUP BY user_email
LIMIT 10;

-- =====================================================
-- GRANT PERMISSÕES PARA USUÁRIOS ANÔNIMOS
-- =====================================================

-- Permitir que QUALQUER UM (incluindo não autenticados) execute a função
GRANT EXECUTE ON FUNCTION check_email_has_purchases(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION check_email_has_purchases(TEXT) TO authenticated;

-- =====================================================
-- VERIFICAR SE FUNCIONOU
-- =====================================================

-- Esta query deve funcionar mesmo sem estar logado
SELECT check_email_has_purchases('email@teste.com');

-- =====================================================
-- RESUMO
-- =====================================================
-- Agora a página /area-membros/primeiro-acesso pode chamar:
--
--   supabase.rpc('check_email_has_purchases', { p_email: email })
--
-- E vai funcionar MESMO sem o usuário estar autenticado!
-- A função bypassa RLS de forma segura porque:
-- - Só retorna TRUE/FALSE (não expõe dados sensíveis)
-- - Não permite modificação de dados
-- - Apenas verifica se email existe em purchases
-- =====================================================
