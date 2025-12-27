'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckIcon, SparklesIcon, XIcon, ClockIcon, ArrowRightIcon, BookOpenIcon, StarIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function Oferta1Page() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userScore, setUserScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos em segundos
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Verificar se veio do resultado
    const name = localStorage.getItem('userName')
    const results = localStorage.getItem('testResults')

    if (!name || !results) {
      router.push('/')
      return
    }

    const parsedResults = JSON.parse(results)
    setUserName(name)
    setUserScore(Math.round((parsedResults.percentage / 100) * 10 * 10) / 10)

    // Timer de 15 minutos
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

  const handleAccept = () => {
    setIsLoading(true)
    // TODO: Redirecionar para Kiwify (link será inserido depois)
    // window.location.href = 'LINK_KIWIFY_UPSELL_1'

    // Por enquanto, salvar que aceitou e ir para Upsell 3
    localStorage.setItem('upsell1_accepted', 'true')
    setTimeout(() => {
      router.push('/oferta-3')
    }, 1000)
  }

  const handleDecline = () => {
    // Salvar que recusou e ir para Upsell 2 (downsell)
    localStorage.setItem('upsell1_accepted', 'false')
    router.push('/oferta-2')
  }

  if (!userName) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Timer de Urgência */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <ClockIcon className="w-5 h-5 animate-pulse" />
          <span className="font-bold text-sm sm:text-base">
            Esta oferta expira em: {formatTime(timeLeft)}
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
          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-2 rounded-full mb-4">
            <StarIcon className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-800">OFERTA EXCLUSIVA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {userName}, Você Está a Um Passo da Transformação Real
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Sua nota foi <span className="font-bold text-pink-600">{userScore}/10</span>. Agora você sabe ONDE estão seus padrões... mas sabe COMO transformá-los?
          </p>
        </motion.div>

        {/* Problema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-gray-200 rounded-3xl p-8 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            O Problema:
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            A maioria das mulheres que fazem testes de autoconhecimento <span className="font-bold text-red-600">param por aqui</span>. Elas:
          </p>
          <div className="space-y-3">
            {[
              'Descobrem seus padrões, mas não sabem como quebrá-los',
              'Voltam para o mesmo relacionamento tóxico em 30 dias',
              'Sentem culpa, mas não conseguem agir diferente',
              'Repetem os mesmos erros (porque consciência ≠ transformação)'
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <XIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Solução - O E-book */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 md:p-10 text-white mb-8 shadow-2xl"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpenIcon className="w-12 h-12" />
            <h2 className="text-3xl md:text-4xl font-bold">
              A Solução:
            </h2>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              E-book "Transformação nas 3 Esferas"
            </h3>
            <p className="text-lg md:text-xl opacity-95 leading-relaxed">
              O Guia Completo Para Romper Padrões Emocionais e Reconstruir Relacionamentos Saudáveis
            </p>
          </div>

          {/* O que está incluído */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h4 className="text-xl font-bold mb-4 text-center">📚 O que você vai receber:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                '147 páginas de conteúdo transformador',
                'Exercícios práticos para cada esfera',
                'Técnica de Ressignificação Paterna',
                'Protocolo de Cura Materna',
                'Reconstrução da Sexualidade Saudável',
                'Workbook de Autoconhecimento',
                'Meditações Guiadas (áudios bônus)',
                'Rastreador de Padrões Emocionais',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transformações */}
          <div className="mb-8">
            <h4 className="text-2xl font-bold mb-4 text-center">✨ O que você vai transformar:</h4>
            <div className="space-y-3">
              {[
                '🎯 Esfera Paterna: Romper o padrão de buscar validação masculina',
                '💖 Esfera Materna: Aprender auto-cuidado sem culpa',
                '🔥 Esfera Sexual: Reconectar-se com seu prazer e intimidade',
              ].map((item, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4">
                  <p className="font-medium text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preço */}
          <div className="text-center border-t-2 border-white/20 pt-8">
            <p className="text-lg opacity-90 mb-2 line-through">De R$ 297,00 por:</p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-2xl">R$</span>
              <span className="text-6xl md:text-7xl font-black">97</span>
              <span className="text-2xl">,00</span>
            </div>
            <p className="text-lg opacity-90">ou 3x de R$ 34,90 sem juros</p>
          </div>
        </motion.div>

        {/* Garantia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center"
        >
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-xl font-bold text-green-900 mb-2">
            Garantia de 7 Dias
          </h3>
          <p className="text-green-800">
            Se você não sentir que o conteúdo te ajudou, devolvemos 100% do seu investimento. Sem perguntas.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          {/* Botão Aceitar */}
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl text-lg md:text-xl"
          >
            {isLoading ? (
              'Processando...'
            ) : (
              <>
                <CheckIcon className="w-6 h-6" />
                SIM! QUERO O E-BOOK COMPLETO
                <ArrowRightIcon className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Botão Recusar */}
          <button
            onClick={handleDecline}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-4 px-8 rounded-xl transition-all text-sm"
          >
            Não, obrigada. Prefiro continuar sem solução prática.
          </button>
        </motion.div>

        {/* Escassez */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500 italic">
            ⚠️ Esta oferta não estará disponível novamente após esta tela
          </p>
        </motion.div>

        {/* Prova Social */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              name: 'Juliana, 34 anos',
              text: '"Depois de ler o e-book, finalmente entendi por que sempre me relacionava com homens emocionalmente indisponíveis. Mudou tudo."',
              stars: 5
            },
            {
              name: 'Mariana, 28 anos',
              text: '"Os exercícios da esfera materna me ajudaram a parar de me sacrificar tanto. Aprendi a dizer não sem culpa!"',
              stars: 5
            },
            {
              name: 'Carla, 41 anos',
              text: '"Pela primeira vez consegui me conectar com minha sexualidade de forma saudável. Valeu cada centavo."',
              stars: 5
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.stars)].map((_, i) => (
                  <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-3 text-sm leading-relaxed">
                {testimonial.text}
              </p>
              <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
