'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Search, ShoppingBag, X, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useCartSidebar } from '@/context/CartProvider'
import { usePathname, useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import { ProductCard } from '@/components/ProductCard'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const { cartItems } = useCart()
  const { openCart } = useCartSidebar()
  const cartCount = cartItems.length
  const pathname = usePathname()
  const router = useRouter()
  const searchPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debounced live search
  useEffect(() => {
    if (!showSearch) return;
    if (!search) {
      setSearchResults([])
      setSearchLoading(false)
      setSearchError(null)
      return
    }
    setSearchLoading(true)
    setSearchError(null)
    const handler = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, description, category')
          .ilike('name', `%${search}%`)
          .order('name')
        if (error) throw error
        setSearchResults(data || [])
      } catch (err) {
        setSearchError('Failed to search products')
      } finally {
        setSearchLoading(false)
      }
    }, 350)
    return () => clearTimeout(handler)
  }, [search, showSearch])

  useEffect(() => {
    if (!showSearch) return
    function handleClickOutside(event: MouseEvent) {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target as Node)) {
        setShowSearch(false)
        setSearch('')
        setSearchResults([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSearch])

  const logoClass = `rounded-xl object-contain transition-all duration-300 ${
    !isScrolled ? 'filter invert brightness-0' : ''
  }`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-black/70 backdrop-blur-xl border-b border-white/20 shadow-2xl'
        : 'bg-white/30 backdrop-blur-lg border-b border-transparent shadow-none'
    } rounded-b-2xl`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">
        {/* Mobile: search left, logo center, menu right */}
        <div className="flex md:hidden w-full items-center justify-between">
          <button
            className={`p-2 ${(!isScrolled && !isMenuOpen) ? 'text-black hover:text-white hover:bg-black' : 'text-white hover:text-black hover:bg-white'} rounded-full transition-all duration-200`}
            aria-label="Search"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </button>
          <div className="flex-1 flex justify-center">
            <Link href="/" className="p-1">
              <Image
                src="/logo1.png"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-xl object-contain transition-all duration-300"
                style={{ filter: !isScrolled ? 'invert(1) brightness(0)' : 'none' }}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${(!isScrolled && !isMenuOpen) ? 'text-black hover:text-white hover:bg-black' : 'text-white hover:text-black hover:bg-white'} rounded-full transition-all duration-200`}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={openCart}
              className={`relative p-2 ${(!isScrolled && !isMenuOpen) ? 'text-black hover:text-white hover:bg-black' : 'text-white hover:text-black hover:bg-white'} rounded-full transition-all duration-200`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex w-full items-center justify-between">
          <Link href="/" className="p-1">
            <Image
              src="/logo1.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-xl object-contain transition-all duration-300"
              style={{ filter: !isScrolled ? 'invert(1) brightness(0)' : 'none' }}
              priority
            />
          </Link>

          <div className="flex flex-1 justify-center items-center space-x-8">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              { href: '/custom-design', label: 'Custom Design' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1 rounded-lg font-medium transition-all duration-200 group flex items-center ${
                  isScrolled
                    ? (pathname === link.href ? 'text-black' : 'text-white')
                    : 'text-black'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute left-1/2 -bottom-1 h-0.5 bg-black rounded-full transition-all duration-300 ${
                  pathname === link.href
                    ? 'w-3/4 left-1/8 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-3/4 group-hover:left-1/8 group-hover:opacity-100'
                }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              className={`p-2 ${isScrolled ? 'text-white hover:text-black hover:bg-white' : 'text-black hover:text-white hover:bg-black'} rounded-full transition-all duration-200`}
              aria-label="Search"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={openCart}
              className={`relative p-2 ${isScrolled ? 'text-white hover:text-black hover:bg-white' : 'text-black hover:text-white hover:bg-black'} rounded-full transition-all duration-200`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden fixed left-0 right-0 top-16 z-40 transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        <div className="bg-black/90 backdrop-blur-xl border-t border-white/20 px-4 pb-4 pt-2 space-y-2 rounded-b-2xl shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 relative" style={{ minHeight: 48 }}>
            <button
              className={`p-2 ${(!isScrolled && !isMenuOpen) ? 'text-black hover:text-white hover:bg-black' : 'text-white hover:text-black hover:bg-white'} rounded-full transition-all duration-200 absolute left-0`}
              aria-label="Search"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-5 w-5" />
            </button>
            <div className="flex-1 flex justify-center">
              <div className="p-1">
                <Image
                  src="/logo1.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-xl object-contain transition-all duration-300"
                  style={{ filter: !isScrolled ? 'invert(1) brightness(0)' : 'none' }}
                  priority
                />
              </div>
            </div>
            <div style={{ width: 40 }}></div>
          </div>

          <div className="w-full flex flex-col items-center space-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Products' },
              { href: '/custom-design', label: 'Custom Design' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group text-center w-full ${
                  pathname === link.href ? 'text-black' : 'text-white'
                }`}
                aria-current={pathname === link.href ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute left-1/2 -bottom-1 h-0.5 bg-black rounded-full transition-all duration-300 ${
                  pathname === link.href
                    ? 'w-3/4 left-1/8 opacity-100'
                    : 'w-0 opacity-0 group-hover:w-3/4 group-hover:left-1/8 group-hover:opacity-100'
                }`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <>
          {/* Subtle overlay */}
          <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm transition-opacity" />
          {/* Search bar and results under Navbar, attached as a single white panel */}
          <div className="fixed left-0 right-0 top-16 z-[9999] flex justify-center w-full pointer-events-none">
            <div ref={searchPanelRef} className="w-full max-w-2xl px-2 sm:px-6 pointer-events-auto">
              <div className="bg-white/90 border border-gray-200 shadow-xl rounded-t-2xl flex items-center px-4 py-2 backdrop-blur-xl">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  className="flex-1 bg-transparent outline-none text-base placeholder-gray-400"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button
                  className="ml-2 p-1 text-gray-400 hover:text-black rounded-full transition"
                  onClick={() => { setShowSearch(false); setSearch(''); setSearchResults([]); }}
                  aria-label="Close search"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {/* Results panel, attached to search bar, compact and scrollable */}
              <div className="bg-white/95 border-x border-b border-gray-200 shadow-xl rounded-b-2xl w-full max-h-72 overflow-y-auto transition-all duration-300">
                {searchLoading && (
                  <div className="text-center py-6 text-gray-500 font-medium">Searching...</div>
                )}
                {!searchLoading && search && searchResults.length === 0 && !searchError && (
                  <div className="text-center py-6 text-gray-400 font-medium">No products found.</div>
                )}
                {searchError && (
                  <div className="text-center py-6 text-red-500 font-medium">{searchError}</div>
                )}
                {!searchLoading && searchResults.length > 0 && (
                  <div className="flex flex-col gap-2 py-2">
                    {searchResults.map((product, idx) => (
                      <div
                        key={product.id}
                        className="cursor-pointer"
                        onClick={() => {
                          setShowSearch(false)
                          setSearch('')
                          setSearchResults([])
                          router.push(`/products/${product.id}`)
                        }}
                      >
                        <ProductCard
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={product.image_url}
                          category={product.category || ''}
                          description={product.description || ''}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

/* Add fade-in animation */
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: none; }
    }
    .animate-fade-in { animation: fade-in 0.4s cubic-bezier(.4,0,.2,1) both; }
  `;
  if (!document.head.querySelector('style[data-navbar-fade-in]')) {
    style.setAttribute('data-navbar-fade-in', 'true');
    document.head.appendChild(style);
  }
}
