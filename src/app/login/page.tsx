'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  
  // State manajemen mode form (Login vs Registrasi)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorPayload, setErrorPayload] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorPayload(null)

    // Penentuan endpoint dinamis berdasarkan state mode
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register'
    
    // Penyesuaian payload: Registrasi butuh 'nama', Login hanya butuh 'email' & 'password'
    const payload = isLoginMode 
      ? { email: formData.email, password: formData.password }
      : formData

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Eksekusi otentikasi ditolak oleh server.')
      }

      if (isLoginMode) {
        // Injeksi JWT token dan entitas user ke memori lokal peramban
        localStorage.setItem('kopi-token', data.token)
        localStorage.setItem('kopi-user', JSON.stringify(data.user))
        
        // Relokasi kembali ke rute checkout untuk melanjutkan siklus transaksi
        router.push('/checkout')
      } else {
        // Jika registrasi berhasil, paksa pengguna untuk melakukan login
        alert('Registrasi entitas pengguna berhasil. Silakan lakukan otentikasi log masuk.')
        setIsLoginMode(true)
        setFormData({ ...formData, password: '' }) // Pembersihan field password
      }

    } catch (err: any) {
      setErrorPayload(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
        
        <div className="bg-stone-900 text-center py-6">
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            {isLoginMode ? 'Otentikasi Klien' : 'Registrasi Entitas'}
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {isLoginMode ? 'Akses sesi Anda untuk melanjutkan transaksi' : 'Inisialisasi data pengguna baru'}
          </p>
        </div>

        <div className="p-8">
          {errorPayload && (
            <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-600 text-red-800 text-sm font-semibold">
              Exception: {errorPayload}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama" 
                  required={!isLoginMode}
                  value={formData.nama}
                  onChange={handleInputChange} 
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" 
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Alamat Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email}
                onChange={handleInputChange} 
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Kredensial Sandi</label>
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password}
                onChange={handleInputChange} 
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded focus:ring-2 focus:ring-amber-500 outline-none" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-400 text-white font-extrabold py-3 rounded uppercase tracking-widest transition-colors mt-4"
            >
              {isProcessing ? 'Memvalidasi...' : (isLoginMode ? 'Otorisasi' : 'Daftarkan')}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-stone-200 pt-6">
            <p className="text-sm text-stone-600">
              {isLoginMode ? 'Belum memiliki entitas akun?' : 'Sudah terdaftar di basis data?'}
            </p>
            <button 
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode)
                setErrorPayload(null)
              }}
              className="mt-2 text-amber-700 hover:text-stone-900 font-bold text-sm tracking-wide transition-colors"
            >
              {isLoginMode ? 'INISIALISASI REGISTRASI' : 'KEMBALI KE OTENTIKASI'}
            </button>
          </div>
        </div>

      </div>
    </main>
  )
}