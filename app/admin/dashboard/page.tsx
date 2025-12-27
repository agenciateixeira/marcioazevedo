'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { UsersIcon, CheckCircleIcon, ClockIcon, TrendingUpIcon, HeartIcon, DownloadIcon } from '@/components/icons'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'

interface Stats {
  totalLeads: number
  totalResponses: number
  paidResponses: number
  pendingPayments: number
  conversionRate: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    totalResponses: 0,
    paidResponses: 0,
    pendingPayments: 0,
    conversionRate: 0,
    totalRevenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (data.stats) {
        setStats(data.stats)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading stats:', error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Visão geral do sistema</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Leads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-green-600">+12%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalLeads}</h3>
            <p className="text-sm text-gray-600">Total de Leads</p>
          </motion.div>

          {/* Total Respostas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{stats.conversionRate.toFixed(1)}%</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalResponses}</h3>
            <p className="text-sm text-gray-600">Testes Completos</p>
          </motion.div>

          {/* Pagamentos Aprovados */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-600">
                R$ {stats.totalRevenue.toFixed(2)}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.paidResponses}</h3>
            <p className="text-sm text-gray-600">Pagamentos Aprovados</p>
          </motion.div>

          {/* Pendentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-sm font-medium text-amber-600">Aguardando</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingPayments}</h3>
            <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/leads">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            >
              <UsersIcon className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ver Leads</h3>
              <p className="text-blue-100 text-sm">
                Visualizar todos os leads capturados (nome + email)
              </p>
            </motion.div>
          </Link>

          <Link href="/admin/respostas">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
            >
              <HeartIcon className="w-10 h-10 text-white mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ver Anamneses</h3>
              <p className="text-purple-100 text-sm">
                Visualizar todas as respostas completas dos testes
              </p>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105"
          >
            <DownloadIcon className="w-10 h-10 text-white mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Exportar Dados</h3>
            <p className="text-green-100 text-sm">
              Baixar relatório completo em CSV
            </p>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Receita Total</h2>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUpIcon className="w-5 h-5" />
              <span className="font-semibold">+{stats.paidResponses} vendas</span>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="text-5xl font-black text-gray-900 mb-2">
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-gray-600">
              Ticket médio: R$ {stats.paidResponses > 0 ? (stats.totalRevenue / stats.paidResponses).toFixed(2) : '0.00'}
            </p>
          </div>
        </motion.div>
      </main>
    </AdminLayout>
  )
}
