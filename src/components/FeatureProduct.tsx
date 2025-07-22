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
  is_featured?: boolean
  isNew?: boolean
  sizes?: string[]
  colors?: string[]
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)

        if (error) throw error
        setProducts(data)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">Loading featured products...</div>

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-2 text-black tracking-tight uppercase">Featured Collection</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">Discover our handpicked selection of premium pieces designed for the modern connoisseur.</p>
      </div>
      {!loading && products.length === 0 && (
        <div className="p-8 text-center text-gray-400">No Featured Products Available</div>
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
          />
        ))}
      </div>
    </section>
  )
}
