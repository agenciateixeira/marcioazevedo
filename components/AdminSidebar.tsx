'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartIcon, UsersIcon, HomeIcon, ArrowLeftIcon, BookIcon, XIcon, LogoutIcon } from './icons'

interface AdminSidebarProps {
  adminEmail?: string
}

export default function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024)
    checkScreen()
    window.addEventListener('resize', checkScreen)
    return () => window.removeEventListener('resize', checkScreen)
  }, [])

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_email')
    localStorage.removeItem('admin_user_id')
    localStorage.removeItem('admin_full_name')
    localStorage.removeItem('admin_role')
    router.push('/admin/login')
  }

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: HomeIcon,
      description: 'Visão geral'
    },
    {
      name: 'Leads',
      href: '/admin/leads',
      icon: UsersIcon,
      description: 'Captura de emails'
    },
    {
      name: 'Anamneses',
      href: '/admin/respostas',
      icon: HeartIcon,
      description: 'Testes completos'
    },
    {
      name: 'Produtos',
      href: '/admin/produtos',
      icon: BookIcon,
      description: 'Gerenciar conteúdos'
    }
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay para mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (isMobileMenuOpen ? 0 : '-100%'),
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-50 flex flex-col"
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XIcon className="w-5 h-5 text-gray-600" />
        </button>

        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">Admin Panel</h1>
              <p className="text-xs text-gray-500">Painel de controle</p>
            </div>
          </div>
          {adminEmail && (
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 truncate">{adminEmail}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <div
                      className={`
                        relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${active
                          ? 'bg-pink-50 text-pink-700'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-pink-600' : 'text-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${active ? 'text-pink-700' : 'text-gray-900'}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs truncate ${active ? 'text-pink-600' : 'text-gray-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              Ver Site
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
          >
            <LogoutIcon className="w-4 h-4" />
            Sair
          </button>

          <p className="text-xs text-center text-gray-400 pt-2">
            © 2026 Sistema Admin
          </p>
        </div>
      </motion.aside>
    </>
  )
}
