'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LockIcon, HeartIcon, CheckIcon, XIcon } from '@/components/icons'
import { signUp } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function PrimeiroAcessoPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasPurchases, setHasPurchases] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)

  // Validações de senha
  const passwordChecks = {
    length: password.length >= 8,
    match: password === confirmPassword && password.length > 0,
  }

  const isPasswordValid = passwordChecks.length && passwordChecks.match

  async function checkEmailPurchases() {
    if (!email || !email.includes('@')) return

    setCheckingEmail(true)

    const { data, error } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_email', email)
      .eq('payment_status', 'approved')
      .limit(1)

    setCheckingEmail(false)

    if (data && data.length > 0) {
      setHasPurchases(true)
      setError('')
    } else {
      setHasPurchases(false)
      setError('Este email não possui compras registradas')
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('Preencha todos os campos')
      return
    }

    if (!passwordChecks.length) {
      setError('A senha deve ter pelo menos 8 caracteres')
      return
    }

    if (!passwordChecks.match) {
      setError('As senhas não coincidem')
      return
    }

    if (!hasPurchases) {
      setError('Este email não possui compras registradas')
      return
    }

    setIsLoading(true)

    // Criar conta no Supabase Auth
    const { user, error: signUpError } = await signUp(email, password)

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Este email já possui uma conta. Use a página de login.')
      } else {
        setError('Erro ao criar conta. Tente novamente.')
      }
      setIsLoading(false)
      return
    }

    // Conta criada com sucesso!
    // O trigger do banco vai vincular automaticamente as purchases ao user_id

    // Redirecionar para dashboard
    setTimeout(() => {
      router.push('/area-membros/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <HeartIcon className="w-10 h-10 text-pink-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Bem-vinda!
            </h1>
          </div>
          <p className="text-gray-600">
            Defina sua senha para acessar seus conteúdos
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-8">
          <form onSubmit={handleCreateAccount} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email usado na compra
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={checkEmailPurchases}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                disabled={isLoading}
              />
              {checkingEmail && (
                <p className="text-xs text-gray-500 mt-2">Verificando email...</p>
              )}
              {hasPurchases && !checkingEmail && (
                <div className="flex items-center gap-2 mt-2">
                  <CheckIcon className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-600 font-medium">Email verificado! Você possui compras.</p>
                </div>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Criar senha (mínimo 8 caracteres)
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

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Validações */}
            {password.length > 0 && (
              <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  {passwordChecks.length ? (
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <XIcon className="w-4 h-4 text-red-500" />
                  )}
                  <p className={`text-sm ${passwordChecks.length ? 'text-green-700' : 'text-gray-600'}`}>
                    Mínimo de 8 caracteres
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {passwordChecks.match ? (
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <XIcon className="w-4 h-4 text-red-500" />
                  )}
                  <p className={`text-sm ${passwordChecks.match ? 'text-green-700' : 'text-gray-600'}`}>
                    Senhas coincidem
                  </p>
                </div>
              </div>
            )}

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !hasPurchases}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                'Criando conta...'
              ) : (
                <>
                  <LockIcon className="w-5 h-5" />
                  Criar Minha Conta
                </>
              )}
            </button>
          </form>

          {/* Link para login */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Já possui uma conta?{' '}
              <button
                onClick={() => router.push('/area-membros/login')}
                className="font-bold text-pink-600 hover:text-pink-700 transition-colors"
              >
                Fazer login
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

        {/* Informação */}
        <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center">
          <p className="text-sm text-blue-800">
            💡 Use o mesmo email que você usou na compra
          </p>
        </div>
      </motion.div>
    </div>
  )
}
