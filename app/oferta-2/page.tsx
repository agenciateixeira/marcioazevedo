'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckIcon, XIcon, ArrowRightIcon, BookOpenIcon, AlertCircleIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function Oferta2Page() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const name = localStorage.getItem('userName')
    const upsell1 = localStorage.getItem('upsell1_accepted')

    if (!name) {
      router.push('/')
      return
    }

    // Só mostra essa página se recusou o Upsell 1
    if (upsell1 === 'true') {
      router.push('/oferta-3')
      return
    }

    setUserName(name)
  }, [router])

  const handleAccept = () => {
    setIsLoading(true)
    // TODO: Redirecionar para Kiwify (link será inserido depois)
    // window.location.href = 'LINK_KIWIFY_UPSELL_2'

    // Por enquanto, salvar que aceitou
    localStorage.setItem('upsell2_accepted', 'true')
    setTimeout(() => {
      router.push('/canal-whatsapp')
    }, 1000)
  }

  const handleDecline = () => {
    localStorage.setItem('upsell2_accepted', 'false')
    router.push('/canal-whatsapp')
  }

  if (!userName) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-amber-100 border-2 border-amber-300 px-4 py-2 rounded-full mb-4">
            <AlertCircleIcon className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-800">ESPERA, {userName.toUpperCase()}!</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Eu Entendo...
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Talvez R$ 97 não caiba no seu orçamento agora.
          </p>

          <p className="text-xl md:text-2xl font-bold text-gray-900">
            Mas eu NÃO posso deixar você ir embora sem NENHUMA ferramenta prática.
          </p>
        </motion.div>

        {/* Oferta Especial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-10 text-white mb-8 shadow-2xl"
        >
          <div className="text-center mb-6">
            <BookOpenIcon className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              E-book "Primeiros Passos Para Transformação"
            </h2>
            <p className="text-lg opacity-95">
              Uma versão enxuta, mas PODEROSA, com o essencial para você começar
            </p>
          </div>

          {/* O que está incluído */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h4 className="text-xl font-bold mb-4 text-center">📚 O que você vai receber:</h4>
            <div className="space-y-3">
              {[
                '✅ Workbook Essencial (30 páginas - os exercícios MAIS importantes)',
                '✅ Técnica Principal: Como Quebrar o Ciclo Emocional',
                '✅ 3 Meditações Guiadas de Ancoragem Emocional',
                '✅ Checklist de Autoconsciência Diária',
                '✅ Mapa dos 5 Padrões Mais Comuns',
                '✅ Protocolo de Emergência Emocional',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <p className="leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Diferença */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-bold mb-3">🔍 Diferença para o E-book Completo:</h4>
            <p className="opacity-95 leading-relaxed">
              O e-book completo tem 147 páginas com trabalho profundo nas 3 esferas.
              Este tem 30 páginas com o ESSENCIAL para você dar os primeiros passos importantes.
            </p>
          </div>

          {/* Preço */}
          <div className="text-center border-t-2 border-white/20 pt-8">
            <p className="text-lg opacity-90 mb-2 line-through">Valor normal: R$ 97,00</p>
            <p className="text-lg opacity-90 mb-4">Você paga APENAS:</p>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-2xl">R$</span>
              <span className="text-6xl md:text-7xl font-black">47</span>
              <span className="text-2xl">,00</span>
            </div>
            <p className="text-lg opacity-90">
              O investimento de <span className="font-bold">1 almoço</span> para mudar sua vida
            </p>
          </div>
        </motion.div>

        {/* Por que isso é importante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-6 md:p-8 mb-8"
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 text-center">
            💔 O que acontece se você não fizer nada?
          </h3>
          <div className="space-y-3">
            {[
              'Daqui 6 meses você estará no mesmo lugar',
              'Continuará repetindo os mesmos padrões tóxicos',
              'Seus relacionamentos continuarão te esgotando',
              'A frustração e culpa só vão aumentar',
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <XIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-900 font-bold text-lg mt-6">
            R$ 47 agora pode evitar ANOS de sofrimento.
          </p>
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
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-6 px-8 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-2xl text-lg md:text-xl"
          >
            {isLoading ? (
              'Processando...'
            ) : (
              <>
                <CheckIcon className="w-6 h-6" />
                SIM! QUERO OS PRIMEIROS PASSOS
                <ArrowRightIcon className="w-6 h-6" />
              </>
            )}
          </button>

          {/* Botão Recusar */}
          <button
            onClick={handleDecline}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-4 px-8 rounded-xl transition-all text-sm"
          >
            Não quero transformação. Vou continuar do jeito que está.
          </button>
        </motion.div>

        {/* Escassez */}
        <div className="text-center mt-8">
          <p className="text-sm text-red-600 font-bold">
            ⚠️ Você não verá essa oferta novamente
          </p>
          <p className="text-xs text-gray-500 mt-2 italic">
            Esta é sua última chance de ter suporte prático a um preço acessível
          </p>
        </div>
      </div>
    </div>
  )
}
