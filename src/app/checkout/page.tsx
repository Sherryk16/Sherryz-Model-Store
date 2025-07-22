'use client'

import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import supabase from '@/lib/supabase'

const SIZES = ['S', 'M', 'L', 'XL'];
const DELIVERY_CHARGE = 200;

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [itemEdits, setItemEdits] = useState({});
  const [productColors, setProductColors] = useState<{ [id: string]: string[] }>({});

  // Merge cartItems with any edits from dropdowns
  const mergedCartItems = cartItems.map((item, idx) => ({
    ...item,
    ...((itemEdits as any)[idx] || {})
  }));

  const subtotal = mergedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const totalAmount = subtotal + DELIVERY_CHARGE;

  // Fetch colors for all products in cart on mount or when cartItems change
  useEffect(() => {
    async function fetchColors() {
      const ids = cartItems.map(item => item.id);
      if (ids.length === 0) return;
      const { data, error } = await supabase
        .from('products')
        .select('id,colors')
        .in('id', ids);
      if (!error && data) {
        const colorMap = {};
        data.forEach((prod: { id: string, colors: string[] }) => {
          colorMap[prod.id] = prod.colors || [];
        });
        setProductColors(colorMap);
      }
    }
    fetchColors();
  }, [cartItems]);

  function getColorOptions(item) {
    if (productColors[item.id] && productColors[item.id].length > 0) {
      return productColors[item.id];
    }
    return [];
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Check for missing size/color
    const missing = mergedCartItems.some(item => !item.size || !item.color);
    if (missing) {
      alert('Please select size and color for all products before placing your order.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: mergedCartItems,
          total_amount: totalAmount
        })
      })

      const data = await res.json()

      if (res.ok) {
        alert('Order placed successfully!')
        clearCart()
        if (data.orderId) {
          router.push(`/order-success/${data.orderId}`)
        } else {
          router.push('/order-success')
        }
      } else {
        alert('Something went wrong: ' + data.error)
      }
    } catch (error) {
      alert('An error occurred while placing your order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Order Summary Section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {mergedCartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-2 items-center">
                        {item.size ? (
                          <span className="mr-2">Size: {item.size}</span>
                        ) : (
                          <span>
                            <label className="mr-1">Size:</label>
                            <select
                              className="border rounded px-1 py-0.5"
                              value={(itemEdits as any)[idx]?.size || ''}
                              onChange={e => setItemEdits(edits => ({ ...edits, [idx]: { ...edits[idx], size: e.target.value } }))}
                            >
                              <option value="">Select</option>
                              {SIZES.map(size => <option key={size} value={size}>{size}</option>)}
                            </select>
                          </span>
                        )}
                        <span>
                          <label className="ml-2 mr-1">Color:</label>
                          <select
                            className="border rounded px-1 py-0.5"
                            value={(itemEdits as any)[idx]?.color || item.color || ''}
                            onChange={e => setItemEdits(edits => ({ ...edits, [idx]: { ...edits[idx], color: e.target.value } }))}
                            disabled={getColorOptions(item).length === 0}
                          >
                            {getColorOptions(item).length === 0 ? (
                              <option value="">No colors available</option>
                            ) : (
                              <>
                                <option value="">Select</option>
                                {getColorOptions(item).map(color => <option key={color} value={color}>{color}</option>)}
                              </>
                            )}
                          </select>
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      PKR{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>PKR{subtotal.toFixed(0)}</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                  <p>Delivery Charges</p>
                  <p>PKR{DELIVERY_CHARGE}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-2 border-t pt-2">
                  <p>Total</p>
                  <p>PKR{totalAmount.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Shipping Information Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Shipping Address
                    </label>
                    <textarea
                      id="address"
                      required
                      rows={3}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `Place Order – PKR${totalAmount.toFixed(0)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
