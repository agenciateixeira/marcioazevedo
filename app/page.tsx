'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, SparklesIcon, ArrowRightIcon, CheckIcon, ShieldIcon, ClockIcon, ZapIcon, XIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
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

    if (!acceptedTerms) {
      alert('Por favor, aceite os termos de uso e política de privacidade para continuar.')
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
      <header className="w-full py-4 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <HeartIcon className="w-7 h-7 text-pink-500" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Teste Para Mulheres Esgotadas</h1>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full mb-6">
              <SparklesIcon className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-semibold text-pink-700">
                Avaliação Profunda Baseada em Psicanálise
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight px-2 sm:px-4">
              Teste Para Mulheres Esgotadas no Relacionamento
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed px-2">
              <span className="block font-bold text-2xl sm:text-3xl text-pink-600 mb-3">Descubra em 7 Minutos Por Que Você Repete os Mesmos Padrões</span>
              Se você sente que está <span className="font-semibold text-pink-600">emocionalmente esgotada</span>, vivendo ciclos que parecem nunca acabar, e seu relacionamento está longe do que você sempre sonhou...
              <span className="block mt-3 font-semibold">A resposta está na sua história.</span>
            </p>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white" />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">+2.847 mulheres</span> já descobriram seus padrões
              </p>
            </div>
          </motion.div>

          {/* Pain Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-50 to-pink-50 rounded-3xl p-8 md:p-10 mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              Você já se pegou pensando...
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Por que sempre me relaciono com o mesmo tipo de pessoa?',
                'Por que sinto que nunca sou suficiente para meu parceiro?',
                'Por que tenho tanto medo de ser abandonada?',
                'Por que repito os erros do relacionamento dos meus pais?',
                'Por que não consigo expressar minhas necessidades?',
                'Por que me sinto culpada por querer ser feliz?'
              ].map((pain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm"
                >
                  <XIcon className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 leading-relaxed">{pain}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-gray-700 mt-8 text-lg font-medium">
              Se você respondeu <span className="text-pink-600 font-bold">SIM</span> para pelo menos uma dessas perguntas...
              <span className="block mt-2 text-xl font-bold text-gray-900">Você está no lugar certo.</span>
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Descubra os padrões ocultos que controlam seus relacionamentos
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Uma avaliação completa baseada em <span className="font-semibold text-gray-900">Psicanálise Freudiana</span> que revela como sua relação com seus pais e seu desenvolvimento emocional estão impactando seu relacionamento hoje.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white border-2 border-pink-100 rounded-2xl p-6 hover:border-pink-300 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <HeartIcon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Relação Paterna</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Como a figura do seu pai moldou suas expectativas, limites e escolhas amorosas
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white border-2 border-pink-100 rounded-2xl p-6 hover:border-pink-300 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <HeartIcon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Vínculo Materno</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Como sua mãe influenciou sua capacidade de intimidade, dependência e auto-cuidado
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white border-2 border-pink-100 rounded-2xl p-6 hover:border-pink-300 transition-colors"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                  <HeartIcon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Desenvolvimento Sexual</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Como suas fases psicossexuais afetam sua intimidade e prazer no relacionamento
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-8 md:p-10 mb-12 text-white"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              O que você vai descobrir sobre si mesma:
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Por que você atrai sempre o mesmo tipo de parceiro',
                'Quais traumas da infância estão sabotando sua felicidade',
                'Como romper os padrões tóxicos e criar relacionamentos saudáveis',
                'Onde está a origem do seu medo de abandono ou rejeição',
                'Por que você tem dificuldade em estabelecer limites',
                'Como sua sexualidade foi moldada pelas suas experiências'
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-6 h-6 flex-shrink-0 mt-1" />
                  <p className="text-white/95 leading-relaxed font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-gray-50 to-white border-2 border-pink-200 rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Faça sua Avaliação Completa AGORA
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                São apenas <span className="font-bold text-pink-600">10 minutos</span> que podem mudar completamente a forma como você entende seus relacionamentos
              </p>

              {/* Urgency */}
              <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 px-4 py-2 rounded-full">
                <ClockIcon className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">
                  Comece agora e descubra seus padrões
                </span>
              </div>
            </div>

            <form onSubmit={handleStart} className="max-w-md mx-auto">
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Qual é o seu nome?
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu primeiro nome"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-gray-900 text-lg"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Qual é o seu melhor e-mail?
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 transition-colors text-gray-900 text-lg"
                    required
                  />
                </div>
              </div>

              {/* Checkbox LGPD */}
              <div className="mb-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center flex-shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="sr-only peer"
                      required
                    />
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:border-pink-500 peer-checked:bg-pink-500 transition-all group-hover:border-pink-400">
                      {acceptedTerms && (
                        <CheckIcon className="w-full h-full text-white p-1" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 leading-relaxed">
                    Eu li e concordo com os{' '}
                    <a
                      href="/termos"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 font-semibold hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Termos de Uso e Política de Privacidade
                    </a>
                    {' '}e autorizo o tratamento dos meus dados pessoais conforme a LGPD.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !acceptedTerms}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 px-4 sm:px-8 rounded-xl flex items-center justify-center gap-2 sm:gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl text-sm sm:text-base md:text-lg"
              >
                {isSubmitting ? (
                  'Preparando sua avaliação...'
                ) : (
                  <>
                    <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="leading-tight">QUERO INICIAR MEU TESTE AGORA</span>
                    <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  </>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ShieldIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="whitespace-nowrap">100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="whitespace-nowrap">10 minutos</span>
                </div>
              </div>
            </form>

            {/* Guarantee */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 italic">
                Seus dados estão protegidos e serão usados apenas para fornecer sua análise personalizada
              </p>
            </div>
          </motion.div>

          {/* Final Push */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm">
              A mudança que você busca começa com o autoconhecimento.
              <span className="block mt-2 font-semibold text-gray-700">Não deixe para depois.</span>
            </p>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 Saúde Emocional. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
