'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckIcon, SparklesIcon, ArrowRightIcon, VideoIcon, StarIcon, ClockIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function Oferta3Page() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10 * 60) // 10 minutos

  useEffect(() => {
    const name = localStorage.getItem('userName')
    const upsell1 = localStorage.getItem('upsell1_accepted')

    if (!name) {
      router.push('/')
      return
    }

    // Só mostra essa página se ACEITOU o Upsell 1
    if (upsell1 !== 'true') {
      router.push('/canal-whatsapp')
      return
    }

    setUserName(name)

    // Timer de 10 minutos
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAccept = async () => {
    setIsLoading(true)

    try {
      const email = localStorage.getItem('userEmail')
      const name = localStorage.getItem('userName')

      // Criar Checkout Session no Stripe para Upsell 3 (R$ 497)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MENTORIA, // R$ 497,00
          email,
          name,
          productType: 'mentoria'
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        alert('Erro ao processar pagamento. Tente novamente.')
        setIsLoading(false)
        return
      }

      // Salvar que aceitou o upsell 3
      localStorage.setItem('upsell3_accepted', 'true')

      // Redirecionar para o Stripe Checkout
      const stripe = await (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
      await stripe.redirectToCheckout({ sessionId })

    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
      setIsLoading(false)
    }
  }

  const handleDecline = () => {
    localStorage.setItem('upsell3_accepted', 'false')
    router.push('/canal-whatsapp')
  }

  if (!userName) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Timer */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <ClockIcon className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm sm:text-base">
            Esta tela fecha em: {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            PARABÉNS, {userName}!
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Você acabou de dar o passo mais importante: investir em si mesma.
          </p>

          <p className="text-xl md:text-2xl font-bold text-pink-600">
            E como você demonstrou COMPROMISSO REAL com sua transformação...
          </p>
        </motion.div>

        {/* Oferta Exclusiva */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-4 border-pink-300 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full mb-4">
              <SparklesIcon className="w-5 h-5" />
              <span className="text-sm font-bold">OFERTA EXCLUSIVA</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Tenho uma oferta que nunca mostro para ninguém:
            </h2>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 md:p-10 text-white mb-6">
            <div className="text-center mb-6">
              <VideoIcon className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Mentoria Individual Online - 2 Horas
              </h3>
              <p className="text-lg opacity-95">
                Sessão Particular Comigo Para Trabalhar SEU Caso Específico
              </p>
            </div>

            {/* O que vamos fazer */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h4 className="text-xl font-bold mb-4 text-center">🎯 O que vamos fazer na mentoria:</h4>
              <div className="space-y-4">
                {[
                  {
                    icon: '📍',
                    title: 'Mapeamento do SEU Caso',
                    desc: 'Vamos analisar profundamente SUAS respostas e identificar padrões únicos'
                  },
                  {
                    icon: '💎',
                    title: 'Trabalho nos SEUS Traumas',
                    desc: 'Técnicas específicas para os bloqueios que apareceram no SEU teste'
                  },
                  {
                    icon: '📋',
                    title: 'Plano de Ação Personalizado',
                    desc: 'Estratégia sob medida para a SUA situação e relacionamento'
                  },
                  {
                    icon: '🔄',
                    title: 'Acompanhamento Posterior',
                    desc: 'Suporte via WhatsApp por 30 dias após a mentoria'
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 bg-white/10 rounded-xl p-4">
                    <div className="text-3xl flex-shrink-0">{item.icon}</div>
                    <div>
                      <h5 className="font-bold text-lg mb-1">{item.title}</h5>
                      <p className="opacity-90 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bônus */}
            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <h4 className="text-xl font-bold mb-3 text-center">🎁 BÔNUS EXCLUSIVOS:</h4>
              <div className="space-y-2">
                {[
                  '✅ Gravação da mentoria para você rever quando quiser',
                  '✅ Workbook personalizado com seus exercícios',
                  '✅ Acesso ao grupo VIP no WhatsApp',
                  '✅ 1 sessão de follow-up de 30min após 15 dias',
                ].map((item, index) => (
                  <p key={index} className="opacity-95">{item}</p>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div className="text-center border-t-2 border-white/20 pt-6">
              <p className="text-lg opacity-90 mb-2 line-through">Valor normal: R$ 997,00</p>
              <p className="text-lg mb-4">Para quem acabou de comprar o e-book:</p>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-2xl">R$</span>
                <span className="text-6xl md:text-7xl font-black">497</span>
                <span className="text-2xl">,00</span>
              </div>
              <p className="text-lg opacity-90">ou 12x de R$ 49,90</p>
            </div>
          </div>

          {/* Escassez */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <h4 className="font-bold text-red-900 mb-2">⚠️ ATENÇÃO:</h4>
            <p className="text-red-800">
              Tenho apenas <span className="font-bold">3 vagas disponíveis</span> este mês.<br/>
              Esta tela fecha em {formatTime(timeLeft)} e você não verá essa oferta novamente.
            </p>
          </div>
        </motion.div>

        {/* Depoimentos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            O que quem fez a mentoria diz:
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                name: 'Paula, 36 anos',
                text: '"A mentoria mudou TUDO. Em 2 horas consegui ver coisas que anos de terapia não tinham revelado. Hoje meu relacionamento é completamente diferente."',
                result: 'Nota antes: 3.5/10 → Nota depois: 8.2/10'
              },
              {
                name: 'Camila, 29 anos',
                text: '"Investimento que se pagou em 1 semana. Finalmente entendi meu padrão de autossabotagem e consegui quebrar. Valeu MUITO mais que R$ 497."',
                result: 'Nota antes: 4.1/10 → Nota depois: 7.9/10'
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white border-2 border-purple-100 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="border-t pt-3">
                  <p className="font-bold text-gray-900 mb-1">{testimonial.name}</p>
                  <p className="text-sm text-green-600 font-semibold">{testimonial.result}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {/* Botão Aceitar */}
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl text-lg md:text-xl"
          >
            {isLoading ? (
              'Processando...'
            ) : (
              <>
                <CheckIcon className="w-6 h-6" />
                SIM! QUERO MINHA MENTORIA INDIVIDUAL
                <ArrowRightIcon className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Botão Recusar */}
          <button
            onClick={handleDecline}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-4 px-8 rounded-xl transition-all text-sm"
          >
            Não quero aceleração. Vou tentar sozinha.
          </button>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500 italic">
            Esta oferta é exclusiva para quem comprou o e-book completo
          </p>
        </div>
      </div>
    </div>
  )
}
