'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookIcon, PlayIcon, HeadphonesIcon, CheckIcon, XIcon, AlertCircleIcon, DownloadIcon } from '@/components/icons'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  price: number
  content_type: 'pdf' | 'video' | 'link' | 'session'
  content_url: string | null
  thumbnail_url: string | null
  is_active: boolean
  created_at: string
}

interface ProductForm {
  slug: string
  name: string
  description: string
  price: string
  content_type: 'pdf' | 'video' | 'link' | 'session'
  content_url: string
  thumbnail_url: string
  is_active: boolean
}

export default function ProdutosAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [form, setForm] = useState<ProductForm>({
    slug: '',
    name: '',
    description: '',
    price: '',
    content_type: 'pdf',
    content_url: '',
    thumbnail_url: '',
    is_active: true
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setProducts(data || [])
      setIsLoading(false)
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
      setErrorMessage('Erro ao carregar produtos')
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'content' | 'thumbnail') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (type === 'content' && form.content_type === 'pdf' && file.type !== 'application/pdf') {
      setErrorMessage('Por favor, selecione um arquivo PDF')
      return
    }

    if (type === 'thumbnail' && !file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione uma imagem')
      return
    }

    // Validar tamanho do arquivo (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB em bytes
    if (file.size > maxSize) {
      setErrorMessage(`Arquivo muito grande! Máximo: 50MB. Tamanho atual: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    setIsUploading(true)
    setErrorMessage('')
    console.log(`📤 Iniciando upload de ${type}:`, file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`)

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = type === 'content' ? `products/${fileName}` : `thumbnails/${fileName}`

      console.log(`📁 Caminho do arquivo: ${filePath}`)

      // Upload para Supabase Storage
      const { data, error } = await supabase.storage
        .from('content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Erro no upload do Supabase:', error)

        // Mensagens de erro mais específicas
        if (error.message.includes('not found')) {
          throw new Error('Bucket "content" não encontrado! Você precisa criar o bucket no Supabase Storage primeiro.')
        }
        if (error.message.includes('policies')) {
          throw new Error('Erro de permissão! Verifique as políticas de acesso do bucket no Supabase.')
        }
        throw error
      }

      console.log('✅ Upload realizado:', data)

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath)

      console.log('🔗 URL pública:', publicUrl)

      // Atualizar formulário com a URL
      if (type === 'content') {
        setForm(prev => ({ ...prev, content_url: publicUrl }))
        setSuccessMessage('✅ Arquivo enviado com sucesso! Não esqueça de SALVAR o produto.')
      } else {
        setForm(prev => ({ ...prev, thumbnail_url: publicUrl }))
        setSuccessMessage('✅ Thumbnail enviado com sucesso! Não esqueça de SALVAR o produto.')
      }

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      console.error('❌ Erro completo no upload:', error)
      setErrorMessage(error.message || 'Erro ao fazer upload do arquivo. Verifique o console para mais detalhes.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    // Validações
    if (!form.slug || !form.name || !form.price) {
      setErrorMessage('Preencha todos os campos obrigatórios')
      setIsSaving(false)
      return
    }

    try {
      const productData = {
        slug: form.slug,
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        content_type: form.content_type,
        content_url: form.content_url || null,
        thumbnail_url: form.thumbnail_url || null,
        is_active: form.is_active
      }

      if (editingProduct) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error

        setSuccessMessage('Produto atualizado com sucesso!')
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error

        setSuccessMessage('Produto criado com sucesso!')
      }

      // Resetar formulário
      resetForm()
      loadProducts()

      setTimeout(() => {
        setShowForm(false)
        setSuccessMessage('')
      }, 2000)
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      setErrorMessage(error.message || 'Erro ao salvar produto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      slug: product.slug,
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      content_type: product.content_type,
      content_url: product.content_url || '',
      thumbnail_url: product.thumbnail_url || '',
      is_active: product.is_active
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSuccessMessage('Produto excluído com sucesso!')
      loadProducts()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao excluir produto')
    }
  }

  const resetForm = () => {
    setForm({
      slug: '',
      name: '',
      description: '',
      price: '',
      content_type: 'pdf',
      content_url: '',
      thumbnail_url: '',
      is_active: true
    })
    setEditingProduct(null)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <BookIcon className="w-5 h-5" />
      case 'video':
      case 'link': return <PlayIcon className="w-5 h-5" />
      case 'session': return <HeadphonesIcon className="w-5 h-5" />
      default: return <BookIcon className="w-5 h-5" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf': return 'PDF'
      case 'video': return 'Vídeo'
      case 'link': return 'Link'
      case 'session': return 'Sessão'
      default: return type
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-600">Carregando produtos...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie os conteúdos disponíveis na área de membros</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
            >
              + Novo Produto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
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

        {/* Formulário */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug * <span className="text-gray-500 font-normal">(ex: ebook-completo)</span>
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="ebook-completo"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="E-book Completo"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Preço */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="97.00"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Tipo de Conteúdo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Conteúdo *
                  </label>
                  <select
                    value={form.content_type}
                    onChange={(e) => setForm({ ...form, content_type: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-900"
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Vídeo (YouTube)</option>
                    <option value="link">Link Externo</option>
                    <option value="session">Sessão/Mentoria</option>
                  </select>
                </div>
              </div>

              {/* Upload de Arquivo (PDF) */}
              {form.content_type === 'pdf' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload de Arquivo PDF
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, 'content')}
                      disabled={isUploading}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 outline-none transition-all"
                    />
                    {form.content_url && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckIcon className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-800 font-medium">Arquivo carregado</span>
                        </div>
                        <a
                          href={form.content_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-600 hover:text-pink-700 text-sm font-medium flex items-center gap-1"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          Visualizar
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* URL Manual (para vídeo/link) */}
              {(form.content_type === 'video' || form.content_type === 'link' || form.content_type === 'session') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL do Conteúdo
                    {form.content_type === 'video' && <span className="text-gray-500 font-normal"> (Link do YouTube)</span>}
                  </label>
                  <input
                    type="url"
                    value={form.content_url}
                    onChange={(e) => setForm({ ...form, content_url: e.target.value })}
                    placeholder={form.content_type === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              )}

              {/* Upload de Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail (Opcional)
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'thumbnail')}
                    disabled={isUploading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 outline-none transition-all"
                  />
                  {form.thumbnail_url && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
                      <img
                        src={form.thumbnail_url}
                        alt="Thumbnail preview"
                        className="h-32 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                  Produto Ativo (visível para usuários)
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Salvando...' : editingProduct ? 'Atualizar Produto' : 'Criar Produto'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Lista de Produtos */}
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-12 text-center">
              <BookIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Nenhum produto cadastrado
              </h3>
              <p className="text-gray-600">
                Clique em "Novo Produto" para adicionar o primeiro conteúdo
              </p>
            </div>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:border-pink-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${product.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {getContentTypeIcon(product.content_type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">Slug: {product.slug}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                        {getContentTypeLabel(product.content_type)}
                      </span>
                    </div>
                    {product.description && (
                      <p className="text-gray-600 mb-3">{product.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-pink-600">R$ {product.price.toFixed(2)}</span>
                      {product.content_url && (
                        <a
                          href={product.content_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          Ver Conteúdo
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </AdminLayout>
  )
}
