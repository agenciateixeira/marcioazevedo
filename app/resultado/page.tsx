'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, DownloadIcon, Share2Icon, CheckCircleIcon, AlertCircleIcon, TrendingUpIcon, HomeIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

interface Results {
  name: string
  email: string
  test1Score: number
  test2Score: number
  test3Score: number
  totalScore: number
  maxScore: number
  percentage: number
  healthLevel: 'critical' | 'moderate' | 'good' | 'excellent'
  analysis: string
}

export default function ResultadoPage() {
  const router = useRouter()
  const [results, setResults] = useState<Results | null>(null)
  const [showCTA, setShowCTA] = useState(false)

  useEffect(() => {
    const savedResults = localStorage.getItem('testResults')

    if (!savedResults) {
      router.push('/')
      return
    }

    const parsedResults: Results = JSON.parse(savedResults)
    setResults(parsedResults)

    // Mostrar CTA após 3 segundos
    setTimeout(() => {
      setShowCTA(true)
    }, 3000)
  }, [router])

  if (!results) {
    return null
  }

  const healthLevelConfig = {
    critical: {
      title: 'Atenção Necessária',
      color: 'red',
      icon: AlertCircleIcon,
      gradient: 'from-red-400 to-red-600',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    moderate: {
      title: 'Desenvolvimento Necessário',
      color: 'orange',
      icon: TrendingUpIcon,
      gradient: 'from-orange-400 to-orange-600',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200'
    },
    good: {
      title: 'Boa Saúde Emocional',
      color: 'blue',
      icon: CheckCircleIcon,
      gradient: 'from-blue-400 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    excellent: {
      title: 'Excelente Saúde Emocional',
      color: 'green',
      icon: CheckCircleIcon,
      gradient: 'from-green-400 to-green-600',
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200'
    }
  }

  const config = healthLevelConfig[results.healthLevel]
  const Icon = config.icon

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Teste de Saúde Emocional',
        text: 'Acabei de fazer o teste de saúde emocional no relacionamento!',
        url: window.location.origin
      })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <HeartIcon className="w-6 h-6 text-pink-500" />
            <h1 className="text-2xl font-bold text-gray-800">Seus Resultados</h1>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Olá, {results.name}!
            </h2>
            <p className="text-gray-600">
              Aqui está sua análise completa de saúde emocional
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`${config.bg} border-2 ${config.border} rounded-3xl p-8 mb-8`}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Icon className={`w-10 h-10 ${config.text}`} />
              <h3 className={`text-2xl md:text-3xl font-bold ${config.text}`}>
                {config.title}
              </h3>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-2">
                <span className={`text-5xl md:text-6xl font-bold ${config.text}`}>
                  {Math.round(results.percentage)}
                </span>
                <span className={`text-2xl ${config.text}`}>%</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Pontuação Total: {results.totalScore} de {results.maxScore} pontos
              </p>
            </div>

            {/* Individual Test Scores */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Teste 1: Pai</p>
                <p className="text-2xl font-bold text-gray-900">{results.test1Score}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Teste 2: Mãe</p>
                <p className="text-2xl font-bold text-gray-900">{results.test2Score}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Teste 3: Sexualidade</p>
                <p className="text-2xl font-bold text-gray-900">{results.test3Score}</p>
              </div>
            </div>
          </motion.div>

          {/* Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-3xl p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sua Análise Personalizada
            </h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {results.analysis}
              </p>
            </div>
          </motion.div>

          {/* CTA Section */}
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 text-white text-center mb-8"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Quer aprofundar seu autoconhecimento?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Agende uma sessão de acompanhamento para trabalhar os padrões identificados nesta avaliação e transformar sua saúde emocional.
              </p>
              <button
                onClick={() => {
                  // Aqui você pode adicionar um link para agendamento ou WhatsApp
                  window.open('https://wa.me/5511999999999?text=Olá, gostaria de agendar uma sessão de acompanhamento', '_blank')
                }}
                className="bg-white text-pink-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 inline-flex items-center gap-2"
              >
                <HeartIcon className="w-5 h-5" />
                Agendar Sessão
              </button>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:text-pink-600 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              Voltar ao Início
            </button>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
            >
              <Share2Icon className="w-5 h-5" />
              Compartilhar
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 Saúde Emocional. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
