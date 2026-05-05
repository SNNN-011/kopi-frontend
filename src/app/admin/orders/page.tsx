// src/app/admin/orders/page.tsx
'use client'

import { useState, useEffect } from 'react'

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
  }
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
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('kopi-token')
      if (!token) throw new Error('Akses ditolak: Tidak ada token admin')

      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Gagal mengambil data pesanan')
      }
      setOrders(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUpdateStatus = async (id: string, statusOrder: string) => {
    setUpdating(id)
    try {
      const token = localStorage.getItem('kopi-token')
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ statusOrder })
      })
      
      if (!res.ok) throw new Error('Gagal update status pesanan')
      
      showToast('✓ Status pesanan diperbarui')
      fetchOrders() // Refresh data
    } catch (e: any) {
      showToast(e.message, 'err')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = orders.filter(o =>
  o._id.toLowerCase().includes(search.toLowerCase()) ||
  o.user?.nama?.toLowerCase().includes(search.toLowerCase()) ||
  o.alamat?.nama?.toLowerCase().includes(search.toLowerCase())
)

  // Stats
  const totalPendapatan = orders.filter(o => o.statusPembayaran === 'sukses').reduce((s, o) => s + o.totalHarga, 0)
  const pesananAktif = orders.filter(o => o.statusOrder === 'diproses' || o.statusOrder === 'dikirim').length

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-stone-200 pt-16"
      style={{ fontFamily: "'DM Sans', 'Lato', sans-serif" }}>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl
          transition-all duration-300 border
          ${toast.type === 'ok'
            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
            : 'bg-red-950 text-red-300 border-red-700'}`}>
          {toast.msg}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="fixed left-0 top-16 bottom-0 w-56 bg-[#141210] border-r border-stone-800/60 px-4 py-6 z-30">
        <div className="mb-8">
          <p className="text-[10px] text-stone-600 uppercase tracking-widest mb-1">Panel</p>
          <p className="text-amber-400 font-semibold text-sm">☕ Admin Kopi</p>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { icon: '▦', label: 'Produk', active: false, href: '/admin' },
            { icon: '📋', label: 'Orders', active: true, href: '/admin/orders' },
            { icon: '👤', label: 'Users', active: false, href: '/admin/users' },
          ].map(item => (
            <a key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${item.active
                  ? 'bg-amber-900/40 text-amber-300 font-medium'
                  : 'text-stone-500 hover:text-stone-300 hover:bg-stone-800/40'}`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-56 px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-100 tracking-tight">Manajemen Pesanan</h1>
            <p className="text-stone-500 text-sm mt-1">Pantau dan kelola transaksi pelanggan</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
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

        {/* Search */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari ID Pesanan / Nama..."
              className="w-full bg-[#141210] border border-stone-800 rounded-xl pl-9 pr-4 py-2.5
                text-stone-300 text-sm placeholder-stone-600 focus:outline-none
                focus:border-amber-700 transition-colors" />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-stone-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">⚠ {error}</p>
            <button onClick={fetchOrders} className="mt-4 text-xs text-red-400 underline">Coba lagi</button>
          </div>
        ) : (
          <div className="bg-[#141210] border border-stone-800/60 rounded-2xl overflow-hidden">
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
                    {/* Order Info */}
                    <td className="px-5 py-4">
                      <p className="text-stone-200 text-sm font-medium">#{o._id.slice(-6).toUpperCase()}</p>
                      <p className="text-stone-500 text-xs mt-0.5">{formatTanggal(o.createdAt)}</p>
                    </td>
                    {/* Pelanggan */}
                    <td className="px-4 py-4">
                      <p className="text-stone-200 text-sm">{o.user?.nama || o.alamat.nama}</p>
                      <p className="text-stone-500 text-xs mt-0.5">{o.alamat?.kota}</p>
                    </td>
                    {/* Total Harga */}
                    <td className="px-4 py-4">
                      <p className="text-amber-400 text-sm font-medium">{rupiah(o.totalHarga)}</p>
                      <p className="text-stone-500 text-[10px] mt-0.5 uppercase">{o.items.length} Item</p>
                    </td>
                    {/* Status Pembayaran */}
                    <td className="px-4 py-4">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border capitalize font-medium
                        ${StatusPayColor[o.statusPembayaran] || StatusPayColor.menunggu}`}>
                        {o.statusPembayaran}
                      </span>
                    </td>
                    {/* Status Order (Aksi) */}
                    <td className="px-5 py-4 text-right">
                      <select 
                        value={o.statusOrder}
                        onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                        disabled={updating === o._id}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border focus:outline-none transition-colors cursor-pointer appearance-none text-center
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
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-stone-600 text-sm">
                      {search ? `Tidak ada pesanan dengan kata kunci "${search}"` : 'Belum ada data pesanan.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}