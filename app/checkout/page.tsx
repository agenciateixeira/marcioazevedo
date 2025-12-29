'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckIcon, LockIcon, ShieldIcon, ClockIcon, SparklesIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'
import StripePaymentForm from '@/components/StripePaymentForm'

export default function CheckoutPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userScore, setUserScore] = useState(0)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem('userName')
    const email = localStorage.getItem('userEmail')
    const results = localStorage.getItem('testResults')

    if (!name || !email || !results) {
      router.push('/')
      return
    }

    const parsedResults = JSON.parse(results)
    setUserName(name)
    setUserEmail(email)
    setUserScore(Math.round((parsedResults.percentage / 100) * 10 * 10) / 10)
  }, [router])

  const handlePaymentSuccess = () => {
    // Salvar status de pagamento
    localStorage.setItem('payment_status', 'approved')

    // Redirecionar para oferta 1
    setTimeout(() => {
      router.push('/oferta-1')
    }, 1500)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
  }

  if (!userName) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-pink-100 border-2 border-pink-300 px-4 py-2 rounded-full mb-4">
            <LockIcon className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-bold text-pink-800">ÁREA SEGURA</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Parabéns, {userName}! 🎉
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-3">
            Você completou sua avaliação emocional
          </p>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full">
            <SparklesIcon className="w-5 h-5" />
            <span className="font-bold">Sua nota: {userScore}/10</span>
          </div>
        </motion.div>

        {/* Preview do que está bloqueado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-gray-200 rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden"
        >
          {/* Blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm bg-white/80 z-10 flex items-center justify-center">
            <div className="text-center p-6">
              <LockIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Conteúdo Bloqueado
              </h3>
              <p className="text-gray-600">
                Libere acesso ao seu resultado completo
              </p>
            </div>
          </div>

          {/* Preview borrado */}
          <div className="blur-sm select-none pointer-events-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sua Análise Preditiva Personalizada
            </h2>
            <p className="text-gray-700 mb-4">
              {userName}, sua nota {userScore} revela padrões específicos que estão moldando seus relacionamentos hoje. Com base nas suas respostas nas 3 esferas avaliadas...
            </p>
            <div className="space-y-3">
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-gray-700">🎯 Padrão identificado: xxxxxxxxxxxxxxxxx</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-gray-700">💡 Área crítica: xxxxxxxxxxxxxxxxx</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-gray-700">📋 Próximos passos: xxxxxxxxxxxxxxxxx</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Valor e Benefícios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 md:p-10 text-white mb-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Desbloqueie Seu Resultado Completo
            </h2>
            <p className="text-lg opacity-95 mb-6">
              Investimento único de apenas:
            </p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-2xl">R$</span>
              <span className="text-7xl md:text-8xl font-black">7</span>
              <span className="text-2xl">,00</span>
            </div>
            <p className="text-sm opacity-90">
              Menos que um café, para entender os padrões que te aprisionam
            </p>
          </div>

          {/* O que está incluído */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-center">✨ O que você vai receber:</h3>
            <div className="space-y-3">
              {[
                'Sua nota de 0 a 10 com análise visual completa',
                'Algoritmo preditivo que identifica seus padrões específicos',
                'Análise cruzada das 3 esferas (Pai, Mãe, Sexualidade)',
                'Identificação da sua área mais crítica',
                'Plano de ação personalizado com próximos passos',
                'Relatório completo para salvar e consultar sempre',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Garantia */}
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <ShieldIcon className="w-12 h-12 mx-auto mb-3" />
            <h4 className="font-bold text-lg mb-2">Garantia de 7 Dias</h4>
            <p className="opacity-90 text-sm">
              Se você não achar que valeu cada centavo, devolvemos 100% do seu dinheiro
            </p>
          </div>
        </motion.div>

        {/* Formulário de Pagamento */}
        {!showPaymentForm ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setShowPaymentForm(true)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-2xl text-lg md:text-xl mb-4"
            >
              <LockIcon className="w-6 h-6" />
              DESBLOQUEAR MEU RESULTADO AGORA
              <SparklesIcon className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldIcon className="w-4 h-4 text-green-600" />
                <span>Pagamento 100% Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-blue-600" />
                <span>Acesso Imediato</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StripePaymentForm
              amount={7}
              email={userEmail}
              name={userName}
              productType="resultado"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </motion.div>
        )}

        {/* Prova Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            +2.847 mulheres já desbloquearam seus resultados
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <p className="font-bold text-green-900">4.9/5</p>
              <p className="text-green-700">Avaliação</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="font-bold text-blue-900">98%</p>
              <p className="text-blue-700">Satisfação</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2">
              <p className="font-bold text-purple-900">100%</p>
              <p className="text-purple-700">Seguro</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
