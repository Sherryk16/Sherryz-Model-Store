'use client'

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/ProductCard"
import supabase from "@/lib/supabase"

interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image_url: string
  images?: string[]
  category: string
  isNew?: boolean
  sizes?: string[]
  colors?: string[]
  description?: string
}

export function StreetWear() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('is_streetwear', true)
      if (error) setError('Failed to load streetwear products.')
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-2 text-black tracking-tight uppercase">Street Wear</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">Bold, urban-inspired looks for every day. Discover our latest streetwear collection, crafted for comfort and style.</p>
      </div>
      {loading && <div className="p-8 text-center text-gray-500">Loading streetwear...</div>}
      {error && <div className="p-8 text-red-500">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="p-8 text-center text-gray-400">No Street Wear Available</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.original_price}
            image={product.image_url}
            images={product.images}
            category={product.category}
            isNew={product.isNew}
            sizes={product.sizes}
            colors={product.colors}
            monochrome
            description={product.description || ''}
          />
        ))}
      </div>
    </section>
  )
} 