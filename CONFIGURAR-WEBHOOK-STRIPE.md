# 🔧 Configurar Webhook do Stripe - Guia Completo

## ❌ Problema Atual
Compras novas não estão criando registros na tabela `purchases` automaticamente.

## ✅ Solução

### **Passo 1: Testar a Função do Banco**

No Supabase SQL Editor, execute:

```sql
-- Cole TODO o conteúdo de: TEST-WEBHOOK-FUNCTION.sql
```

**Resultado esperado:**
- ✅ Função existe
- ✅ Teste manual funciona
- ✅ Purchase é criada
- ✅ Progresso é criado

**Se der erro:** Execute novamente `supabase-area-membros.sql`

---

### **Passo 2: Configurar Webhook no Stripe**

#### No Stripe Dashboard:

1. Acesse: **Developers** → **Webhooks**
2. Clique em **"Add endpoint"** (ou "Create endpoint")

#### Configurações do Endpoint:

**Endpoint URL:**
```
https://marcioazevedo.vercel.app/api/webhook/stripe
```

**Events to send:** (Selecionar estes 2 eventos)
- ✅ `payment_intent.succeeded`
- ✅ `checkout.session.completed`

**Version:** Latest API version

3. Clique em **"Add endpoint"** para salvar

#### Copiar o Signing Secret:

4. Após criar, você verá a página do webhook
5. Na seção **"Signing secret"**, clique em **"Reveal"**
6. Copie o valor (começa com `whsec_...`)

---

### **Passo 3: Configurar no Vercel**

#### No Vercel Dashboard:

1. Acesse seu projeto: **marcioazevedo**
2. Vá em **Settings** → **Environment Variables**
3. Procure por `STRIPE_WEBHOOK_SECRET`

**Se NÃO EXISTE:**
- Clique em **"Add New"**
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (cole o valor copiado do Stripe)
- **Environments:** Production, Preview, Development (todos)
- Clique em **"Save"**

**Se JÁ EXISTE:**
- Clique no ícone de lápis (Edit)
- Substitua pelo novo valor `whsec_...`
- Clique em **"Save"**

4. Após salvar, clique em **"Redeploy"** no Vercel
   - Deployments → Latest → ⋮ (três pontos) → Redeploy

---

### **Passo 4: Testar Compra Real**

#### Fazer uma compra de teste:

1. Acesse: `https://marcioazevedo.vercel.app/checkout`
2. Use o cartão de teste do Stripe:
   - **Número:** `4242 4242 4242 4242`
   - **Data:** Qualquer data futura (ex: 12/30)
   - **CVC:** Qualquer 3 dígitos (ex: 123)
   - **Email:** Use um email de teste (ex: `teste123@teste.com`)
3. Complete o pagamento

#### Verificar se funcionou:

No Supabase SQL Editor, execute:

```sql
-- Ver as purchases mais recentes
SELECT
  user_email,
  payment_id,
  amount_paid,
  created_at,
  prod.name as produto
FROM purchases p
LEFT JOIN products prod ON p.product_id = prod.id
ORDER BY created_at DESC
LIMIT 5;
```

**Deve mostrar a compra de teste que você acabou de fazer!**

---

## 🔍 Troubleshooting

### **1. Purchase não foi criada após compra de teste**

#### Verificar logs do Vercel:
1. Vercel Dashboard → **Logs** (ou **Runtime Logs**)
2. Filtrar por `/api/webhook/stripe`
3. Procurar por erros em vermelho

**Erros comuns:**

❌ **"Invalid signature"**
- Solução: STRIPE_WEBHOOK_SECRET está errado
- Reconfigure com o valor correto do Stripe

❌ **"create_purchase_from_payment does not exist"**
- Solução: Função não foi criada no banco
- Execute `supabase-area-membros.sql` novamente

❌ **"No customer email found"**
- Solução: Email não está sendo enviado no metadata
- Isso é bug do código, me avise!

---

### **2. Verificar eventos no Stripe**

1. Stripe Dashboard → **Developers** → **Webhooks**
2. Clique no seu webhook
3. Vá na aba **"Recent deliveries"** ou **"Events"**

**Ver detalhes:**
- Verde = Sucesso (200 OK)
- Vermelho = Erro

Clique em um evento para ver:
- Request body (dados enviados)
- Response (resposta do webhook)
- Error messages (se houver)

---

### **3. Verificar se o webhook está recebendo eventos**

Execute uma compra de teste e veja se aparece nos **Recent deliveries** do Stripe.

**Se NÃO aparecer:**
- URL do webhook está errada
- Reconfigure com: `https://marcioazevedo.vercel.app/api/webhook/stripe`

**Se aparecer mas der erro 500:**
- Veja os logs do Vercel
- Veja a mensagem de erro no Stripe

---

## 📋 Checklist de Configuração

- [ ] Executei `supabase-area-membros.sql` no Supabase
- [ ] Testei a função com `TEST-WEBHOOK-FUNCTION.sql` ✅
- [ ] Criei webhook no Stripe com URL correta
- [ ] Selecionei eventos: `payment_intent.succeeded` e `checkout.session.completed`
- [ ] Copiei o Signing Secret (whsec_...)
- [ ] Configurei `STRIPE_WEBHOOK_SECRET` no Vercel
- [ ] Fiz redeploy no Vercel após configurar
- [ ] Fiz compra de teste com cartão 4242...
- [ ] Verifiquei que purchase foi criada no Supabase ✅

---

## 🎯 Resultado Final Esperado

**Quando alguém comprar:**

1. Stripe processa pagamento ✅
2. Stripe envia evento para webhook ✅
3. Webhook cria purchase no banco ✅
4. Cliente pode acessar `/area-membros/primeiro-acesso` ✅
5. Sistema reconhece que tem compra ✅
6. Cliente cria senha e entra ✅

---

## 🆘 Ainda Não Funciona?

Execute isso e me envie o resultado:

```sql
-- 1. Verificar se função existe
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'create_purchase_from_payment';

-- 2. Verificar produtos
SELECT slug, name, id FROM products;

-- 3. Testar função manualmente
SELECT create_purchase_from_payment(
  'debug@test.com',
  'resultado',
  'debug_001',
  7.00
);

-- 4. Ver se criou
SELECT * FROM purchases WHERE user_email = 'debug@test.com';
```

Me envie o erro completo e os logs do Vercel!
