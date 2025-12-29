# 🔵 Guia Completo de Configuração do Stripe

## 📋 Índice
1. [Criar Conta no Stripe](#1-criar-conta-no-stripe)
2. [Obter Chaves da API](#2-obter-chaves-da-api)
3. [Criar Produtos e Preços](#3-criar-produtos-e-preços)
4. [Configurar Variáveis de Ambiente](#4-configurar-variáveis-de-ambiente)
5. [Configurar Webhook](#5-configurar-webhook)
6. [Testar Integração](#6-testar-integração)
7. [Ativar Modo Produção](#7-ativar-modo-produção)

---

## 1. Criar Conta no Stripe

1. Acesse https://dashboard.stripe.com/register
2. Crie sua conta com email e senha
3. Complete o processo de onboarding
4. Ative sua conta fornecendo os dados da empresa/pessoa física

**IMPORTANTE:** Você começará em modo de teste. Poderá testar tudo sem cobranças reais.

---

## 2. Obter Chaves da API

1. No dashboard do Stripe, vá em **Developers → API keys**
2. Você verá 4 chaves:

### Modo de Teste (para desenvolvimento):
- **Publishable key (pk_test_...)** - Chave pública
- **Secret key (sk_test_...)** - Chave secreta

### Modo Live (para produção):
- **Publishable key (pk_live_...)** - Chave pública
- **Secret key (sk_live_...)** - Chave secreta

3. Copie as chaves de **teste** primeiro para testar

---

## 3. Criar Produtos e Preços

Você precisa criar 4 produtos no Stripe:

### 3.1. Produto 1: Resultado do Teste (R$ 7,00)

1. No dashboard, vá em **Product catalog → Add product**
2. Preencha:
   - **Name:** `Resultado da Anamnese Emocional`
   - **Description:** `Acesso completo ao resultado do teste com análise preditiva personalizada`
   - **Pricing:**
     - **Type:** One-time
     - **Price:** `7.00` BRL
     - **Billing period:** One time
3. Clique em **Save product**
4. **COPIE O PRICE ID** (começa com `price_...`)

### 3.2. Produto 2: E-book Completo (R$ 97,00)

1. **Add product** novamente
2. Preencha:
   - **Name:** `E-book Transformação nas 3 Esferas`
   - **Description:** `Guia completo de 147 páginas para romper padrões emocionais`
   - **Pricing:**
     - **Type:** One-time
     - **Price:** `97.00` BRL
     - **Billing period:** One time
3. **COPIE O PRICE ID**

### 3.3. Produto 3: E-book Simplificado (R$ 47,00)

1. **Add product**
2. Preencha:
   - **Name:** `E-book Primeiros Passos para Transformação`
   - **Description:** `Versão essencial com 30 páginas dos exercícios mais importantes`
   - **Pricing:**
     - **Type:** One-time
     - **Price:** `47.00` BRL
3. **COPIE O PRICE ID**

### 3.4. Produto 4: Mentoria Individual (R$ 497,00)

1. **Add product**
2. Preencha:
   - **Name:** `Mentoria Individual Online - 2 Horas`
   - **Description:** `Sessão particular para trabalhar seu caso específico com acompanhamento de 30 dias`
   - **Pricing:**
     - **Type:** One-time
     - **Price:** `497.00` BRL
3. **COPIE O PRICE ID**

---

## 4. Configurar Variáveis de Ambiente

Edite o arquivo `.env.local` na raiz do projeto e adicione:

```bash
# Supabase (já configurado)
NEXT_PUBLIC_SUPABASE_URL=https://gaoajxkhbgilotyrtyfe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key_atual
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Para teste local
# NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app  # Para produção

# Stripe - MODO DE TESTE (pk_test e sk_test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxx  # Vamos obter no passo 5

# Stripe Price IDs (cole aqui os IDs que você copiou)
NEXT_PUBLIC_STRIPE_PRICE_RESULTADO=price_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_COMPLETO=price_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_SIMPLES=price_xxxxxxxxx
NEXT_PUBLIC_STRIPE_PRICE_MENTORIA=price_xxxxxxxxx
```

---

## 5. Configurar Webhook

O webhook permite que o Stripe notifique seu sistema quando um pagamento é aprovado.

### Desenvolvimento Local (usando Stripe CLI):

1. Instale o Stripe CLI:
   - **Mac:** `brew install stripe/stripe-cli/stripe`
   - **Windows:** Baixe em https://github.com/stripe/stripe-cli/releases

2. Faça login:
   ```bash
   stripe login
   ```

3. Inicie o listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

4. O CLI vai exibir o **webhook signing secret** (whsec_...). **COPIE e cole no .env.local**

5. Mantenha o CLI rodando em um terminal separado enquanto testa

### Produção (após deploy):

1. No dashboard do Stripe, vá em **Developers → Webhooks**
2. Clique em **Add endpoint**
3. Preencha:
   - **Endpoint URL:** `https://seu-dominio.com.br/api/webhook/stripe`
   - **Events to send:**
     - `checkout.session.completed`
     - `payment_intent.payment_failed`
4. Clique em **Add endpoint**
5. **COPIE O SIGNING SECRET** e adicione no Vercel:
   - Vá no Vercel → Settings → Environment Variables
   - Adicione `STRIPE_WEBHOOK_SECRET` com o valor

---

## 6. Testar Integração

### 6.1. Testar Localmente

1. Inicie o projeto:
   ```bash
   npm run dev
   ```

2. Em outro terminal, inicie o Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook/stripe
   ```

3. Acesse http://localhost:3000

4. Complete o quiz até chegar ao checkout

5. Use **cartões de teste do Stripe:**
   - **Sucesso:** `4242 4242 4242 4242`
   - **Falha:** `4000 0000 0000 0002`
   - **CVC:** Qualquer 3 dígitos
   - **Data:** Qualquer data futura
   - **Nome:** Qualquer nome

6. Após o pagamento, verifique:
   - Console do Stripe CLI (deve mostrar webhook recebido)
   - Supabase (tabela `responses` deve ter `payment_status: approved`)
   - Resultado deve desbloquear

### 6.2. Testar Fluxo Completo

1. **Resultado (R$ 7):**
   - Complete o quiz → Checkout → Pague → Deve ir para Oferta 1

2. **Upsell 1 (R$ 97):**
   - Aceitar → Pague → Deve ir para Oferta 3

3. **Upsell 3 (R$ 497):**
   - Aceitar → Pague → Deve ir para Thank You Page

4. **Downsell (R$ 47):**
   - Na Oferta 1, clique em "Não quero" → Oferta 2 → Pague

---

## 7. Ativar Modo Produção

Quando estiver pronto para receber pagamentos reais:

### 7.1. Ativar Conta no Stripe

1. No dashboard, complete o processo de ativação:
   - Dados bancários para receber os pagamentos
   - Documentos da empresa/pessoa física
   - Informações fiscais

2. Após aprovação, você terá acesso às chaves **live**

### 7.2. Criar Produtos no Modo Live

1. No canto superior esquerdo, **desative "Test mode"**
2. Repita o passo 3 (criar os 4 produtos) no modo LIVE
3. **COPIE OS NOVOS PRICE IDs** (agora começam com `price_live_...`)

### 7.3. Atualizar Variáveis no Vercel

1. Vá no Vercel → Settings → Environment Variables
2. **Substitua** as chaves de teste pelas de produção:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

NEXT_PUBLIC_STRIPE_PRICE_RESULTADO=price_live_...
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_COMPLETO=price_live_...
NEXT_PUBLIC_STRIPE_PRICE_EBOOK_SIMPLES=price_live_...
NEXT_PUBLIC_STRIPE_PRICE_MENTORIA=price_live_...
```

3. **Faça um redeploy** no Vercel para aplicar as novas variáveis

### 7.4. Configurar Webhook de Produção

1. No Stripe (modo LIVE), vá em **Developers → Webhooks**
2. **Add endpoint**
3. URL: `https://seu-dominio.com.br/api/webhook/stripe`
4. Events: `checkout.session.completed`, `payment_intent.payment_failed`
5. **COPIE O SIGNING SECRET** e adicione no Vercel como `STRIPE_WEBHOOK_SECRET`

---

## ✅ Checklist Final

Antes de ir para produção, verifique:

- [ ] Conta Stripe ativada e aprovada
- [ ] 4 produtos criados no modo LIVE
- [ ] Chaves LIVE adicionadas no Vercel
- [ ] 4 Price IDs LIVE atualizados no Vercel
- [ ] Webhook configurado e testado
- [ ] Testou um pagamento REAL de R$ 0,50 (teste mínimo)
- [ ] Verificou que o webhook foi recebido
- [ ] Verificou que o banco de dados foi atualizado
- [ ] Resultado desbloqueou corretamente

---

## 🚨 Problemas Comuns

### Erro: "No signature found"
- Verifique se o `STRIPE_WEBHOOK_SECRET` está correto
- Certifique-se de que o webhook está configurado no dashboard

### Erro: "Invalid signature"
- O secret do webhook está desatualizado
- Recrie o webhook e atualize o secret

### Pagamento não desbloqueia resultado
- Verifique os logs do webhook: Vercel → Deployment → Functions
- Confirme se o email no Stripe é o mesmo do banco
- Verifique se a tabela `responses` tem RLS correto

### Redirecionamento após pagamento não funciona
- Verifique se `NEXT_PUBLIC_APP_URL` está correto
- Certifique-se de usar HTTPS em produção

---

## 📞 Suporte

- **Documentação Stripe:** https://stripe.com/docs
- **Dashboard Stripe:** https://dashboard.stripe.com
- **Testes de Cartão:** https://stripe.com/docs/testing

---

**Status:** ✅ Stripe configurado e pronto para uso!
