# 📋 Documentação do Projeto - Plataforma de Anamnese Psicológica

## 🎯 Visão Geral

Plataforma de avaliação psicológica para mulheres esgotadas em relacionamentos, baseada em psicanálise freudiana. Sistema completo com quiz, análise preditiva, sistema de pagamento e painel administrativo.

---

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Landing Page**
- ✅ Headline persuasiva: "Teste Para Mulheres Esgotadas no Relacionamento"
- ✅ Design 100% responsivo (mobile-first)
- ✅ Captura de nome + email (LGPD compliant)
- ✅ Checkbox obrigatório de termos de uso
- ✅ SEO completo:
  - Meta tags Open Graph
  - Twitter Cards
  - Schema.org JSON-LD
  - Favicon dinâmico
  - Slots preparados para Meta Pixel e Google Analytics
- ✅ 20+ ícones SVG customizados (sem dependências externas)

**Arquivo:** `app/page.tsx`

---

### 2. **Sistema de Quiz em 3 Fases**

#### Estrutura:
- **Fase 1:** Relação Paterna (👨) - 21 questões
- **Fase 2:** Relação Materna (👩) - 21 questões
- **Fase 3:** Sexualidade (💕) - 21 questões
- **Total:** 63 questões, 5 opções cada, 315 pontos máximos

#### Features:
- ✅ Uma pergunta por vez (estilo IQ test)
- ✅ Transições suaves entre fases
- ✅ Barras de progresso (individual e global)
- ✅ Telas de transição entre fases
- ✅ Animações com Framer Motion
- ✅ 100% responsivo

**Arquivo:** `app/quiz/page.tsx`

---

### 3. **Sistema de Pontuação e Análise**

#### Cálculo de Scores:
- ✅ Nota de 0 a 10 (termômetro visual)
- ✅ 4 níveis de saúde emocional:
  - Critical (0-3)
  - Moderate (3-5)
  - Good (5-7)
  - Excellent (7-10)

#### Algoritmo Preditivo Consultivo:
Identifica 6 padrões emocionais através de cross-analysis:

1. **Validação Masculina via Sexualidade**
   - Ferida paterna + baixa sexualidade

2. **Competição Feminina e Idealização Masculina**
   - Ferida materna + pai idealizado

3. **Padrão de Duplo Abandono**
   - Feridas paterna E materna graves

4. **Bloqueio de Sexualidade e Intimidade**
   - Sexualidade baixa isolada

5. **Dificuldade de Auto-Cuidado**
   - Ferida materna específica

6. **Insegurança Generalizada**
   - Scores baixos em todas as áreas

**Arquivo:** `app/resultado/page.tsx` (linhas 200-350)

---

### 4. **Sistema de Pagamento**

#### Checkpoint de Pagamento:
- ✅ Bloqueio de resultado até aprovação de pagamento R$7,00
- ✅ Escolha entre Stripe (cartão) ou Kiwify (PIX/boleto)
- ✅ Preview do resultado bloqueado (teaser)
- ✅ Página de aguardo com polling 3s
- ✅ Webhooks preparados para ambos gateways

#### Webhooks Implementados:
- ✅ `/api/webhook/stripe` - Atualiza status via Stripe
- ✅ `/api/webhook/kiwify` - Atualiza status via Kiwify

**Arquivos:**
- `app/checkout/page.tsx`
- `app/aguardando/page.tsx`
- `app/api/webhook/stripe/route.ts`
- `app/api/webhook/kiwify/route.ts`

---

### 5. **Funil de Vendas Completo**

#### Upsells Implementados:

**Upsell 1 - E-book Completo (R$97)**
- 147 páginas
- 3 esferas de análise profunda
- Exercícios práticos

**Upsell 2 - E-book Simplificado (R$47)**
- Downsell do primeiro
- 30 páginas
- Versão resumida

**Upsell 3 - Mentoria Individual (R$497)**
- 2 horas de sessão
- Apenas se aceitou Upsell 1
- Análise personalizada

