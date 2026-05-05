'use client'

import Link from 'next/link'
import { useCart } from '@/store/cart'

// Definisi kontrak tipe data berdasarkan skema Mongoose Anda
interface Product {
  _id: string
  nama: string
  harga: number
  kategori: string
  gambar: string
  berat: string
}

export default function ProductCard({ product }: { product: Product }) {
  const { tambah } = useCart()

  const handleAddToCart = () => {
    tambah({
      id: product._id,
      nama: product.nama,
      harga: product.harga,
      gambar: product.gambar,
      jumlah: 1,
      berat: product.berat // Default value, bisa disesuaikan dengan skema backend
    })
    alert(`${product.nama} ditambahkan ke keranjang`)
  }

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden flex flex-col transition-transform hover:scale-105">
      <img 
        src={product.gambar} 
        alt={product.nama} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-amber-600 uppercase mb-1">
          {product.kategori}
        </span>
        <Link href={`/products/${product._id}`} className="hover:text-amber-800">
          <h3 className="text-lg font-bold text-stone-800 mb-2 line-clamp-2">{product.nama}</h3>
        </Link>
        <p className="text-xl font-semibold text-stone-900 mt-auto mb-4">
          Rp {product.harga.toLocaleString('id-ID')}
        </p>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  )
}