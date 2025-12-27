// Configuração centralizada de SEO

export const siteConfig = {
  name: 'Transformação Emocional | Avaliação de Saúde Emocional',
  title: 'Descubra Por Que Você Repete os Mesmos Padrões no Relacionamento',
  description: 'Avaliação completa baseada em Psicanálise Freudiana para mulheres esgotadas emocionalmente. Descubra como sua história com seus pais está afetando seus relacionamentos hoje. +2.847 mulheres já transformaram suas vidas.',
  url: 'https://saudeemocional.com.br', // Atualize com seu domínio
  ogImage: 'https://saudeemocional.com.br/og-image.jpg', // Crie esta imagem
  keywords: [
    'saúde emocional',
    'relacionamento tóxico',
    'psicanálise freudiana',
    'autoconhecimento feminino',
    'terapia online',
    'esgotamento emocional',
    'padrões de relacionamento',
    'trauma familiar',
    'complexo de édipo',
    'desenvolvimento sexual',
    'mulheres empoderadas',
    'transformação pessoal',
    'relacionamento saudável',
    'terapia para mulheres',
    'saúde mental feminina'
  ],
  authors: [
    {
      name: 'Márcio Azevedo',
      url: 'https://saudeemocional.com.br'
    }
  ],
  creator: 'Márcio Azevedo',
  publisher: 'Transformação Emocional',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Transformação Emocional',
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  description: siteConfig.description,
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'contato@saudeemocional.com',
    availableLanguage: ['Portuguese']
  },
  sameAs: [
    'https://www.instagram.com/saudeemocional',
    'https://www.facebook.com/saudeemocional',
  ]
}

export const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: 'pt-BR',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/busca?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
}

export const jsonLdService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Avaliação de Saúde Emocional',
  provider: {
    '@type': 'Organization',
    name: 'Transformação Emocional'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Brasil'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Avaliação Psicanalítica',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Avaliação Completa de Saúde Emocional',
          description: 'Teste baseado em psicanálise freudiana com 63 perguntas sobre relação paterna, materna e desenvolvimento sexual'
        }
      }
    ]
  }
}
