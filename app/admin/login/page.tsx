'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LockIcon, ArrowRightIcon, AlertCircleIcon } from '@/components/icons'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Chamar API segura de login
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Email ou senha incorretos')
        setIsLoading(false)
        return
      }

      // Login bem-sucedido - salvar sessão
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_email', data.user.email)
      localStorage.setItem('admin_user_id', data.user.id)
      localStorage.setItem('admin_full_name', data.user.fullName)
      localStorage.setItem('admin_role', data.user.role)

      // Redirecionar para dashboard
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setError('Erro ao conectar com o servidor. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
            <LockIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Área Administrativa
          </h1>
          <p className="text-gray-400">
            Acesso restrito para administradores
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 text-white transition-colors"
                required
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-pink-500 text-white transition-colors"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                'Entrando...'
              ) : (
                <>
                  <LockIcon className="w-5 h-5" />
                  Entrar no Sistema
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2026 Sistema Administrativo
          </p>
        </div>
      </motion.div>
    </div>
  )
}
