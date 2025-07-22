'use client'

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import supabase from "@/lib/supabase"

interface Category {
  name: string
  product_count: number
}

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category, count:category', { count: 'exact', groupBy: 'category' })
      if (error) setError('Failed to load categories.')
      if (data) setCategories(data.map((c: any) => ({ name: c.category, product_count: c.count })))
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading categories...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>
  if (categories.length === 0) return <div className="p-8 text-center text-gray-500">No Categories Available</div>

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div key={cat.name} className="border rounded-lg p-4 bg-white shadow text-center">
            <div className="font-semibold text-lg mb-2">{cat.name}</div>
            <div className="text-xs text-gray-500">{cat.product_count} products</div>
              </div>
        ))}
      </div>
    </section>
  )
}
