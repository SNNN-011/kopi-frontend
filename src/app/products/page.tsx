// app/products/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/store/cart'

interface Product {
  _id: string
  nama: string
  deskripsi: string
  harga: number
  gambar: string
  kategori: string
  berat: string
  stok: number
}

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const KATEGORI = ['semua', 'arabika', 'robusta', 'campuran', 'lainnya']
const SORT_OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'termurah', label: 'Harga Termurah' },
  { value: 'termahal', label: 'Harga Termahal' },
  { value: 'az', label: 'A → Z' },
]

export default function CatalogPage() {
  const [semua, setSemua]       = useState<Product[]>([])
  const [tampil, setTampil]     = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [kategori, setKategori] = useState('semua')
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState('terbaru')
  const [ditambah, setDitambah] = useState<string | null>(null)
  const { tambah }              = useCart()

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((r) => r.json())
      .then((data) => { setSemua(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let hasil = [...semua]
    if (kategori !== 'semua') hasil = hasil.filter((p) => p.kategori === kategori)
    if (search.trim()) hasil = hasil.filter((p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'termurah') hasil.sort((a, b) => a.harga - b.harga)
    else if (sort === 'termahal') hasil.sort((a, b) => b.harga - a.harga)
    else if (sort === 'az') hasil.sort((a, b) => a.nama.localeCompare(b.nama))
    setTampil(hasil)
  }, [semua, kategori, search, sort])

  const handleTambah = (p: Product) => {
    tambah({ id: p._id, nama: p.nama, harga: p.harga, gambar: p.gambar, jumlah: 1, berat: p.berat })
    setDitambah(p._id)
    setTimeout(() => setDitambah(null), 1500)
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ── HEADER (Diselaraskan dengan Hero HomePage) ── */}
      <section className="relative pt-32 pb-24 flex items-center overflow-hidden">
        {/* bg texture dari HomePage */}
        <div className="absolute inset-0 bg-[#1C1008]" />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `radial-gradient(circle at 20% 50%, #6B3D14 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, #8B5E3C 0%, transparent 50%)` }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-4 font-medium">
            ✦ Koleksi Lengkap
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl md:text-6xl font-bold text-amber-50 mb-6">
            Katalog <span className="text-amber-400 italic">Kopi</span>
          </h1>
          <p className="text-stone-300 text-lg leading-relaxed max-w-xl mx-auto">
            Jelajahi koleksi kopi bubuk pilihan dari seluruh Nusantara.
            Diroasting segar, dikirim cepat.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ── FILTER BAR ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 mb-8 flex flex-wrap gap-3 items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama kopi..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200
                rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors" />
          </div>

          {/* Kategori */}
          <div className="flex gap-2 flex-wrap">
            {KATEGORI.map((k) => (
              <button key={k} onClick={() => setKategori(k)}
                className={`text-xs px-5 py-2.5 rounded-full capitalize transition-all font-medium
                  ${kategori === k
                    ? 'bg-amber-800 text-amber-50 shadow-md shadow-amber-900/20'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'}`}>
                {k}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-stone-200 rounded-xl px-4 py-2.5
              bg-stone-50 text-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer">
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* ── RESULT COUNT ── */}
        {!loading && (
          <p className="text-stone-500 text-sm mb-8">
            Menampilkan <span className="font-semibold text-stone-800">{tampil.length}</span> produk
            {kategori !== 'semua' && <span> dalam kategori <b className="capitalize text-stone-800">{kategori}</b></span>}
            {search && <span> untuk "<b className="text-stone-800">{search}</b>"</span>}
          </p>
        )}

        {/* ── GRID (Diselaraskan dengan Produk Unggulan HomePage) ── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-stone-100 rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : tampil.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-3xl shadow-sm border border-stone-100">
            <p className="text-5xl mb-4 opacity-70">🔍</p>
            <p className="text-stone-700 text-lg font-medium">Produk tidak ditemukan</p>
            <p className="text-stone-500 text-sm mt-2">Coba kata kunci atau filter lain</p>
            <button onClick={() => { setSearch(''); setKategori('semua') }}
              className="mt-6 text-sm text-amber-700 hover:text-amber-900 underline underline-offset-4 font-medium transition-colors">
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tampil.map((p) => (
              <div key={p._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">

                {/* Gambar */}
                <Link href={`/products/${p._id}`} className="block relative h-56 bg-amber-50 overflow-hidden">
                  {p.gambar ? (
                    <img src={p.gambar} alt={p.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl opacity-30">☕</span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 bg-amber-800 text-amber-100
                    text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                    {p.kategori}
                  </span>
                  
                  {p.stok <= 5 && p.stok > 0 && (
                    <span className="absolute top-4 right-4 bg-orange-500 text-white
                      text-[10px] px-3 py-1 rounded-full font-semibold shadow-sm">
                      Sisa {p.stok}
                    </span>
                  )}
                  {p.stok === 0 && (
                    <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="bg-white text-stone-800 text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest shadow-sm">
                        Habis
                      </span>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-stone-400 mb-1 font-medium">{p.berat}</p>
                  <Link href={`/products/${p._id}`}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-xl font-bold text-stone-800 mb-2 leading-tight
                        hover:text-amber-800 transition-colors">
                      {p.nama}
                    </h3>
                  </Link>
                  <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
                    {p.deskripsi}
                  </p>
                  
                  {/* Action Area */}
                  <div className="flex items-center justify-between">
                    <p className="text-amber-800 font-bold text-lg">{rupiah(p.harga)}</p>
                    <button
                      onClick={() => handleTambah(p)}
                      disabled={p.stok === 0}
                      className={`text-xs px-5 py-2.5 rounded-full font-medium transition-all duration-200 shadow-sm
                        ${p.stok === 0
                          ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                          : ditambah === p._id
                            ? 'bg-green-500 text-white scale-95'
                            : 'bg-amber-800 hover:bg-amber-700 text-amber-50 hover:shadow-md'}`}>
                      {ditambah === p._id ? '✓ Ditambah' : p.stok === 0 ? 'Habis' : '+ Keranjang'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
