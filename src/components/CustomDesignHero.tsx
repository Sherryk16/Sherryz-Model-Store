'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Palette, Type, ShoppingCart, Star, Upload, ArrowRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

export function CustomDesignHero() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    {
      icon: Upload,
      title: "Upload Your Artwork",
      description: "Have a design ready? Upload your images or logos in JPG, PNG, or GIF format and place them on your shirt.",
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Type,
      title: "Add Expressive Text",
      description: "Choose from a wide range of fonts and colors to add names, slogans, or any message you can think of.",
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Palette,
      title: "Pick The Perfect Canvas",
      description: "Select a classic black or white t-shirt as the base for your masterpiece. Preview your design instantly.",
      color: "green",
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: ShoppingCart,
      title: "Seamless & Secure Ordering",
      description: "Our streamlined checkout ensures your custom creation gets to you safely and quickly.",
      color: "orange",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ]

  return (
    <section ref={sectionRef} className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-4 drop-shadow-lg">
            Your Vision, Now Wearable
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-200 max-w-2xl mx-auto drop-shadow">
            Turn your ideas into high-quality custom t-shirts. Our intuitive design tool makes it easy to create something truly unique.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className={`relative p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                isVisible 
                  ? 'opacity-100 transform translate-y-0 scale-100' 
                  : 'opacity-0 transform translate-y-10 scale-95'
              }`}
              style={{ transitionDelay: `${500 + index * 100}ms` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`w-20 h-20 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 ${
                hoveredCard === index ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
              }`}>
                <feature.icon className={`h-10 w-10 ${feature.iconColor} transition-all duration-300 ${
                  hoveredCard === index ? 'scale-110' : 'scale-100'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 drop-shadow">
                {feature.title}
              </h3>
              <p className="text-gray-200">
                {feature.description}
              </p>
              {/* Floating particles effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-2 left-2 w-1 h-1 bg-purple-400 rounded-full opacity-0 transition-all duration-700 delay-100 ${
                  hoveredCard === index ? 'opacity-60 animate-bounce' : ''
                }`}></div>
                <div className={`absolute top-4 right-3 w-0.5 h-0.5 bg-blue-400 rounded-full opacity-0 transition-all duration-700 delay-200 ${
                  hoveredCard === index ? 'opacity-60 animate-bounce' : ''
                }`}></div>
              </div>
            </Card>
          ))}
        </div>

        <div className={`text-center transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
        }`}>
          <Link href="/custom-design">
            <Button
              size="lg"
              className="w-full max-w-md mx-auto bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 border border-white/30 text-white px-10 py-4 text-xl font-extrabold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_40px_0_rgba(168,85,247,0.5)] group flex items-center justify-center gap-x-2"
            >
              <span>Start Designing Now</span>
              <ArrowRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
} 