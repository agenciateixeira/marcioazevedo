# ⚡ Configurar Webhook - 5 Minutos

## 🎯 Isso É Tudo Que Falta!

Compras antigas = ✅ Migradas
Compras novas = ❌ Webhook não configurado

---

## 📍 PASSO 1: Criar Webhook no Stripe

1. Entre em: https://dashboard.stripe.com/test/webhooks
2. Clique em **"Add endpoint"**

**Cole esta URL:**
```
https://marcioazevedo.vercel.app/api/webhook/stripe
```

**Selecione estes 2 eventos:**
- ✅ `payment_intent.succeeded`
- ✅ `checkout.session.completed`

3. Clique em **"Add endpoint"**

---

## 📍 PASSO 2: Copiar Signing Secret

Após criar o webhook:

1. Na página do webhook, procure **"Signing secret"**
2. Clique em **"Reveal"** ou **"Click to reveal"**
3. Copie o valor (começa com `whsec_...`)

Exemplo: `whsec_Whe1234567890abcdefg...`

---

## 📍 PASSO 3: Configurar no Vercel

1. Entre em: https://vercel.com/
2. Abra o projeto **marcioazevedo**
3. Settings → **Environment Variables**

**Adicionar nova variável:**
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (cole o valor copiado)
- **Environments:** ✅ Production ✅ Preview ✅ Development

4. Clique em **Save**

---

## 📍 PASSO 4: Redeploy

No Vercel:

1. Vá em **Deployments**
2. Clique no deployment mais recente
3. Clique nos 3 pontinhos **⋮**
4. Clique em **"Redeploy"**
5. Aguarde completar

---

## ✅ TESTAR

Fazer compra de teste:

1. Acesse: https://marcioazevedo.vercel.app/checkout
2. Use:
   - **Email:** teste@webhook.com
   - **Cartão:** 4242 4242 4242 4242
   - **Data:** 12/30
   - **CVC:** 123
3. Pague

**Verificar no Supabase:**

```sql
SELECT * FROM purchases
WHERE user_email = 'teste@webhook.com';
```

**Deve aparecer a compra!** ✅

---

## 🔍 Ver Logs (Se Não Funcionar)

**No Stripe:**
- Dashboard → Developers → Webhooks
- Seu webhook → Tab "Events"
- Ver se eventos estão chegando

**No Vercel:**
- Runtime Logs
- Filtrar: `/api/webhook/stripe`
- Ver erros em vermelho

---

## ⚠️ IMPORTANTE

**Ambiente de Teste vs Produção:**

Você tem 2 webhooks diferentes:

1. **Test (desenvolvimento):**
   - URL: `https://marcioazevedo.vercel.app/api/webhook/stripe`
   - Secret: `whsec_test_...`
   - Usado com chaves: `pk_test_...` e `sk_test_...`

2. **Production (quando for ao vivo):**
   - Mesma URL
   - Secret diferente: `whsec_live_...`
   - Usado com chaves: `pk_live_...` e `sk_live_...`

Por enquanto, configure apenas o **Test**!

---

**É só isso! Depois de configurar, toda compra nova vai criar purchase automaticamente.** 🚀
