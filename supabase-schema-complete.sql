-- ============================================
-- SCHEMA COMPLETO - PLATAFORMA DE ANAMNESE
-- ============================================
-- Inclui: Tabelas, Autenticação, RLS Policies, Triggers, Indexes
-- Executar este arquivo uma única vez no Supabase SQL Editor

-- ============================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ============================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Password encryption (pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. TABELAS PRINCIPAIS
-- ============================================

-- Tabela de LEADS (captura inicial de nome + email)
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

-- Tabela de RESPONSES (anamneses completas)
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  test_1_score INTEGER NOT NULL CHECK (test_1_score >= 0 AND test_1_score <= 105),
  test_2_score INTEGER NOT NULL CHECK (test_2_score >= 0 AND test_2_score <= 105),
  test_3_score INTEGER NOT NULL CHECK (test_3_score >= 0 AND test_3_score <= 105),
  total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 315),
  test_1_responses JSONB NOT NULL,
  test_2_responses JSONB NOT NULL,
  test_3_responses JSONB NOT NULL,
  analysis TEXT NOT NULL,
  health_level TEXT NOT NULL CHECK (health_level IN ('critical', 'moderate', 'good', 'excellent')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'refused', 'refunded', 'chargeback')),
  payment_id TEXT,
  payment_amount DECIMAL(10,2),
  payment_date TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  kiwify_order_id TEXT,
  kiwify_customer_id TEXT,
  result_unlocked BOOLEAN DEFAULT FALSE,
  result_unlocked_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de ADMIN USERS (administradores)
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

-- Tabela de AUDIT LOG (registro de ações dos admins)
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
-- 3. ÍNDICES PARA PERFORMANCE
-- ============================================

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_started_quiz ON leads(started_quiz);
CREATE INDEX IF NOT EXISTS idx_leads_completed_quiz ON leads(completed_quiz);
CREATE INDEX IF NOT EXISTS idx_leads_utm_source ON leads(utm_source);

-- Responses
CREATE INDEX IF NOT EXISTS idx_responses_email ON responses(email);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_payment_status ON responses(payment_status);
CREATE INDEX IF NOT EXISTS idx_responses_result_unlocked ON responses(result_unlocked);
CREATE INDEX IF NOT EXISTS idx_responses_payment_id ON responses(payment_id);
CREATE INDEX IF NOT EXISTS idx_responses_stripe_session_id ON responses(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_responses_kiwify_order_id ON responses(kiwify_order_id);

-- Admin Users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource_type ON audit_log(resource_type);

-- ============================================
-- 4. FUNCTIONS (Funções utilitárias)
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se é admin autenticado
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica se o usuário atual tem role de admin
  -- Nota: Esta função será usada em conjunto com Supabase Auth
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND is_active = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para criar hash de senha
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

-- Função para verificar login de admin
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.email,
    a.full_name,
    a.role
  FROM admin_users a
  WHERE a.email = p_email
    AND a.password_hash = crypt(p_password, a.password_hash)
    AND a.is_active = TRUE;

  -- Atualizar last_login
  UPDATE admin_users
  SET last_login = NOW()
  WHERE email = p_email
    AND password_hash = crypt(p_password, password_hash)
    AND is_active = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Trigger para atualizar updated_at em leads
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em responses
DROP TRIGGER IF EXISTS update_responses_updated_at ON responses;
CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar updated_at em admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES para LEADS
-- ============================================

-- Qualquer pessoa pode inserir um lead (captura de email)
DROP POLICY IF EXISTS "Public can insert leads" ON leads;
CREATE POLICY "Public can insert leads"
  ON leads FOR INSERT
  TO public
  WITH CHECK (true);

-- Apenas admins autenticados podem visualizar leads
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  );

-- Apenas admins podem atualizar leads
DROP POLICY IF EXISTS "Admins can update leads" ON leads;
CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  );

-- ============================================
-- POLICIES para RESPONSES
-- ============================================

-- Qualquer pessoa pode inserir uma response (completar quiz)
DROP POLICY IF EXISTS "Public can insert responses" ON responses;
CREATE POLICY "Public can insert responses"
  ON responses FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins autenticados podem ver todas as responses
DROP POLICY IF EXISTS "Admins can view all responses" ON responses;
CREATE POLICY "Admins can view all responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  );

-- Service role pode atualizar responses (para webhooks de pagamento)
DROP POLICY IF EXISTS "Service role can update responses" ON responses;
CREATE POLICY "Service role can update responses"
  ON responses FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins podem atualizar responses manualmente
