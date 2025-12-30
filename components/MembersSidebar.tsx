'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartIcon,
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  LogoutIcon,
  XIcon,
  SparklesIcon
} from '@/components/icons'
import { signOut } from '@/lib/auth'

interface MembersSidebarProps {
  user: {
    email: string
    id: string
  }
  userName?: string
}

export default function MembersSidebar({ user, userName }: MembersSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
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

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/area-membros/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Meus Produtos',
      path: '/area-membros/dashboard',
      icon: BookOpenIcon,
    },
    {
      name: 'Meu Resultado',
      path: '/area-membros/meu-resultado',
      icon: SparklesIcon,
    },
    {
      name: 'Meu Perfil',
      path: '/area-membros/perfil',
      icon: UserIcon,
    },
  ]

  async function handleLogout() {
    await signOut()
    router.push('/area-membros/login')
  }

  const isActive = (path: string) => pathname === path

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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Área de Membros</h1>
              <p className="text-xs text-gray-500">Bem-vinda</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {userName || 'Membro'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
                    ${
                      isActive(item.path)
                        ? 'bg-pink-50 text-pink-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? 'text-pink-600' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <LogoutIcon className="w-5 h-5 text-gray-400" />
            <span>Sair</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © 2026 Todos os direitos reservados
          </p>
        </div>
      </motion.aside>
    </>
  )
}
