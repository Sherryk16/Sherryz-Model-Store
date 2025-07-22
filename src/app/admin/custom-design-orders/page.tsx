"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, User, Calendar, DollarSign, Type, Image as ImageIcon } from 'lucide-react'

interface DesignElement {
  id: string
  type: 'text' | 'image'
  content: string
  fontSize: number
  fontFamily: string
  color: string
  imageUrl?: string
}

interface CustomOrder {
  id: string
  design_elements: string
  design_color: string
  product_type: string
  product_name: string
  base_price: number
  shirt_size: string
  quantity: number
  print_side: string
  total_price: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_state: string
  customer_zip_code: string
  status: string
  created_at: string
}

export default function AdminCustomDesignOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/custom-orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        console.error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/custom-orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders() // Refresh the orders list
      } else {
        console.error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const viewOrderDetails = (order: CustomOrder) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const parseDesignElements = (elementsString: string): DesignElement[] => {
    try {
      return JSON.parse(elementsString)
    } catch (error) {
      console.error('Error parsing design elements:', error)
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading custom design orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Custom Design Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage all custom t-shirt design orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Custom Design Orders Yet</h2>
            <p className="text-gray-600">Custom design orders will appear here once customers place them.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{order.product_name}</h3>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Customer:</span>
                        <span className="font-medium">{order.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">PKR{order.total_price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">{order.shirt_size}</span>
                        <span className="text-gray-600">Qty:</span>
                        <span className="font-medium">{order.quantity}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium">{order.product_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Print Side:</span>
                        <span className="font-medium capitalize">{order.print_side}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Color:</span>
                        <span className="font-medium capitalize">{order.design_color}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Button variant="outline" onClick={() => viewOrderDetails(order)}>
                      <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'processing')}>Processing</Button>
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'shipped')}>Shipped</Button>
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>Delivered</Button>
                      <Button size="sm" onClick={() => updateOrderStatus(order.id, 'cancelled')} variant="destructive">Cancel</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 