'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'

const paymentMethods = [
  {
    value: 'transfer',
    label: 'Transfer Bank',
    desc: 'BCA, Mandiri, BNI, BRI',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    value: 'qris',
    label: 'QRIS',
    desc: 'Scan QR dari aplikasi manapun',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    value: 'ewallet',
    label: 'E-Wallet',
    desc: 'GoPay, OVO, Dana, ShopeePay',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalHarga, totalItem, kosongkan } = useCart()

  const [formData, setFormData] = useState({
    nama: '',
    alamatLengkap: '',
    kota: '',
    kodePos: '',
    telepon: '',
  })

  const [metodeBayar, setMetodeBayar] = useState('transfer')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthToken = () => {
    if (typeof window !== 'undefined') return localStorage.getItem('kopi-token')
    return null
  }

  useEffect(() => {
    if (items.length === 0 && !isProcessing) router.push('/cart')
    if (!getAuthToken()) {
      router.push('/login')
    }
  }, [items, router, isProcessing])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const item of items) {
      if (item.jumlah < 1 || item.jumlah > 100) {
        setError('Jumlah item tidak valid (1–100).')
        return
      }
    }
    setIsProcessing(true)
    setError(null)
    const token = getAuthToken()
    if (!token) return
    try {
      const orderPayload = {
  alamat: {
    nama:    formData.nama,
    jalan:   formData.alamatLengkap,
    kota:    formData.kota,
    kodePos: formData.kodePos,
    telepon: formData.telepon,
  },
  metodePembayaran: metodeBayar,
  items: items.map((item) => ({ produkId: item.id, jumlah: item.jumlah })),
}
      const orderRes = await fetch('https://kopi-backend-production.up.railway.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderPayload),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.message || 'Gagal membuat pesanan.')

      const paymentRes = await fetch('https://kopi-backend-production.up.railway.app/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: orderData.order._id }),
      })
      const paymentData = await paymentRes.json()
      if (!paymentRes.ok || !paymentData.sukses)
        throw new Error(paymentData.message || 'Pembayaran gagal diproses.')

      kosongkan()
      router.push('/success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba kembali.')
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !isProcessing) return null

  const inputClass =
    'w-full px-4 py-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-sm ' +
    'focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 outline-none transition-all ' +
    'placeholder:text-stone-300'

  return (
    <main
      className="min-h-screen pt-24 pb-16 px-6 bg-[#FAF6F0]"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-amber-700/80 text-[10px] tracking-[0.3em] uppercase mb-3 font-semibold flex items-center gap-2">
            <span className="w-4 h-px bg-amber-700/50 inline-block" />
            Tahap Akhir
          </p>
          <h1
            className="text-4xl font-bold text-stone-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Penyelesaian Pesanan
          </h1>
          <div className="h-px bg-gradient-to-r from-amber-200/80 via-stone-200 to-transparent mt-5" />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl
            text-sm font-medium flex items-start gap-3">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Panel — Form */}
          <div className="w-full lg:w-3/5">
            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-6">

              {/* Shipping Card */}
              <div className="bg-white rounded-2xl border border-stone-100
                shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-7">
                <h2
                  className="text-base font-bold text-stone-800 mb-5 flex items-center gap-2.5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span className="w-6 h-6 rounded-full bg-amber-800 text-amber-50 flex items-center
                    justify-center text-xs font-bold flex-shrink-0">1</span>
                  Informasi Pengiriman
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase
                      tracking-wider mb-1.5">
                      Nama Penerima
                    </label>
                    <input
                      required type="text" name="nama"
                      placeholder="Nama lengkap penerima"
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase
                      tracking-wider mb-1.5">
                      Alamat Lengkap
                    </label>
                    <textarea
                      required name="alamatLengkap" rows={3}
                      placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan..."
                      onChange={handleInputChange}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase
                        tracking-wider mb-1.5">
                        Kota / Kabupaten
                      </label>
                      <input
                        required type="text" name="kota"
                        placeholder="Jakarta Selatan"
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-500 uppercase
                        tracking-wider mb-1.5">
                        Kode Pos
                      </label>
                      <input
                        required type="text" name="kodePos"
                        placeholder="12345"
                        onChange={handleInputChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase
                      tracking-wider mb-1.5">
                      Nomor Telepon
                    </label>
                    <input
                      required type="tel" name="telepon"
                      maxLength={13}
                      placeholder="08xxxxxxxxxx"
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '')
                        setFormData({ ...formData, telepon: val })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Card */}
              <div className="bg-white rounded-2xl border border-stone-100
                shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-7">
                <h2
                  className="text-base font-bold text-stone-800 mb-5 flex items-center gap-2.5"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <span className="w-6 h-6 rounded-full bg-amber-800 text-amber-50 flex items-center
                    justify-center text-xs font-bold flex-shrink-0">2</span>
                  Metode Pembayaran
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setMetodeBayar(method.value)}
                      className={`flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${metodeBayar === method.value
                          ? 'border-amber-700 bg-amber-50 text-amber-900'
                          : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'}`}
                    >
                      <span className={metodeBayar === method.value ? 'text-amber-700' : 'text-stone-400'}>
                        {method.icon}
                      </span>
                      <span className="font-semibold text-sm">{method.label}</span>
                      <span className="text-xs leading-relaxed opacity-70">{method.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

            </form>
          </div>

          {/* Right Panel — Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-[#1C1208] text-stone-100 p-7 rounded-2xl shadow-xl sticky top-24
              relative overflow-hidden border border-stone-800/50">

              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full
                bg-amber-800/20 blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full
                bg-amber-900/10 blur-2xl -ml-10 -mb-10 pointer-events-none" />

              <div className="relative z-10">
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Ringkasan Pesanan
                </h2>
                <p className="text-stone-500 text-xs mb-6">{totalItem()} item dipilih</p>

                {/* Divider */}
                <div className="h-px bg-stone-700/60 mb-5" />

                {/* Items */}
                <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1
                  scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-3 text-sm">
                      <span className="text-stone-400 leading-relaxed flex-1 min-w-0">
                        <span className="text-stone-200 font-medium truncate block">{item.nama}</span>
                        <span className="text-amber-600 text-xs">× {item.jumlah}</span>
                      </span>
                      <span className="font-semibold text-stone-200 whitespace-nowrap tabular-nums">
                        Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px bg-stone-700/60 mb-5" />

                {/* Total */}
                <div className="flex justify-between items-baseline mb-7">
                  <span className="text-stone-400 text-xs uppercase tracking-widest">Total</span>
                  <span
                    className="text-3xl font-bold text-amber-400"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Rp {totalHarga().toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-stone-700
                    disabled:text-stone-500 disabled:cursor-not-allowed text-amber-50
                    font-bold py-4 rounded-xl transition-all duration-200 text-sm tracking-widest
                    uppercase shadow-lg shadow-amber-900/30 hover:shadow-amber-700/30
                    hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-stone-600 text-[11px] mt-4 flex items-center justify-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Transaksi diproses dengan aman
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
