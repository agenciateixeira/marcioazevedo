# Área de Membros - Documentação Completa

## 📋 Visão Geral

A Área de Membros é um sistema completo de gerenciamento de conteúdo similar a plataformas como Kiwify e Hotmart. Permite que clientes que compraram produtos através do Stripe tenham acesso a:

- PDFs (E-books)
- Vídeos do YouTube
- Audiobooks
- Sessões de mentoria

## 🏗️ Arquitetura

### Estrutura de Páginas

```
app/area-membros/
├── login/page.tsx              # Login com email e senha
├── primeiro-acesso/page.tsx    # Definir senha (primeiro acesso)
├── dashboard/page.tsx          # Dashboard principal com produtos
├── perfil/page.tsx            # Gerenciar perfil e senha
└── produto/[slug]/page.tsx    # Visualizar conteúdo do produto
```

### Utilitários

```
lib/
└── auth.ts                    # Funções de autenticação e gerenciamento
```

### Database Schema

```
supabase-area-membros.sql      # Schema completo do banco de dados
```

## 🔄 Fluxo Completo do Usuário

### 1. Compra do Produto

```
Usuário → Checkout → Stripe Payment → Webhook → Cria Purchase no DB
```

- Cliente preenche email e nome no quiz
- Faz pagamento via Stripe (R$ 7, R$ 47, R$ 97 ou R$ 497)
- Webhook do Stripe cria registro na tabela `purchases`
- Purchase é vinculado ao email do cliente

### 2. Primeiro Acesso

```
/area-membros/primeiro-acesso
```

**Fluxo:**
1. Cliente acessa a página de primeiro acesso
2. Digita o email usado na compra
3. Sistema verifica se o email tem compras aprovadas
4. Cliente define senha (mínimo 8 caracteres)
5. Conta é criada no Supabase Auth
6. Trigger do banco vincula automaticamente as purchases ao `user_id`
7. Redirecionado para o dashboard

**Validações:**
- Email deve ter compras na tabela `purchases`
- Senha mínima de 8 caracteres
- Confirmação de senha deve coincidir

### 3. Login

```
/area-membros/login
```

**Fluxo:**
1. Cliente digita email e senha
2. Sistema autentica via Supabase Auth
3. Redirecionado para o dashboard

**Recursos:**
- Se já estiver logado, redireciona automaticamente para dashboard
- Link para página de primeiro acesso
- Link para voltar ao site principal

### 4. Dashboard

```
/area-membros/dashboard
```

**Exibe:**
- Lista de todos os produtos comprados
- Thumbnail de cada produto
- Tipo de conteúdo (PDF, Vídeo, Mentoria)
- Barra de progresso individual
- Botão de acesso ao conteúdo
- Estatísticas gerais:
  - Total de produtos
  - Progresso geral
  - Horas assistidas
  - Último acesso

**Funcionalidades:**
- Navegação para perfil
- Logout
- Acesso direto aos produtos

### 5. Visualização de Produto

```
/area-membros/produto/[slug]
```

**Renderização por tipo:**

#### PDF (E-books)
- Visualizador embutido de PDF (iframe)
- Botão de download
- Progresso de leitura

#### Vídeos (YouTube)
- Player embutido do YouTube
- Suporta URLs do tipo `youtube.com/watch?v=` e `youtu.be/`
- Conversão automática para embed

#### Mentoria/Audiobooks
- Player de vídeo/áudio do YouTube
- Ou link direto para conteúdo externo

**Recursos:**
- Botões para marcar progresso (50%, 100%)
- Voltar ao dashboard
- Barra de progresso no header
- Atualização automática do progresso no banco

### 6. Perfil

```
/area-membros/perfil
```

**Informações:**
- Email (não editável)
- Nome completo
- Telefone
- Total investido
- Produtos adquiridos
- Membro desde

**Funcionalidades:**
- Atualizar nome e telefone
- Alterar senha
- Estatísticas da conta

## 🗄️ Estrutura do Banco de Dados

### Tabela `products`

Armazena todos os produtos disponíveis.

```sql
id              UUID
created_at      TIMESTAMP
slug            TEXT UNIQUE          # 'resultado', 'ebook_completo', etc.
name            TEXT
description     TEXT
price           DECIMAL(10,2)
content_type    TEXT                 # 'pdf', 'video', 'link', 'session'
content_url     TEXT                 # URL do arquivo ou vídeo
thumbnail_url   TEXT
metadata        JSONB
is_active       BOOLEAN
```

