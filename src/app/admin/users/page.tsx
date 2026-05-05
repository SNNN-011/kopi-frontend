// src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface User {
  _id: string
  nama: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export default function AdminUserDashboard() {
  const pathname = usePathname()
  const router = useRouter()
  
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('kopi-token')
      if (!token) throw new Error('Token otorisasi hilang')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Gagal mengunduh daftar pengguna')
      
      const data = await res.json()
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kesalahan sistem tidak teridentifikasi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('kopi-token')
    if (!token) {
      router.push('/login')
    } else {
      fetchUsers()
    }
  }, [router])

  const handleUpdateRole = async (id: string, newRole: string) => {
    setUpdatingId(id)
    try {
      const token = localStorage.getItem('kopi-token')
      if (!token) throw new Error('Sesi kedaluwarsa')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Gagal memperbarui hak akses')
      }

      showToast('Hak akses berhasil diperbarui', 'ok')
      fetchUsers()
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error pembaruan data', 'err')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-stone-200 pt-16 font-sans">
      
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl
          transition-all duration-300 border
          ${toast.type === 'ok'
            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
            : 'bg-red-950 text-red-300 border-red-700'}`}>
          {toast.msg}
        </div>
      )}

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-16 bottom-0 w-56 bg-[#141210] border-r border-stone-800/60 px-4 py-6 z-40
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8">
          <p className="text-[10px] text-stone-600 uppercase tracking-widest mb-1">Panel</p>
          <p className="text-amber-400 font-semibold text-sm">☕ Admin Kopi</p>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { icon: '▦', label: 'Produk', href: '/admin' },
            { icon: '📋', label: 'Orders', href: '/admin/orders' },
            { icon: '👤', label: 'Users',  href: '/admin/users' },
          ].map(item => (
            <Link 
              key={item.label} 
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${pathname === item.href
                  ? 'bg-amber-900/40 text-amber-300 font-medium'
                  : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/40'}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-56 px-4 md:px-8 py-6 md:py-8 transition-all w-full lg:w-[calc(100%-14rem)]">
        
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 bg-stone-900 border border-stone-800 rounded-lg text-stone-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-stone-100 tracking-tight">Manajemen Pelanggan</h1>
            <p className="text-stone-500 text-xs md:text-sm mt-1">Daftar entitas yang terdaftar dalam sistem.</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-16 bg-stone-900/50 rounded-xl animate-pulse" />)}
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">⚠ {error}</p>
            <button onClick={fetchUsers} className="mt-4 text-xs text-red-400 underline">Coba lagi</button>
          </div>
        ) : (
          <>
            {/* VIEW SELULER: Render sebagai tumpukan Card (Hidden pada medium screen ke atas) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {users.map(u => (
                <div key={u._id} className="bg-[#141210] border border-stone-800/60 rounded-xl p-5 flex flex-col gap-4 shadow-sm">
                  <div className="flex justify-between items-start gap-4">
                    <div className="overflow-hidden">
                      <p className="font-medium text-stone-200 text-sm truncate">{u.nama}</p>
                      <p className="text-stone-400 text-xs truncate mt-0.5">{u.email}</p>
                    </div>
                    <p className="text-stone-500 text-[10px] text-right whitespace-nowrap shrink-0">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-stone-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 uppercase tracking-widest font-medium">Role Akses</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={u.role}
                        disabled={updatingId === u._id}
                        onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border bg-stone-900 focus:outline-none cursor-pointer transition-colors
                          ${u.role === 'admin' 
                            ? 'text-amber-300 border-amber-700/50 hover:border-amber-500' 
                            : 'text-stone-400 border-stone-700 hover:border-stone-500'}
                          ${updatingId === u._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <option value="user" className="bg-stone-900 text-stone-300">User</option>
                        <option value="admin" className="bg-stone-900 text-amber-300">Admin</option>
                      </select>
                      {updatingId === u._id && (
                        <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW DESKTOP: Render sebagai Tabel Standar (Hidden pada mobile screen) */}
            <div className="hidden md:block bg-[#141210] border border-stone-800/60 rounded-2xl overflow-hidden shadow-sm w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-800 text-xs text-stone-500 uppercase tracking-wider">
                    <th className="p-4 font-medium">Nama</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium text-right">Bergabung</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-stone-800/20 transition-colors">
                      <td className="p-4 font-medium text-stone-200">{u.nama}</td>
                      <td className="p-4 text-stone-400 text-sm">{u.email}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            disabled={updatingId === u._id}
                            onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase border bg-stone-900 focus:outline-none cursor-pointer transition-colors
                              ${u.role === 'admin' 
                                ? 'text-amber-300 border-amber-700/50 hover:border-amber-500' 
                                : 'text-stone-400 border-stone-700 hover:border-stone-500'}
                              ${updatingId === u._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <option value="user" className="bg-stone-900 text-stone-300">User</option>
                            <option value="admin" className="bg-stone-900 text-amber-300">Admin</option>
                          </select>
                          {updatingId === u._id && (
                            <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-stone-500 text-sm text-right">
                        {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State Guard */}
            {users.length === 0 && (
              <div className="p-8 mt-4 md:mt-0 text-center text-stone-500 text-sm bg-[#141210] border border-stone-800/60 rounded-2xl">
                Belum ada pengguna terdaftar.
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}