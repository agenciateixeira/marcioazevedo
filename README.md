# Saúde Emocional no Relacionamento

Plataforma de avaliação de saúde emocional para mulheres baseada em psicanálise freudiana.

## Sobre o Projeto

Este projeto oferece uma avaliação completa de saúde emocional através de 3 testes principais:

1. **Teste 1: Relação com o Pai** - 21 perguntas sobre como a figura paterna influencia os relacionamentos atuais
2. **Teste 2: Relação com a Mãe** - 21 perguntas sobre formação emocional primária e vínculos afetivos
3. **Teste 3: Sexualidade** - 21 perguntas sobre desenvolvimento sexual e intimidade emocional

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Supabase** - Banco de dados e backend
- **Lucide React** - Ícones

## Estrutura do Projeto

```
├── app/
│   ├── page.tsx          # Landing page
│   ├── quiz/
│   │   └── page.tsx      # Página do quiz
│   └── resultado/
│       └── page.tsx      # Página de resultados
├── data/
│   └── tests.ts          # Dados dos testes
├── lib/
│   └── supabase.ts       # Configuração Supabase
└── types/
    └── index.ts          # Tipos TypeScript
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Banco de Dados Supabase

Execute o script SQL em `supabase-schema.sql` no editor SQL do Supabase para criar a tabela necessária.

## Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Deploy

Este projeto está configurado para deploy na Vercel. Basta conectar o repositório GitHub à Vercel e configurar as variáveis de ambiente.

## Licença

© 2024 Saúde Emocional. Todos os direitos reservados.
