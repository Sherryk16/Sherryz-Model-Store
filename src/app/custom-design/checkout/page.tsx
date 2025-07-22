'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, CreditCard, User, Mail, Phone, MapPin, Type, Image as ImageIcon } from 'lucide-react'

interface DesignElement {
  id: string
  type: 'text' | 'image'
  content: string
  fontSize: number
  fontFamily: string
  color: string
  imageUrl?: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

interface ProductOption {
  id: string
  name: string
  type: string
  price: number
  description: string
  features: string[]
  image: string
}

interface CustomOrder {
  selectedProduct: ProductOption;
  frontDesign?: string | null;
  backDesign?: string | null;
  designNotes?: string;
  selectedSize: string;
  selectedColor: string;
  totalPrice: number;
  timestamp: number;
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

export default function CustomDesignCheckoutPage() {
  const router = useRouter()
  const [customOrder, setCustomOrder] = useState<CustomOrder | null>(null)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shirtSize, setShirtSize] = useState('M')
  const [quantity, setQuantity] = useState(1)

  const shirtSizes = ['S', 'M', 'L', 'XL']

  const designCharge = 200;
  const deliveryCharge = 200;

  useEffect(() => {
    const savedOrder = localStorage.getItem('customOrder')
    if (!savedOrder) {
      router.push('/custom-design')
      return
    }

    try {
      setCustomOrder(JSON.parse(savedOrder))
    } catch (error) {
      console.error('Error parsing custom order:', error)
      router.push('/custom-design')
    }
  }, [router])

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const requiredFields: (keyof CustomerInfo)[] = ['name', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const emptyFields = requiredFields.filter(field => !customerInfo[field].trim())
    
    if (emptyFields.length > 0) {
      alert(`Please fill in all required fields: ${emptyFields.join(', ')}`)
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerInfo.email)) {
      alert('Please enter a valid email address')
      return false
    }

    // Remove phone validation for Pakistani numbers
    return true
  }

  const calculateShirtPrice = () => {
    if (!customOrder) return 0;
    return customOrder.selectedProduct.price * quantity;
  };

  const calculateDesignPrice = () => {
    return designCharge * quantity;
  };

  const calculateTotalPrice = () => {
    return calculateShirtPrice() + calculateDesignPrice() + deliveryCharge;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm() || !customOrder) return

    setIsSubmitting(true)

    try {
      const orderData = {
        elements: customOrder.elements,
        designColor: customOrder.designColor,
        designNotes: customOrder.designNotes,
        selectedProduct: customOrder.selectedProduct,
        shirtSize,
        quantity,
        totalPrice: calculateTotalPrice(),
        customerInfo,
        status: 'pending',
      }

      const response = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const result = await response.json()
      
      // Clear the custom order from localStorage
      localStorage.removeItem('customOrder')
      
      // Redirect to success page with order ID
      router.push(`/custom-design/order-success/${result.orderId}`)
    } catch (error) {
      console.error('Error submitting order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!customOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/custom-design')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Designer
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout - Custom {customOrder.selectedProduct.name}</h1>
          <p className="text-gray-600 mt-2">Complete your custom apparel order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </h2>
              {/* Product Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Product</h3>
                <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{customOrder.selectedProduct.image}</div>
                    <div>
                      <h4 className="font-semibold">{customOrder.selectedProduct.name}</h4>
                      <p className="text-sm text-gray-600">{customOrder.selectedProduct.description}</p>
                      <p className="text-lg font-bold text-blue-600">PKR{customOrder.selectedProduct.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Images */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Your Uploaded Designs</h3>
                <div className="flex flex-col gap-4">
                  {customOrder.frontDesign && (
                    <div>
                      <div className="font-medium mb-1">Front Design:</div>
                      <img src={customOrder.frontDesign} alt="Front Design" className="w-full max-w-xs border rounded" />
                    </div>
                  )}
                  {customOrder.backDesign && (
                    <div>
                      <div className="font-medium mb-1">Back Design:</div>
                      <img src={customOrder.backDesign} alt="Back Design" className="w-full max-w-xs border rounded" />
                    </div>
                  )}
                  {!customOrder.frontDesign && !customOrder.backDesign && (
                    <div className="text-gray-500">No design uploaded.</div>
                  )}
                </div>
              </div>

              {/* Design Sides Uploaded */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Design Sides Uploaded</h3>
                <div className="flex gap-4">
                  {customOrder.frontDesign && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">Front</span>}
                  {customOrder.backDesign && <span className="px-3 py-1 bg-green-100 text-green-800 rounded">Back</span>}
                  {!customOrder.frontDesign && !customOrder.backDesign && <span className="text-gray-500">No design uploaded.</span>}
                </div>
              </div>

              {/* Size and Color */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Size & Color</h3>
                <div className="flex gap-4 items-center">
                  <span className="font-medium">Size: {customOrder.selectedSize}</span>
                  <span className="font-medium flex items-center gap-2">
                    Color:
                    <span className="inline-block w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: customOrder.selectedColor }}></span>
                  </span>
                </div>
              </div>

              {/* Design Notes */}
              {customOrder.designNotes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Design Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {customOrder.designNotes}
                  </p>
                </div>
              )}

              {/* Order Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shirt Price:</span>
                  <span className="font-medium">PKR{customOrder.selectedProduct.price} × {quantity} = PKR{calculateShirtPrice()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Design Price:</span>
                  <span className="font-medium">PKR{designCharge} × {quantity} = PKR{calculateDesignPrice()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Price:</span>
                  <span className="font-medium">PKR{deliveryCharge}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>PKR{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Product Options */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Product Options</h2>
              
              {/* Size Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {shirtSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setShirtSize(size)}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        shirtSize === size
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>

            {/* Shipping Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Order Terms */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Terms</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Custom apparel is made to order and typically ships within 7-10 business days</p>
                <p>• All designs are printed using high-quality, durable materials</p>
                <p>• Custom designs are final sale and cannot be returned or exchanged</p>
                <p>• You will receive email confirmation and tracking information</p>
              </div>
            </Card>

            {/* Place Order Button */}
            <Card className="p-6">
              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full py-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Place Order - PKR{calculateTotalPrice()}
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                By placing this order, you agree to our terms and conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 