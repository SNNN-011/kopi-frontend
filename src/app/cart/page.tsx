'use client'

import { useCart } from '@/store/cart'
import CartItem from '@/components/CartItem'
import Link from 'next/link'

export default function CartPage() {
  const { items, totalHarga, totalItem, kosongkan } = useCart()

  return (
    <main 
      className="min-h-screen p-8 pt-24 bg-[#FAF6F0] text-stone-800 selection:bg-amber-800/20"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-10 border-b border-stone-200 pb-6">
          <div>
            <p className="text-amber-700 text-xs tracking-[0.25em] uppercase mb-3 font-medium">
              ✦ Keranjang Anda
            </p>
            <h1 
              className="text-4xl md:text-5xl font-bold text-stone-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Keranjang Belanja
            </h1>
            <p className="text-stone-500 mt-3 text-lg">
              Anda memiliki <span className="text-amber-800 font-bold">{totalItem()}</span> item di keranjang.
            </p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={kosongkan} 
              className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 border-b border-transparent hover:border-red-600 pb-0.5"
            >
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {/* State Management Rendering */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm">
            <div className="text-6xl mb-6 opacity-80">🛒</div>
            <h2 
              className="text-2xl font-bold text-stone-800 mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Keranjang Anda kosong
            </h2>
            <p className="text-stone-500 mb-8 max-w-md text-center">
              Belum ada biji kopi pilihan yang Anda tambahkan. Jelajahi koleksi kopi Nusantara kami.
            </p>
            <Link 
              href="/products" 
              className="bg-amber-800 hover:bg-amber-700 text-amber-50 px-8 py-3.5 rounded-full font-semibold transition-all duration-200 text-sm tracking-wide shadow-md"
            >
              Kembali ke Katalog
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* List Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            {/* Checkout Summary Box */}
            <div className="bg-white border border-stone-200 p-6 sm:p-10 rounded-3xl flex flex-col sm:flex-row justify-between items-center shadow-sm relative overflow-hidden">
              {/* Subtle background accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-800/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="mb-6 sm:mb-0 text-center sm:text-left z-10">
                <p className="text-stone-400 text-xs tracking-[0.2em] uppercase font-medium mb-2">
                  Total Pembayaran
                </p>
                <p className="text-3xl md:text-4xl font-bold text-amber-800 tracking-tight">
                  Rp {totalHarga().toLocaleString('id-ID')}
                </p>
              </div>
              <Link 
                href="/checkout" 
                className="bg-amber-800 hover:bg-amber-700 text-amber-50 font-semibold py-4 px-10 rounded-full transition-all duration-200 shadow-md hover:-translate-y-0.5 z-10 w-full sm:w-auto text-center text-sm tracking-wide"
              >
                Lanjutkan ke Checkout →
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </main>
  )
}