// store/cart.ts — Zustand state keranjang belanja

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id:     string
  nama:   string
  harga:  number
  gambar: string
  jumlah: number
  berat:  string
}

interface CartStore {
  items:         CartItem[]
  tambah:        (item: CartItem) => void
  kurangi:       (id: string) => void
  hapus:         (id: string) => void
  kosongkan:     () => void
  totalItem:     () => number
  totalHarga:    () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Tambah ke keranjang (jika sudah ada, tambah jumlahnya)
      tambah: (item) => set((state) => {
        const ada = state.items.find((i) => i.id === item.id)
        if (ada) {
          return {
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, jumlah: i.jumlah + item.jumlah }
                : i
            )
          }
        }
        return { items: [...state.items, item] }
      }),

      // Kurangi jumlah 1, kalau jumlah jadi 0 hapus dari list
      kurangi: (id) => set((state) => ({
        items: state.items
          .map((i) => i.id === id ? { ...i, jumlah: i.jumlah - 1 } : i)
          .filter((i) => i.jumlah > 0)
      })),

      // Hapus item dari keranjang
      hapus: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      // Kosongkan keranjang (setelah checkout)
      kosongkan: () => set({ items: [] }),

      // Total jumlah item (untuk badge di navbar)
      totalItem: () => get().items.reduce((sum, i) => sum + i.jumlah, 0),

      // Total harga semua item
      totalHarga: () => get().items.reduce(
        (sum, i) => sum + i.harga * i.jumlah, 0
      )
    }),
    { name: 'kopi-cart' } // disimpan di localStorage otomatis
  )
)