'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

interface ProductItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

interface Order {
  id: string
  status: string
  total_price: number
  created_at: string
  updated_at: string
  items: ProductItem[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*')
    if (data) setOrders(data)
  }

  const deleteOrder = async (id: string) => {
    await supabase.from('orders').delete().eq('id', id)
    fetchOrders()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    fetchOrders()
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4 font-bold">Manage Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orders.map(order => (
          <div key={order.id} className="border rounded-xl p-4 shadow-sm bg-white">
            <div className="mb-3">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Email:</strong> {order.customer_email}</p>
              <p><strong>Phone:</strong> {order.customer_phone}</p>
              <p><strong>Status:</strong> <span className="text-blue-600 capitalize">{order.status}</span></p>
              <p><strong>Total Price:</strong> PKR {order.total_price}</p>
              <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>

            <div className="mb-3">
              <p className="font-semibold mb-1">Products:</p>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border p-2 rounded-md">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} | Price: PKR {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => updateOrderStatus(order.id, 'shipped')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
              >
                Cancel Order
              </button>
              <button
                onClick={() => deleteOrder(order.id)}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
