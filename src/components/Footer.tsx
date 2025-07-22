"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { FaWhatsapp } from 'react-icons/fa'

export function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer 
      ref={footerRef}
      className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className={`transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <div className="flex items-center space-x-2 mb-4 group">
              <div className="p-1">
                <Image
                  src="/logo1.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-xl object-contain transition-all duration-300"
                  style={{ filter: 'none' }}
                  priority
                />
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Premium streetwear and custom designs for the bold and creative. 
              Express yourself through fashion that speaks your language.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" }
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={`p-2 bg-gray-800 hover:bg-black rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-6 group ${
                    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                { href: "/custom-design", label: "Custom Design" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" }
              ].map((link, index) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-gray-300 hover:text-black transition-all duration-300 transform hover:translate-x-2 flex items-center group ${
                      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}
                    style={{ transitionDelay: `${300 + index * 50}ms` }}
                  >
                    <span className="w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-4 mr-2"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-3">
              {[
                { href: "/products?category=streetwear", label: "Street Wear" },
                { href: "/products?category=urdu-calligraphy", label: "Urdu Calligraphy" },
                { href: "/products?category=tshirts", label: "T-Shirts" },
                { href: "/products?category=hoodies", label: "Hoodies" },
                { href: "/custom-design", label: "Custom Designs" }
              ].map((category, index) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className={`text-gray-300 hover:text-black transition-all duration-300 transform hover:translate-x-2 flex items-center group ${
                      isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                    }`}
                    style={{ transitionDelay: `${400 + index * 50}ms` }}
                  >
                    <span className="w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-4 mr-2"></span>
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Info</h3>
            <div className="space-y-3">
              {[
                { icon: Mail, text: "sherryzpk1@gmail.com", href: "mailto:sherryzpk1@gmail.com" },
                { icon: FaWhatsapp, text: "+92 300 1234567", href: "https://wa.me/923001234567" },
                { icon: Phone, text: "+92 300 1234567", href: "tel:+923001234567" },
                { icon: MapPin, text: "Lahore, Pakistan", href: "#" }
              ].map((contact, index) => (
                <a
                  key={contact.text}
                  href={contact.href}
                  className={`flex items-center space-x-3 text-gray-300 hover:text-black transition-all duration-300 transform hover:translate-x-2 group ${
                    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                  }`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <contact.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {contact.text && <span>{contact.text}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t border-gray-700 mt-8 pt-8 text-center transition-all duration-700 delay-500 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
        }`}>
          <p className="text-gray-400 flex items-center justify-center space-x-2">
            <span>© 2024 Sherryz. Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>in Pakistan</span>
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-400">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
              { href: "/shipping", label: "Shipping Info" }
            ].map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                className={`hover:text-black transition-all duration-300 transform hover:scale-105 ${
                  isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
