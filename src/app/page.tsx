// app/page.tsx — Homepage Toko Pure Coffee
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

// Format harga ke Rupiah
const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export default function HomePage() {
  const [produkUnggulan, setProdukUnggulan] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { tambah, totalItem } = useCart()
  const [ditambah, setDitambah] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then((r) => r.json())
      .then((data) => {
        setProdukUnggulan(Array.isArray(data) ? data.slice(0, 3) : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleTambah = (p: Product) => {
    tambah({ id: p._id, nama: p.nama, harga: p.harga, gambar: p.gambar, jumlah: 1, berat: p.berat })
    setDitambah(p._id)
    setTimeout(() => setDitambah(null), 1500)
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]" style={{ fontFamily: "'Lato', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* bg texture */}
        <div className="absolute inset-0 bg-[#1C1008]" />
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `radial-gradient(circle at 20% 50%, #6B3D14 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, #8B5E3C 0%, transparent 50%)` }} />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-6 font-medium">
              ✦ Dari Bumi Nusantara
            </p>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-5xl md:text-7xl font-bold text-amber-50 leading-[1.05] mb-6">
              Kopi yang<br />
              <span className="text-amber-400 italic">Bicara</span><br />
              Rasa
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mb-10 max-w-md">
              Kopi bubuk pilihan dari Aceh, Toraja, Flores, dan Kintamani —
              dipetik manual, diproses dengan penuh cinta.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products"
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold
                  px-8 py-3.5 rounded-full transition-all duration-200 text-sm tracking-wide">
                Lihat Katalog →
              </Link>
              <a href="#unggulan"
                className="border border-stone-500 hover:border-amber-400 text-stone-300
                  hover:text-amber-400 font-medium px-8 py-3.5 rounded-full
                  transition-all duration-200 text-sm tracking-wide">
                Produk Unggulan
              </a>
            </div>
          </div>

          {/* Hero stats */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {[
              { angka: '12+', label: 'Jenis Kopi' },
              { angka: '100%', label: 'Single Origin' },
              { angka: '5 Pulau', label: 'Sumber Biji' },
              { angka: '2 Hari', label: 'Pengiriman' },
            ].map((s) => (
              <div key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <p style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-3xl font-bold text-amber-400 mb-1">{s.angka}</p>
                <p className="text-stone-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-stone-500 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-stone-500 to-transparent" />
        </div>
      </section>

      {/* ── KATEGORI STRIP ── */}
      <section className="bg-amber-800 py-5 overflow-hidden">
        <div className="flex gap-10 animate-scroll whitespace-nowrap">
          {['Arabika Aceh', 'Robusta Lampung', 'Toraja Sapan', 'Kintamani Bali',
            'Flores Bajawa', 'Papua Wamena', 'Arabika Aceh', 'Robusta Lampung',
            'Toraja Sapan', 'Kintamani Bali'].map((k, i) => (
            <span key={i} className="text-amber-200 text-sm font-medium tracking-wider shrink-0">
              ☕ {k}
            </span>
          ))}
        </div>
        <style>{`
          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-scroll { animation: scroll 20s linear infinite; }
        `}</style>
      </section>

      {/* ── PRODUK UNGGULAN ── */}
      <section id="unggulan" className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-amber-700 text-xs tracking-[0.25em] uppercase mb-3 font-medium">
              ✦ Pilihan Terbaik
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl font-bold text-stone-800">
              Produk Unggulan
            </h2>
          </div>
          <Link href="/products"
            className="hidden md:block text-amber-700 hover:text-amber-900 text-sm
              font-medium border-b border-amber-700 hover:border-amber-900 transition-colors pb-0.5">
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-stone-100 rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : produkUnggulan.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">☕</p>
            <p className="text-stone-500 text-lg">Belum ada produk.</p>
            <p className="text-stone-400 text-sm mt-2">
              Tambahkan produk dulu lewat dashboard admin.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {produkUnggulan.map((p, i) => (
              <div key={p._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm
                  hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                {/* gambar */}
                <div className="relative h-56 bg-amber-50 overflow-hidden">
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
                  {i === 0 && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white
                      text-[10px] px-3 py-1 rounded-full font-semibold">
                      Terlaris
                    </span>
                  )}
                </div>

                {/* info */}
                <div className="p-6">
                  <p className="text-xs text-stone-400 mb-1">{p.berat}</p>
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-xl font-bold text-stone-800 mb-2 leading-tight">
                    {p.nama}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-5 line-clamp-2">
                    {p.deskripsi}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-amber-800 font-bold text-lg">{rupiah(p.harga)}</p>
                    <div className="flex gap-2">
                      <Link href={`/products/${p._id}`}
                        className="text-xs text-stone-500 hover:text-stone-800
                          border border-stone-200 hover:border-stone-400
                          px-3 py-2 rounded-full transition-colors">
                        Detail
                      </Link>
                      <button
                        onClick={() => handleTambah(p)}
                        className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-200
                          ${ditambah === p._id
                            ? 'bg-green-500 text-white scale-95'
                            : 'bg-amber-800 hover:bg-amber-700 text-amber-50'}`}>
                        {ditambah === p._id ? '✓ Ditambah' : '+ Keranjang'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── KEUNGGULAN ── */}
      <section className="bg-stone-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-400 text-xs tracking-[0.25em] uppercase mb-3 font-medium text-center">
            ✦ Kenapa Kami
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-4xl font-bold text-amber-50 text-center mb-14">
            Beda dari yang Lain
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🌿', judul: 'Single Origin', teks: 'Setiap biji punya cerita dan karakter rasa yang unik.' },
              { icon: '🤝', judul: 'Petani Langsung', teks: 'Bermitra langsung dengan petani lokal yang berpengalaman.' },
              { icon: '📦', judul: 'Segar Tiap Roast', teks: 'Kopi diroasting segar sesuai pesanan, bukan stok lama.' },
              { icon: '🚚', judul: 'Pengiriman Cepat', teks: 'Dikirim dalam 1-2 hari kerja ke seluruh Indonesia.' },
            ].map((f) => (
              <div key={f.judul}
                className="bg-white/5 border border-white/10 rounded-2xl p-6
                  hover:bg-white/10 transition-colors duration-200">
                <span className="text-3xl block mb-4">{f.icon}</span>
                <h3 className="text-amber-300 font-semibold mb-2 text-sm tracking-wide">{f.judul}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.teks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center bg-[#FAF6F0]">
        <p className="text-amber-700 text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          ✦ Mulai Sekarang
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-4xl md:text-5xl font-bold text-stone-800 mb-6 max-w-xl mx-auto leading-tight">
          Temukan Kopi Favoritmu
        </h2>
        <p className="text-stone-500 mb-10 max-w-md mx-auto">
          Jelajahi lebih dari 12 jenis kopi bubuk pilihan dari seluruh penjuru Nusantara.
        </p>
        <Link href="/products"
          className="inline-block bg-amber-800 hover:bg-amber-700 text-amber-50
            font-semibold px-10 py-4 rounded-full transition-colors text-sm tracking-wide">
          Belanja Sekarang →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-stone-900 text-stone-500 text-center py-8 text-sm">
        <p style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-amber-400 font-semibold mb-1">☕ Pure Coffee</p>
        <p>© {new Date().getFullYear()} — Premium Ground Coffee dari Seluruh Indonesia</p>
      </footer>
    </div>
  )
}
