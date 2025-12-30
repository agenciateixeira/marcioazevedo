# Passo a Passo: Configurar e Usar Sistema de Produtos

## PROBLEMA: "Subi um PDF e não apareceu na área de membros"

### Causas Possíveis:
1. ❌ Bucket do Supabase não está criado
2. ❌ Produto não foi salvo após upload
3. ❌ Cliente não tem purchase do produto
4. ❌ content_url está NULL no banco

---

## SOLUÇÃO COMPLETA (Siga EXATAMENTE esta ordem)

### PASSO 1: Criar Bucket no Supabase Storage

1. Acesse: https://gaoajxkhbgilotyrtyfe.supabase.co
2. Login com suas credenciais do Supabase
3. Menu lateral → **Storage**
4. Clique em **"Create a new bucket"**
5. Preencha:
   - **Name:** `content` (exatamente assim, minúsculo)
   - **Public bucket:** ✅ MARCAR (importante!)
   - **File size limit:** 50 MB
6. Clique em **"Create bucket"**

![Verificação] O bucket "content" aparece na lista de buckets

---

### PASSO 2: Configurar Políticas de Acesso (RLS)

1. Ainda no **Storage**, clique no bucket **"content"**
2. Vá na aba **"Policies"**
3. Clique em **"New Policy"**
4. Selecione **"For full customization"**
5. Cole este SQL:

```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content');
```

6. Salve a policy
7. Crie outra policy para upload:

```sql
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content');
```

8. Salve a policy

![Verificação] Você deve ter 2 policies criadas

---

### PASSO 3: Criar Produtos no Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Clique em **"New Query"**
3. Cole e execute:

```sql
-- Verificar se já tem produtos
SELECT * FROM products;

-- Se não tiver produtos, inserir produtos de exemplo
INSERT INTO products (slug, name, description, price, content_type, is_active)
VALUES
  (
    'ebook-completo',
    'E-book Completo de Saúde Emocional',
    'Material completo sobre saúde emocional no relacionamento',
    97.00,
    'pdf',
    true
  ),
  (
    'ebook-simples',
    'E-book Introdutório',
    'Introdução à saúde emocional feminina',
    47.00,
    'pdf',
    true
  )
ON CONFLICT (slug) DO NOTHING;
```

4. Execute a query (botão "Run" ou Ctrl+Enter)

![Verificação] Deve retornar "Success. No rows returned"

---

### PASSO 4: Fazer Upload do PDF no Admin

1. Acesse: `http://localhost:3000/admin/login` (ou URL de produção)
2. Login:
   - Email: `hdlprofissional@yahoo.com.br`
   - Senha: `248367`
3. Vá em **"Produtos"** (menu lateral)
4. Clique em **"+ Novo Produto"** OU clique em **"Editar"** em um produto existente
5. Preencha os campos (se criando novo):
   - **Slug:** `ebook-teste` (sem espaços)
   - **Nome:** Nome que aparecerá para o cliente
   - **Descrição:** Descrição do produto
   - **Preço:** 97.00
   - **Tipo:** PDF
6. **Upload de Arquivo PDF:**
   - Clique em "Escolher arquivo"
   - Selecione um PDF do seu computador
   - ⏳ Aguarde aparecer "✅ Arquivo enviado com sucesso!"
7. **IMPORTANTE:** Clique em **"Salvar Produto"** (botão azul no final do formulário)
8. ✅ Deve aparecer "Produto criado/atualizado com sucesso!"

![Verificação] O produto aparece na lista com status "Ativo"

---

### PASSO 5: Verificar se Upload Funcionou

1. No Supabase, vá em **Storage** → bucket **"content"**
2. Veja se tem uma pasta **"products"**
3. Dentro de "products" deve ter seu PDF

![Verificação] Arquivo PDF está lá com tamanho correto

---

### PASSO 6: Verificar no Banco se a URL Salvou

1. No Supabase, vá em **SQL Editor**
2. Execute:

```sql
SELECT
  slug,
  name,
  content_type,
  content_url,
  is_active
FROM products
WHERE content_type = 'pdf';
```

