# 🔍 Debug - Criação de Conta

## ✅ Logs Adicionados

Foram adicionados logs detalhados em **TODOS** os pontos da criação de conta.

---

## 🧪 Como Testar e Ver os Logs

### **Passo 1: Aguardar Build do Vercel**

Aguarde 1-2 minutos para o Vercel fazer o deploy.

---

### **Passo 2: Abrir Console do Navegador**

1. Abra o site: `https://marcioazevedo.vercel.app/area-membros/primeiro-acesso`
2. Pressione **F12** (ou clique com botão direito → Inspecionar)
3. Vá na aba **Console**

---

### **Passo 3: Testar Criação de Conta**

1. Digite um **email que tem purchase**
2. Clique fora do campo (onBlur)

**Você vai ver logs assim:**

```
🔵 Verificando email: seuemail@gmail.com
🔵 Resposta check_email_has_purchases: { data: true, error: null }
✅ Email tem compras!
```

ou

```
🔵 Verificando email: seuemail@gmail.com
🔵 Resposta check_email_has_purchases: { data: false, error: null }
❌ Email NÃO tem compras
```

3. Digite uma senha (8+ caracteres)
4. Confirme a senha
5. Clique em **"Criar Minha Conta"**

**Você vai ver logs assim:**

```
🔵 Iniciando criação de conta para: seuemail@gmail.com
🔵 Chamando função signUp...
🔵 [auth.ts] signUp chamado para: seuemail@gmail.com
🔵 [auth.ts] signUp resposta: { user: { id: "...", email: "..." }, session: "exists", error: null }
🔵 Resposta signUp: { user: {...}, error: null }
✅ Conta criada com sucesso! User ID: ...
🔵 Redirecionando para dashboard...
```

---

## 🔴 Se Der Erro

**Você vai ver logs assim:**

```
🔴 [auth.ts] signUp erro: { message: "...", code: "..." }
🔴 Erro ao criar conta: { message: "...", code: "..." }
```

**OU**

```
🔴 Erro inesperado ao criar conta: ...
```

---

## 📋 Checklist de Verificação

### **1. Executou o SQL da função RPC?**
```sql
-- Verificar se função existe
SELECT routine_name FROM information_schema.routines
WHERE routine_name = 'check_email_has_purchases';
```

Se retornar **vazio**, execute `FIX-RLS-PRIMEIRO-ACESSO.sql`

---

### **2. Email tem purchase?**
```sql
SELECT * FROM purchases WHERE user_email = 'seuemail@gmail.com';
```

Se retornar **vazio**, execute `SYNC-ALL-STRIPE-PAYMENTS.sql`

---

### **3. Trigger de vincular purchases existe?**
```sql
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Se retornar **vazio**, execute `supabase-area-membros.sql`

---

## 🎯 Erros Comuns e Soluções

### **Erro: "User already registered"**
- **Causa:** Email já tem conta criada
- **Solução:** Use a página de login ao invés de primeiro acesso
- **URL:** `/area-membros/login`

### **Erro: "check_email_has_purchases does not exist"**
- **Causa:** Função RPC não foi criada
- **Solução:** Execute `FIX-RLS-PRIMEIRO-ACESSO.sql`

### **Erro: "Email não possui compras"**
- **Causa:** Email não está na tabela purchases
- **Solução:** Execute `SYNC-ALL-STRIPE-PAYMENTS.sql`

### **Erro: Nenhum erro, mas não redireciona**
- **Causa:** Pode ser problema no trigger
- **Verificar:** Console do navegador deve ter logs
- **Solução:** Copie os logs e me envie

---

## 📸 O Que Copiar e Enviar

Se continuar com erro, me envie:

1. **TODOS os logs do console** (F12 → Console)
2. **Captura de tela** do erro (se aparecer)
3. **Email que você está testando**
4. **Resultado desta query:**

```sql
-- Ver se email tem purchase
SELECT
  user_email,
  payment_id,
  amount_paid,
  created_at
FROM purchases
WHERE user_email = 'SEU_EMAIL_AQUI@gmail.com';
```

---

## ⚡ Teste Rápido

Execute isso no Supabase e me diga o resultado:

```sql
-- Teste 1: Função existe?
SELECT check_email_has_purchases('teste@exemplo.com');

-- Teste 2: Email tem purchase?
SELECT user_email FROM purchases LIMIT 5;

-- Teste 3: Trigger existe?
SELECT trigger_name FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Me envie os resultados dessas 3 queries!** ✅
