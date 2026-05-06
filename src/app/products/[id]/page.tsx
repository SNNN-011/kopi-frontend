// src/app/products/[id]/page.tsx
'use client'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen pt-32 pb-24 text-center">
      <h1 className="text-2xl font-bold text-stone-800">
        Halaman Detail Produk
      </h1>
      <p className="text-stone-500 mt-4">
        ID Produk: {params.id}
      </p>
      {/* Nanti di sini kamu bisa tambahkan useEffect untuk fetch data spesifik produk ini dari backend */}
    </div>
  )
}