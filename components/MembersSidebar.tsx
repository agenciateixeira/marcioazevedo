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
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-xl shadow-lg border-2 border-gray-100"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop ? 0 : (isMobileMenuOpen ? 0 : '-100%'),
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-pink-500 to-purple-600 text-white z-50 flex flex-col shadow-2xl"
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Logo/Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <HeartIcon className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold">Área de Membros</h1>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">
                {userName || 'Membro'}
              </p>
              <p className="text-xs opacity-75 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => {
                    router.push(item.path)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${
                      isActive(item.path)
                        ? 'bg-white text-pink-600 shadow-lg font-semibold'
                        : 'hover:bg-white/10 text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-white"
          >
            <LogoutIcon className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <p className="text-xs opacity-75">
            © 2026 Todos os direitos reservados
          </p>
        </div>
      </motion.aside>
    </>
  )
}