**Thank You Page:**
- Redirecionamento para canal do WhatsApp
- Opção de pular ofertas

**Arquivos:**
- `app/oferta-1/page.tsx`
- `app/oferta-2/page.tsx`
- `app/oferta-3/page.tsx`
- `app/canal-whatsapp/page.tsx`

---

### 6. **Banco de Dados (Supabase)**

#### Tabelas Criadas:

**`leads`**
- Captura inicial (nome + email)
- Flags de progresso (started_quiz, completed_quiz, viewed_checkout)
- UTM tracking completo (source, medium, campaign, term, content)
- IP, referrer, user agent

**`responses`**
- Anamnese completa com 63 respostas
- Scores de cada teste
- Análise preditiva gerada
- Status de pagamento
- IDs de transação (Stripe/Kiwify)
- Flag result_unlocked

**`admin_users`**
- Email + senha criptografada (bcrypt)
- Roles: admin / super_admin
- Last login tracking
- Status ativo/inativo

**`audit_log`**
- Registro de ações dos admins
- IP e user agent
- Detalhes em JSONB

#### RLS Policies Configuradas:
- ✅ Leads: público insert, service_role read/update
- ✅ Responses: público insert e read, service_role update
- ✅ Admin_users: apenas service_role
- ✅ Audit_log: apenas service_role

**Arquivo:** `supabase-schema-complete.sql`

---

### 7. **Painel Administrativo**

#### Features Implementadas:

**Sidebar Profissional:**
- ✅ Navegação lateral fixa
- ✅ Indicador visual de página ativa
- ✅ Animações suaves
- ✅ Logout e link para site

**Páginas Admin:**

1. **Dashboard** (`/admin/dashboard`)
   - Cards com estatísticas em tempo real
   - Total de leads
   - Testes completos
   - Pagamentos aprovados + receita
   - Pagamentos pendentes
   - Taxa de conversão
   - Receita total e ticket médio

2. **Leads** (`/admin/leads`)
   - Lista completa de leads capturados
   - Busca por nome/email
   - Filtro por status (iniciou/completou quiz)
   - Exportação CSV
   - Visualização de UTM parameters

3. **Anamneses** (`/admin/respostas`)
   - Lista de testes completos
   - Busca por nome/email
   - Filtro por status de pagamento
   - Badges coloridos de status
   - Exportação CSV
   - Link para relatório individual

4. **Relatório Individual** (`/admin/relatorio/[id]`)
   - Dados gerais da pessoa
   - Nota final (0-10)
   - Scores por área (Pai, Mãe, Sexualidade)
   - Análise preditiva completa
   - Todas as 63 respostas organizadas por teste
   - Botão para download PDF (preparado)

**Login Seguro:**
- ✅ Autenticação via banco de dados
- ✅ Função `verify_admin_login()` no Supabase
- ✅ Senhas criptografadas com bcrypt
- ✅ API route `/api/admin/login`
- ✅ Apenas usuários cadastrados podem acessar

**Credenciais Configuradas:**
- Email: `hdlprofissional@yahoo.com.br`
- Senha: `248367`
- Role: super_admin

**Arquivos:**
- `components/AdminSidebar.tsx`
- `components/AdminLayout.tsx`
- `app/admin/login/page.tsx`
- `app/admin/dashboard/page.tsx`
- `app/admin/leads/page.tsx`
- `app/admin/respostas/page.tsx`
- `app/admin/relatorio/[id]/page.tsx`

---

### 8. **API Routes Server-Side**

Para garantir segurança com RLS, todas as queries admin são feitas server-side:

- ✅ `GET /api/admin/stats` - Estatísticas do dashboard
- ✅ `GET /api/admin/leads` - Todos os leads
- ✅ `GET /api/admin/responses` - Todas as anamneses
- ✅ `GET /api/admin/response/[id]` - Anamnese individual
- ✅ `POST /api/admin/login` - Autenticação admin

Todas usam `supabaseAdmin` com `SERVICE_ROLE_KEY` para bypassar RLS.

