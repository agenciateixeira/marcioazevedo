import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Transformação Emocional - Avaliação de Saúde Emocional',
    short_name: 'Transformação Emocional',
    description: 'Descubra como sua história está afetando seus relacionamentos através de avaliação baseada em psicanálise freudiana',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ec4899',
    orientation: 'portrait-primary',
    categories: ['health', 'lifestyle', 'education'],
    lang: 'pt-BR',
    dir: 'ltr',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