**Produtos Padrão:**
- `resultado` (R$ 7.00) - Resultado da Anamnese
- `ebook_completo` (R$ 97.00) - E-book Transformação nas 3 Esferas
- `ebook_simples` (R$ 47.00) - E-book Primeiros Passos
- `mentoria` (R$ 497.00) - Mentoria Individual 2h

### Tabela `purchases`

Relaciona usuários com produtos comprados.

```sql
id                  UUID
created_at          TIMESTAMP
user_email          TEXT                    # Email do usuário
user_id             UUID                    # FK para auth.users (vinculado após signup)
product_id          UUID                    # FK para products
payment_id          TEXT                    # ID do pagamento no Stripe
payment_status      TEXT                    # 'approved', 'refunded', 'cancelled'
amount_paid         DECIMAL(10,2)
access_granted_at   TIMESTAMP
access_expires_at   TIMESTAMP               # NULL = vitalício
metadata            JSONB
```

**Fluxo:**
1. Webhook cria purchase com `user_email` (sem `user_id`)
2. Cliente cria conta com mesmo email
3. Trigger `link_purchases_to_user()` vincula automaticamente o `user_id`

### Tabela `user_progress`

Tracking de progresso em cada produto.

```sql
id                   UUID
created_at           TIMESTAMP
updated_at           TIMESTAMP
user_email           TEXT
user_id              UUID
product_id           UUID
progress_percentage  INTEGER (0-100)
completed            BOOLEAN
completed_at         TIMESTAMP
sections_completed   JSONB
last_accessed_at     TIMESTAMP
```

**Unique constraint:** `(user_email, product_id)`

### Tabela `user_metadata`

Dados extras do usuário além do auth.users.

```sql
id                      UUID (FK auth.users)
created_at              TIMESTAMP
updated_at              TIMESTAMP
full_name               TEXT
phone                   TEXT
preferences             JSONB
onboarding_completed    BOOLEAN
first_login_at          TIMESTAMP
last_login_at           TIMESTAMP
```

## 🔒 Row Level Security (RLS)

Todas as tabelas têm RLS habilitado:

### Products
- **SELECT**: Todos podem ver produtos ativos

### Purchases
- **SELECT**: Usuário só vê suas próprias compras
  - `auth.uid() = user_id OR auth.email() = user_email`

### User Progress
- **SELECT/UPDATE/INSERT**: Usuário só vê/atualiza seu próprio progresso
  - `auth.uid() = user_id OR auth.email() = user_email`

### User Metadata
- **SELECT/UPDATE/INSERT**: Usuário só vê/atualiza seus próprios dados
  - `auth.uid() = id`

## ⚙️ Funções do Banco

### `link_purchases_to_user()`

**Trigger:** Executado automaticamente quando novo usuário é criado no `auth.users`

**Função:**
1. Busca todas as purchases com o email do novo usuário
2. Vincula o `user_id` às purchases
3. Vincula o `user_id` ao progresso

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_purchases_to_user();
```

### `create_purchase_from_payment()`

**Chamada:** Webhook do Stripe após pagamento aprovado

**Parâmetros:**
- `p_email` - Email do cliente
- `p_product_type` - Slug do produto (resultado, ebook_completo, etc)
- `p_payment_id` - ID do pagamento no Stripe
- `p_amount` - Valor pago

**Retorna:** UUID do purchase criado

**Função:**
1. Busca ID do produto pelo slug
2. Cria registro na tabela `purchases`
3. Cria progresso inicial (0%) na tabela `user_progress`

## 🔐 Autenticação

### Funções Disponíveis (`lib/auth.ts`)

#### `signUp(email, password, fullName?)`
Cria nova conta no Supabase Auth

#### `signIn(email, password)`
Login com email e senha

#### `signOut()`
Logout do usuário

#### `getCurrentUser()`
Retorna usuário atualmente logado

#### `userHasAccess(email, productSlug)`
Verifica se usuário tem acesso a um produto específico

#### `getUserPurchases(email)`
Lista todos os produtos comprados pelo usuário

#### `getUserProgress(email, productId)`
Retorna progresso do usuário em um produto

#### `updateUserProgress(email, productId, percentage, completed)`
Atualiza progresso do usuário

## 🎨 Design e UX

### Tema de Cores
- **Primary:** Pink gradient (from-pink-500 to-pink-600)
- **Secondary:** Purple gradient (from-purple-500 to-purple-600)
- **Success:** Green (from-green-500 to-green-600)
- **Background:** Gradient (from-pink-50 via-white to-purple-50)

### Responsividade
Todas as páginas são 100% responsivas:
- Mobile first
- Breakpoints: `sm:`, `md:`, `lg:`
- Grid adaptativo
- Navegação otimizada para mobile

### Animações
- Framer Motion para transições suaves
- Fade in ao carregar páginas
- Stagger nas listas de produtos
- Hover effects nos botões

## 📦 Como Configurar

### 1. Executar SQL no Supabase

Execute o arquivo `supabase-area-membros.sql` no SQL Editor do Supabase:

```sql
-- Isso criará:
-- ✅ Todas as tabelas
-- ✅ Produtos padrão
-- ✅ RLS policies
-- ✅ Triggers
-- ✅ Funções
```

### 2. Configurar Variáveis de Ambiente

Já configuradas no `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Atualizar URLs dos Produtos

