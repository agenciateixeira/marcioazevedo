'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, ArrowLeftIcon, DownloadIcon, CheckCircleIcon } from '@/components/icons'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface FullResponse {
  id: string
  created_at: string
  name: string
  email: string
  test_1_score: number
  test_2_score: number
  test_3_score: number
  total_score: number
  test_1_responses: Record<number, string>
  test_2_responses: Record<number, string>
  test_3_responses: Record<number, string>
  analysis: string
  health_level: string
  payment_status: string
  payment_amount: number | null
  payment_date: string | null
  result_unlocked: boolean
}

export default function AdminRelatorioPage() {
  const router = useRouter()
  const params = useParams()
  const [response, setResponse] = useState<FullResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated')
    if (isAuth !== 'true') {
      router.push('/admin/login')
      return
    }

    if (params.id) {
      loadResponse(params.id as string)
    }
  }, [router, params.id])

  const loadResponse = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      setResponse(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading response:', error)
      setIsLoading(false)
    }
  }

  const calculatePercentage = (score: number) => {
    // Assumindo que cada teste tem pontuação máxima de ~105 pontos (21 questões x 5 pontos)
    const maxPerTest = 105
    return Math.round((score / maxPerTest) * 100)
  }

  const calculateNota10 = (totalScore: number) => {
    // Total máximo = 315 (3 testes x 105)
    const maxTotal = 315
    return ((totalScore / maxTotal) * 10).toFixed(1)
  }

  const downloadPDF = () => {
    // TODO: Implementar geração de PDF
    alert('Funcionalidade de PDF será implementada em breve')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Carregando anamnese...</p>
        </div>
      </div>
    )
  }

  if (!response) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Anamnese não encontrada</p>
          <Link href="/admin/respostas">
            <button className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg">
              Voltar
            </button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/respostas">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Relatório Completo</h1>
                <p className="text-sm text-gray-500">{response.name}</p>
              </div>
            </div>
            <button
              onClick={downloadPDF}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <DownloadIcon className="w-4 h-4" />
              Baixar PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Dados Gerais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Gerais</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">Nome</label>
              <p className="text-lg text-gray-900">{response.name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">Email</label>
              <p className="text-lg text-gray-900">{response.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">Data do Teste</label>
              <p className="text-lg text-gray-900">
                {new Date(response.created_at).toLocaleString('pt-BR')}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-1">Status Pagamento</label>
              <div className="flex items-center gap-2">
                {response.payment_status === 'approved' && (
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                )}
                <p className="text-lg text-gray-900 capitalize">{response.payment_status}</p>
                {response.payment_amount && (
                  <span className="text-sm text-gray-600 ml-2">
                    (R$ {response.payment_amount.toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nota 0-10 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 mb-6 shadow-lg text-white text-center"
        >
          <h2 className="text-xl font-bold mb-4">Nota Final</h2>
          <div className="text-7xl font-black mb-2">{calculateNota10(response.total_score)}</div>
          <p className="text-xl opacity-90">de 10</p>
        </motion.div>

        {/* Scores por Teste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Pontuação por Área</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Teste 1 - Pai */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="text-3xl mb-2">👨</div>
              <h3 className="font-bold text-gray-900 mb-1">Relação Paterna</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">{response.test_1_score}</div>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(response.test_1_score)}%` }}
                />
              </div>
              <p className="text-sm text-purple-700">{calculatePercentage(response.test_1_score)}%</p>
            </div>

            {/* Teste 2 - Mãe */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
              <div className="text-3xl mb-2">👩</div>
              <h3 className="font-bold text-gray-900 mb-1">Relação Materna</h3>
              <div className="text-4xl font-bold text-pink-600 mb-2">{response.test_2_score}</div>
              <div className="w-full bg-pink-200 rounded-full h-2 mb-2">
                <div
                  className="bg-pink-600 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(response.test_2_score)}%` }}
                />
              </div>
              <p className="text-sm text-pink-700">{calculatePercentage(response.test_2_score)}%</p>
            </div>

            {/* Teste 3 - Sexualidade */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="text-3xl mb-2">💕</div>
              <h3 className="font-bold text-gray-900 mb-1">Sexualidade</h3>
              <div className="text-4xl font-bold text-red-600 mb-2">{response.test_3_score}</div>
              <div className="w-full bg-red-200 rounded-full h-2 mb-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(response.test_3_score)}%` }}
                />
              </div>
              <p className="text-sm text-red-700">{calculatePercentage(response.test_3_score)}%</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Pontuação Total</span>
              <span className="text-3xl font-bold text-gray-900">{response.total_score}</span>
            </div>
          </div>
        </motion.div>

        {/* Análise Completa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Análise Preditiva</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {response.analysis}
            </p>
          </div>
        </motion.div>

        {/* Respostas Detalhadas - Teste 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            👨 Respostas - Relação Paterna
          </h2>
          <div className="space-y-4">
            {Object.entries(response.test_1_responses).map(([questionId, answer]) => (
              <div key={questionId} className="border-l-4 border-purple-500 pl-4 py-2">
                <p className="text-sm font-semibold text-gray-600">Questão {questionId}</p>
                <p className="text-gray-900">{answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Respostas Detalhadas - Teste 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            👩 Respostas - Relação Materna
          </h2>
          <div className="space-y-4">
            {Object.entries(response.test_2_responses).map(([questionId, answer]) => (
              <div key={questionId} className="border-l-4 border-pink-500 pl-4 py-2">
                <p className="text-sm font-semibold text-gray-600">Questão {questionId}</p>
                <p className="text-gray-900">{answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Respostas Detalhadas - Teste 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 mb-6 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            💕 Respostas - Sexualidade
          </h2>
          <div className="space-y-4">
            {Object.entries(response.test_3_responses).map(([questionId, answer]) => (
              <div key={questionId} className="border-l-4 border-red-500 pl-4 py-2">
                <p className="text-sm font-semibold text-gray-600">Questão {questionId}</p>
                <p className="text-gray-900">{answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
