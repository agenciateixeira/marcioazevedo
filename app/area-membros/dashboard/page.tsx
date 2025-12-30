'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HeartIcon, CheckIcon, LockIcon, PlayIcon, BookIcon, HeadphonesIcon } from '@/components/icons'
import { getCurrentUser, getUserPurchases } from '@/lib/auth'
import MembersSidebar from '@/components/MembersSidebar'

interface Product {
  id: string
  slug: string
  name: string
  description: string
  content_type: 'pdf' | 'video' | 'link' | 'session'
  content_url: string | null
  thumbnail_url: string | null
}

interface Purchase {
  id: string
  created_at: string
  amount_paid: number
  payment_status: string
  product: Product
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  async function checkAuthAndLoadData() {
    const { user: currentUser, error } = await getCurrentUser()

    if (error || !currentUser) {
      router.push('/area-membros/login')
      return
    }

    setUser(currentUser)

    // Carregar purchases do usuário
    const { purchases: userPurchases, error: purchasesError } = await getUserPurchases(currentUser.email!)

    if (!purchasesError && userPurchases) {
      setPurchases(userPurchases)
    }

    setIsLoading(false)
  }

  function getProductIcon(contentType: string) {
    switch (contentType) {
      case 'pdf':
        return <BookIcon className="w-6 h-6" />
      case 'video':
      case 'link':
        return <PlayIcon className="w-6 h-6" />
      case 'session':
        return <HeadphonesIcon className="w-6 h-6" />
      default:
        return <BookIcon className="w-6 h-6" />
    }
  }

  function getProductTypeLabel(contentType: string) {
    switch (contentType) {
      case 'pdf':
        return 'E-book PDF'
      case 'video':
      case 'link':
        return 'Vídeo Aula'
      case 'session':
        return 'Mentoria'
      default:
        return 'Conteúdo'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Sidebar */}
      <MembersSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 md:py-12 lg:ml-0 ml-16">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Bem-vinda de volta! 💖
          </h2>
          <p className="text-gray-600">
            Acesse seus conteúdos e continue sua jornada de transformação
          </p>
        </motion.div>

        {/* Products Grid */}
        {purchases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-gray-100 p-8 text-center"
          >
            <LockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhum produto ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Você ainda não possui nenhum produto. Explore nossas ofertas!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Explorar Produtos
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase, index) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all"
              >
                {/* Thumbnail */}
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 h-48 flex items-center justify-center">
                  {purchase.product.thumbnail_url ? (
                    <img
                      src={purchase.product.thumbnail_url}
                      alt={purchase.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white">
                      {getProductIcon(purchase.product.content_type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {getProductIcon(purchase.product.content_type)}
                    {getProductTypeLabel(purchase.product.content_type)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {purchase.product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {purchase.product.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">Progresso</span>
                      <span className="text-xs font-semibold text-pink-600">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => router.push(`/area-membros/produto/${purchase.product.slug}`)}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    {purchase.product.content_url ? (
                      <>
                        Acessar Conteúdo
                        <PlayIcon className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Em Breve
                        <LockIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Purchase Date */}
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Adquirido em {new Date(purchase.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        {purchases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
              <p className="text-3xl font-bold text-pink-600 mb-1">{purchases.length}</p>
              <p className="text-sm text-gray-600">Produtos</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
              <p className="text-3xl font-bold text-purple-600 mb-1">0%</p>
              <p className="text-sm text-gray-600">Concluído</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
              <p className="text-3xl font-bold text-green-600 mb-1">0</p>
              <p className="text-sm text-gray-600">Horas Assistidas</p>
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 text-center">
              <p className="text-3xl font-bold text-blue-600 mb-1">Hoje</p>
              <p className="text-sm text-gray-600">Último Acesso</p>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  )
}
