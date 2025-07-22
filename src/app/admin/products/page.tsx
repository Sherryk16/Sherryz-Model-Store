'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import  supabase  from '@/lib/supabase'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/add" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Product
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-sm text-gray-700 mb-2">PKR {product.price}</p>
            <p className="text-sm text-gray-500 mb-4">{product.description}</p>
            <div className="flex justify-between">
              <Link
                href={`/admin/products/edit/${product.id}`}
                className="text-blue-600 hover:underline"
              >
                Edit
              </Link>
              <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
