'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckIcon, SparklesIcon, BellIcon, ArrowRightIcon, HomeIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function CanalWhatsAppPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('userName')

    if (!name) {
      router.push('/')
      return
    }

    setUserName(name)
  }, [router])

  const handleJoinChannel = () => {
    // TODO: Substituir pelo link real do WhatsApp
    // window.open('https://chat.whatsapp.com/SEU_LINK_AQUI', '_blank')

    // Por enquanto só mostrar alerta
    alert('Link do WhatsApp será adicionado em breve!')
  }

  if (!userName) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <div className="flex-1 px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Parabéns, {userName}!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Você deu o primeiro passo para transformar sua saúde emocional
            </p>
          </motion.div>

          {/* Benefícios já conquistados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-green-200 rounded-3xl p-8 md:p-10 mb-8 shadow-xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              ✅ O que você já conquistou hoje:
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: '🔍',
                  title: 'Autoconhecimento Profundo',
                  desc: 'Você descobriu seus padrões emocionais e sua nota de 0 a 10'
                },
                {
                  icon: '🧠',
                  title: 'Análise Preditiva Personalizada',
                  desc: 'Recebeu insights específicos sobre suas 3 esferas emocionais'
                },
                {
                  icon: '📋',
                  title: 'Plano de Ação Claro',
                  desc: 'Sabe exatamente quais áreas precisam de atenção primeiro'
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5">
                  <div className="text-4xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Canal do WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 md:p-10 text-white mb-8 shadow-2xl"
          >
            <div className="text-center mb-8">
              <BellIcon className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Continue Sua Jornada de Transformação
              </h2>
              <p className="text-lg md:text-xl opacity-95">
                Entre no nosso Canal GRATUITO no WhatsApp
              </p>
            </div>

            {/* O que você vai receber */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8">
              <h3 className="text-xl font-bold mb-5 text-center">📲 O que você vai receber no canal:</h3>
              <div className="space-y-3">
                {[
                  '💎 Conteúdos exclusivos sobre saúde emocional toda semana',
                  '🎯 Dicas práticas para aplicar no seu dia a dia',
                  '🔥 Lives mensais com temas importantes',
                  '💬 Comunidade de apoio com outras mulheres em transformação',
                  '📚 E-books e materiais gratuitos periodicamente',
                  '⚡ Avisos de novas ferramentas e recursos',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <p className="leading-relaxed text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleJoinChannel}
              className="w-full bg-white text-green-600 font-bold py-6 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-xl text-lg md:text-xl flex items-center justify-center gap-3"
            >
              <SparklesIcon className="w-6 h-6" />
              ENTRAR NO CANAL AGORA
              <ArrowRightIcon className="w-6 h-6" />
            </button>

            <p className="text-center text-sm mt-4 opacity-90">
              ✅ 100% Gratuito • Sem Spam • Cancele Quando Quiser
            </p>
          </motion.div>

          {/* Próximos passos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
              <HeartIcon className="w-7 h-7 text-pink-500" />
              Seus Próximos Passos
            </h3>
            <div className="space-y-4">
              {[
                {
                  number: 1,
                  title: 'Releia sua análise personalizada',
                  desc: 'Volte à página de resultado e anote os padrões identificados'
                },
                {
                  number: 2,
                  title: 'Comece pelos pequenos passos',
                  desc: 'Escolha 1 ação do seu plano e coloque em prática esta semana'
                },
                {
                  number: 3,
                  title: 'Entre no canal do WhatsApp',
                  desc: 'Receba suporte contínuo e conteúdos que vão te guiar'
                },
                {
                  number: 4,
                  title: 'Busque ajuda profissional',
                  desc: 'Considere terapia ou mentoria para acelerar sua transformação'
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.number}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Mensagem Final */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-8"
          >
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Lembre-se: a mudança não acontece da noite para o dia, mas <span className="font-bold text-pink-600">começa com uma decisão</span>.
            </p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-4">
              E você já tomou essa decisão hoje. 💖
            </p>
          </motion.div>

          {/* Botão voltar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:text-pink-600 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              Voltar ao Início
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            © 2026 Teste Para Mulheres Esgotadas. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
