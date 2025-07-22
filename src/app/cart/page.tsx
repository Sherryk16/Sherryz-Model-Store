'use client'

import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useCartSidebar } from '@/context/CartProvider'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart()
  const { closeCart } = useCartSidebar()

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-500"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="p-6">
                  <div className="space-y-6">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm font-medium text-gray-900">
                              PKR{(item.price * item.quantity).toFixed(0)}
                            </p>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {item.size && <span className="mr-2">Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                -
                              </button>
                              <span className="mx-2 text-gray-700">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-sm text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                    <p>Subtotal</p>
                    <p>PKR{totalAmount.toFixed(0)}</p>
                  </div>
                  <div className="space-y-4">
                    <Link
                      href="/checkout"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                      onClick={closeCart}
                    >
                      Proceed to Checkout
                    </Link>
                    <Link
                      href="/"
                      className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      onClick={closeCart}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
