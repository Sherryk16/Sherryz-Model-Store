'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SocialIcons } from '@/components/ui/social-icons'
import { useEffect, useState, useRef } from 'react'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  // Calculate opacity based on scroll position
  const imageOpacity = Math.max(0.6 - (scrollY * 0.001), 0.2) // Decreases from 60% to 20% on scroll

  return (
    <section 
      ref={heroRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50"
    >
      <div className="absolute inset-0">
        <Image
          src="/cover.png"
          alt="Welcome Hero"
          fill
          className="object-cover transition-opacity duration-500"
          style={{ opacity: imageOpacity }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/40 via-transparent to-gray-100/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className={`relative z-10 text-center max-w-3xl mx-auto px-4 py-10 md:py-16 transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-10'
      }`}>
        <span className={`text-lg md:text-xl font-semibold text-white drop-shadow-lg mb-2 block transition-all duration-700 delay-200 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          Welcome to
        </span>
        <h1 className={`text-5xl md:text-6xl font-black mb-4 text-white drop-shadow-2xl tracking-tight uppercase transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`} style={{ fontFamily: 'New York, Georgia, Times New Roman, serif' }}>
          Sherryz
        </h1>
        <p className={`text-xl md:text-2xl text-white font-bold mb-2 drop-shadow-lg transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          Premium Streetwear & Custom Tees
        </p>
        <p className={`text-base md:text-lg text-white mb-6 max-w-xl mx-auto drop-shadow transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          Discover unique, high-quality streetwear or design your own custom t-shirt. Fast delivery. Easy process. Always authentic.
        </p>
        <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-4 transition-all duration-700 delay-600 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <Link href="/products">
            <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105">
              Shop Collection
            </button>
          </Link>
          <Link href="/custom-design">
            <button className="bg-white text-black border-2 border-black px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Create Your Design
            </button>
          </Link>
        </div>
        <div className={`mt-4 flex justify-center transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <SocialIcons size={36} />
        </div>
      </div>
    </section>
  )
}