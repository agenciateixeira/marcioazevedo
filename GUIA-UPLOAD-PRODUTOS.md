# Guia Completo: Upload e Gerenciamento de Produtos

## 1. Configurar Supabase Storage (OBRIGATÓRIO)

### Passo 1: Criar Bucket no Supabase

1. Acesse o Supabase Dashboard: https://gaoajxkhbgilotyrtyfe.supabase.co
2. Vá em **Storage** (menu lateral esquerdo)
3. Clique em **"Create a new bucket"**
4. Configure o bucket:
   - **Name:** `content`
   - **Public bucket:** ✅ Marcar como público (para permitir acesso aos arquivos)
   - **File size limit:** 50 MB (ou mais se precisar)
   - **Allowed MIME types:** Deixe em branco para aceitar todos
5. Clique em **"Create bucket"**

### Passo 2: Configurar Políticas de Acesso (RLS)

Após criar o bucket, configure as políticas:

1. Clique no bucket **"content"**
2. Vá na aba **"Policies"**
3. Adicione as seguintes políticas:

#### Política 1: Permitir leitura pública
```sql
-- Nome: Public read access
-- Operation: SELECT
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content');
```

#### Política 2: Permitir upload autenticado
```sql
-- Nome: Authenticated users can upload
-- Operation: INSERT
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content');
```

#### Política 3: Permitir delete autenticado
```sql
-- Nome: Authenticated users can delete
-- Operation: DELETE
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content');
```

### Passo 3: Testar Upload

1. Vá no admin: `/admin/login`
2. Login com: `hdlprofissional@yahoo.com.br` / `248367`
3. Vá em **Produtos**
4. Clique em **"+ Novo Produto"**
5. Tente fazer upload de um PDF de teste

---

## 2. Como Adicionar Produtos

### Tipos de Produtos Suportados

1. **PDF** - E-books, apostilas, materiais em PDF
2. **Vídeo** - Vídeos do YouTube (cole o link)
3. **Link** - Links externos (Google Drive, Vimeo, etc.)
4. **Sessão** - Mentorias, consultorias agendadas

### Adicionar Produto do Tipo PDF

1. Acesse `/admin/produtos`
2. Clique em **"+ Novo Produto"**
3. Preencha os campos:
   - **Slug:** `ebook-completo` (usado na URL, sem espaços)
   - **Nome:** `E-book Completo de Saúde Emocional`
   - **Descrição:** Descrição do produto
   - **Preço:** `97.00`
   - **Tipo:** PDF
4. **Upload de Arquivo PDF:**
   - Clique em "Escolher arquivo"
   - Selecione o PDF do seu computador
   - Aguarde o upload (aparecerá "Arquivo carregado")
5. **Thumbnail (opcional):**
   - Faça upload de uma imagem (PNG, JPG)
   - Tamanho recomendado: 800x600px
6. **Status:** Ativo ✅
7. Clique em **"Salvar Produto"**

### Adicionar Produto do Tipo Vídeo (YouTube)

1. Acesse `/admin/produtos`
2. Clique em **"+ Novo Produto"**
3. Preencha os campos básicos
4. **Tipo:** Vídeo (YouTube)
5. **URL do Conteúdo:**
   - Cole o link completo do YouTube
   - Exemplo: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - OU: `https://youtu.be/dQw4w9WgXcQ`
6. Salvar

### Adicionar Produto do Tipo Mentoria/Sessão

1. Mesmo processo acima
2. **Tipo:** Sessão/Mentoria
3. **URL:** Link para agendamento (Calendly, Google Calendar, etc.)

---

## 3. Como Funciona para o Cliente

### Fluxo de Compra

1. Cliente faz o quiz no site
2. Compra um produto (ex: E-book Completo)
3. Stripe processa o pagamento
4. **Sistema cria conta automaticamente** com o email do pagamento
5. Cliente recebe acesso à área de membros

### Primeiro Acesso

1. Cliente vai em `/area-membros/primeiro-acesso?email=cliente@email.com`
2. Define uma senha (mínimo 8 caracteres)
3. Faz login automático

### Acessar Produtos

1. Cliente faz login em `/area-membros/login`
2. Vê dashboard com produtos comprados
3. Clica em "Acessar Conteúdo"
4. Visualiza o PDF/vídeo diretamente no navegador

---

## 4. Tipos de Visualização

### PDF
- **Visualizador embutido** com iframe
- **Botão de download** para salvar no computador
- Funciona em todos os navegadores modernos

