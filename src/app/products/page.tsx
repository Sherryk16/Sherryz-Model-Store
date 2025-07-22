'use client'

// app/products/page.tsx
import { useEffect, useState, useMemo } from 'react'
import supabase from '@/lib/supabase'
import { ProductCard } from '@/components/ProductCard'

// Define the Product type
interface Product {
  id: string
  name: string
  price: number
  original_price?: number
  image_url: string
  description: string
  category: string
  sizes: string[]
  colors: string[]
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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center pt-16 pb-10">
          <h1 className="text-5xl font-extrabold mb-4 text-gray-900 drop-shadow">All Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Browse our full collection of premium, creative, and trending street wear. Find your perfect streetwear fit or get inspired to design your own.</p>
        </div>
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 bg-white rounded-xl shadow p-4 gap-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-base"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="w-full sm:w-1/4 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-base"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
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
              monochrome={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
