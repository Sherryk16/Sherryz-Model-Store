"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  images?: string[];
  description: string;
  sizes: string[];
  colors: string[];
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  if (!product) {
    return <div className="p-8 text-red-500">Product not found.</div>;
  }

  const sizes = product.sizes || [];
  const colors = product.colors || [];

  // Determine images to show
  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const handlePrev = () => setSelectedImageIdx(idx => (idx - 1 + images.length) % images.length);
  const handleNext = () => setSelectedImageIdx(idx => (idx + 1) % images.length);

  const canAddToCart =
    (!sizes.length || selectedSize) &&
    (!colors.length || selectedColor) &&
    quantity > 0;

  // Intersection Observer for image animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsImageVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });

    setShowAddedToCart(true);
    setTimeout(() => {
      setShowAddedToCart(false);
    }, 2000);
  };

  const handleBuyNow = async () => {
    if (!canAddToCart) return;

    setIsLoading(true);
    try {
      // Add to cart first
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        size: selectedSize,
        color: selectedColor,
        quantity,
      });

      // Then redirect to checkout
      router.push('/checkout');
    } catch (error) {
      console.error('Error during buy now:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there's a discount
  const hasDiscount = product.original_price && product.original_price > product.price;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Added to Cart Notification */}
      {showAddedToCart && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out">
          Product added to cart!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images Carousel */}
        <div className="w-full md:w-1/2" ref={imageRef}>
          <div 
            className={`relative aspect-square mb-4 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden transition-all duration-1000 ${
              isImageVisible 
                ? 'opacity-100 transform translate-y-0 scale-100' 
                : 'opacity-0 transform translate-y-10 scale-95'
            }`}
          >
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all duration-200 hover:scale-110"
              style={{ display: images.length > 1 ? 'block' : 'none' }}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <Image
              src={images[selectedImageIdx]}
              alt={product.name}
              fill
              className="object-cover rounded-lg transition-transform duration-500 hover:scale-105"
              priority
            />
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all duration-200 hover:scale-110"
              style={{ display: images.length > 1 ? 'block' : 'none' }}
              aria-label="Next image"
              type="button"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
              {images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`border rounded overflow-hidden w-16 h-16 flex-shrink-0 focus:outline-none transition-all duration-200 hover:scale-105 ${
                    selectedImageIdx === idx 
                      ? 'border-blue-600 ring-2 ring-blue-300' 
                      : 'border-gray-200 hover:border-blue-400'
                  }`}
                  type="button"
                >
                  <Image 
                    src={img} 
                    alt={`Thumbnail ${idx+1}`} 
                    width={64} 
                    height={64} 
                    className="object-cover w-full h-full" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {hasDiscount ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-semibold text-green-600">PKR {product.price.toLocaleString()}</p>
                  <p className="text-lg text-gray-500 line-through">PKR {product.original_price?.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    SALE
                  </span>
                  <p className="text-sm text-red-600 font-medium">Special Discount Price!</p>
                </div>
                <div className="text-sm text-gray-600">
                  Save PKR {(product.original_price! - product.price).toLocaleString()}!
                </div>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-green-600">PKR {product.price.toLocaleString()}</p>
            )}
          </div>

          <p className="text-gray-700">{product.description}</p>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Size:</label>
                {selectedSize && (
                  <span className="text-sm text-gray-500">Selected: {selectedSize}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 rounded-md border-2 transition-all duration-200 hover:scale-105 ${
                      selectedSize === size
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-blue-400"
                    }`}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold">Color:</label>
                {selectedColor && (
                  <span className="text-sm text-gray-500">Selected: {selectedColor}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`px-4 py-2 rounded-md border-2 transition-all duration-200 hover:scale-105 ${
                      selectedColor === color
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-blue-400"
                    }`}
                    onClick={() => setSelectedColor(color)}
                    type="button"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="space-y-2">
            <label className="font-semibold">Quantity:</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors duration-200"
                type="button"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 text-center border rounded-md py-1"
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 transition-colors duration-200"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleBuyNow}
                disabled={!canAddToCart || isLoading}
                className={`flex-1 bg-green-600 text-white px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-105 ${
                  !canAddToCart || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
                }`}
              >
                {isLoading ? "Processing..." : "Buy Now"}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!canAddToCart}
                className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold transition-all duration-200 hover:scale-105 ${
                  !canAddToCart
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                Add to Cart
              </button>
            </div>
            {!canAddToCart && (
              <div className="text-red-500 text-sm">
                Please select {!selectedSize && sizes.length > 0 ? "size" : ""}
                {!selectedSize && !selectedColor && sizes.length > 0 && colors.length > 0 ? " and " : ""}
                {!selectedColor && colors.length > 0 ? "color" : ""}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 