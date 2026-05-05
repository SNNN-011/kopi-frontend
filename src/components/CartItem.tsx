'use client'

import { useCart, CartItem as CartItemType } from '@/store/cart'

export default function CartItem({ item }: { item: CartItemType }) {
  const { tambah, kurangi, hapus } = useCart()

  return (
    <div className="group flex flex-col sm:flex-row items-start sm:items-center justify-between
      p-5 bg-white border border-stone-100 rounded-2xl transition-all duration-300
      hover:border-amber-200/80 hover:shadow-[0_4px_24px_rgba(120,80,30,0.08)]"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* Product Info */}
      <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
        <div className="relative flex-shrink-0">
          <img
            src={item.gambar}
            alt={item.nama}
            className="w-[72px] h-[72px] object-cover rounded-xl border border-amber-100/80"
          />
          {/* Subtle overlay shimmer on hover */}
          <div className="absolute inset-0 rounded-xl bg-amber-800/0 group-hover:bg-amber-800/5 transition-colors duration-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-stone-800 text-base md:text-lg leading-tight truncate"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.nama}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-amber-800 text-sm font-semibold">
              Rp {item.harga.toLocaleString('id-ID')}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="text-stone-400 text-sm">{item.berat}</span>
          </div>
        </div>
      </div>

      {/* Controls & Price */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 sm:gap-6">

        {/* Quantity Stepper */}
        <div className="flex items-center rounded-xl border border-stone-200 overflow-hidden bg-stone-50">
          <button
            onClick={() => kurangi(item.id)}
            className="w-9 h-9 flex items-center justify-center text-stone-500
              hover:text-amber-800 hover:bg-amber-50 transition-colors duration-150 text-lg leading-none"
            aria-label="Kurangi"
          >
            −
          </button>
          <span className="w-10 text-center border-x border-stone-200 text-stone-800 font-semibold
            text-sm bg-white h-9 flex items-center justify-center tabular-nums">
            {item.jumlah}
          </span>
          <button
            onClick={() => tambah(item)}
            className="w-9 h-9 flex items-center justify-center text-stone-500
              hover:text-amber-800 hover:bg-amber-50 transition-colors duration-150 text-lg leading-none"
            aria-label="Tambah"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[110px]">
          <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">Total</p>
          <p className="font-bold text-amber-800 text-base">
            Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
          </p>
        </div>

        {/* Delete */}
        <button
          onClick={() => hapus(item.id)}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-400
            hover:text-red-500 transition-colors duration-200 group/del"
          aria-label="Hapus item"
        >
          <svg
            className="w-4 h-4 group-hover/del:scale-110 transition-transform duration-150"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="hidden sm:block">Hapus</span>
        </button>

      </div>
    </div>
  )
}
