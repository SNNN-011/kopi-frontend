import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-stone-200 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-stone-900 mb-2">Injeksi Order Berhasil</h1>
        <p className="text-stone-600 mb-8 leading-relaxed">
          Siklus pembayaran simulasi telah divalidasi. Parameter pesanan Anda telah berhasil ditulis ke dalam basis data.
        </p>
        <Link 
          href="/products" 
          className="inline-block w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-4 px-6 rounded-lg transition-colors uppercase tracking-widest"
        >
          Kembali ke Katalog Produk
        </Link>
      </div>
    </main>
  )
}