# 🚀 Configuração SEO - Guia Completo

## ✅ O que já está configurado:

### 1. **Meta Tags Completas**
- Title otimizado para conversão
- Description persuasiva (155-160 caracteres)
- Keywords estratégicas
- Open Graph (Facebook, LinkedIn)
- Twitter Cards
- Canonical URLs

### 2. **Schema.org (JSON-LD)**
- Organization
- WebSite
- Service
Isso ajuda o Google a entender melhor seu site e aparecer em rich snippets!

### 3. **Sitemap & Robots.txt**
- `/sitemap.xml` - Gerado automaticamente
- `/robots.txt` - Configurado para permitir crawlers

### 4. **PWA Ready**
- Manifest.json configurado
- Favicon SVG customizado (coração rosa)
- Theme color definido

### 5. **Performance**
- Fontes com `display: swap`
- Lazy loading de scripts
- Otimização automática do Next.js

---

## 📋 CHECKLIST - O que você precisa fazer:

### 1. **Atualizar o Domínio**
Arquivo: `lib/seo.ts`
```typescript
url: 'https://SEU-DOMINIO.com.br', // Linha 8
```

### 2. **Criar Imagem Open Graph** (1200x630px)
- Crie uma imagem com:
  - Logo + Texto chamativo
  - Cores: Rosa (#ec4899) e branco
  - Exemplo: "Descubra Por Que Você Repete os Mesmos Padrões"
- Salve em: `public/og-image.jpg`

### 3. **Google Search Console**
1. Acesse: https://search.google.com/search-console
2. Adicione sua propriedade
3. Cole o código de verificação em `app/layout.tsx` linha 87:
```typescript
google: "SEU_CODIGO_AQUI",
```

### 4. **Google Analytics**
1. Crie conta em: https://analytics.google.com
2. Obtenha seu ID (ex: G-XXXXXXXXXX)
3. Descomente e cole em `app/layout.tsx` linha 135-146
4. Substitua `G-XXXXXXXXXX` pelo seu ID

### 5. **Meta Pixel (Facebook)**
1. Acesse: https://business.facebook.com/events_manager
2. Crie um Pixel
3. Obtenha seu Pixel ID
4. Descomente e cole em `app/layout.tsx` linha 148-170
5. Substitua `YOUR_PIXEL_ID` pelo seu ID

### 6. **Google Tag Manager** (Opcional, mas recomendado)
1. Crie conta em: https://tagmanager.google.com
2. Obtenha seu ID (GTM-XXXXXXX)
3. Descomente em `app/layout.tsx` linhas 172-193
4. Substitua `GTM-XXXXXXX` pelo seu ID

---

## 🎯 Estratégia de SEO

### **Palavras-chave Principais:**
1. saúde emocional relacionamento
2. teste psicanálise feminino
3. padrões relacionamento tóxico
4. autoconhecimento mulheres
5. esgotamento emocional relacionamento

### **Conteúdo para Rankear:**
1. **Blog Posts** (crie depois):
   - "5 Sinais de Que Você Repete Padrões Tóxicos no Relacionamento"
   - "Como a Relação com Seu Pai Afeta Suas Escolhas Amorosas"
   - "Psicanálise Freudiana: Entenda Seus Padrões Emocionais"

2. **Landing Page** (já otimizada):
   - Headlines focadas em dor e transformação
   - CTA claro
   - Social proof
   - Urgência e escassez

### **Backlinks:**
- Busque parcerias com blogs de psicologia
- Guest posts em sites de relacionamento
- Diretórios de saúde mental

---

## 📊 Monitoramento

### **Ferramentas Essenciais:**
1. **Google Search Console** - Ver como o Google vê seu site
2. **Google Analytics** - Tráfego e conversões
3. **Meta Business Suite** - Anúncios Facebook/Instagram
4. **Hotjar** - Mapas de calor e gravações

### **Métricas para Acompanhar:**
- Taxa de conversão (lead)
- Taxa de conversão (vendas)
- Custo por lead
- ROI dos anúncios
- Tempo na página
- Taxa de rejeição

---

## 🚀 Próximos Passos (Após Deploy)

1. ✅ Enviar sitemap para Google Search Console
2. ✅ Configurar Google Analytics
3. ✅ Configurar Meta Pixel
4. ✅ Testar conversões com eventos personalizados
5. ✅ Criar campanhas no Google Ads
6. ✅ Criar campanhas no Facebook Ads
7. ✅ Instalar Microsoft Clarity (opcional)

---

## 📱 Eventos de Conversão Recomendados

Para Meta Pixel e Google Analytics:

```javascript
// Lead (quando preencher o formulário)
fbq('track', 'Lead');
gtag('event', 'generate_lead');

// Iniciar quiz
fbq('track', 'InitiateCheckout');
gtag('event', 'begin_checkout');

// Completar quiz
fbq('track', 'CompleteRegistration');
gtag('event', 'sign_up');

// Ver resultado (página de checkout)
fbq('track', 'ViewContent');
gtag('event', 'view_item');

// Purchase (pagamento aprovado)
fbq('track', 'Purchase', {value: 7.00, currency: 'BRL'});
gtag('event', 'purchase', {value: 7.00, currency: 'BRL'});
```

---

## 🎨 Imagem OG Sugerida

**Texto na imagem:**
```
🔥 Por Que Você Continua Repetindo
Os Mesmos Padrões no Relacionamento?

✨ Avaliação Completa Baseada em Psicanálise
💖 +2.847 Mulheres Já Transformaram Suas Vidas

[CTA: Faça Seu Teste Agora]
```

Dimensões: 1200x630px
Formato: JPG ou PNG
Local: `/public/og-image.jpg`

---

## ✅ Está Tudo Pronto!

Quando fizer deploy na Vercel, o Next.js vai gerar automaticamente:
- ✅ Sitemap dinâmico
- ✅ Manifest PWA
- ✅ Favicon otimizado
- ✅ Meta tags completas

**Basta configurar os pixels e começar a anunciar!** 🚀
