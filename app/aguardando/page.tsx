'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, ClockIcon, CheckCircleIcon, SparklesIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AguardandoPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [checking, setChecking] = useState(true)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const name = localStorage.getItem('userName')
    const email = localStorage.getItem('userEmail')

    if (!name || !email) {
      router.push('/')
      return
    }

    setUserName(name)
    setUserEmail(email)

    // Animação dos pontos
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    // Polling para verificar se pagamento foi aprovado
    const checkPayment = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('responses')
          .select('payment_status, result_unlocked')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (data && data.payment_status === 'approved' && data.result_unlocked) {
          clearInterval(checkPayment)
          clearInterval(dotsInterval)

          // Salvar que está liberado
          localStorage.setItem('payment_approved', 'true')

          // Redirecionar para resultado
          router.push('/resultado')
        }
      } catch (error) {
        console.error('Error checking payment:', error)
      }
    }, 3000) // Verifica a cada 3 segundos

    return () => {
      clearInterval(checkPayment)
      clearInterval(dotsInterval)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-2 border-blue-200 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
        >
          {/* Ícone Animado */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <ClockIcon className="w-20 h-20 text-blue-500" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Processando Seu Pagamento{dots}
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {userName}, estamos verificando seu pagamento
          </p>

          {/* Status Steps */}
          <div className="space-y-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Teste Completo</p>
                <p className="text-sm text-gray-600">Suas respostas foram salvas</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ClockIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              </motion.div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Aguardando Confirmação</p>
                <p className="text-sm text-gray-600">Processando pagamento...</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-4 opacity-50">
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-gray-700">Resultado Desbloqueado</p>
                <p className="text-sm text-gray-500">Em breve...</p>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6 mb-6">
            <SparklesIcon className="w-10 h-10 text-pink-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">
              Seu resultado está quase pronto!
            </h3>
            <p className="text-sm text-gray-700">
              Assim que confirmarmos seu pagamento, você terá acesso imediato à sua análise completa com nota 0-10, padrões identificados e plano de ação personalizado.
            </p>
          </div>

          {/* Tempo estimado */}
          <div className="text-sm text-gray-500">
            <p className="mb-2">⏱️ <strong>Pagamento via Cartão:</strong> aprovação instantânea (segundos)</p>
            <p>⏱️ <strong>Pagamento via PIX:</strong> até 2 minutos após confirmação</p>
          </div>

          {/* Email de confirmação */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              📧 Enviamos um email de confirmação para: <strong className="text-gray-900">{userEmail}</strong>
            </p>
          </div>
        </motion.div>

        {/* Dúvidas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>
            Problemas com o pagamento?{' '}
            <a href="mailto:suporte@example.com" className="text-pink-600 font-semibold hover:underline">
              Entre em contato
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
