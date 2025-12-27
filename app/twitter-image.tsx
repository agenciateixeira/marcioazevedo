import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Teste Para Mulheres Esgotadas no Relacionamento'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Coração */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 75l-25-25c-5-5-5-12 0-17 5-5 12-5 17 0l8 8 8-8c5-5 12-5 17 0 5 5 5 12 0 17z" fill="white"/>
          </svg>
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '30px',
          }}
        >
          Teste Para Mulheres
          <br />
          Esgotadas no Relacionamento
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: 40,
            color: 'rgba(255, 255, 255, 0.95)',
            textAlign: 'center',
            fontWeight: '500',
            marginBottom: '40px',
          }}
        >
          Descubra em 7 Minutos Por Que Você Repete os Mesmos Padrões
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '20px 40px',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            ✨ Avaliação Baseada em Psicanálise Freudiana
          </div>
        </div>

        {/* Social Proof */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            fontSize: 28,
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '600',
          }}
        >
          💖 +2.847 Mulheres Já Transformaram Suas Vidas
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
