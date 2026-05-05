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
    // Intersepsi rute jika keranjang kosong atau token tidak valid
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
    setIsProcessing(true)
    setError(null)

    const token = getAuthToken()
    if (!token) return

    try {
      // Fase 1: Remapping properti dan kompilasi payload Order
      const orderPayload = {
        alamat: `${formData.alamatLengkap}, ${formData.kota}, ${formData.kodePos} (Telp: ${formData.telepon})`,
        metodePembayaran: metodeBayar,
        items: items.map(item => ({
          produkId: item.id,
          jumlah: item.jumlah
        }))
      }

      // Fase 2: Eksekusi Injeksi Order Baru ke Database
      const orderRes = await fetch('http://localhost:5000/api/orders', {
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

      // Fase 3: Simulasi Pembayaran berdasarkan Order ID yang telah tervalidasi
      const paymentRes = await fetch('http://localhost:5000/api/payment/simulate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ orderId: generatedOrderId })
      })

      const paymentData = await paymentRes.json()
      
      // Mengakomodasi rasio probabilitas kegagalan 10% dari backend
      if (!paymentRes.ok || !paymentData.sukses) {
        throw new Error(paymentData.message || 'Gateway pembayaran menolak instruksi komputasi. Silakan coba kembali.')
      }

      // Fase 4: Terminasi transaksi dan relokasi antarmuka
      kosongkan()
      router.push('/success')

    } catch (err: any) {
      setError(err.message)
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing) return null

  return (
    <main className="min-h-screen p-8 pt-24 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-8">Penyelesaian Transaksi</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-600 text-red-800 font-medium shadow-sm">
            <p>Exception: {error}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 bg-white p-8 rounded-xl shadow-sm border border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 mb-6 border-b pb-2">Informasi Logistik</h2>
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Nama Penerima</label>
                <input required type="text" name="nama" onChange={handleInputChange} className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Alamat Spesifik</label>
                <textarea required name="alamatLengkap" rows={3} onChange={handleInputChange} className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none transition-shadow"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Kota/Kabupaten</label>
                  <input required type="text" name="kota" onChange={handleInputChange} className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-1">Kode Pos</label>
                  <input required type="text" name="kodePos" onChange={handleInputChange} className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Nomor Kontak Operasional</label>
                <input required type="tel" name="telepon" onChange={handleInputChange} className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none transition-shadow" />
              </div>

              <h2 className="text-xl font-bold text-stone-800 mt-8 mb-4 border-b pb-2">Konfigurasi Gateway Pembayaran</h2>
              <select name="metodeBayar" value={metodeBayar} onChange={(e) => setMetodeBayar(e.target.value)} className="w-full p-3 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none font-medium text-stone-700">
                <option value="transfer">Transfer Bank Konvensional</option>
                <option value="qris">QRIS Terintegrasi</option>
                <option value="ewallet">E-Wallet Platform</option>
              </select>
            </form>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="bg-stone-900 text-white p-6 rounded-xl shadow-lg sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b border-stone-700 pb-2">Total Komputasi Akhir</h2>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-stone-800 pb-2">
                    <span className="truncate pr-4">{item.nama} <span className="text-stone-400">x{item.jumlah}</span></span>
                    <span className="font-semibold whitespace-nowrap">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-8 bg-stone-800 p-4 rounded-lg">
                <span className="text-stone-300 font-medium">Akumulasi Tagihan</span>
                <span className="text-2xl font-black text-amber-500">Rp {totalHarga().toLocaleString('id-ID')}</span>
              </div>
              <button 
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 disabled:text-stone-500 text-white font-extrabold py-4 rounded-lg transition-colors uppercase tracking-widest"
              >
                {isProcessing ? 'Komputasi API...' : 'Inisialisasi Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}