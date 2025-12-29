'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, UserIcon, LockIcon, HeartIcon, CheckIcon, AlertCircleIcon } from '@/components/icons'
import { getCurrentUser, getUserPurchases, signOut } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Stats
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    loadUserData()
  }, [])

  async function loadUserData() {
    const { user: currentUser, error } = await getCurrentUser()

    if (error || !currentUser) {
      router.push('/area-membros/login')
      return
    }

    setUser(currentUser)

    // Carregar metadata do usuário
    const { data: metadata } = await supabase
      .from('user_metadata')
      .select('*')
      .eq('id', currentUser.id)
      .single()

    if (metadata) {
      setFullName(metadata.full_name || '')
      setPhone(metadata.phone || '')
    }

    // Carregar estatísticas
    const { purchases } = await getUserPurchases(currentUser.email!)

    if (purchases) {
      setTotalProducts(purchases.length)
      setTotalSpent(purchases.reduce((sum, p) => sum + parseFloat(p.amount_paid.toString()), 0))
    }

    setIsLoading(false)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      // Atualizar ou criar metadata
      const { error } = await supabase
        .from('user_metadata')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setSuccessMessage('Perfil atualizado com sucesso!')
    } catch (error) {
      setErrorMessage('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setIsChangingPassword(true)
    setSuccessMessage('')
    setErrorMessage('')

    if (newPassword.length < 8) {
      setErrorMessage('A nova senha deve ter pelo menos 8 caracteres')
      setIsChangingPassword(false)
      return
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('As senhas não coincidem')
      setIsChangingPassword(false)
      return
    }

    try {
      // Atualizar senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccessMessage('Senha alterada com sucesso!')
      setShowPasswordChange(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (error) {
      setErrorMessage('Erro ao alterar senha. Tente novamente.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/area-membros/dashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Voltar ao Dashboard</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações e configurações
          </p>
        </motion.div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <CheckIcon className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            <p className="text-red-800 font-medium">{errorMessage}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
            <p className="text-pink-100 text-sm mb-1">Total Investido</p>
            <p className="text-3xl font-bold">
              R$ {totalSpent.toFixed(2)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-purple-100 text-sm mb-1">Produtos Adquiridos</p>
            <p className="text-3xl font-bold">{totalProducts}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <p className="text-green-100 text-sm mb-1">Membro desde</p>
            <p className="text-xl font-bold">
              {new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-gray-100 p-6 md:p-8 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Informações Pessoais</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </motion.div>

        {/* Password Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border-2 border-gray-100 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <LockIcon className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-bold text-gray-900">Segurança</h2>
          </div>

          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all"
            >
              Alterar Senha
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nova Senha (mínimo 8 caracteres)
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? 'Alterando...' : 'Confirmar Alteração'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordChange(false)
                    setNewPassword('')
                    setConfirmNewPassword('')
                    setErrorMessage('')
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
