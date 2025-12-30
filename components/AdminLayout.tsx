'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated')
    const email = localStorage.getItem('admin_email')

    if (isAuth !== 'true') {
      router.push('/admin/login')
      return
    }

    setAdminEmail(email || '')
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar adminEmail={adminEmail} />
      <div className="flex-1 overflow-x-hidden w-full lg:w-auto">
        <div className="pt-16 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}
