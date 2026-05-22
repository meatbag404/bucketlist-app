'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useStore } from '@bucketlist/shared'
import Link from 'next/link'
import { supabase } from '@bucketlist/shared'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { session, profile } = useStore()

  if (!session) {
    router.push('/auth')
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const navItems = [
    { href: '/app', label: '🏠 Buckets', active: pathname === '/app' },
    { href: '/app/friends', label: '👥 Friends', active: pathname === '/app/friends' },
    { href: '/app/activity', label: '📢 Activity', active: pathname === '/app/activity' },
    { href: '/app/profile', label: '👤 Profile', active: pathname === '/app/profile' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">Bucket List</h1>
          <p className="text-sm text-gray-500">{profile?.name}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition ${
                item.active
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}
