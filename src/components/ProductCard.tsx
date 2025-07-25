'use client'

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Eye } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useCart } from "@/context/CartContext"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  isNew?: boolean
  sizes?: string[] | null
  colors?: string[] | null
  monochrome?: boolean
  description: string // Added description prop
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  images,
  category,
  isNew,
  sizes,
  colors,
  monochrome = false,
  description, // Added description prop
}: ProductCardProps) {
  // Robust defaults
  const safeSizes = Array.isArray(sizes) ? sizes : []
  const safeImages = Array.isArray(images) ? images : []
  const displayImage = safeImages.length > 0 ? safeImages[0] : image || "/vercel.svg"
  const hasDiscount = typeof originalPrice === 'number' && originalPrice > price
  const showIsNew = typeof isNew === 'boolean' ? isNew : false

  // Animation and cart state
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  const handleAddToCart = () => {
    addToCart({ id, name, price, image_url: image, color: Array.isArray(colors) ? colors[0] : undefined })
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleCardClick = () => {
    router.push(`/products/${id}`)
  }

  // Monochrome classes
  const color = monochrome
  const cardBg = color ? "bg-white" : "bg-gradient-to-br from-white via-blue-50 to-gray-100"
  const border = color ? "border-gray-900" : "border-gray-200"
  const shadow = color ? "shadow-xl" : "shadow-lg hover:shadow-2xl"
  const heading = color ? "text-black" : "text-gray-900 group-hover:text-blue-700"
  const priceBadge = color ? "bg-gray-900 text-white" : "bg-blue-100 text-blue-700"
  const saleBadge = color ? "bg-gray-800 text-white" : "bg-red-600 text-white animate-pulse"
  const newBadge = color ? "bg-gray-700 text-white" : "bg-gray-900 text-white"
  const categoryBadge = color ? "bg-gray-900 text-white" : "bg-blue-600/90 text-white"
  const button = color ? "bg-black hover:bg-gray-900 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
  const outlineBtn = color ? "border border-black text-black hover:bg-gray-100" : "border border-blue-600 text-blue-700 hover:bg-blue-50"

  return (
    <>
      {isAddedToCart && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">Added to cart!</span>
          </div>
        </div>
      )}
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        className={`group overflow-hidden rounded-3xl border ${border} ${cardBg} transition-all duration-500 cursor-pointer flex flex-col ${shadow} ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
        } ${isHovered ? 'scale-105 -translate-y-1' : ''}`}
        style={{ minHeight: 420 }}
      >
        <div className="relative w-full h-64 flex items-center justify-center bg-gray-100 rounded-2xl overflow-hidden mb-3">
          <Image
            src={displayImage}
            alt={name || "Product"}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="transition-transform duration-300 group-hover:scale-110"
          />
          {showIsNew && (
            <span className={`absolute left-2 top-2 text-xs font-bold px-2 py-1 rounded-full shadow ${newBadge}`}>New</span>
          )}
          {hasDiscount && (
            <span className={`absolute right-2 top-2 text-xs font-bold px-2 py-1 rounded-full shadow ${saleBadge}`}>SALE</span>
          )}
          <span className={`absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow ${categoryBadge}`}>{category}</span>
        </div>
        <div className="px-4 pb-4 pt-2 flex-1 flex flex-col">
          <h3 className={`font-semibold text-lg mb-1 ${heading}`}>{name}</h3>
          <p className="text-gray-500 text-sm mb-2">{description}</p> {/* Display description */}
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-block font-bold px-3 py-1 rounded-full text-xs shadow-sm ${priceBadge}`}>PKR {price?.toLocaleString?.() ?? price}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">PKR {originalPrice?.toLocaleString?.() ?? originalPrice}</span>
            )}
          </div>
          {safeSizes.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1 justify-center">
              <span className="text-xs font-semibold text-gray-500">Sizes:</span>
              {safeSizes.slice(0, 2).map((size) => (
                <span key={size} className="bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">{size}</span>
              ))}
              {safeSizes.length > 2 && <span className="text-xs text-gray-500">+{safeSizes.length - 2}</span>}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full mt-auto px-2 pb-3">
          <button
            className={`w-full flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold shadow transition ${button}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart();
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
          <button 
            className={`w-full flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold shadow transition ${outlineBtn}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>
      </div>
    </>
  )
}
