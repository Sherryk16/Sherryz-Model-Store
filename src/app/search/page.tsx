'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import supabase from '@/lib/supabase'
import { ProductCard } from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
  sizes: string[]
  colors: string[]
  original_price?: number
  images?: string[]
  category?: string
  isNew?: boolean
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function searchProducts() {
      if (!query) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('name', `%${query}%`)
          .order('name')

        if (error) throw error

        setProducts(data || [])
      } catch (err) {
        console.error('Error searching products:', err)
        setError('Failed to search products')
      } finally {
        setLoading(false)
      }
    }

    searchProducts()
  }, [query])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Searching...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price}
              image={product.image_url}
              images={product.images}
              category={product.category || ''}
              isNew={product.isNew}
              sizes={product.sizes}
              colors={product.colors}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  )
} 