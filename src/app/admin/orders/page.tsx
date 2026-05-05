// src/app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface OrderItem {
  _id: string
  produk: string
  nama: string
  harga: number
  jumlah: number
}

interface Order {
  _id: string
  user: {
    _id: string
    nama: string
    email: string
  } | null // Penanda eksplisit bahwa user bisa bernilai null (Orphaned Record)
  items: OrderItem[]
  totalHarga: number
  alamat: {
    nama: string
    telepon: string
    jalan: string
    kota: string
  }
  statusPembayaran: 'menunggu' | 'sukses' | 'gagal'
  statusOrder: 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan'
  metodePembayaran: string
  createdAt: string
}

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const formatTanggal = (dateString: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(dateString))
}

const StatusPayColor: Record<string, string> = {
  sukses: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
  menunggu: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
  gagal: 'bg-red-900/60 text-red-300 border-red-700/50',
}

const StatusOrderColor: Record<string, string> = {
  diproses: 'bg-sky-900/60 text-sky-300 border-sky-700/50',
  dikirim: 'bg-amber-900/60 text-amber-300 border-amber-700/50',
  selesai: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
  dibatalkan: 'bg-stone-800 text-stone-400 border-stone-600',
}

export default function AdminOrderDashboard() {
  const pathname = usePathname()
  const router = useRouter()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State untuk UX & Responsivitas
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('kopi-token')
      if (!token) throw new Error('Akses ditolak: Tidak ada token admin')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Gagal mengambil data pesanan')
      }
      setOrders(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kesalahan sistem tidak teridentifikasi')
    } finally {
      setLoading(false)
    }
  }

  // Intersepsi Keamanan
  useEffect(() => {
    const token = localStorage.getItem('kopi-token')
    if (!token) {
      router.push('/login')
    } else {
      fetchOrders()
    }
  }, [router])

  const handleUpdateStatus = async (id: string, statusOrder: string) => {
    setUpdating(id)
    try {
      const token = localStorage.getItem('kopi-token')
      if (!token) throw new Error('Sesi kedaluwarsa')

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ statusOrder })
      })
      
      if (!res.ok) throw new Error('Gagal memperbarui status pesanan')
      
      showToast('✓ Status pesanan diperbarui', 'ok')
      fetchOrders() 
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Gagal memperbarui status', 'err')
    } finally {
      setUpdating(null)
    }
  }

  // Koreksi Null-Safety pada Engine Pencarian
  const filtered = orders.filter(o => {
    const searchLower = search.toLowerCase()
    const idMatch = o._id.toLowerCase().includes(searchLower)
    const nameMatch = (o.user?.nama || o.alamat?.nama || '').toLowerCase().includes(searchLower)
    return idMatch || nameMatch
  })

  // Agregasi Statistik
  const totalPendapatan = orders.filter(o => o.statusPembayaran === 'sukses').reduce((s, o) => s + o.totalHarga, 0)
  const pesananAktif = orders.filter(o => o.statusOrder === 'diproses' || o.statusOrder === 'dikirim').length

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-stone-200 pt-16 font-sans">

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl
          transition-all duration-300 border
          ${toast.type === 'ok'
            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
            : 'bg-red-950 text-red-300 border-red-700'}`}>
          {toast.msg}
        </div>
      )}

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── ADAPTIVE SIDEBAR ── */}
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

      {/* ── MAIN CONTENT ── */}
      <main className="lg:ml-56 px-4 md:px-8 py-6 md:py-8 transition-all w-full lg:w-[calc(100%-14rem)]">

        {/* Header Responsif */}
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
            <h1 className="text-xl md:text-2xl font-bold text-stone-100 tracking-tight">Manajemen Pesanan</h1>
            <p className="text-stone-500 text-xs md:text-sm mt-1">Pantau dan kelola transaksi pelanggan</p>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Pesanan', value: orders.length, sub: 'transaksi masuk', color: 'text-amber-400' },
            { label: 'Pendapatan', value: rupiah(totalPendapatan), sub: 'pembayaran sukses', color: 'text-emerald-400' },
            { label: 'Perlu Diproses', value: pesananAktif, sub: 'pesanan aktif', color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#141210] border border-stone-800/60 rounded-2xl p-5">
              <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</p>
              <p className="text-stone-600 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Kontrol Pencarian */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5 w-full">
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari ID / Nama Pelanggan..."
              className="w-full bg-[#141210] border border-stone-800 rounded-xl pl-9 pr-4 py-2.5
                text-stone-300 text-sm placeholder-stone-600 focus:outline-none
                focus:border-amber-700 transition-colors" />
          </div>
          <p className="text-stone-500 text-sm hidden sm:block">{filtered.length} pesanan</p>
        </div>

        {/* Area Rendering Data */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-stone-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">⚠ {error}</p>
            <button onClick={fetchOrders} className="mt-4 text-xs text-red-400 underline">Coba lagi</button>
          </div>
        ) : (
          <>
            {/* VIEW SELULER: Responsive Card Stack */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filtered.map(o => (
                <div key={o._id} className="bg-[#141210] border border-stone-800/60 rounded-xl p-5 flex flex-col shadow-sm relative overflow-hidden">
                  
                  {/* Visual Indicator Status Pembayaran */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${o.statusPembayaran === 'sukses' ? 'bg-emerald-600' : o.statusPembayaran === 'gagal' ? 'bg-red-600' : 'bg-amber-600'}`} />

                  <div className="flex justify-between items-start mb-3 pl-2">
                    <div>
                      <p className="text-stone-200 text-sm font-bold tracking-wider">#{o._id.slice(-6).toUpperCase()}</p>
                      <p className="text-stone-500 text-[10px] mt-0.5">{formatTanggal(o.createdAt)}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border capitalize font-semibold whitespace-nowrap
                        ${StatusPayColor[o.statusPembayaran] || StatusPayColor.menunggu}`}>
                      {o.statusPembayaran}
                    </span>
                  </div>

                  <div className="bg-stone-900/50 rounded-lg p-3 mb-4 pl-4 border border-stone-800">
                    {/* Fallback untuk akun yang terhapus */}
                    <p className="text-stone-300 text-sm font-medium">{o.user?.nama || o.alamat?.nama || 'Pengguna Tidak Diketahui'}</p>
                    <p className="text-stone-500 text-xs mt-1">{o.alamat?.kota}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-800/60">
                      <p className="text-stone-400 text-xs">{o.items.length} Item</p>
                      <p className="text-amber-400 text-sm font-bold">{rupiah(o.totalHarga)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pl-2">
                    <span className="text-xs text-stone-500 font-medium">Status Aksi:</span>
                    <select 
                        value={o.statusOrder}
                        onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                        disabled={updating === o._id}
                        className={`text-xs px-3 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer text-center font-semibold tracking-wide
                          ${StatusOrderColor[o.statusOrder] || StatusOrderColor.dibatalkan}
                          ${updating === o._id ? 'opacity-50' : 'hover:opacity-80'}`}
                      >
                        <option value="diproses" className="bg-stone-900 text-stone-300">Diproses</option>
                        <option value="dikirim" className="bg-stone-900 text-stone-300">Dikirim</option>
                        <option value="selesai" className="bg-stone-900 text-stone-300">Selesai</option>
                        <option value="dibatalkan" className="bg-stone-900 text-stone-300">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW DESKTOP: Tabel Konvensional */}
            <div className="hidden md:block bg-[#141210] border border-stone-800/60 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="text-left px-5 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Order & Tanggal</th>
                    <th className="text-left px-4 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Pelanggan</th>
                    <th className="text-left px-4 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Total Harga</th>
                    <th className="text-left px-4 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Status Bayar</th>
                    <th className="text-right px-5 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Status Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {filtered.map(o => (
                    <tr key={o._id} className="hover:bg-stone-800/20 transition-colors group">
                      <td className="px-5 py-4">
                        <p className="text-stone-200 text-sm font-medium">#{o._id.slice(-6).toUpperCase()}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{formatTanggal(o.createdAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-stone-200 text-sm">{o.user?.nama || o.alamat?.nama || 'Pengguna Tidak Diketahui'}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{o.alamat?.kota}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-amber-400 text-sm font-medium">{rupiah(o.totalHarga)}</p>
                        <p className="text-stone-500 text-[10px] mt-0.5 uppercase">{o.items.length} Item</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full border capitalize font-medium whitespace-nowrap
                          ${StatusPayColor[o.statusPembayaran] || StatusPayColor.menunggu}`}>
                          {o.statusPembayaran}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <select 
                          value={o.statusOrder}
                          onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                          disabled={updating === o._id}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer appearance-none text-center font-medium
                            ${StatusOrderColor[o.statusOrder] || StatusOrderColor.dibatalkan}
                            ${updating === o._id ? 'opacity-50' : 'hover:opacity-80'}`}
                        >
                          <option value="diproses" className="bg-stone-900 text-stone-300">Diproses</option>
                          <option value="dikirim" className="bg-stone-900 text-stone-300">Dikirim</option>
                          <option value="selesai" className="bg-stone-900 text-stone-300">Selesai</option>
                          <option value="dibatalkan" className="bg-stone-900 text-stone-300">Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="p-8 mt-4 md:mt-0 text-center text-stone-500 text-sm bg-[#141210] border border-stone-800/60 rounded-2xl">
                {search ? `Tidak ada pesanan yang sesuai dengan "${search}"` : 'Belum ada data pesanan masuk.'}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}