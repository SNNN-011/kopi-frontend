import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col w-full bg-stone-50">
      
      {/* 1. Modul Hero (Kesan Pertama & Call-to-Action) */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-stone-950 overflow-hidden">
        {/* Dekorasi Latar Belakang Geometris (Opsional, mengganti gambar absolut) */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-600 via-stone-900 to-black"></div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-sm mb-4 block">
            Proyek E-Commerce Akademik
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-stone-100 tracking-tight mb-8 leading-tight">
            Ekstraksi <span className="text-amber-600">Presisi</span>,<br /> Rasa Autentik.
          </h1>
          <p className="text-lg md:text-xl text-stone-400 mb-12 leading-relaxed max-w-3xl font-light">
            Implementasi antarmuka Next.js terdistribusi untuk kurasi entitas biji kopi nusantara. 
            Sistem ini dikonstruksi dengan pendekatan arsitektur terpisah (decoupled) untuk mendemonstrasikan kapabilitas integrasi REST API dan manajemen state klien.
          </p>
          
          <Link 
            href="/products" 
            className="inline-flex items-center justify-center px-10 py-5 text-sm font-extrabold text-stone-950 bg-amber-500 rounded hover:bg-amber-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.5)] uppercase tracking-widest"
          >
            Inisialisasi Katalog Produk
          </Link>
        </div>
      </section>

      {/* 2. Modul Spesifikasi Teknis / Value Proposition */}
      <section className="w-full py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-stone-900 uppercase tracking-widest">
              Topologi Sistem
            </h2>
            <div className="w-20 h-1.5 bg-amber-700 mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Indikator 1 */}
            <div className="p-10 border border-stone-200 rounded-2xl bg-stone-50 hover:border-amber-600 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-amber-700 font-bold text-xl">01</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">RESTful Interoperability</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Pemisahan absolut antara layer presentasi dan logika server. Pengambilan data produk dieksekusi secara asinkronus ke instance Express.js.
              </p>
            </div>
            
            {/* Indikator 2 */}
            <div className="p-10 border border-stone-200 rounded-2xl bg-stone-50 hover:border-amber-600 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-amber-700 font-bold text-xl">02</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Client-Side State</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Alokasi memori lokal peramban dikelola menggunakan arsitektur Zustand, memastikan persistensi keranjang belanja tanpa dependensi rendering server.
              </p>
            </div>
            
            {/* Indikator 3 */}
            <div className="p-10 border border-stone-200 rounded-2xl bg-stone-50 hover:border-amber-600 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <span className="text-amber-700 font-bold text-xl">03</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Dynamic Segment Routing</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Pemetaan parameter URL secara real-time untuk mengekstraksi dan melakukan komputasi spesifikasi produk unik dari basis data MongoDB.
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}