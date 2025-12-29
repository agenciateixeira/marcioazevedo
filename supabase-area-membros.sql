-- =====================================================
-- ÁREA DE MEMBROS - SCHEMA COMPLETO
-- =====================================================
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- 1. TABELA DE PRODUTOS
-- Armazena todos os produtos disponíveis
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Informações do produto
  slug TEXT UNIQUE NOT NULL, -- 'resultado', 'ebook_completo', 'ebook_simples', 'mentoria'
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,

  -- Conteúdo
  content_type TEXT NOT NULL, -- 'pdf', 'video', 'link', 'session'
  content_url TEXT, -- URL do arquivo ou link
  thumbnail_url TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Status
  is_active BOOLEAN DEFAULT true
);

-- Inserir os 4 produtos iniciais
INSERT INTO products (slug, name, description, price, content_type, content_url) VALUES
  ('resultado', 'Resultado da Anamnese Emocional', 'Acesso completo ao seu resultado com análise preditiva personalizada', 7.00, 'pdf', NULL),
  ('ebook_completo', 'E-book Transformação nas 3 Esferas', 'Guia completo de 147 páginas para romper padrões emocionais', 97.00, 'pdf', NULL),
  ('ebook_simples', 'E-book Primeiros Passos', 'Versão essencial com 30 páginas dos exercícios mais importantes', 47.00, 'pdf', NULL),
  ('mentoria', 'Mentoria Individual - 2 Horas', 'Sessão particular com acompanhamento de 30 dias', 497.00, 'session', NULL)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 2. TABELA DE COMPRAS (PURCHASES)
-- Relaciona usuários com produtos comprados
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relacionamentos
  user_email TEXT NOT NULL, -- Email do usuário (até ele criar conta)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Vincula quando criar conta
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,

  -- Informações da compra
  payment_id TEXT, -- ID do pagamento no Stripe
  payment_status TEXT DEFAULT 'approved', -- 'approved', 'refunded', 'cancelled'
  amount_paid DECIMAL(10,2) NOT NULL,

  -- Acesso
  access_granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  access_expires_at TIMESTAMP WITH TIME ZONE, -- NULL = acesso vitalício

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_purchases_user_email ON purchases(user_email);
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product_id ON purchases(product_id);

-- =====================================================
-- 3. TABELA DE PROGRESSO DO USUÁRIO
-- Tracking de o que foi consumido/visualizado
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Relacionamentos
  user_email TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,

  -- Progresso
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Tracking detalhado (opcional)
  sections_completed JSONB DEFAULT '[]'::jsonb,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Unique constraint: um progresso por usuário por produto
  UNIQUE(user_email, product_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_user_progress_user_email ON user_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- =====================================================
-- 4. TABELA DE METADADOS DO USUÁRIO (OPCIONAL)
-- Dados extras além do auth.users
CREATE TABLE IF NOT EXISTS user_metadata (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Informações pessoais
  full_name TEXT,
  phone TEXT,

  -- Preferências
  preferences JSONB DEFAULT '{}'::jsonb,

  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT false,
  first_login_at TIMESTAMP WITH TIME ZONE,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metadata ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Todos podem ler produtos ativos
CREATE POLICY "Produtos públicos" ON products
  FOR SELECT
  USING (is_active = true);

-- PURCHASES: Usuário só vê suas próprias compras
CREATE POLICY "Ver próprias compras" ON purchases
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    auth.email() = user_email
  );

-- USER_PROGRESS: Usuário só vê seu próprio progresso
CREATE POLICY "Ver próprio progresso" ON user_progress
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    auth.email() = user_email
  );

-- USER_PROGRESS: Usuário pode atualizar seu próprio progresso
CREATE POLICY "Atualizar próprio progresso" ON user_progress
  FOR UPDATE
  USING (
    auth.uid() = user_id
    OR
    auth.email() = user_email
  );

-- USER_PROGRESS: Usuário pode inserir seu próprio progresso
CREATE POLICY "Inserir próprio progresso" ON user_progress
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR
    auth.email() = user_email
  );

-- USER_METADATA: Usuário só vê seus próprios dados
CREATE POLICY "Ver próprios metadados" ON user_metadata
  FOR SELECT
  USING (auth.uid() = id);

-- USER_METADATA: Usuário pode atualizar seus próprios dados
CREATE POLICY "Atualizar próprios metadados" ON user_metadata
  FOR UPDATE
  USING (auth.uid() = id);

-- USER_METADATA: Usuário pode inserir seus próprios dados
CREATE POLICY "Inserir próprios metadados" ON user_metadata
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 6. FUNCTIONS ÚTEIS
-- =====================================================

-- Função para vincular compras ao user_id quando usuário se cadastra
CREATE OR REPLACE FUNCTION link_purchases_to_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar purchases com o user_id
  UPDATE purchases
  SET user_id = NEW.id
  WHERE user_email = NEW.email AND user_id IS NULL;

  -- Atualizar user_progress com o user_id
  UPDATE user_progress
  SET user_id = NEW.id
  WHERE user_email = NEW.email AND user_id IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: quando novo usuário se registra, vincular compras
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_purchases_to_user();

-- =====================================================
-- 7. FUNÇÃO PARA CRIAR PURCHASE APÓS PAGAMENTO
-- =====================================================

CREATE OR REPLACE FUNCTION create_purchase_from_payment(
  p_email TEXT,
  p_product_type TEXT,
  p_payment_id TEXT,
  p_amount DECIMAL
)
RETURNS UUID AS $$
DECLARE
  v_product_id UUID;
  v_purchase_id UUID;
BEGIN
  -- Buscar ID do produto pelo slug
  SELECT id INTO v_product_id
  FROM products
  WHERE slug = p_product_type AND is_active = true
  LIMIT 1;

  IF v_product_id IS NULL THEN
    RAISE EXCEPTION 'Produto não encontrado: %', p_product_type;
  END IF;

  -- Criar purchase
  INSERT INTO purchases (user_email, product_id, payment_id, amount_paid)
  VALUES (p_email, v_product_id, p_payment_id, p_amount)
  RETURNING id INTO v_purchase_id;

  -- Criar progresso inicial
  INSERT INTO user_progress (user_email, product_id)
  VALUES (p_email, v_product_id)
  ON CONFLICT (user_email, product_id) DO NOTHING;

  RETURN v_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PRONTO! Schema criado com sucesso!
-- =====================================================

-- Para verificar se tudo foi criado:
SELECT
  'products' as tabela,
  COUNT(*) as registros
FROM products
UNION ALL
SELECT 'purchases', COUNT(*) FROM purchases
UNION ALL
SELECT 'user_progress', COUNT(*) FROM user_progress
UNION ALL
SELECT 'user_metadata', COUNT(*) FROM user_metadata;
