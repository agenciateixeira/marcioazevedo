'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { DownloadIcon, PlayIcon, BookIcon, HeadphonesIcon, CheckIcon } from '@/components/icons'
import { getCurrentUser, userHasAccess, getUserProgress, updateUserProgress } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import MembersSidebar from '@/components/MembersSidebar'

interface Product {
  id: string
  slug: string
  name: string
  description: string
  content_type: 'pdf' | 'video' | 'link' | 'session'
  content_url: string | null
  thumbnail_url: string | null
  metadata: any
}

export default function ProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [user, setUser] = useState<any>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    loadProductAndCheckAccess()
  }, [slug])

  async function loadProductAndCheckAccess() {
    // Verificar autenticação
    const { user: currentUser, error: userError } = await getCurrentUser()

    if (userError || !currentUser) {
      router.push('/area-membros/login')
      return
    }

    setUser(currentUser)

    // Buscar produto
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (productError || !productData) {
      router.push('/area-membros/dashboard')
      return
    }

    setProduct(productData)

    // Verificar acesso
    const access = await userHasAccess(currentUser.email!, slug)

    if (!access) {
      router.push('/area-membros/dashboard')
      return
    }

    setHasAccess(true)

    // Buscar progresso
    const { progress: userProgress } = await getUserProgress(currentUser.email!, productData.id)

    if (userProgress) {
      setProgress(userProgress.progress_percentage || 0)
    }

    setIsLoading(false)
  }

  async function handleMarkAsComplete() {
    if (!user || !product) return

    await updateUserProgress(user.email!, product.id, 100, true)
    setProgress(100)
  }

  async function handleUpdateProgress(percentage: number) {
    if (!user || !product) return

    await updateUserProgress(user.email!, product.id, percentage, percentage === 100)
    setProgress(percentage)
  }

  function renderContent() {
    if (!product || !product.content_url) {
      return (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
          <BookIcon className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Conteúdo em breve
          </h3>
          <p className="text-gray-600">
            O conteúdo deste produto está sendo preparado e estará disponível em breve.
          </p>
        </div>
      )
    }

    switch (product.content_type) {
      case 'pdf':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            {/* PDF Viewer */}
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookIcon className="w-6 h-6 text-pink-600" />
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-600">Arquivo PDF</p>
                </div>
              </div>
              <a
                href={product.content_url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
              >
                <DownloadIcon className="w-4 h-4" />
                Baixar PDF
              </a>
            </div>

            {/* PDF Embed */}
            <div className="relative" style={{ height: '70vh' }}>
              <iframe
                src={product.content_url}
                className="w-full h-full"
                title={product.name}
              />
            </div>
          </div>
        )

      case 'video':
      case 'link':
        // Extrair ID do vídeo do YouTube
        const getYouTubeEmbedUrl = (url: string) => {
          // Suporta formatos: youtube.com/watch?v=ID ou youtu.be/ID
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
          const match = url.match(regExp)
          const videoId = match && match[2].length === 11 ? match[2] : null
          return videoId ? `https://www.youtube.com/embed/${videoId}` : url
        }

        return (
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
            {/* Video Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <PlayIcon className="w-6 h-6 text-pink-600" />
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-600">Vídeo Aula</p>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
              <iframe
                src={getYouTubeEmbedUrl(product.content_url)}
                className="w-full h-full"
                title={product.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info */}
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        )

      case 'session':
        return (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8">
            <div className="text-center mb-6">
              <HeadphonesIcon className="w-16 h-16 text-pink-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-6">
                {product.description}
              </p>
            </div>

            {product.content_url ? (
              <>
                {/* Se for link do YouTube (audiobook) */}
                {product.content_url.includes('youtube') || product.content_url.includes('youtu.be') ? (
                  <div className="mb-6">
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                      <iframe
                        src={product.content_url.includes('embed')
                          ? product.content_url
                          : product.content_url.replace('watch?v=', 'embed/')
                        }
                        className="w-full h-full"
                        title={product.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  /* Se for outro tipo de conteúdo */
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 text-center">
                    <a
                      href={product.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                    >
                      <PlayIcon className="w-5 h-5" />
                      Acessar Conteúdo
                    </a>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                <p className="text-yellow-800">
                  Conteúdo em preparação. Você será notificada quando estiver disponível.
                </p>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <BookIcon className="w-16 h-16 text-pink-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess || !product) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Sidebar */}
      <MembersSidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 lg:ml-0 ml-16">
          {/* Progress Bar */}
          <div className="mb-6 bg-white rounded-2xl border-2 border-gray-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Seu Progresso</span>
              <span className="text-lg font-bold text-pink-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {renderContent()}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          {/* Progress Buttons */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleUpdateProgress(50)}
              disabled={progress >= 50}
              className="bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Marcar 50%
            </button>
            <button
              onClick={handleMarkAsComplete}
              disabled={progress === 100}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {progress === 100 ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Concluído
                </>
              ) : (
                'Marcar como Concluído'
              )}
            </button>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  )
}