**Arquivo:** `lib/supabase-admin.ts` + `app/api/admin/*`

---

### 9. **Tracking e Analytics**

#### Preparado (slots vazios):
- ⚠️ Meta Pixel - slot em `app/layout.tsx`
- ⚠️ Google Analytics - slot em `app/layout.tsx`
- ⚠️ Google Tag Manager - slot preparado

#### Implementado:
- ✅ UTM tracking completo
- ✅ Referrer tracking
- ✅ IP e User Agent capture
- ✅ Funnel tracking (started_quiz, completed_quiz, viewed_checkout)

---

## 🔴 O QUE FALTA FAZER

### 1. **Integração de Pagamento (CRÍTICO)**

#### Stripe:
- [ ] Adicionar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Adicionar `STRIPE_SECRET_KEY`
- [ ] Adicionar `STRIPE_WEBHOOK_SECRET`
- [ ] Criar Checkout Session em `/checkout`
- [ ] Configurar webhook no painel Stripe
- [ ] Testar fluxo completo de pagamento

**Arquivos a modificar:**
- `app/checkout/page.tsx` (linha 23-28)
- `app/api/webhook/stripe/route.ts`

#### Kiwify:
- [ ] Adicionar link do produto no botão
- [ ] Configurar webhook secret
- [ ] Testar notificações de pagamento

**Arquivos a modificar:**
- `app/checkout/page.tsx` (linha 29-34)
- `app/api/webhook/kiwify/route.ts`

---

### 2. **Links dos Upsells**

#### Oferta 1 (R$97):
- [ ] Adicionar link de pagamento do e-book completo
- [ ] Configurar webhook

**Arquivo:** `app/oferta-1/page.tsx` (linha 42)

#### Oferta 2 (R$47):
- [ ] Adicionar link de pagamento do e-book simplificado
- [ ] Configurar webhook

**Arquivo:** `app/oferta-2/page.tsx` (linha 38)

#### Oferta 3 (R$497):
- [ ] Adicionar link de pagamento da mentoria
- [ ] Configurar webhook

**Arquivo:** `app/oferta-3/page.tsx` (linha 41)

---

### 3. **Canal do WhatsApp**

- [ ] Adicionar link do grupo/canal do WhatsApp
- [ ] Substituir o placeholder

**Arquivo:** `app/canal-whatsapp/page.tsx` (linha 32)

---

### 4. **Geração de PDF**

Implementar download de PDF do relatório individual:

- [ ] Instalar biblioteca (ex: jsPDF, react-pdf, ou Puppeteer)
- [ ] Criar template de PDF profissional
- [ ] Incluir logo, branding
- [ ] Todas as 63 respostas formatadas
- [ ] Análise preditiva
- [ ] Gráficos de pontuação

**Arquivo:** `app/admin/relatorio/[id]/page.tsx` (linha 78-81)

---

### 5. **Analytics e Tracking**

#### Meta Pixel:
- [ ] Obter Pixel ID
- [ ] Adicionar script no `app/layout.tsx`
- [ ] Configurar eventos:
  - PageView
  - Lead (captura de email)
  - InitiateCheckout
  - Purchase
  - ViewContent (resultado)

#### Google Analytics:
- [ ] Criar propriedade GA4
- [ ] Adicionar Measurement ID
- [ ] Configurar eventos customizados:
  - quiz_started
  - quiz_phase_completed
  - quiz_completed
  - checkout_viewed
  - payment_success
  - upsell_viewed
  - upsell_accepted

**Arquivo:** `app/layout.tsx` (linhas 20-30)

---

### 6. **Melhorias de UX**

#### Loader States:
- [ ] Adicionar skeleton loading nos cards do dashboard
- [ ] Loading state nas tabelas (leads/responses)
- [ ] Animação de carregamento no quiz

#### Feedback Visual:
- [ ] Toast notifications para ações (ex: "CSV exportado com sucesso")
- [ ] Confirmação antes de sair do quiz
- [ ] Progress save no quiz (salvar a cada resposta)