DROP POLICY IF EXISTS "Admins can update responses" ON responses;
CREATE POLICY "Admins can update responses"
  ON responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  );

-- ============================================
-- POLICIES para ADMIN_USERS
-- ============================================

-- Apenas super_admins podem criar novos admins
DROP POLICY IF EXISTS "Super admins can create admins" ON admin_users;
CREATE POLICY "Super admins can create admins"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- Admins podem ver apenas seu próprio perfil
DROP POLICY IF EXISTS "Admins can view own profile" ON admin_users;
CREATE POLICY "Admins can view own profile"
  ON admin_users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Super admins podem ver todos os admins
DROP POLICY IF EXISTS "Super admins can view all admins" ON admin_users;
CREATE POLICY "Super admins can view all admins"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- Admins podem atualizar apenas seu próprio perfil (exceto role)
DROP POLICY IF EXISTS "Admins can update own profile" ON admin_users;
CREATE POLICY "Admins can update own profile"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM admin_users WHERE id = auth.uid()));

-- Super admins podem atualizar qualquer admin
DROP POLICY IF EXISTS "Super admins can update any admin" ON admin_users;
CREATE POLICY "Super admins can update any admin"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- ============================================
-- POLICIES para AUDIT_LOG
-- ============================================

-- Service role pode inserir logs de auditoria
DROP POLICY IF EXISTS "Service can insert audit logs" ON audit_log;
CREATE POLICY "Service can insert audit logs"
  ON audit_log FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins autenticados podem inserir logs
DROP POLICY IF EXISTS "Admins can insert audit logs" ON audit_log;
CREATE POLICY "Admins can insert audit logs"
  ON audit_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND is_active = TRUE
    )
  );

-- Apenas super admins podem visualizar audit logs
DROP POLICY IF EXISTS "Super admins can view audit logs" ON audit_log;
CREATE POLICY "Super admins can view audit logs"
  ON audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = TRUE
    )
  );

-- ============================================
-- 7. GRANTS (Permissões)
-- ============================================

-- Public role (anônimos) - apenas INSERT em leads e responses
GRANT INSERT ON leads TO anon;
GRANT INSERT ON responses TO anon;

-- Authenticated role - acesso completo conforme RLS policies
GRANT ALL ON leads TO authenticated;
GRANT ALL ON responses TO authenticated;
GRANT ALL ON admin_users TO authenticated;
GRANT ALL ON audit_log TO authenticated;

-- Service role - acesso total (para webhooks)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- ============================================
-- 8. DADOS INICIAIS (SEED DATA)
-- ============================================

-- Criar primeiro super admin
-- IMPORTANTE: Altere o email e senha antes de executar!
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@marcioazevedo.com') THEN
    PERFORM create_admin_user(
      'admin@marcioazevedo.com',
      'ChangeMeNow123!',
      'Administrador Principal',
      'super_admin'
    );
  END IF;
END $$;

-- ============================================
-- 9. VIEWS ÚTEIS (Visualizações)
-- ============================================

-- View com estatísticas gerais
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

-- View com conversão de funil
CREATE OR REPLACE VIEW funnel_conversion AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE started_quiz = TRUE) as started,
  COUNT(*) FILTER (WHERE completed_quiz = TRUE) as completed,
  COUNT(*) FILTER (WHERE viewed_checkout = TRUE) as viewed_checkout,
  ROUND(
    (COUNT(*) FILTER (WHERE started_quiz = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    2
  ) as start_rate,
  ROUND(
    (COUNT(*) FILTER (WHERE completed_quiz = TRUE)::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
    2
  ) as completion_rate
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- 10. COMENTÁRIOS NAS TABELAS
-- ============================================

COMMENT ON TABLE leads IS 'Captura inicial de leads (nome + email) antes de iniciar o quiz';
COMMENT ON TABLE responses IS 'Anamneses completas com todas as respostas dos 3 testes';
COMMENT ON TABLE admin_users IS 'Usuários administradores com acesso ao painel admin';
COMMENT ON TABLE audit_log IS 'Registro de todas as ações realizadas pelos administradores';

-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Para verificar se tudo foi criado corretamente:
SELECT
  'Tables' as type,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public'
UNION ALL
SELECT
  'Policies' as type,
  COUNT(*) as count
FROM pg_policies
UNION ALL
SELECT
  'Functions' as type,
  COUNT(*) as count
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace;
