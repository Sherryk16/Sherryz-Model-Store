import supabase from '@/lib/supabase'
import ProductDetailClient from '@/components/ProductDetailClient'
import { ProductCard } from '@/components/ProductCard'

interface ProductPageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return <div className="p-8 text-red-500">Error loading product.</div>
  }

  if (!product) {
    return <div className="p-8 text-red-500">Product not found.</div>
  }

  // Ensure product has the required structure
  const productWithDefaults = {
    ...product,
    sizes: product.sizes || [],
    colors: product.colors || [],
    images: product.images || [],
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mt-20 mb-8">
        <ProductDetailClient product={productWithDefaults} />
      </div>
    </div>
  )
}
