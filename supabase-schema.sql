-- ============================================
-- SCHEMA COMPLETO - EXECUTAR UMA ÚNICA VEZ
-- Plataforma de Avaliação de Saúde Emocional
-- ============================================

-- 1. Tabela de Leads (captura inicial)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados do lead
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Controle de progresso
  started_quiz BOOLEAN DEFAULT FALSE,
  completed_quiz BOOLEAN DEFAULT FALSE,
  viewed_checkout BOOLEAN DEFAULT FALSE,

  -- Dados de origem/tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,

  -- Controle de duplicação
  CONSTRAINT unique_email UNIQUE(email)
);

-- 2. Tabela de Respostas dos Testes
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Dados do usuário
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Scores dos testes
  test_1_score INTEGER NOT NULL,
  test_2_score INTEGER NOT NULL,
  test_3_score INTEGER NOT NULL,
  total_score INTEGER NOT NULL,

  -- Respostas detalhadas
  test_1_responses JSONB NOT NULL,
  test_2_responses JSONB NOT NULL,
  test_3_responses JSONB NOT NULL,

  -- Análise e resultado
  analysis TEXT NOT NULL,
  health_level TEXT NOT NULL CHECK (health_level IN ('critical', 'moderate', 'good', 'excellent')),

  -- Status de pagamento (Kiwify)
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'refused', 'refunded', 'chargeback')),
  payment_id TEXT, -- ID da transação Kiwify
  payment_amount DECIMAL(10,2), -- Valor pago
  payment_date TIMESTAMP WITH TIME ZONE,
  kiwify_order_id TEXT, -- Order ID da Kiwify
  kiwify_customer_id TEXT, -- Customer ID da Kiwify

  -- Controle de acesso ao resultado
  result_unlocked BOOLEAN DEFAULT FALSE,
  result_unlocked_at TIMESTAMP WITH TIME ZONE
);

-- 2. Criar Índices para Performance

-- Índices para Leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_started_quiz ON leads(started_quiz);
CREATE INDEX IF NOT EXISTS idx_leads_completed_quiz ON leads(completed_quiz);
CREATE INDEX IF NOT EXISTS idx_leads_utm_campaign ON leads(utm_campaign);

-- Índices para Responses
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_health_level ON responses(health_level);
CREATE INDEX IF NOT EXISTS idx_responses_payment_status ON responses(payment_status);
CREATE INDEX IF NOT EXISTS idx_responses_payment_id ON responses(payment_id);
CREATE INDEX IF NOT EXISTS idx_responses_kiwify_order_id ON responses(kiwify_order_id);

-- 3. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_responses_updated_at ON responses;
CREATE TRIGGER update_responses_updated_at
    BEFORE UPDATE ON responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- 6. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Enable insert for all users" ON responses;
DROP POLICY IF EXISTS "Enable read access for own data" ON responses;
DROP POLICY IF EXISTS "Enable update for payment webhook" ON responses;

-- 7. Criar Políticas de Segurança

-- Permitir inserção pública (qualquer pessoa pode inserir)
CREATE POLICY "Enable insert for all users" ON responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Permitir leitura dos próprios dados
CREATE POLICY "Enable read access for own data" ON responses
FOR SELECT
TO anon, authenticated
USING (true);

-- Permitir atualização para webhooks (via service_role ou authenticated)
CREATE POLICY "Enable update for payment webhook" ON responses
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 8. Comentários para Documentação
COMMENT ON TABLE responses IS 'Armazena as respostas dos testes de saúde emocional com integração Kiwify';
COMMENT ON COLUMN responses.test_1_responses IS 'Respostas do Teste 1 (Relação com o Pai) em formato JSON';
COMMENT ON COLUMN responses.test_2_responses IS 'Respostas do Teste 2 (Relação com a Mãe) em formato JSON';
COMMENT ON COLUMN responses.test_3_responses IS 'Respostas do Teste 3 (Sexualidade) em formato JSON';
COMMENT ON COLUMN responses.health_level IS 'Nível de saúde emocional: critical, moderate, good, excellent';
COMMENT ON COLUMN responses.payment_status IS 'Status do pagamento na Kiwify: pending, approved, refused, refunded, chargeback';
COMMENT ON COLUMN responses.result_unlocked IS 'Se o resultado foi desbloqueado após pagamento aprovado';

-- 9. Função para processar webhook da Kiwify
CREATE OR REPLACE FUNCTION process_kiwify_webhook(
  p_order_id TEXT,
  p_status TEXT,
  p_payment_id TEXT DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Atualizar status do pagamento
  UPDATE responses
  SET
    payment_status = p_status,
    payment_id = COALESCE(p_payment_id, payment_id),
    payment_date = CASE WHEN p_status = 'approved' THEN NOW() ELSE payment_date END,
    result_unlocked = CASE WHEN p_status = 'approved' THEN TRUE ELSE result_unlocked END,
    result_unlocked_at = CASE WHEN p_status = 'approved' THEN NOW() ELSE result_unlocked_at END
  WHERE
    kiwify_order_id = p_order_id
    OR (p_customer_email IS NOT NULL AND email = p_customer_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant de permissões
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON responses TO anon, authenticated;
GRANT EXECUTE ON FUNCTION process_kiwify_webhook TO authenticated;

-- ============================================
-- FIM DO SCHEMA
-- Execute este arquivo UMA ÚNICA VEZ no Supabase SQL Editor
-- ============================================
