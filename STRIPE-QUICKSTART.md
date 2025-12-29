# ⚡ Stripe - Guia Rápido

## 🎯 O Que Você Precisa Fazer

### 1️⃣ Criar 4 Produtos no Stripe

Acesse: https://dashboard.stripe.com/products

| Produto | Nome | Preço |
|---------|------|-------|
| 1 | Resultado da Anamnese Emocional | R$ 7,00 |
| 2 | E-book Transformação nas 3 Esferas | R$ 97,00 |
| 3 | E-book Primeiros Passos | R$ 47,00 |
| 4 | Mentoria Individual Online - 2h | R$ 497,00 |

**COPIE OS PRICE IDs DE CADA UM!** (começam com `price_`)

---

### 2️⃣ Configurar Variáveis de Ambiente

Edite `.env.local` e adicione:

```bash
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (copie do dashboard: Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxx  # Obter no passo 3

# Price IDs (cole os IDs que você copiou)
NEXT_PUBLIC_STRIPE_PRICE_RESULTADO=price_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_COMPLETO=price_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_SIMPLES=price_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_MENTORIA=price_xxxxxxxxx
```

---

### 3️⃣ Configurar Webhook (Local)

1. Instale Stripe CLI:
   ```bash
   # Mac
   brew install stripe/stripe-cli/stripe

   # Windows: baixe em github.com/stripe/stripe-cli/releases
   ```

2. Faça login:
   ```bash
   stripe login
   ```

3. Inicie o listener (deixe rodando):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

4. **COPIE o webhook secret** (whsec_...) e cole no `.env.local`

---

### 4️⃣ Testar

1. Inicie o projeto:
   ```bash
   npm run dev
   ```

2. Acesse http://localhost:3000

3. Complete o quiz até o checkout

4. Use cartão de teste:
   - **Número:** `4242 4242 4242 4242`
   - **Data:** Qualquer data futura
   - **CVC:** `123`

5. Verifique se:
   - Pagamento foi aprovado
   - Webhook foi recebido (veja terminal do Stripe CLI)
   - Resultado desbloqueou

---

## 📦 Produtos e Fluxo

```
QUIZ → R$ 7 → Oferta 1 (R$ 97) → Oferta 3 (R$ 497)
                    ↓ recusa
              Oferta 2 (R$ 47) → WhatsApp
```

---

## 🚀 Deploy (Produção)

### No Stripe:
1. Desative "Test mode"
2. Crie os mesmos 4 produtos (novos Price IDs!)
3. Configure webhook:
   - URL: `https://seu-dominio.com.br/api/webhook/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`

### No Vercel:
1. Adicione as variáveis de ambiente (chaves **live**)
2. Faça deploy
3. Teste com pagamento real mínimo (R$ 0,50)

---

## ❓ Dúvidas?

Consulte o guia completo: **`STRIPE-SETUP.md`**

---

✅ **Pronto! Agora você tem pagamentos funcionando com Stripe.**
