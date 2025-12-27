'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HeartIcon, CheckCircleIcon, XIcon, ClockIcon } from '@/components/icons'
import AdminLayout from '@/components/AdminLayout'

interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  started_quiz: boolean
  completed_quiz: boolean
  viewed_checkout: boolean
  utm_source?: string
  utm_campaign?: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'started' | 'completed'>('all')

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads')
      const result = await response.json()

      if (result.data) {
        setLeads(result.data)
      }

      setIsLoading(false)
    } catch (error) {
      console.error('Error loading leads:', error)
      setIsLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead => {
    // Filtro de busca
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro de status
    if (filter === 'started') return matchesSearch && lead.started_quiz
    if (filter === 'completed') return matchesSearch && lead.completed_quiz

    return matchesSearch
  })

  const exportCSV = () => {
    const headers = ['Nome', 'Email', 'Data', 'Iniciou Quiz', 'Completou Quiz', 'Viu Checkout', 'UTM Source', 'UTM Campaign']
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      new Date(lead.created_at).toLocaleString('pt-BR'),
      lead.started_quiz ? 'Sim' : 'Não',
      lead.completed_quiz ? 'Sim' : 'Não',
      lead.viewed_checkout ? 'Sim' : 'Não',
      lead.utm_source || '',
      lead.utm_campaign || ''
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-600">Carregando leads...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
              <p className="text-sm text-gray-500 mt-1">{filteredLeads.length} leads encontrados</p>
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
            {/* Search */}
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

            {/* Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              >
                <option value="all">Todos</option>
                <option value="started">Iniciou Quiz</option>
                <option value="completed">Completou Quiz</option>
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
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    UTM
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(lead.created_at).toLocaleTimeString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {lead.started_quiz ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <XIcon className="w-4 h-4 text-gray-300" />
                          )}
                          <span className="text-xs text-gray-600">Iniciou</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lead.completed_quiz ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <XIcon className="w-4 h-4 text-gray-300" />
                          )}
                          <span className="text-xs text-gray-600">Completou</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lead.viewed_checkout ? (
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <XIcon className="w-4 h-4 text-gray-300" />
                          )}
                          <span className="text-xs text-gray-600">Checkout</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.utm_source && (
                        <div className="text-xs">
                          <div className="text-gray-600">
                            <span className="font-semibold">Source:</span> {lead.utm_source}
                          </div>
                          {lead.utm_campaign && (
                            <div className="text-gray-600">
                              <span className="font-semibold">Campaign:</span> {lead.utm_campaign}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum lead encontrado</p>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  )
}
