'use client'

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

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/custom-orders/${orderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedOrder(null);
        // Refresh the orders list
        fetchOrders();
      } else {
        console.error('Failed to delete order');
        alert('Failed to delete order. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/custom-orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(Array.isArray(data) ? data : [])
      } else {
        console.error('Failed to fetch orders')
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
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
    if (!elementsString) return [];
    
    try {
      const parsed = JSON.parse(elementsString);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map(element => ({
        id: element.id || '',
        type: element.type || 'text',
        content: element.content || '',
        fontSize: element.fontSize || 16,
        fontFamily: element.fontFamily || 'Arial',
        color: element.color || '#000000',
        imageUrl: element.imageUrl
      }));
    } catch (error) {
      console.error('Error parsing design elements:', error);
      return [];
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (!orders) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Error loading orders. Please try again later.</p>
          <Button onClick={fetchOrders} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Custom Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage all custom apparel orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600">Custom orders will appear here once customers place them.</p>
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
                        <span className="text-gray-600">Base Price:</span>
                        <span className="font-medium">PKR{order.base_price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => viewOrderDetails(order)}
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <Button
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    size="sm"
                  >
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Order Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order ID:</span>
                          <span className="font-mono">{selectedOrder.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span>{formatDate(selectedOrder.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Product:</span>
                          <span>{selectedOrder.product_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span>{selectedOrder.shirt_size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity:</span>
                          <span>{selectedOrder.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Print Side:</span>
                          <span className="capitalize">{selectedOrder.print_side || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Base Price:</span>
                          <span>PKR{selectedOrder.base_price}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total Price:</span>
                          <span>PKR{selectedOrder.total_price}</span>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="mt-6 space-y-3">
                        <h4 className="font-medium text-gray-900">Order Actions</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedOrder.status !== 'shipped' && (
                            <Button
                              onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                              className="bg-blue-500 hover:bg-blue-600"
                              size="sm"
                            >
                              <Package className="h-4 w-4 mr-1" />
                              Mark as Shipped
                            </Button>
                          )}
                          
                          {selectedOrder.status !== 'cancelled' && (
                            <Button
                              onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                              variant="outline"
                              size="sm"
                            >
                              Cancel Order
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => handleDeleteOrder(selectedOrder.id)}
                            variant="outline"
                            size="sm"
                          >
                            Delete Order
                          </Button>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{selectedOrder.customer_name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{selectedOrder.customer_email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2 font-medium">{selectedOrder.customer_phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <div className="ml-2">
                            <div>{selectedOrder.customer_address}</div>
                            <div>{selectedOrder.customer_city}, {selectedOrder.customer_state} {selectedOrder.customer_zip_code}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Design Information */}
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h3 className="text-lg font-semibold mb-3">Design Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Design Color:</span>
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: selectedOrder.design_color || '#ffffff' }}
                          ></div>
                          <span className="text-sm">{selectedOrder.design_color || 'N/A'}</span>
                        </div>
                        
                        <div>
                          <span className="text-gray-600 text-sm">Design Elements:</span>
                          <div className="mt-2 space-y-2">
                            {selectedOrder.design_elements ? (
                              parseDesignElements(selectedOrder.design_elements).map((element, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                  {element.type === 'text' ? (
                                    <Type className="h-4 w-4 text-blue-600" />
                                  ) : (
                                    <ImageIcon className="h-4 w-4 text-green-600" />
                                  )}
                                  <span>
                                    {element.type === 'text' ? 'Text' : 'Image'}: {element.content}
                                  </span>
                                  {element.type === 'text' && (
                                    <span className="text-xs text-gray-500">
                                      ({element.fontSize}px, {element.color})
                                    </span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-gray-500 italic">No design elements found</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 