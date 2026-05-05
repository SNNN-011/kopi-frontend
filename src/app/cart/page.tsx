'use client'

import { useCart } from '@/store/cart'
import CartItem from '@/components/CartItem'
import Link from 'next/link'

export default function CartPage() {
  const { items, totalHarga, totalItem, kosongkan } = useCart()

  return (
    <main className="min-h-screen p-8 pt-24 bg-zinc-950 text-zinc-100 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-50">Keranjang Belanja</h1>
            <p className="text-zinc-400 mt-1 font-medium">
              Anda memiliki <span className="text-amber-500">{totalItem()}</span> item di keranjang.
            </p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={kosongkan} 
              className="text-sm text-red-500 hover:text-red-400 font-semibold transition-colors duration-200"
            >
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {/* State Management Rendering */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-sm backdrop-blur-sm">
            <div className="text-6xl mb-6 opacity-80">🛒</div>
            <h2 className="text-2xl font-bold text-zinc-300 mb-2">Keranjang Anda kosong</h2>
            <p className="text-zinc-500 mb-8">Belum ada biji kopi pilihan yang Anda tambahkan.</p>
            <Link 
              href="/products" 
              className="bg-amber-600 hover:bg-amber-500 text-zinc-50 px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-amber-900/20 hover:shadow-amber-900/40"
            >
              Kembali ke Katalog
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* List Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            {/* Checkout Summary Box */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-2xl mt-8 flex flex-col sm:flex-row justify-between items-center shadow-xl relative overflow-hidden">
              {/* Subtle background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="mb-6 sm:mb-0 text-center sm:text-left z-10">
                <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-1">Total Pembayaran</p>
                <p className="text-3xl font-bold text-amber-500 tracking-tight">
                  Rp {totalHarga().toLocaleString('id-ID')}
                </p>
              </div>
              <Link 
                href="/checkout" 
                className="bg-amber-600 hover:bg-amber-500 text-zinc-50 font-bold py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md shadow-amber-900/30 hover:shadow-amber-900/50 hover:-translate-y-0.5 z-10 w-full sm:w-auto text-center"
              >
                Lanjutkan ke Checkout
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </main>
  )
}