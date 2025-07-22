export default function OrderSuccessPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded p-8 text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
          <p className="mb-6">Thank you for your order. We’ll get it shipped to you soon.</p>
          <a href="/" className="text-blue-600 underline">Continue Shopping</a>
        </div>
      </div>
    )
  }
  