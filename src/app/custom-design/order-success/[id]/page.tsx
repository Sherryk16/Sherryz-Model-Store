'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Home, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'

interface CustomOrder {
  id: string
  design_elements: string
  design_color: string
  design_notes: string
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
  payment_status: string
  shipping_method: string
  created_at: string
}

export default function CustomOrderSuccessPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<CustomOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/custom-orders/${params.id}`)
        if (response.ok) {
          const orderData = await response.json()
          setOrder(orderData)
        } else {
          console.error('Failed to fetch order')
          router.push('/custom-design')
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        router.push('/custom-design')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchOrder()
    }
  }, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/custom-design')}>
            <Home className="h-4 w-4 mr-2" />
            Return to Designer
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your custom t-shirt order. We've received your design and will start processing it right away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="capitalize">{order.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <Badge className="capitalize">{order.payment_status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-lg">PKR {order.total_price}</span>
                </div>
              </div>
            </Card>

            {/* Design Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Design Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{order.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Design Color:</span>
                  <span className="font-medium capitalize">{order.design_color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium uppercase">{order.shirt_size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{order.quantity}</span>
                </div>
                {order.design_notes && (
                  <div className="mt-4">
                    <span className="text-gray-600 block mb-2">Design Notes:</span>
                    <p className="text-sm bg-gray-50 p-3 rounded">{order.design_notes}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Customer Information & Next Steps */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Contact:</span>
                  <div className="ml-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">{order.customer_email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <p className="font-medium">{order.customer_phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Shipping Address:</span>
                  <div className="ml-4 mt-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <p className="font-medium">
                        {order.customer_address}<br />
                        {order.customer_city}, {order.customer_state} {order.customer_zip_code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Order Review</h3>
                    <p className="text-sm text-gray-600">Our team will review your design and prepare it for printing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Production</h3>
                    <p className="text-sm text-gray-600">Your custom t-shirt will be carefully printed and quality checked</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Shipping</h3>
                    <p className="text-sm text-gray-600">We'll send you tracking information once your order ships</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => router.push('/')} 
            className="px-8 py-2 text-lg"
            size="lg"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
} 