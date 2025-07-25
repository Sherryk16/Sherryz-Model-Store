'use client'

// app/products/page.tsx
import { useEffect, useMemo, useState } from 'react'
import supabase from '@/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  description: string
  sizes: string[]
  colors: string[]
  category?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean)
    return Array.from(new Set(cats))
  }, [products])

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category ? product.category === category : true
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*')
      if (error) setError('Failed to load products.')
      if (data) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
      </div>
    )
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 mb-2 sm:mb-0">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="border rounded p-4 shadow">
              <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-sm text-gray-700 mb-2">PKR {product.price}</p>
              <p className="text-sm text-gray-500 mb-4">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
