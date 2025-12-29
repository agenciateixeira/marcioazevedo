'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LockIcon, HeartIcon, ArrowRightIcon } from '@/components/icons'
import { signIn, getCurrentUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Se já está logado, redirecionar para dashboard
    checkAuth()
  }, [])

  async function checkAuth() {
    const { user } = await getCurrentUser()
    if (user) {
      router.push('/area-membros/dashboard')
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('Preencha todos os campos')
      setIsLoading(false)
      return
    }

    const { user, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError('Email ou senha incorretos')
      setIsLoading(false)
      return
    }

    // Login bem-sucedido
    router.push('/area-membros/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <HeartIcon className="w-10 h-10 text-pink-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Área de Membros
            </h1>
          </div>
          <p className="text-gray-600">
            Acesse seus conteúdos e acompanhe seu progresso
          </p>
        </div>

        {/* Form de Login */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Entrando...'
              ) : (
                <>
                  <LockIcon className="w-5 h-5" />
                  Entrar na Área de Membros
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Link para criar conta */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Primeira vez aqui?{' '}
              <button
                onClick={() => router.push('/area-membros/primeiro-acesso')}
                className="font-bold text-pink-600 hover:text-pink-700 transition-colors"
              >
                Criar senha de acesso
              </button>
            </p>
          </div>

          {/* Link para voltar */}
          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Voltar para o site
            </button>
          </div>
        </div>

        {/* Informação de Segurança */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Seus dados estão protegidos com criptografia de ponta a ponta
          </p>
        </div>
      </motion.div>
    </div>
  )
}