### Vídeo (YouTube)
- **Player embutido** do YouTube
- Controles nativos do YouTube
- Suporta fullscreen, qualidade, legendas

### Links Externos
- Abre em nova aba
- Cliente tem acesso direto ao link

### Sessão/Mentoria
- Link para agendamento
- Instruções de como agendar

---

## 5. Vincular Produtos ao Stripe

### Produtos Existentes no Stripe

Já configurados no `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PRICE_RESULTADO=price_1Sjoyu2Fw969RPo5TwXEcyGN
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_COMPLETO=price_1SjozH2Fw969RPo5Ml3ZwtyB
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_SIMPLES=price_1SjozZ2Fw969RPo5XrhyR952
NEXT_PUBLIC_STRIPE_PRICE_MENTORIA=price_1Sjozo2Fw969RPo5jut2q6Yj
```

### Criar Produtos no Banco

No Supabase SQL Editor, execute:

```sql
-- Inserir produtos que correspondem aos Price IDs do Stripe
INSERT INTO products (slug, name, description, price, content_type, stripe_price_id, is_active)
VALUES
  ('resultado-anamnese', 'Resultado da Anamnese Completa', 'Acesso ao resultado completo da sua anamnese emocional', 27.00, 'pdf', 'price_1Sjoyu2Fw969RPo5TwXEcyGN', true),

  ('ebook-completo', 'E-book Completo de Saúde Emocional', 'Material completo sobre saúde emocional no relacionamento', 97.00, 'pdf', 'price_1SjozH2Fw969RPo5Ml3ZwtyB', true),

  ('ebook-simples', 'E-book Introdutório', 'Introdução à saúde emocional feminina', 47.00, 'pdf', 'price_1SjozZ2Fw969RPo5XrhyR952', true),

  ('mentoria', 'Mentoria Individual', 'Sessão individual de mentoria emocional', 297.00, 'session', 'price_1Sjozo2Fw969RPo5jut2q6Yj', true);
```

**Depois faça upload dos PDFs através do admin!**

---

## 6. Verificar se Está Funcionando

### Checklist Admin

- [ ] Bucket `content` criado no Supabase Storage
- [ ] Políticas de acesso configuradas
- [ ] Produtos cadastrados no banco
- [ ] Upload de PDF funcionando
- [ ] URLs corretas salvas

### Checklist Cliente

- [ ] Cliente consegue fazer compra
- [ ] Cliente recebe email de confirmação (se configurado)
- [ ] Cliente consegue criar senha
- [ ] Cliente vê produtos no dashboard
- [ ] Cliente consegue visualizar PDF
- [ ] Cliente consegue baixar PDF

---

## 7. Troubleshooting

### Erro: "Failed to upload file"
- Verifique se o bucket `content` existe
- Verifique as políticas de acesso
- Verifique o tamanho do arquivo (limite: 50MB)

### PDF não aparece para o cliente
- Verifique se `content_url` está preenchido no banco
- Verifique se o arquivo está público no Storage
- Verifique se o cliente realmente comprou (tabela `purchases`)

### Vídeo do YouTube não carrega
- Verifique se o link é válido
- Verifique se o vídeo não está privado
- Verifique se permite embed (configuração do YouTube)

---

## 8. Estrutura do Banco

### Tabela `products`
```sql
- id (uuid)
- slug (text) → usado na URL
- name (text) → nome exibido
- description (text)
- price (numeric)
- content_type (text) → pdf | video | link | session
- content_url (text) → URL do arquivo ou vídeo
- thumbnail_url (text)
- stripe_price_id (text) → ID do Price no Stripe
- is_active (boolean)
- created_at (timestamp)
```

### Tabela `purchases`
```sql
- id (uuid)
- user_email (text)
- product_id (uuid) → FK para products
- stripe_payment_id (text)
- amount_paid (numeric)
- payment_status (text)
- created_at (timestamp)
```

Quando o webhook do Stripe recebe um pagamento aprovado, ele cria um registro em `purchases` vinculando o email do cliente ao produto.

---

## 9. Próximos Passos

Após configurar tudo:

1. **Testar fluxo completo** de ponta a ponta
2. **Configurar webhook do Stripe** em produção
3. **Fazer upload dos PDFs reais**
4. **Testar com compra real** (modo teste do Stripe)
5. **Configurar emails** de boas-vindas (opcional)

---

## Suporte

- **Supabase Dashboard:** https://gaoajxkhbgilotyrtyfe.supabase.co
- **Admin:** /admin/login
- **Email Admin:** hdlprofissional@yahoo.com.br
- **Senha Admin:** 248367