No Supabase, atualize os produtos com os URLs reais:

```sql
-- Exemplo: Adicionar URL de um PDF
UPDATE products
SET content_url = 'https://seu-bucket.supabase.co/storage/v1/object/public/ebooks/transformacao.pdf',
    thumbnail_url = 'https://seu-bucket.supabase.co/storage/v1/object/public/thumbnails/transformacao.jpg'
WHERE slug = 'ebook_completo';

-- Exemplo: Adicionar URL de vídeo do YouTube
UPDATE products
SET content_url = 'https://www.youtube.com/watch?v=VIDEO_ID'
WHERE slug = 'resultado';
```

### 4. Testar Fluxo Completo

1. **Fazer uma compra de teste:**
   - Acesse `/checkout`
   - Use cartão de teste do Stripe: `4242 4242 4242 4242`
   - Complete o pagamento

2. **Webhook processa:**
   - Stripe envia evento `payment_intent.succeeded`
   - Webhook cria purchase no banco

3. **Primeiro acesso:**
   - Acesse `/area-membros/primeiro-acesso`
   - Digite email usado na compra
   - Defina senha

4. **Acessar dashboard:**
   - Visualize produtos comprados
   - Clique para acessar conteúdo

## 🚀 Próximos Passos

### Funcionalidades Futuras

1. **Email Notifications (Resend)**
   - Após compra aprovada
   - Link para primeiro acesso
   - Boas-vindas à área de membros
   - *Aguardando compra do domínio*

2. **Upload de Conteúdo**
   - Interface admin para subir PDFs
   - Upload de thumbnails
   - Gerenciar links de vídeos

3. **Progresso Avançado**
   - Tracking de tempo assistido
   - Marcar seções específicas como concluídas
   - Certificados de conclusão

4. **Gamificação**
   - Badges por conquistas
   - Streak de dias consecutivos
   - Ranking de progresso

5. **Comunidade**
   - Comentários em produtos
   - Área de perguntas e respostas
   - Grupo exclusivo no WhatsApp

## 🐛 Troubleshooting

### Usuário não consegue fazer login
- Verificar se o email foi usado em uma compra
- Confirmar que a compra tem `payment_status = 'approved'`
- Verificar se a senha tem 8+ caracteres

### Produtos não aparecem no dashboard
- Verificar se a purchase foi criada: `SELECT * FROM purchases WHERE user_email = '...'`
- Confirmar que o trigger vinculou o `user_id`: `SELECT user_id FROM purchases WHERE user_email = '...'`
- Verificar RLS policies

### Progresso não atualiza
- Verificar console do navegador para erros
- Confirmar que `user_progress` foi criado
- Verificar permissões RLS

### Vídeo do YouTube não carrega
- Confirmar que a URL está no formato correto
- Verificar se o vídeo está público
- Testar URL diretamente no navegador

## 📝 Checklist de Deploy

- [ ] Executar SQL no Supabase de produção
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Testar webhook do Stripe em produção
- [ ] Fazer compra de teste completa
- [ ] Testar criação de conta
- [ ] Verificar acesso aos produtos
- [ ] Testar em mobile
- [ ] Configurar domínio personalizado
- [ ] Setup Resend para emails

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do Supabase
2. Verificar logs do Stripe Dashboard
3. Verificar console do navegador
4. Revisar esta documentação

---

**Desenvolvido com 💖 para transformar vidas**
