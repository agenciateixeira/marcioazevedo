'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      alert('Por favor, preencha seu nome e email para continuar.')
      return
    }

    if (!email.includes('@')) {
      alert('Por favor, insira um email válido.')
      return
    }

    setIsSubmitting(true)

    // Salvar dados no localStorage para usar depois
    localStorage.setItem('userName', name)
    localStorage.setItem('userEmail', email)

    // Redirecionar para o quiz
    router.push('/quiz')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
            <h1 className="text-2xl font-bold text-gray-800">Saúde Emocional</h1>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-700">
                Avaliação Completa de Saúde Emocional
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Descubra como sua história está afetando seu relacionamento
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Uma jornada profunda de autoconhecimento baseada em psicanálise freudiana para entender os padrões que podem estar esgotando você emocionalmente.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-2xl"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💖</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teste 1: Relação com o Pai</h3>
                <p className="text-sm text-gray-600">
                  21 perguntas sobre como a figura paterna influencia seus relacionamentos atuais
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 p-6 rounded-2xl"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💖</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teste 2: Relação com a Mãe</h3>
                <p className="text-sm text-gray-600">
                  21 perguntas sobre a formação emocional primária e vínculos afetivos
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 p-6 rounded-2xl"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">💖</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Teste 3: Sexualidade</h3>
                <p className="text-sm text-gray-600">
                  21 perguntas sobre desenvolvimento sexual e intimidade emocional
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleStart}
            className="bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Comece sua jornada de autoconhecimento
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Seu nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como você gostaria de ser chamada?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-gray-900"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Seu melhor email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-gray-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                'Preparando...'
              ) : (
                <>
                  Iniciar Avaliação
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Seus dados estão seguros e serão usados apenas para enviar seus resultados
            </p>
          </motion.form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2024 Saúde Emocional. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
