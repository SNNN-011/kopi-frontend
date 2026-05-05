// src/app/admin/products/page.tsx
'use client';

import { useState, useEffect } from 'react';

// Definisi interface berdasarkan skema Mongoose Anda
interface Product {
  _id?: string;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  kategori: string;
  berat: string;
  gambar: string;
}

export default function AdminProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk form Create Product
  const [formData, setFormData] = useState<Product>({
    nama: '',
    deskripsi: '',
    harga: 0,
    stok: 0,
    kategori: 'arabika', // Default value
    berat: '',
    gambar: ''
  });

  // Fungsi READ: Mengambil data dari backend
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('Gagal mengambil data produk');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler mutasi form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'harga' || name === 'stok' ? Number(value) : value
    }));
  };

  // Fungsi CREATE: Mengirim payload POST ke backend
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem('kopi-token');
  
  if (!token) {
    alert("Otorisasi ditolak: Silakan login sebagai admin.");
    return;
  }

  // Tentukan apakah ini Edit atau Tambah Baru
  const isEditing = !!formData._id; 
  const url = isEditing 
    ? `http://localhost:5000/api/products/${formData._id}` 
    : 'http://localhost:5000/api/products';
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: method, // Dinamis: bisa POST atau PUT
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) throw new Error('Gagal memproses data produk');

    alert(isEditing ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan');
    fetchProducts();
    
    // Reset form ke awal
    setFormData({
      nama: '', deskripsi: '', harga: 0, stok: 0, kategori: 'arabika', berat: '', gambar: ''
    });
  } catch (err: any) {
    alert(`Kesalahan: ${err.message}`);
  }
};

  // Fungsi DELETE (Placeholder untuk Anda kembangkan)
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus produk ini?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('kopi-token');
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal menghapus entitas');
      fetchProducts();
    } catch (err: any) {
      alert(`Gagal mengeksekusi DELETE: ${err.message}`);
    }
  };

  if (loading) return <div className="p-8 text-stone-500">Memuat arsitektur data...</div>;

  return (
    <main className="min-h-screen p-8 bg-stone-100 flex gap-8 pt-24">
      {/* Kolom Form (CREATE) */}
      {/* Kolom Form (CREATE & UPDATE) */}
      <section className="w-1/3 bg-white p-6 rounded-lg shadow-sm h-fit">
        {/* 1. Judul form berubah otomatis */}
        <h2 className="text-xl font-bold text-amber-900 mb-4">
          {formData._id ? 'Edit Data Produk' : 'Tambah Produk Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-stone-600">Nama Produk</label>
            <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required className="w-full border p-2 rounded mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-stone-600">Deskripsi</label>
            <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} required className="w-full border p-2 rounded mt-1" rows={3}></textarea>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-semibold text-stone-600">Harga (Rp)</label>
              <input type="number" name="harga" value={formData.harga} onChange={handleInputChange} required min="0" className="w-full border p-2 rounded mt-1" />
            </div>
            <div className="w-1/2">
              <label className="text-sm font-semibold text-stone-600">Stok</label>
              <input type="number" name="stok" value={formData.stok} onChange={handleInputChange} required min="0" className="w-full border p-2 rounded mt-1" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-semibold text-stone-600">Kategori</label>
              <select name="kategori" value={formData.kategori} onChange={handleInputChange} className="w-full border p-2 rounded mt-1">
                <option value="arabika">Arabika</option>
                <option value="robusta">Robusta</option>
                <option value="campuran">Blend</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="text-sm font-semibold text-stone-600">Berat</label>
              <input type="text" name="berat" value={formData.berat} onChange={handleInputChange} required placeholder="Contoh: 250g" className="w-full border p-2 rounded mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-stone-600">URL Gambar</label>
            <input type="text" name="gambar" value={formData.gambar} onChange={handleInputChange} required className="w-full border p-2 rounded mt-1" />
          </div>
          
          {/* 2. Teks tombol submit berubah otomatis */}
          <button type="submit" className="bg-amber-700 text-white p-2 rounded mt-2 hover:bg-amber-800 transition font-semibold w-full">
            {formData._id ? 'Simpan Perubahan' : 'Tambah Produk'}
          </button>

          {/* 3. Tambahan tombol Batal Edit (Hanya muncul saat mode edit) */}
          {formData._id && (
            <button 
              type="button"
              onClick={() => setFormData({ nama: '', deskripsi: '', harga: 0, stok: 0, kategori: 'arabika', berat: '', gambar: '' })}
              className="mt-1 text-sm text-stone-500 hover:text-amber-700 underline transition-colors"
            >
              Batal Edit / Kembali Tambah Baru
            </button>
          )}
        </form>
      </section>

      {/* Kolom Tabel (READ & DELETE) */}
      <section className="w-2/3 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-amber-900 mb-4">Direktori Produk</h2>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-stone-50">
                  <th className="p-3 text-sm font-semibold text-stone-600">Nama</th>
                  <th className="p-3 text-sm font-semibold text-stone-600">Kategori</th>
                  <th className="p-3 text-sm font-semibold text-stone-600">Harga</th>
                  <th className="p-3 text-sm font-semibold text-stone-600">Stok</th>
                  <th className="p-3 text-sm font-semibold text-stone-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-stone-50">
                    <td className="p-3 text-sm">{product.nama}</td>
                    <td className="p-3 text-sm capitalize">{product.kategori}</td>
                    <td className="p-3 text-sm">Rp {product.harga.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-sm">{product.stok}</td>
                    <td className="p-3 text-sm flex gap-2">
                      <button 
  onClick={() => setFormData(product as Product)} 
  className="bg-stone-200 text-stone-700 px-3 py-1 rounded text-xs font-semibold hover:bg-stone-300"
>
  Edit
</button>
                      <button onClick={() => handleDelete(product._id!)} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200">Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-stone-500">Tidak ada data terdeteksi dalam koleksi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}