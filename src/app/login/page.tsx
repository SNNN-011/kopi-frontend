'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AuthPage() {
  const router = useRouter()
  const [isLoginMode, setIsLoginMode]       = useState(true)
  const [isProcessing, setIsProcessing]     = useState(false)
  const [errorPayload, setErrorPayload]     = useState<string | null>(null)

  const [formData, setFormData] = useState({ nama: '', email: '', password: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setErrorPayload(null)

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register'
    const payload  = isLoginMode
      ? { email: formData.email, password: formData.password }
      : formData

    try {
      const response = await fetch(
        `https://kopi-backend-production.up.railway.app${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Autentikasi gagal.')

      if (isLoginMode) {
        localStorage.setItem('kopi-token', data.token)
        localStorage.setItem('kopi-user', JSON.stringify(data.user))
        router.push('/checkout')
      } else {
        alert('Registrasi berhasil. Silakan masuk dengan akun Anda.')
        setIsLoginMode(true)
        setFormData({ ...formData, password: '' })
      }
    } catch (err: any) {
      setErrorPayload(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const inputClass =
    'w-full px-4 py-3.5 bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-sm ' +
    'focus:ring-2 focus:ring-amber-700/30 focus:border-amber-700 outline-none transition-all ' +
    'placeholder:text-stone-300'

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#FAF6F0] p-6"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* Subtle radial ambient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(180,120,60,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="w-full max-w-md relative z-10">

        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-1 group">
            <div className="w-14 h-14 rounded-full bg-amber-800/10 flex items-center justify-center
              group-hover:bg-amber-800/15 transition-colors duration-200 mb-1">
              <span className="text-3xl">☕</span>
            </div>
            <p
              className="font-bold text-amber-900 text-xl tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pure Coffee
            </p>
            <p className="text-[9px] text-amber-600/70 tracking-[0.25em] uppercase">
              Premium Ground Coffee
            </p>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl border border-stone-100 shadow-[0_4px_40px_rgba(120,80,30,0.10)] overflow-hidden">

          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 border-b border-stone-100">
            <h1
              className="text-2xl font-bold text-stone-800 mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {isLoginMode ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h1>
            <p className="text-stone-400 text-sm">
              {isLoginMode
                ? 'Masuk untuk melanjutkan belanja Anda'
                : 'Daftar dan mulai perjalanan kopi Anda'}
            </p>
          </div>

          {/* Form Body */}
          <div className="px-8 py-7">

            {/* Error */}
            {errorPayload && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl
                text-sm font-medium flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {errorPayload}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase
                    tracking-wider mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text" name="nama"
                    required={!isLoginMode}
                    value={formData.nama}
                    placeholder="Nama Anda"
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase
                  tracking-wider mb-1.5">
                  Alamat Email
                </label>
                <input
                  type="email" name="email"
                  required
                  value={formData.email}
                  placeholder="email@contoh.com"
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase
                  tracking-wider mb-1.5">
                  Kata Sandi
                </label>
                <input
                  type="password" name="password"
                  required
                  value={formData.password}
                  placeholder="••••••••"
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-2 bg-amber-800 hover:bg-amber-700 disabled:bg-stone-300
                  disabled:cursor-not-allowed text-amber-50 font-bold py-4 rounded-xl
                  transition-all duration-200 text-sm tracking-widest uppercase
                  shadow-md shadow-amber-800/20 hover:shadow-amber-700/30 hover:-translate-y-0.5
                  flex items-center justify-center gap-2"
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
                  isLoginMode ? 'Masuk' : 'Daftar Sekarang'
                )}
              </button>
            </form>

            {/* Mode Toggle */}
            <div className="mt-6 pt-6 border-t border-stone-100 text-center">
              <p className="text-stone-400 text-sm">
                {isLoginMode ? 'Belum punya akun?' : 'Sudah punya akun?'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode)
                  setErrorPayload(null)
                }}
                className="mt-2 text-amber-800 hover:text-amber-600 font-bold text-sm
                  transition-colors duration-200 tracking-wide underline underline-offset-4
                  decoration-amber-300 hover:decoration-amber-600"
              >
                {isLoginMode ? 'Buat akun baru' : 'Masuk ke akun saya'}
              </button>
            </div>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-5">
          <Link
            href="/"
            className="text-stone-400 hover:text-amber-800 text-xs transition-colors duration-200
              flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  )
}
