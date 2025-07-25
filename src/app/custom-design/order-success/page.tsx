'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function OrderSuccessRedirectInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  useEffect(() => {
    if (orderId) {
      router.replace(`/custom-design/order-success/${orderId}`)
    } else {
      router.replace('/custom-design')
    }
  }, [orderId, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}

export default function OrderSuccessRedirectPage() {
  return (
    <Suspense>
      <OrderSuccessRedirectInner />
    </Suspense>
  )
}