#### Responsividade:
- [ ] Testar em mais dispositivos
- [ ] Otimizar sidebar mobile (drawer/hamburger)
- [ ] Ajustar tabelas em telas pequenas (scroll horizontal)

---

### 7. **Segurança**

#### Rate Limiting:
- [ ] Implementar rate limit em `/api/admin/login`
- [ ] Bloquear após X tentativas falhas
- [ ] Captcha no login após tentativas

#### CSRF Protection:
- [ ] Adicionar tokens CSRF nos forms
- [ ] Validar origin nos webhooks

#### Sanitização:
- [ ] Sanitizar inputs do quiz
- [ ] Validar emails com regex mais forte
- [ ] Escapar outputs no relatório

---

### 8. **Email Marketing**

#### Notificações Automáticas:
- [ ] Email de boas-vindas ao capturar lead
- [ ] Email quando completar quiz
- [ ] Email quando pagamento aprovado com link do resultado
- [ ] Email de lembrete se abandonou quiz
- [ ] Email de upsell para quem comprou resultado

#### Integração:
- [ ] Escolher provider (SendGrid, Mailchimp, Resend)
- [ ] Criar templates HTML
- [ ] Configurar triggers

---

### 9. **Backup e Recovery**

- [ ] Configurar backup automático do Supabase
- [ ] Script de export de dados
- [ ] Documentar processo de restore
- [ ] Versionamento do schema SQL

---

### 10. **Testes**

#### Unitários:
- [ ] Testar função de cálculo de score
- [ ] Testar algoritmo preditivo
- [ ] Testar conversão de porcentagem para nota 0-10

#### Integração:
- [ ] Testar fluxo completo (landing → quiz → checkout → resultado)
- [ ] Testar webhooks com dados fake
- [ ] Testar recuperação de resultado do banco

#### E2E:
- [ ] Cypress ou Playwright para testar jornada do usuário
- [ ] Testar admin completo

---

### 11. **Performance**

#### Otimizações:
- [ ] Lazy loading de imagens
- [ ] Code splitting por rota
- [ ] Compressão de respostas (gzip)
- [ ] Cache de estatísticas do dashboard
- [ ] Otimizar queries do Supabase (indexes já criados)

#### Monitoramento:
- [ ] Configurar Vercel Analytics
- [ ] Adicionar Sentry para error tracking
- [ ] Lighthouse CI

---

### 12. **Compliance**

#### LGPD:
- [x] Página de termos criada
- [ ] Adicionar política de privacidade detalhada
- [ ] Cookie consent banner (se usar cookies)
- [ ] Direito de exclusão de dados (botão no resultado)
- [ ] Export de dados pessoais (download JSON)

---

## 🔧 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### Vercel (Produção):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seuprojetoID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=suaAnonKeyAqui
SUPABASE_SERVICE_ROLE_KEY=suaServiceRoleKeyAqui

# Stripe (quando configurar)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Kiwify (quando configurar)
KIWIFY_WEBHOOK_SECRET=seu_secret_aqui

# Analytics (quando configurar)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=123456789

