import ProductCard from '@/components/ProductCard'

// Fungsi pengambilan data ke REST API Backend Express
async function getProducts() {
  try {
    // Parameter 'no-store' memaksa Next.js untuk selalu mengambil data terbaru (mematikan static caching)
    const res = await fetch('http://localhost:5000/api/products', { cache: 'no-store' })
    if (!res.ok) throw new Error('Gagal melakukan ekstraksi data produk')
    return res.json()
  } catch (error) {
    console.error("Fetch error:", error)
    return []
  }
}

export default async function CatalogPage() {
  const products = await getProducts()

  return (
    <main className="min-h-screen p-8 pt-24 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Katalog Kopi</h1>
          <p className="text-stone-500 mt-2">Pilih varian biji kopi murni untuk kebutuhan Anda.</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">
              Koneksi ke backend gagal atau database kosong. Pastikan server Express di port 5000 sedang berjalan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}