'use client'

import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  size?: string
  color?: string
  quantity?: number
  colors?: string[]
  sizes?: string[]
}

export function AddToCartButton({ product, disabled = false }: { product: Product, disabled?: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { addToCart } = useCart()

  const handleAdd = () => {
    setLoading(true)
    addToCart({ ...product })
    setTimeout(() => {
      setLoading(false)
      router.push('/cart')
    }, 300)
  }

  return (
    <button
      onClick={handleAdd}
      className="bg-primary text-white px-6 py-2 rounded mt-4 disabled:opacity-50"
      disabled={loading || disabled}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
