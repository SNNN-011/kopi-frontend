//src/app/admin/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface User {
  _id: string
  nama: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export default function AdminUserDashboard() {
  const pathname = usePathname()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('kopi-token')
    if (!token) throw new Error('Token tidak ditemukan. Silakan login kembali.')

    // UBAH BARIS DI BAWAH INI:
    // Tambahkan /auth di dalam URL-nya
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`, { 
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!res.ok) throw new Error('Gagal mengambil data user')
    
    const data = await res.json()
    setUsers(data)
  } catch (e: any) {
    setError(e.message)
  } finally {
    setLoading(false)
  }
}

// Di dalam AdminUserDashboard
const [updatingId, setUpdatingId] = useState<string | null>(null);

const handleUpdateRole = async (id: string, newRole: string) => {
  setUpdatingId(id);
  try {
    const token = localStorage.getItem('kopi-token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    });

    if (!res.ok) throw new Error('Gagal memperbarui role');

    alert('Role berhasil diperbarui!');
    fetchUsers(); // Segarkan data tabel
  } catch (e: any) {
    alert(e.message);
  } finally {
    setUpdatingId(null);
  }
};

  useEffect(() => { fetchUsers() }, [])

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-stone-200 pt-16">
      
      {/* ── SIDEBAR ── */}
      <aside className="fixed left-0 top-16 bottom-0 w-56 bg-[#141210] border-r border-stone-800/60 px-4 py-6 z-30">
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

      {/* ── MAIN CONTENT ── */}
      <main className="ml-56 p-8">
        <h1 className="text-2xl font-bold text-stone-100 mb-2">Manajemen Pelanggan</h1>
        <p className="text-stone-500 text-sm mb-8">Daftar entitas yang terdaftar dalam sistem.</p>

        {loading ? (
          <div className="space-y-3">
             {[1,2,3].map(i => <div key={i} className="h-16 bg-stone-900/50 rounded-xl animate-pulse" />)}
          </div>
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : (
          <div className="bg-[#141210] border border-stone-800/60 rounded-2xl overflow-hidden shadow-sm">
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
  <select
    value={u.role}
    disabled={updatingId === u._id}
    onChange={(e) => handleUpdateRole(u._id, e.target.value)}
    className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border bg-transparent focus:outline-none cursor-pointer
      ${u.role === 'admin' 
        ? 'text-amber-300 border-amber-700/50' 
        : 'text-stone-500 border-stone-700'}`}
  >
    <option value="user" className="bg-stone-900">User</option>
    <option value="admin" className="bg-stone-900">Admin</option>
  </select>
  {updatingId === u._id && <span className="ml-2 text-[10px] animate-pulse">...</span>}
</td>
                    <td className="p-4 text-stone-500 text-sm text-right">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
