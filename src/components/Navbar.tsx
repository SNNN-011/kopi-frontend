// components/Navbar.tsx
'use client'

import Link               from 'next/link'
import { usePathname, useRouter }    from 'next/navigation'
import { useCart }        from '@/store/cart'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname      = usePathname()
  const router        = useRouter()
  const totalItem     = useCart((s) => s.totalItem())
  const [user, setUser]     = useState<any>(null)
  const [scroll, setScroll] = useState(false)
  
  // Hydration guard state
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Set status mount untuk sinkronisasi render SSR dan CSR
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
      className={`text-sm transition-all duration-200 hover:text-amber-700
        ${pathname === href
          ? 'text-amber-800 font-semibold border-b-2 border-amber-700 pb-0.5'
          : 'text-stone-600'}`}
    >
      {label}
    </Link>
  )

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scroll
        ? 'bg-amber-50/95 backdrop-blur-md shadow-sm border-b border-amber-100'
        : 'bg-amber-50/80 backdrop-blur-sm'}`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">☕</span>
          <div>
            <p className="font-bold text-amber-900 leading-tight text-base tracking-tight">
              Pure Coffee
            </p>
            <p className="text-[10px] text-amber-600 tracking-widest uppercase leading-none">
              Premium Ground Coffee
            </p>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {navLink('/', 'Beranda')}
          {navLink('/products', 'Katalog')}
          {isMounted && user?.role === 'admin' && navLink('/admin', 'Dashboard')}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-amber-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {/* Conditional rendering dengan isMounted untuk mencegah hydration error */}
            {isMounted && totalItem > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-700 text-white text-[10px]
                font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItem > 9 ? '9+' : totalItem}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isMounted && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-600 hidden md:block">
                  Halo, <b className="text-amber-800">{user.nama}</b>
                </span>
                <button
                  onClick={logout}
                  className="text-xs text-stone-500 hover:text-red-600 transition-colors px-2 py-1"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-amber-800 text-amber-50 px-4 py-1.5 rounded-full
                  hover:bg-amber-700 transition-colors font-medium"
              >
                Masuk
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}