-- ============================================
-- SCHEMA COMPLETO - PLATAFORMA DE ANAMNESE
-- ============================================
-- IMPORTANTE: Execute este arquivo UMA ÚNICA VEZ em um banco limpo
-- Se já existem tabelas, execute primeiro: DROP SCHEMA public CASCADE; CREATE SCHEMA public;

-- ============================================
-- 1. LIMPAR TUDO (Cuidado: apaga todos os dados!)
-- ============================================
-- Descomente as linhas abaixo apenas se quiser resetar TUDO

-- DROP TABLE IF EXISTS audit_log CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;
-- DROP TABLE IF EXISTS responses CASCADE;
-- DROP TABLE IF EXISTS leads CASCADE;
-- DROP VIEW IF EXISTS stats_overview CASCADE;
-- DROP VIEW IF EXISTS funnel_conversion CASCADE;

-- ============================================
-- 2. EXTENSÕES NECESSÁRIAS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 3. TABELAS PRINCIPAIS
-- ============================================

-- Tabela de LEADS
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  started_quiz BOOLEAN DEFAULT FALSE,
  completed_quiz BOOLEAN DEFAULT FALSE,
  viewed_checkout BOOLEAN DEFAULT FALSE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  CONSTRAINT unique_lead_email UNIQUE(email)
);

-- Tabela de RESPONSES
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  test_1_score INTEGER NOT NULL,
  test_2_score INTEGER NOT NULL,
  test_3_score INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  test_1_responses JSONB NOT NULL,
  test_2_responses JSONB NOT NULL,
  test_3_responses JSONB NOT NULL,
  analysis TEXT NOT NULL,
  health_level TEXT NOT NULL CHECK (health_level IN ('critical', 'moderate', 'good', 'excellent')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'refused', 'refunded', 'chargeback')),
  payment_id TEXT,
  payment_amount DECIMAL(10,2),
  payment_date TIMESTAMP WITH TIME ZONE,
  kiwify_order_id TEXT,
  kiwify_customer_id TEXT,
  result_unlocked BOOLEAN DEFAULT FALSE,
  result_unlocked_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de ADMIN USERS
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Tabela de AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT
);

-- ============================================
-- 4. ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_started_quiz ON leads(started_quiz);
CREATE INDEX IF NOT EXISTS idx_leads_completed_quiz ON leads(completed_quiz);

CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_payment_status ON responses(payment_status);
CREATE INDEX IF NOT EXISTS idx_responses_result_unlocked ON responses(result_unlocked);
CREATE INDEX IF NOT EXISTS idx_responses_payment_id ON responses(payment_id);

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- ============================================
-- 5. FUNCTIONS
-- ============================================

-- Atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email TEXT,
  p_password TEXT,
  p_full_name TEXT,
  p_role TEXT DEFAULT 'admin'
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  INSERT INTO admin_users (email, password_hash, full_name, role)
  VALUES (
    p_email,
    crypt(p_password, gen_salt('bf', 10)),
    p_full_name,
    p_role
  )
  RETURNING id INTO v_user_id;

  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar login
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  success BOOLEAN
) AS $$
DECLARE
  v_user_id UUID;
  v_email TEXT;
  v_full_name TEXT;
  v_role TEXT;
BEGIN
  SELECT a.id, a.email, a.full_name, a.role
  INTO v_user_id, v_email, v_full_name, v_role
  FROM admin_users a
  WHERE a.email = p_email
    AND a.password_hash = crypt(p_password, a.password_hash)
    AND a.is_active = TRUE;

  IF v_user_id IS NOT NULL THEN
    -- Login bem-sucedido, atualizar last_login
    UPDATE admin_users
    SET last_login = NOW()
    WHERE id = v_user_id;

    RETURN QUERY SELECT v_user_id, v_email, v_full_name, v_role, TRUE;
  ELSE
    -- Login falhou
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_responses_updated_at ON responses;
CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- LEADS POLICIES
DROP POLICY IF EXISTS "Public can insert leads" ON leads;
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can read leads" ON leads;
CREATE POLICY "Service role can read leads"
  ON leads FOR SELECT
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "Service role can update leads" ON leads;
CREATE POLICY "Service role can update leads"
  ON leads FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RESPONSES POLICIES
DROP POLICY IF EXISTS "Public can insert responses" ON responses;
CREATE POLICY "Public can insert responses"
  ON responses FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can read responses" ON responses;
CREATE POLICY "Service role can read responses"
  ON responses FOR SELECT
  TO service_role
  USING (true);

DROP POLICY IF EXISTS "Service role can update responses" ON responses;
CREATE POLICY "Service role can update responses"
  ON responses FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ADMIN_USERS POLICIES (apenas service_role pode acessar)
DROP POLICY IF EXISTS "Service role can manage admin_users" ON admin_users;
CREATE POLICY "Service role can manage admin_users"
  ON admin_users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- AUDIT_LOG POLICIES
DROP POLICY IF EXISTS "Service role can insert audit_logs" ON audit_log;
CREATE POLICY "Service role can insert audit_logs"
  ON audit_log FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can read audit_logs" ON audit_log;
CREATE POLICY "Service role can read audit_logs"
  ON audit_log FOR SELECT
  TO service_role
  USING (true);

-- ============================================
-- 8. GRANTS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT INSERT ON leads TO anon;
GRANT SELECT, UPDATE ON leads TO service_role;

GRANT INSERT ON responses TO anon;
GRANT SELECT, UPDATE ON responses TO service_role;

GRANT ALL ON admin_users TO service_role;
GRANT ALL ON audit_log TO service_role;

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ============================================
-- 9. VIEWS
-- ============================================

CREATE OR REPLACE VIEW stats_overview AS
SELECT
  (SELECT COUNT(*) FROM leads) as total_leads,
  (SELECT COUNT(*) FROM leads WHERE started_quiz = TRUE) as leads_started,
  (SELECT COUNT(*) FROM leads WHERE completed_quiz = TRUE) as leads_completed,
  (SELECT COUNT(*) FROM responses) as total_responses,
  (SELECT COUNT(*) FROM responses WHERE payment_status = 'approved') as paid_responses,
  (SELECT COUNT(*) FROM responses WHERE payment_status = 'pending') as pending_payments,
  (SELECT COALESCE(SUM(payment_amount), 0) FROM responses WHERE payment_status = 'approved') as total_revenue,
  (SELECT ROUND(AVG(total_score), 2) FROM responses) as avg_score;

CREATE OR REPLACE VIEW funnel_conversion AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE started_quiz = TRUE) as started,
  COUNT(*) FILTER (WHERE completed_quiz = TRUE) as completed,
  COUNT(*) FILTER (WHERE viewed_checkout = TRUE) as viewed_checkout,
  ROUND((COUNT(*) FILTER (WHERE started_quiz = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2) as start_rate,
  ROUND((COUNT(*) FILTER (WHERE completed_quiz = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100, 2) as completion_rate
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- 10. SEED DATA - PRIMEIRO ADMIN
-- ============================================
-- Email: hdlprofissional@yahoo.com.br
-- Senha: 248367

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'hdlprofissional@yahoo.com.br') THEN
    PERFORM create_admin_user(
      'hdlprofissional@yahoo.com.br',
      '248367',
      'Administrador Principal',
      'super_admin'
    );
    RAISE NOTICE 'Super admin criado com sucesso!';
  ELSE
    RAISE NOTICE 'Super admin já existe.';
  END IF;
END $$;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

SELECT 'Schema criado com sucesso!' as status;