3. Verifique se `content_url` está preenchido
   - ✅ Correto: `https://gaoajxkhbgilotyrtyfe.supabase.co/storage/v1/object/public/content/products/...pdf`
   - ❌ Errado: `NULL` ou vazio

![Verificação] Todos os produtos têm content_url preenchido

---

### PASSO 7: Criar Purchase de Teste (Para Testar)

Se você quiser testar SEM fazer compra real, crie uma purchase manualmente:

1. No Supabase, vá em **SQL Editor**
2. Execute (substitua `seu-email@gmail.com` pelo seu email):

```sql
INSERT INTO purchases (user_email, product_id, amount_paid, payment_status)
VALUES (
  'seu-email@gmail.com',
  (SELECT id FROM products WHERE slug = 'ebook-completo' LIMIT 1),
  97.00,
  'succeeded'
);
```

3. Verifique se criou:

```sql
SELECT
  p.user_email,
  pr.name as product_name,
  p.created_at
FROM purchases p
JOIN products pr ON p.product_id = pr.id
WHERE p.user_email = 'seu-email@gmail.com';
```

![Verificação] Retorna sua compra

---

### PASSO 8: Criar Conta e Acessar Área de Membros

1. Vá em: `/area-membros/primeiro-acesso?email=seu-email@gmail.com`
2. Defina uma senha (mínimo 8 caracteres)
3. Clique em "Criar Conta"
4. Você será redirecionado para o dashboard
5. ✅ Deve aparecer o produto que você comprou
6. Clique em **"Acessar Conteúdo"**
7. 🎉 O PDF deve aparecer!

---

## CHECKLIST FINAL

Marque cada item conforme completar:

- [ ] 1. Bucket "content" criado no Supabase Storage
- [ ] 2. Bucket está marcado como PÚBLICO
- [ ] 3. Policies de acesso criadas (read e upload)
- [ ] 4. Produtos criados no banco de dados
- [ ] 5. Upload de PDF feito no admin
- [ ] 6. Mensagem de sucesso apareceu no upload
- [ ] 7. Botão "Salvar Produto" foi clicado
- [ ] 8. Arquivo aparece no Storage do Supabase
- [ ] 9. content_url está preenchido no banco
- [ ] 10. Purchase criada (manual ou via Stripe)
- [ ] 11. Conta criada na área de membros
- [ ] 12. Produto aparece no dashboard
- [ ] 13. PDF abre corretamente

---

## TROUBLESHOOTING

### Erro: "Bucket 'content' not found"
**Solução:** Você não criou o bucket. Volte ao PASSO 1.

### Erro: "Unauthorized" ao fazer upload
**Solução:** Policies não estão configuradas. Volte ao PASSO 2.

### Upload funciona mas content_url fica NULL
**Solução:** Você não clicou em "Salvar Produto". O upload apenas prepara o arquivo, o SAVE é que salva no banco.

### Produto não aparece na área de membros
**Possíveis causas:**
1. Cliente não tem purchase desse produto (execute query do PASSO 7)
2. content_url está NULL (execute query do PASSO 6)
3. Produto está inativo (verifique coluna `is_active`)

### PDF não carrega no navegador
**Soluções:**
1. Clique em "Abrir em Nova Aba" - alguns navegadores bloqueiam PDF em iframe
2. Clique em "Baixar PDF" - sempre funciona
3. Verifique se o arquivo é realmente um PDF válido

---

## PRÓXIMOS PASSOS

Depois de testar e confirmar que funciona:

1. Configurar webhook do Stripe para compras reais
2. Fazer upload dos PDFs verdadeiros
3. Testar compra real no modo teste do Stripe
4. Ativar modo produção do Stripe

---

## SUPORTE

Se ainda tiver problemas:

1. Abra o Console do navegador (F12)
2. Vá na aba "Console"
3. Procure por erros em vermelho
4. Tire print e envie para análise

**Dica:** Os logs de upload aparecem com emojis:
- 📤 = iniciando upload
- 📁 = caminho do arquivo
- ✅ = sucesso
- ❌ = erro
