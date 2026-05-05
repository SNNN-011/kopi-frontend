'use client'

import { useCart, CartItem as CartItemType } from '@/store/cart'

export default function CartItem({ item }: { item: CartItemType }) {
  const { tambah, kurangi, hapus } = useCart()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-stone-200 rounded-xl shadow-sm mb-4 transition-all duration-200 hover:border-stone-300 hover:shadow-md">
      
      {/* Product Info Section */}
      <div className="flex items-center space-x-4 mb-4 sm:mb-0 w-full sm:w-auto">
        <img 
          src={item.gambar} 
          alt={item.nama} 
          className="w-20 h-20 object-cover rounded-lg bg-amber-50 border border-stone-100" 
        />
        <div className="flex-1">
          <h3 
            className="font-bold text-stone-800 text-lg tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.nama}
          </h3>
          <p className="text-stone-500 text-sm font-medium">
            Rp {item.harga.toLocaleString('id-ID')} <span className="text-stone-300 mx-1">•</span> {item.berat}
          </p>
        </div>
      </div>
      
      {/* Controls & Price Section */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-0 sm:space-x-6">
        
        {/* Quantity Controls */}
        <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => kurangi(item.id)} 
            className="px-3.5 py-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            -
          </button>
          <span className="px-4 py-1.5 border-x border-stone-200 text-stone-800 font-medium bg-white">
            {item.jumlah}
          </span>
          <button 
            onClick={() => tambah(item)} 
            className="px-3.5 py-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            +
          </button>
        </div>
        
        {/* Total Price & Delete Action */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <p className="font-bold text-amber-800 min-w-[120px] text-right text-lg">
            Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
          </p>
          <button 
            onClick={() => hapus(item.id)} 
            className="text-red-600 hover:text-red-700 text-sm font-bold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-all duration-200"
          >
            HAPUS
          </button>
        </div>

      </div>
    </div>
  )
}