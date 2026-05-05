'use client'

import { useCart, CartItem as CartItemType } from '@/store/cart'

export default function CartItem({ item }: { item: CartItemType }) {
  const { tambah, kurangi, hapus } = useCart()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm mb-4 transition-all duration-200 hover:border-zinc-700 hover:shadow-md">
      
      {/* Product Info Section */}
      <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
        <img 
          src={item.gambar} 
          alt={item.nama} 
          className="w-20 h-20 object-cover rounded-lg bg-zinc-800 border border-zinc-700" 
        />
        <div className="flex-1">
          <h3 className="font-bold text-zinc-100 text-lg tracking-tight">{item.nama}</h3>
          <p className="text-zinc-400 text-sm font-medium">
            Rp {item.harga.toLocaleString('id-ID')} <span className="text-zinc-600 mx-1">•</span> {item.berat}
          </p>
        </div>
      </div>
      
      {/* Controls & Price Section */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-0 sm:space-x-6">
        
        {/* Quantity Controls */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <button 
            onClick={() => kurangi(item.id)} 
            className="px-3.5 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            -
          </button>
          <span className="px-4 py-1.5 border-x border-zinc-800 text-zinc-200 font-medium bg-zinc-900/50">
            {item.jumlah}
          </span>
          <button 
            onClick={() => tambah(item)} 
            className="px-3.5 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Total Price & Delete Action */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <p className="font-bold text-amber-500 min-w-[120px] text-right text-lg">
            Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
          </p>
          <button 
            onClick={() => hapus(item.id)} 
            className="text-red-500/80 hover:text-red-400 text-sm font-bold px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md transition-all duration-200"
          >
            HAPUS
          </button>
        </div>

      </div>
    </div>
  )
}