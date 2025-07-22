'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import supabase from '@/lib/supabase'

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*')
    if (data) setProducts(data)
  }

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <Link href="/admin/add" className="bg-blue-600 text-white px-4 py-2 mb-6 inline-block">+ Add Product</Link>
      <Link href="/admin/orders" className="bg-green-600 text-white px-4 py-2 mb-6 inline-block ml-4">Manage Orders</Link>
      <Link href="/admin/custom-orders" className="bg-purple-600 text-white px-4 py-2 mb-6 inline-block ml-4">Custom Orders</Link>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.image_url} alt={product.name} className="h-48 w-full object-cover rounded mb-2" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">${product.price}</p>
            <div className="mt-3 flex gap-2">
              <Link href={`/admin/edit/${product.id}`} className="text-blue-600">Edit</Link>
              <button onClick={() => deleteProduct(product.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
