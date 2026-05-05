// app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalHarga, totalItem, kosongkan } = useCart()

  const [formData, setFormData] = useState({
    nama: '',
    alamatLengkap: '',
    kota: '',
    kodePos: '',
    telepon: ''
  })
  
  const [metodeBayar, setMetodeBayar] = useState('transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ekstraksi JWT Token untuk otorisasi endpoint
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kopi-token')
    }
    return null
  }

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/cart')
    }
    if (!getAuthToken()) {
      alert('Akses ditolak. Resolusi otentikasi diperlukan sebelum melakukan transaksi.')
      router.push('/login')
    }
  }, [items, router, isProcessing])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    
    for (const item of items) {
      if (item.jumlah < 1 || item.jumlah > 100) {
        setError('Anomali data: Jumlah item di luar batas rasional (1-100).')
        return
      }
    }
    
    setIsProcessing(true)
    setError(null)

    const token = getAuthToken()
    if (!token) return

    try {
      const orderPayload = {
        alamat: `${formData.alamatLengkap}, ${formData.kota}, ${formData.kodePos} (Telp: ${formData.telepon})`,
        metodePembayaran: metodeBayar,
        items: items.map(item => ({
          produkId: item.id,
          jumlah: item.jumlah
        }))
      }

      const orderRes = await fetch('https://kopi-backend-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderPayload)
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.message || 'Kegagalan komputasi saat inisialisasi order.')

      const generatedOrderId = orderData.order._id

      const paymentRes = await fetch('https://kopi-backend-production.up.railway.app/api/payment/simulate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ orderId: generatedOrderId })
      })

      const paymentData = await paymentRes.json()
      
      if (!paymentRes.ok || !paymentData.sukses) {
        throw new Error(paymentData.message || 'Gateway pembayaran menolak instruksi komputasi. Silakan coba kembali.')
      }

      kosongkan()
      router.push('/success')

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Terjadi fault sistem yang tidak terpetakan.')
      }
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing) return null

  return (
    <main className="min-h-screen p-8 pt-24 bg-[#FAF6F0]" style={{ fontFamily: "'Lato', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-amber-800 text-xs tracking-[0.25em] uppercase mb-2 font-medium">
            ✦ Tahap Akhir
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-4xl font-bold text-stone-900">
            Penyelesaian Transaksi
          </h1>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-700 text-red-900 font-medium shadow-sm">
            <p>Exception: {error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panel Kiri: Form */}
          <div className="w-full lg:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 mb-6 border-b border-stone-100 pb-4">Informasi Logistik</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Nama Penerima</label>
                <input required type="text" name="nama" onChange={handleInputChange} 
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Alamat Spesifik</label>
                <textarea required name="alamatLengkap" rows={3} onChange={handleInputChange} 
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 outline-none transition-all"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Kota/Kabupaten</label>
                  <input required type="text" name="kota" onChange={handleInputChange} 
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Kode Pos</label>
                  <input required type="text" name="kodePos" onChange={handleInputChange} 
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Nomor Kontak Operasional</label>
                <input
                    required
                    type="tel"
                    name="telepon"
                    maxLength={13}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setFormData({ ...formData, telepon: val })
                    }}
                    className="w-full p-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 outline-none transition-all"
                  />
              </div>

              <h2 className="text-xl font-bold text-stone-800 mt-10 mb-4 border-b border-stone-100 pb-4">Konfigurasi Gateway Pembayaran</h2>
              <select name="metodeBayar" value={metodeBayar} onChange={(e) => setMetodeBayar(e.target.value)} 
                className="w-full p-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-amber-800 outline-none font-medium cursor-pointer transition-all">
                <option value="transfer">Transfer Bank Konvensional</option>
                <option value="qris">QRIS Terintegrasi</option>
                <option value="ewallet">E-Wallet Platform</option>
              </select>
            </form>
          </div>

          {/* Panel Kanan: Summary dengan tema Kopi Peat/Cokelat Gelap */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#1C1008] text-amber-50 p-8 rounded-2xl shadow-xl sticky top-24 relative overflow-hidden">
              {/* Subtle background texture overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: `radial-gradient(circle at 80% 20%, #8B5E3C 0%, transparent 50%)` }} />
                
              <div className="relative z-10">
                <h2 style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold mb-6 border-b border-stone-700 pb-4">
                  Total Komputasi
                </h2>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-stone-800/60 pb-3">
                      <span className="truncate pr-4 text-stone-300">
                        {item.nama} <span className="text-amber-500 font-medium ml-1">x{item.jumlah}</span>
                      </span>
                      <span className="font-semibold whitespace-nowrap text-amber-50">
                        Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm">
                  <span className="text-stone-300 font-medium text-sm uppercase tracking-wide">Akumulasi Tagihan</span>
                  <span className="text-2xl font-black text-amber-400">Rp {totalHarga().toLocaleString('id-ID')}</span>
                </div>
                <button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-500 text-stone-950 font-bold py-4 rounded-xl transition-all duration-200 uppercase tracking-widest shadow-lg hover:shadow-amber-900/40 disabled:shadow-none"
                >
                  {isProcessing ? 'Memproses...' : 'Inisialisasi Pembayaran'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}