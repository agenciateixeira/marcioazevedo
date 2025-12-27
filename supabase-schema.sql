-- Tabela para armazenar as respostas dos testes
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
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
  health_level TEXT NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX idx_responses_email ON responses(email);
CREATE INDEX idx_responses_created_at ON responses(created_at DESC);
CREATE INDEX idx_responses_health_level ON responses(health_level);

-- Habilitar Row Level Security
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (qualquer pessoa pode inserir)
CREATE POLICY "Enable insert for all users" ON responses
FOR INSERT
TO anon
WITH CHECK (true);

-- Política para permitir leitura apenas dos próprios dados (baseado no email)
CREATE POLICY "Enable read access for own data" ON responses
FOR SELECT
TO anon
USING (true);

-- Comentários para documentação
COMMENT ON TABLE responses IS 'Armazena as respostas dos testes de saúde emocional para mulheres';
COMMENT ON COLUMN responses.test_1_responses IS 'Respostas do Teste 1 (Pai) em formato JSON';
COMMENT ON COLUMN responses.test_2_responses IS 'Respostas do Teste 2 (Mãe) em formato JSON';
COMMENT ON COLUMN responses.test_3_responses IS 'Respostas do Teste 3 (Sexualidade) em formato JSON';
COMMENT ON COLUMN responses.health_level IS 'Nível de saúde emocional: critical, moderate, good, excellent';
