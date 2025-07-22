'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { SocialIcons } from '@/components/ui/social-icons'
import { Phone, Mail, Clock } from 'lucide-react'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Here you would typically handle the form submission
      console.log('Form submitted:', formData)
      setSubmitSuccess(true)
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen bg-white" role="main">
      {/* Success Message */}
      {submitSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg">
          Message sent successfully!
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-[50vh] overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50">
        <motion.div 
          className="relative z-10 text-center max-w-3xl mx-auto px-4 py-16 md:py-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-7xl font-black mb-6 text-black drop-shadow-2xl tracking-tight uppercase">
            Contact Us
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-bold mb-6 drop-shadow">
            We'd love to hear from you!
          </p>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto drop-shadow-lg">
            Have questions, feedback, or want to collaborate? Reach out and our team will get back to you as soon as possible.
          </p>
          <div className="mt-6 flex justify-center">
            <SocialIcons size={48} />
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 py-24" aria-label="Contact form and information">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-gray-100"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8 text-black">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Contact form">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                  required
                  aria-required="true"
                  aria-label="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                  required
                  aria-required="true"
                  aria-label="Your email address"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                  required
                  aria-required="true"
                  aria-label="Message subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                  required
                  aria-required="true"
                  aria-label="Your message"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-black text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-gray-900 transition-colors ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                aria-label="Submit contact form"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            className="space-y-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold mb-8 text-black text-center">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Phone */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-shadow hover:shadow-xl">
                  <Phone className="w-10 h-10 mb-4 text-gray-400 group-hover:text-black transition-colors duration-200" />
                  <h3 className="font-semibold text-lg mb-2">Phone</h3>
                  <a href="tel:+921234567890" className="text-gray-600 hover:text-black">
                    +92 123 4567890
                  </a>
                </div>
                {/* Email */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-shadow hover:shadow-xl">
                  <Mail className="w-10 h-10 mb-4 text-gray-400 group-hover:text-black transition-colors duration-200" />
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <a href="mailto:sherryzpk1@gmail.com" className="text-gray-600 hover:text-black">
                    sherryzpk1@gmail.com
                  </a>
                </div>
                {/* Hours */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-shadow hover:shadow-xl">
                  <Clock className="w-10 h-10 mb-4 text-gray-400 group-hover:text-black transition-colors duration-200" />
                  <h3 className="font-semibold text-lg mb-2">Hours</h3>
                  <p className="text-gray-600 font-semibold text-lg">
                    24/7
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Social Media Section */}
            <motion.div 
              className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100"
              variants={fadeIn}
            >
              <h2 className="text-2xl font-bold mb-6 text-black">Connect With Us</h2>
              <p className="text-gray-600 mb-6">
                Follow us on social media for the latest updates, style tips, and exclusive offers.
              </p>
              <SocialIcons size={56} />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
} 