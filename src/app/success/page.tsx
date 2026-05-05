import Link from 'next/link'

export default function SuccessPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-[#FAF6F0] p-6"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* Ambient radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(180,120,60,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">

        {/* Brand mark */}
        <Link href="/" className="inline-flex flex-col items-center gap-1 mb-10 group">
          <div className="w-10 h-10 rounded-full bg-amber-800/10 flex items-center justify-center
            group-hover:bg-amber-800/15 transition-colors duration-200">
            <span className="text-xl">☕</span>
          </div>
          <p
            className="font-bold text-amber-900 text-base tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pure Coffee
          </p>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-stone-100
          shadow-[0_4px_40px_rgba(120,80,30,0.10)] overflow-hidden">

          {/* Top accent stripe */}
          <div className="h-1 bg-gradient-to-r from-amber-700/40 via-amber-600 to-amber-700/40" />

          <div className="px-10 py-12">

            {/* Success icon */}
            <div className="relative inline-flex items-center justify-center mb-8">
              {/* Outer ring */}
              <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200/60
                flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-amber-700"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              {/* Decorative dot */}
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-400/60" />
            </div>

            {/* Heading */}
            <h1
              className="text-3xl font-bold text-stone-800 mb-3 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pesanan Berhasil!
            </h1>

            {/* Subtext */}
            <p className="text-stone-500 leading-relaxed text-sm mb-2">
              Terima kasih sudah memesan. Pesanan Anda sedang kami proses dan akan segera dikirimkan.
            </p>

            {/* Divider */}
            <div className="h-px bg-stone-100 my-8" />

            {/* Info pills */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {[
                { icon: '📦', label: 'Dikemas dalam 1×24 jam' },
                { icon: '📬', label: 'Konfirmasi via email' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-stone-50 border border-stone-100
                    px-4 py-2.5 rounded-full text-xs text-stone-500"
                >
                  <span className="text-sm">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full bg-amber-800
                hover:bg-amber-700 text-amber-50 font-semibold py-4 px-6 rounded-xl
                transition-all duration-200 text-sm tracking-wide
                shadow-md shadow-amber-800/20 hover:shadow-amber-700/30 hover:-translate-y-0.5"
            >
              Lanjutkan Belanja
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Secondary link */}
            <Link
              href="/"
              className="inline-block mt-4 text-stone-400 hover:text-amber-800 text-xs
                transition-colors duration-200"
            >
              Kembali ke Beranda
            </Link>

          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-stone-400 text-xs flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Cek email Anda untuk detail pesanan
        </p>
      </div>
    </main>
  )
}
