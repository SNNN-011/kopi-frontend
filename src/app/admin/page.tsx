// src/app/admin/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Product {
  _id?: string
  nama: string
  deskripsi: string
  harga: number
  stok: number
  kategori: string
  berat: string
  gambar: string
}

const EMPTY: Product = {
  nama: '', deskripsi: '', harga: 0, stok: 0,
  kategori: 'arabika', berat: '', gambar: ''
}

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const KategoriColor: Record<string, string> = {
  arabika:  'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
  robusta:  'bg-amber-900/60  text-amber-300  border-amber-700/50',
  campuran: 'bg-sky-900/60    text-sky-300    border-sky-700/50',
  lainnya:  'bg-stone-800     text-stone-400  border-stone-600',
}

export default function AdminProductDashboard() {
  // ✅ PINDAH KE SINI: Hook harus berada di dalam tubuh fungsi komponen
  const pathname = usePathname() 

  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [toast, setToast]         = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [search, setSearch]       = useState('')
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [formData, setFormData]   = useState<Product>(EMPTY)
  const [formOpen, setFormOpen]   = useState(false)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products')
      if (!res.ok) throw new Error('Gagal mengambil data')
      setProducts(await res.json())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'harga' || name === 'stok' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('kopi-token')
    if (!token) { showToast('Login admin dulu!', 'err'); return }
    setSaving(true)
    const isEdit = !!formData._id
    try {
      const res = await fetch(
        isEdit ? `http://localhost:5000/api/products/${formData._id}` : 'http://localhost:5000/api/products',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(formData)
        }
      )
      if (!res.ok) throw new Error('Gagal menyimpan')
      showToast(isEdit ? '✓ Produk diupdate' : '✓ Produk ditambahkan')
      setFormData(EMPTY)
      setFormOpen(false)
      fetchProducts()
    } catch (e: any) {
      showToast(e.message, 'err')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return
    const token = localStorage.getItem('kopi-token')
    setDeleting(id)
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Gagal menghapus')
      showToast('✓ Produk dihapus')
      fetchProducts()
    } catch (e: any) {
      showToast(e.message, 'err')
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = (p: Product) => {
    setFormData(p)
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelEdit = () => { setFormData(EMPTY); setFormOpen(false) }

  const filtered = products.filter(p =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.kategori.toLowerCase().includes(search.toLowerCase())
  )

  const totalStok   = products.reduce((s, p) => s + p.stok, 0)
  const totalNilai  = products.reduce((s, p) => s + p.harga * p.stok, 0)
  const stokRendah  = products.filter(p => p.stok <= 5).length

  return (
    <div className="min-h-screen bg-[#0E0C0A] text-stone-200 pt-16"
      style={{ fontFamily: "'DM Sans', 'Lato', sans-serif" }}>

      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl
          transition-all duration-300 border
          ${toast.type === 'ok'
            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
            : 'bg-red-950 text-red-300 border-red-700'}`}>
          {toast.msg}
        </div>
      )}

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

        <div className="mt-auto absolute bottom-8 left-4 right-4 space-y-2">
          <div className="bg-stone-900 rounded-lg p-3 border border-stone-800">
            <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Total Produk</p>
            <p className="text-xl font-bold text-amber-400">{products.length}</p>
          </div>
          {stokRendah > 0 && (
            <div className="bg-red-950/60 rounded-lg p-3 border border-red-900/50">
              <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Stok Kritis</p>
              <p className="text-xl font-bold text-red-400">{stokRendah} item</p>
            </div>
          )}
        </div>
      </aside>

      <main className="ml-56 px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-stone-100 tracking-tight">Manajemen Produk</h1>
            <p className="text-stone-500 text-sm mt-1">Kelola seluruh produk kopi Anda</p>
          </div>
          <button
            onClick={() => { setFormData(EMPTY); setFormOpen(true) }}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950
              font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            <span className="text-lg leading-none">+</span> Tambah Produk
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total SKU', value: products.length, sub: 'jenis produk', color: 'text-amber-400' },
            { label: 'Total Stok', value: totalStok.toLocaleString('id-ID'), sub: 'unit tersedia', color: 'text-emerald-400' },
            { label: 'Nilai Inventori', value: rupiah(totalNilai), sub: 'estimasi nilai', color: 'text-sky-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#141210] border border-stone-800/60 rounded-2xl p-5">
              <p className="text-stone-500 text-xs uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</p>
              <p className="text-stone-600 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {formOpen && (
          <div className="bg-[#141210] border border-amber-900/40 rounded-2xl p-6 mb-8 relative">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-amber-300 text-base">
                {formData._id ? '✏️  Edit Produk' : '➕  Tambah Produk Baru'}
              </h2>
              <button onClick={cancelEdit} className="text-stone-500 hover:text-stone-300 text-xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">Nama Produk</label>
                <input type="text" name="nama" value={formData.nama} onChange={handleChange} required
                  placeholder="Contoh: Mandheling Premium"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm placeholder-stone-600 focus:outline-none
                    focus:border-amber-600 transition-colors" />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">Deskripsi</label>
                <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} required rows={2}
                  placeholder="Rasa, aroma, cara seduh..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm placeholder-stone-600 focus:outline-none
                    focus:border-amber-600 transition-colors resize-none" />
              </div>

              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">Harga (Rp)</label>
                <input type="number" name="harga" value={formData.harga} onChange={handleChange} required min="0"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">Stok</label>
                <input type="number" name="stok" value={formData.stok} onChange={handleChange} required min="0"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm focus:outline-none focus:border-amber-600 transition-colors" />
              </div>

              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">Kategori</label>
                <select name="kategori" value={formData.kategori} onChange={handleChange}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm focus:outline-none focus:border-amber-600 transition-colors">
                  <option value="arabika">Arabika</option>
                  <option value="robusta">Robusta</option>
                  <option value="campuran">Blend / Campuran</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">Berat</label>
                <input type="text" name="berat" value={formData.berat} onChange={handleChange} required
                  placeholder="200g, 500g, 1kg"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm placeholder-stone-600 focus:outline-none
                    focus:border-amber-600 transition-colors" />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-stone-400 uppercase tracking-wider mb-1.5 block">URL Gambar</label>
                <input type="text" name="gambar" value={formData.gambar} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5
                    text-stone-200 text-sm placeholder-stone-600 focus:outline-none
                    focus:border-amber-600 transition-colors" />
              </div>

              {formData.gambar && (
                <div className="col-span-2">
                  <p className="text-xs text-stone-500 mb-2">Preview:</p>
                  <img src={formData.gambar} alt="preview"
                    className="h-20 w-20 object-cover rounded-lg border border-stone-700" />
                </div>
              )}

              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50
                    text-stone-950 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  {saving ? 'Menyimpan...' : formData._id ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
                <button type="button" onClick={cancelEdit}
                  className="px-6 bg-stone-800 hover:bg-stone-700 text-stone-300
                    font-medium py-2.5 rounded-xl text-sm transition-colors">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex items-center gap-4 mb-5">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full bg-[#141210] border border-stone-800 rounded-xl pl-9 pr-4 py-2.5
                text-stone-300 text-sm placeholder-stone-600 focus:outline-none
                focus:border-amber-700 transition-colors" />
          </div>
          <p className="text-stone-500 text-sm">{filtered.length} produk</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-16 bg-stone-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 text-center">
            <p className="text-red-400 text-sm">⚠ {error}</p>
            <button onClick={fetchProducts} className="mt-4 text-xs text-red-400 underline">Coba lagi</button>
          </div>
        ) : (
          <div className="bg-[#141210] border border-stone-800/60 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-800">
                  <th className="text-left px-5 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Produk</th>
                  <th className="text-left px-4 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Kategori</th>
                  <th className="text-left px-4 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Harga</th>
                  <th className="text-left px-4 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Stok</th>
                  <th className="text-right px-5 py-3.5 text-xs text-stone-500 uppercase tracking-wider font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-stone-800/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.gambar ? (
                          <img src={p.gambar} alt={p.nama}
                            className="w-9 h-9 rounded-lg object-cover border border-stone-700 flex-shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700
                            flex items-center justify-center text-base flex-shrink-0">☕</div>
                        )}
                        <div>
                          <p className="text-stone-200 text-sm font-medium leading-tight">{p.nama}</p>
                          <p className="text-stone-500 text-xs mt-0.5">{p.berat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border capitalize font-medium
                        ${KategoriColor[p.kategori] || KategoriColor.lainnya}`}>
                        {p.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-amber-400 text-sm font-medium">{rupiah(p.harga)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold
                          ${p.stok === 0 ? 'text-red-400' : p.stok <= 5 ? 'text-orange-400' : 'text-stone-300'}`}>
                          {p.stok}
                        </span>
                        {p.stok === 0 && (
                          <span className="text-[10px] bg-red-950/60 text-red-400 border border-red-900/50
                            px-1.5 py-0.5 rounded-full">Habis</span>
                        )}
                        {p.stok > 0 && p.stok <= 5 && (
                          <span className="text-[10px] bg-orange-950/60 text-orange-400 border border-orange-900/50
                            px-1.5 py-0.5 rounded-full">Kritis</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(p)}
                          className="text-xs px-3 py-1.5 bg-stone-800 hover:bg-amber-900/40
                            text-stone-300 hover:text-amber-300 border border-stone-700
                            hover:border-amber-800 rounded-lg transition-all">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p._id!)}
                          disabled={deleting === p._id}
                          className="text-xs px-3 py-1.5 bg-stone-800 hover:bg-red-950/60
                            text-stone-400 hover:text-red-400 border border-stone-700
                            hover:border-red-900 rounded-lg transition-all disabled:opacity-40">
                          {deleting === p._id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center text-stone-600 text-sm">
                      {search ? `Tidak ada produk "${search}"` : 'Belum ada produk. Tambahkan produk pertama!'}
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