# Email (quando configurar)
RESEND_API_KEY=re_...
```

---

## 📁 ESTRUTURA DE PASTAS

```
marcioazevedo/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── quiz/page.tsx                 # Quiz em 3 fases
│   ├── resultado/page.tsx            # Resultado bloqueado
│   ├── checkout/page.tsx             # Página de pagamento R$7
│   ├── aguardando/page.tsx           # Aguardando aprovação
│   ├── oferta-1/page.tsx             # Upsell R$97
│   ├── oferta-2/page.tsx             # Upsell R$47 (downsell)
│   ├── oferta-3/page.tsx             # Upsell R$497
│   ├── canal-whatsapp/page.tsx       # Thank you page
│   ├── termos/page.tsx               # Termos LGPD
│   ├── admin/
│   │   ├── login/page.tsx            # Login admin
│   │   ├── dashboard/page.tsx        # Dashboard
│   │   ├── leads/page.tsx            # Gestão de leads
│   │   ├── respostas/page.tsx        # Gestão de anamneses
│   │   └── relatorio/[id]/page.tsx   # Relatório individual
│   └── api/
│       ├── webhook/
│       │   ├── stripe/route.ts       # Webhook Stripe
│       │   └── kiwify/route.ts       # Webhook Kiwify
│       └── admin/
│           ├── login/route.ts        # API login
│           ├── stats/route.ts        # API estatísticas
│           ├── leads/route.ts        # API leads
│           ├── responses/route.ts    # API responses
│           └── response/[id]/route.ts # API response individual
├── components/
│   ├── icons.tsx                     # 20+ ícones SVG customizados
│   ├── AdminSidebar.tsx              # Sidebar do admin
│   └── AdminLayout.tsx               # Layout wrapper admin
├── lib/
│   ├── supabase.ts                   # Cliente público
│   ├── supabase-admin.ts             # Cliente com service role
│   └── seo.ts                        # Configs de SEO
├── supabase-schema-complete.sql      # Schema SQL completo
├── .env.example                      # Exemplo de env vars
└── DOCUMENTATION.md                  # Este arquivo
```

---

## 🚀 PRÓXIMOS PASSOS (Ordem de Prioridade)

1. **URGENTE:** Configurar pagamento Stripe/Kiwify (R$7)
2. **IMPORTANTE:** Adicionar Meta Pixel e Google Analytics
3. **IMPORTANTE:** Configurar email marketing (boas-vindas, resultado)
4. **MÉDIO:** Implementar geração de PDF
5. **MÉDIO:** Adicionar links dos upsells
6. **MÉDIO:** Configurar canal do WhatsApp
7. **BAIXO:** Melhorias de UX (toasts, loading states)
8. **BAIXO:** Testes automatizados
9. **BAIXO:** Otimizações de performance

---

## 📊 MÉTRICAS IMPORTANTES PARA ACOMPANHAR

### Funil de Conversão:
1. Visitantes → Leads (captura email)
2. Leads → Quiz Iniciado
3. Quiz Iniciado → Quiz Completo
4. Quiz Completo → Visualizou Checkout
5. Visualizou Checkout → Pagou R$7
6. Pagou R$7 → Aceitou Upsell 1
7. Aceitou Upsell 1 → Aceitou Upsell 2
8. Aceitou Upsell 1 → Aceitou Upsell 3

### KPIs:
- Taxa de conversão lead → pagamento
- Ticket médio
- LTV (Lifetime Value)
- Taxa de abandono do quiz
- Taxa de aceitação dos upsells

---

## 🔐 CREDENCIAIS IMPORTANTES

### Admin:
- **URL:** `/admin/login`
- **Email:** `hdlprofissional@yahoo.com.br`
- **Senha:** `248367`

### Supabase:
- **URL:** `https://gaoajxkhbgilotyrtyfe.supabase.co`
- **Senha do projeto:** `Gui1302569@`

### GitHub:
- **Repo:** `https://github.com/agenciateixeira/marcioazevedo.git`

### Vercel:
- Deploy automático no push para `main`

---

## 📞 SUPORTE E MANUTENÇÃO

### Logs:
- Vercel: Dashboard → Projeto → Logs
- Supabase: Dashboard → Logs

### Debugging:
- Admin não aparece dados? Verificar `SUPABASE_SERVICE_ROLE_KEY`
- Pagamento não atualiza? Verificar webhooks
- Quiz não salva? Verificar RLS policies

### Comandos Úteis:

```bash
# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Executar SQL no Supabase
# Copiar conteúdo de supabase-schema-complete.sql
# Colar no SQL Editor do Supabase

# Deploy manual (se necessário)
vercel --prod
```

---

**Última atualização:** 27/12/2025
**Versão:** 1.0.0
**Status:** Em produção (pagamento pendente de configuração)
