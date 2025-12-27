'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HeartIcon, UsersIcon, ClockIcon, DownloadIcon, HomeIcon, ArrowLeftIcon } from './icons'
import { motion } from 'framer-motion'

interface AdminSidebarProps {
  adminEmail?: string
}

export default function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

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
    }
  ]

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/')

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">Admin Panel</h1>
          </div>
        </div>
        {adminEmail && (
          <p className="text-xs text-gray-500 truncate mt-1">{adminEmail}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${active
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${active ? 'text-white' : 'text-gray-900'}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs truncate ${active ? 'text-pink-100' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-2 w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link href="/">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeftIcon className="w-4 h-4" />
            Ver Site
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-colors shadow-sm"
        >
          Sair do Sistema
        </button>

        <p className="text-xs text-center text-gray-400 mt-2">
          © 2026 Sistema Admin
        </p>
      </div>
    </div>
  )
}
