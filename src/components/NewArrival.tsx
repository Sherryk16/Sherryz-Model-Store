'use client'

import { useEffect, useState } from "react"
import { useCart } from '@/context/CartContext'
import { ProductCard } from "@/components/ProductCard"
import supabase from "@/lib/supabase"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  rating: number
  description: string
  is_new?: boolean
  sizes?: string[]
  colors?: string[]
}

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_new', true)

        if (error) throw error
        setProducts(data)
      } catch (error) {
        console.error("Error fetching new arrivals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <section className="py-16 px-4 ">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-wider text-center">New Arrivals</h2>
          <div className="w-16 h-px bg-primary mt-4"></div>
          <p className="text-muted-foreground mt-4 text-center max-w-xl">
            The latest additions to our collection, crafted with precision and designed for distinction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url}
              category={product.category}
              description={product.description}
              sizes={product.sizes}
              colors={product.colors}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="border border-white text-white px-8 py-3 tracking-wider hover:bg-white hover:text-black transition-colors">
            SHOP NEW ARRIVALS
          </button>
        </div>
      </div>
    </section>
  )
}
