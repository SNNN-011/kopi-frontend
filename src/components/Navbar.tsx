'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const totalItem = useCart((s) => s.totalItem())
  const [user, setUser]       = useState<any>(null)
  const [scroll, setScroll]   = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const data = localStorage.getItem('kopi-user')
    if (data) setUser(JSON.parse(data))
    const onScroll = () => setScroll(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('kopi-user')
    localStorage.removeItem('kopi-token')
    setUser(null)
    router.push('/')
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-all duration-200 group
        ${pathname === href ? 'text-amber-800' : 'text-stone-500 hover:text-amber-800'}`}
    >
      {label}
      <span className={`absolute -bottom-0.5 left-0 h-px bg-amber-700 transition-all duration-300
        ${pathname === href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
    </Link>
  )

  return (
    <>
      {/* Ambient top accent line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-gradient-to-r from-transparent via-amber-700/60 to-transparent" />

      <nav
        className={`fixed top-0.5 left-0 right-0 z-40 transition-all duration-500
          ${scroll
            ? 'bg-[#FAF6F0]/95 backdrop-blur-md shadow-[0_1px_20px_rgba(120,80,30,0.10)] border-b border-amber-100/80'
            : 'bg-[#FAF6F0]/80 backdrop-blur-sm'}`}
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-amber-800/10 flex items-center justify-center group-hover:bg-amber-800/20 transition-colors duration-200">
                <span className="text-lg leading-none">☕</span>
              </div>
            </div>
            <div className="leading-none">
              <p
                className="font-bold text-amber-900 text-base tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Pure Coffee
              </p>
              <p className="text-[9px] text-amber-600/80 tracking-[0.2em] uppercase mt-0.5">
                Premium Ground Coffee
              </p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLink('/', 'Beranda')}
            {navLink('/products', 'Katalog')}
            {isMounted && user?.role === 'admin' && navLink('/admin', 'Dashboard')}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-amber-800/8 transition-all duration-200 group"
            >
              <svg
                className="w-5 h-5 text-stone-600 group-hover:text-amber-800 transition-colors duration-200"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>
              {isMounted && totalItem > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-800 text-amber-50 text-[9px]
                  font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {totalItem > 9 ? '9+' : totalItem}
                </span>
              )}
            </Link>

            {/* Divider */}
            <div className="w-px h-4 bg-stone-200 mx-1" />

            {/* Auth */}
            {isMounted && (
              user ? (
                <div className="flex items-center gap-3 pl-1">
                  <div className="hidden md:flex flex-col items-end leading-none">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider">Halo,</span>
                    <span className="text-sm font-semibold text-amber-800 mt-0.5">{user.nama}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs text-stone-400 hover:text-red-500 transition-colors duration-200
                      px-3 py-1.5 rounded-full border border-stone-200 hover:border-red-200
                      hover:bg-red-50 font-medium"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="ml-1 text-sm bg-amber-800 text-amber-50 px-5 py-2 rounded-full
                    hover:bg-amber-700 transition-all duration-200 font-semibold tracking-wide
                    shadow-sm hover:shadow-amber-800/20 hover:-translate-y-px"
                >
                  Masuk
                </Link>
              )
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
