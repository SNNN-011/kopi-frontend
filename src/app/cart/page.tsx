'use client'

import { useCart } from '@/store/cart'
import CartItem from '@/components/CartItem'
import Link from 'next/link'

export default function CartPage() {
  const { items, totalHarga, totalItem, kosongkan } = useCart()

  return (
    <main
      className="min-h-screen pt-24 pb-16 px-6 bg-[#FAF6F0] text-stone-800"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-amber-700/80 text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold flex items-center gap-2">
            <span className="w-4 h-px bg-amber-700/50 inline-block" />
            Keranjang Anda
          </p>
          <div className="flex justify-between items-end">
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold text-stone-800 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Keranjang Belanja
              </h1>
              <p className="text-stone-500 mt-2.5 text-base">
                {items.length > 0 ? (
                  <>
                    Anda memiliki{' '}
                    <span className="text-amber-800 font-bold">{totalItem()}</span>
                    {' '}item di keranjang.
                  </>
                ) : 'Belum ada item yang dipilih.'}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={kosongkan}
                className="text-xs text-stone-400 hover:text-red-500 font-medium transition-colors
                  duration-200 flex items-center gap-1.5 pb-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Kosongkan Semua
              </button>
            )}
          </div>
          <div className="h-px bg-gradient-to-r from-amber-200/80 via-stone-200 to-transparent mt-6" />
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white
            rounded-3xl border border-stone-100 shadow-[0_2px_32px_rgba(0,0,0,0.04)]">
            {/* Coffee cup illustration */}
            <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-100 flex items-center
              justify-center mb-6 shadow-inner">
              <span className="text-4xl" style={{ filter: 'grayscale(0.3)' }}>🛒</span>
            </div>
            <h2
              className="text-2xl font-bold text-stone-800 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Keranjang Anda kosong
            </h2>
            <p className="text-stone-400 mb-8 max-w-xs text-center text-sm leading-relaxed">
              Jelajahi koleksi biji kopi Nusantara kami dan temukan yang terbaik untuk Anda.
            </p>
            <Link
              href="/products"
              className="bg-amber-800 hover:bg-amber-700 text-amber-50 px-8 py-3.5 rounded-full
                font-semibold transition-all duration-200 text-sm tracking-wide
                shadow-md shadow-amber-800/20 hover:-translate-y-0.5"
            >
              Lihat Katalog
            </Link>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="bg-white border border-stone-100 p-7 sm:p-10 rounded-3xl
              shadow-[0_2px_32px_rgba(120,80,30,0.07)] relative overflow-hidden">

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-800/3 rounded-full
                blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-stone-100 rounded-full
                blur-3xl -ml-10 -mb-10 pointer-events-none" />

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-stone-400 text-xs tracking-[0.25em] uppercase font-medium mb-2">
                    Total Pembayaran
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-bold text-amber-800"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Rp {totalHarga().toLocaleString('id-ID')}
                  </p>
                  <p className="text-stone-400 text-xs mt-2">
                    {totalItem()} item · Belum termasuk ongkos kirim
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="bg-amber-800 hover:bg-amber-700 text-amber-50 font-semibold py-4 px-10
                    rounded-full transition-all duration-200 shadow-md shadow-amber-800/25
                    hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-800/30
                    w-full sm:w-auto text-center text-sm tracking-wide flex items-center justify-center gap-2"
                >
                  Lanjutkan ke Checkout
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}
