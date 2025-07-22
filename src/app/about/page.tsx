'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SocialIcons } from '@/components/ui/social-icons'
import { Palette, Leaf, Shield, Sparkles, Star, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CustomDesignHero } from '@/components/CustomDesignHero'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const valueIcons = [
  <Palette key="creativity" className="w-10 h-10 text-pink-500 bg-pink-100 rounded-full p-2 shadow" />, // Creativity
  <Leaf key="sustainability" className="w-10 h-10 text-green-600 bg-green-100 rounded-full p-2 shadow" />, // Sustainability
  <Shield key="empowerment" className="w-10 h-10 text-blue-600 bg-blue-100 rounded-full p-2 shadow" /> // Empowerment
]

const missionIcons = [
  <Sparkles key="innovation" className="w-10 h-10 text-yellow-500 bg-yellow-100 rounded-full p-2 shadow" />, // Innovation
  <Star key="quality" className="w-10 h-10 text-amber-600 bg-amber-100 rounded-full p-2 shadow" />, // Quality
  <UserCheck key="expression" className="w-10 h-10 text-purple-600 bg-purple-100 rounded-full p-2 shadow" /> // Expression
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-pink-200 via-blue-100 to-white rounded-3xl shadow-xl mt-8">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/classic-tshirt.png"
            alt="Sherryz Store Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-200/70 via-transparent to-blue-200/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-black tracking-tight uppercase">
            About Sherryz
          </h1>
          <p className="text-xl md:text-2xl text-black font-bold mb-6 drop-shadow-sm">
            Bold streetwear & custom designs from Karachi, made for everyone who dares to stand out.
          </p>
          <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Sherryz is where creativity, comfort, and self-expression meet. We believe fashion should be fearless, inclusive, and uniquely yours.
          </p>
        </motion.div>
      </section>

      {/* Brand Story Section */}
      <section className="py-10 px-4 bg-gradient-to-r from-blue-50 via-pink-50 to-white rounded-2xl shadow-md my-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">Our Story</h2>
          <p className="text-lg text-black mb-2">
            Founded in Karachi, Sherryz was born from a passion for art, street culture, and the spirit of individuality. We set out to create a brand where everyone can express themselves boldly—through premium streetwear and custom designs that break the mold.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 px-4 bg-gradient-to-l from-pink-100 via-blue-50 to-white rounded-2xl shadow-md my-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4 text-black">Our Values</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <Palette className="w-8 h-8 mx-auto text-pink-500 mb-2" />
              <h3 className="font-semibold mb-1 text-black">Creativity</h3>
              <p className="text-black text-sm">Every piece is a canvas for self-expression and bold ideas.</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <Leaf className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <h3 className="font-semibold mb-1 text-black">Sustainability</h3>
              <p className="text-black text-sm">We care about ethical practices and the planet in everything we do.</p>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <Shield className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <h3 className="font-semibold mb-1 text-black">Empowerment</h3>
              <p className="text-black text-sm">We inspire confidence and celebrate individuality through fashion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-pink-100 via-blue-100 to-white rounded-2xl shadow-lg p-6">
          <Image
            src="/logo1.png"
            alt="Founder of Sherryz"
            width={100}
            height={100}
            className="rounded-full shadow border-2 border-pink-200 object-cover bg-white"
          />
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-black mb-1">Meet Sheharyar Khan</h3>
            <p className="text-black text-sm">Founder & Creative Director</p>
            <p className="text-black mt-2 text-sm">“Fashion is the art you live in. At Sherryz, we create canvases for your story.”</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 px-4 text-center bg-gradient-to-r from-blue-100 via-pink-100 to-white rounded-2xl shadow my-8">
        <Link href="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-blue-600 text-white px-8 py-4 rounded-full font-extrabold text-xl shadow-2xl hover:from-pink-700 hover:to-blue-700 transition-colors">
          Explore Collection <ArrowRight className="w-6 h-6" />
        </Link>
      </section>
    </div>
  )
} 