'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import CartSidebar from '@/components/CartSidebar'

interface CartProviderProps {
  children: ReactNode
}

interface CartContextType {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartSidebarProvider({ children }: CartProviderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  const openCart = () => {
    console.log('Opening cart...')
    setIsCartOpen(true)
  }

  const closeCart = () => {
    console.log('Closing cart...')
    setIsCartOpen(false)
  }

  return (
    <CartContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </CartContext.Provider>
  )
}

export function useCartSidebar() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartSidebar must be used within a CartSidebarProvider')
  }
  return context
} 