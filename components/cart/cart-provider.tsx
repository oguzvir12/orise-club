'use client'

import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react'

export type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  type: 'product' | 'ticket' // Ürün mü bilet mi ayrımı
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  count: number
  subtotal: number
  openCart: () => void
  closeCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Sayfa yüklendiğinde sepete localStorage'dan çek
  useEffect(() => {
    const saved = localStorage.getItem('orise_cart')
    if (saved) setItems(JSON.parse(saved))
    setIsLoaded(true)
  }, [])

  // Her değişiklikte localStorage'ı güncelle
  useEffect(() => {
    if (isLoaded) localStorage.setItem('orise_cart', JSON.stringify(items))
  }, [items, isLoaded])

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return {
      items,
      isOpen,
      count,
      subtotal,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (item) => {
        setItems((prev) => {
          const existing = prev.find((i) => i.id === item.id)
          if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
          return [...prev, { ...item, quantity: 1 }]
        })
        setIsOpen(true)
      },
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      updateQuantity: (id, quantity) => setItems((prev) => quantity <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, quantity } : i))),
    }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
