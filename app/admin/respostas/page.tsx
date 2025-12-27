'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckCircleIcon, AlertCircleIcon, ClockIcon, EyeIcon } from '@/components/icons'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

interface Response {
  id: string
  created_at: string
  name: string
  email: string
  test_1_score: number
  test_2_score: number
  test_3_score: number
  total_score: number
  health_level: string
  payment_status: string
  payment_amount: number | null
  result_unlocked: boolean
}

export default function AdminRespostasPage() {
  const [responses, setResponses] = useState<Response[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all')

  useEffect(() => {
    loadResponses()
  }, [])

  const loadResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('responses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setResponses(data || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading responses:', error)
      setIsLoading(false)
    }
  }

  const filteredResponses = responses.filter(response => {
    const matchesSearch = response.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === 'approved') return matchesSearch && response.payment_status === 'approved'
    if (statusFilter === 'pending') return matchesSearch && response.payment_status === 'pending'

    return matchesSearch
  })

  const getHealthLevelBadge = (level: string) => {
    const config = {
      critical: { bg: 'bg-red-100', text: 'text-red-700', label: 'Crítico' },
      moderate: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Moderado' },
      good: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Bom' },
      excellent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Excelente' }
    }

    const badge = config[level as keyof typeof config] || config.moderate

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const config = {
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Pago', icon: CheckCircleIcon },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pendente', icon: ClockIcon },
      refused: { bg: 'bg-red-100', text: 'text-red-700', label: 'Recusado', icon: AlertCircleIcon },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Reembolsado', icon: AlertCircleIcon },
      chargeback: { bg: 'bg-red-100', text: 'text-red-700', label: 'Chargeback', icon: AlertCircleIcon }
    }

    const badge = config[status as keyof typeof config] || config.pending
    const Icon = badge.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    )
  }

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Data', 'Score Total', 'Score Pai', 'Score Mãe', 'Score Sexualidade', 'Nível de Saúde', 'Status Pagamento', 'Valor Pago']
    const rows = filteredResponses.map(r => [
      r.name,
      r.email,
      new Date(r.created_at).toLocaleString('pt-BR'),
      r.total_score,
      r.test_1_score,
      r.test_2_score,
      r.test_3_score,
      r.health_level,
      r.payment_status,
      r.payment_amount || '0'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `anamneses-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-600">Carregando anamneses...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Anamneses</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredResponses.length} testes completos</p>
            </div>
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por pagamento
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="all">Todos</option>
                <option value="approved">Pagos</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pessoa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Scores
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nível
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResponses.map((response, index) => (
                  <motion.tr
                    key={response.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{response.name}</div>
                      <div className="text-sm text-gray-500">{response.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(response.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(response.created_at).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">
                          <span className="font-semibold">Total:</span> {response.total_score}
                        </div>
                        <div className="text-xs text-gray-500">
                          Pai: {response.test_1_score} | Mãe: {response.test_2_score} | Sex: {response.test_3_score}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getHealthLevelBadge(response.health_level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getPaymentStatusBadge(response.payment_status)}
                        {response.payment_amount && (
                          <div className="text-xs text-gray-600 font-semibold">
                            R$ {response.payment_amount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/admin/relatorio/${response.id}`}>
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors">
                          <EyeIcon className="w-4 h-4" />
                          Ver Completo
                        </button>
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResponses.length === 0 && (
            <div className="text-center py-12">
              <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma anamnese encontrada</p>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}
