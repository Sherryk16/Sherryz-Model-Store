'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import createClient from '@/lib/supabase'
import { ProductCard } from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
  sizes: string[]
  colors: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient

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
  }, [query, supabase])

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
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {query ? `Search results for "${query}"` : 'Search Products'}
          </h2>
          <p className="mt-2 text-gray-600">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name} 
                price={product.price} 
                image={product.image_url} 
                description={product.description} 
                sizes={product.sizes} 
                colors={product.colors}
                category=""
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 