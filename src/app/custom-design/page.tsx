'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shirt, Zap, Star, Heart, Palette, Type, Image as ImageIcon, Upload, ShoppingCart, RotateCw, Move, ZoomIn, Save } from 'lucide-react'

interface ProductOption {
  id: string
  name: string
  type: string
  price: number
  description: string
  features: string[]
  image: string
  popular?: boolean
}

interface DesignElement {
  id: string
  type: 'text' | 'image'
  x: number
  y: number
  width: number
  height: number
  content: string
  fontSize: number
  fontFamily: string
  color: string
  rotation: number
  imageUrl?: string
}

export default function CustomDesignPage() {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null)
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [designColor, setDesignColor] = useState('#ffffff')
  const [textInput, setTextInput] = useState('')
  const [fontSize, setFontSize] = useState(24)
  const [textColor, setTextColor] = useState('#000000')
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [printSide, setPrintSide] = useState<'front' | 'back'>('front')
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<'nw' | 'ne' | 'sw' | 'se' | null>(null)
  const [designNotes, setDesignNotes] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [frontDesign, setFrontDesign] = useState<string | null>(null)
  const [backDesign, setBackDesign] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  const productOptions: ProductOption[] = [
    {
      id: 'tshirt',
      name: 'Classic T-Shirt',
      type: 'tshirt',
      price: 1000,
      description: 'Comfortable cotton t-shirt perfect for everyday wear',
      features: ['100% Cotton', 'Comfortable fit', 'Multiple sizes', 'Quick printing'],
      image: '👕'
    },
    {
      id: 'premium-tshirt',
      name: 'Premium T-Shirt',
      type: 'premium-tshirt',
      price: 2000,
      description: 'High-quality pure cotton t-shirt with superior comfort',
      features: ['100% Pure Cotton', 'Premium quality', 'Soft feel', 'Durable print'],
      image: '👔',
      popular: true
    },
    {
      id: 'oversize-tshirt',
      name: 'Oversize T-Shirt (Drop Shoulder)',
      type: 'oversize-tshirt',
      price: 1300,
      description: 'Trendy oversized drop shoulder fit for a modern, relaxed look',
      features: ['Oversized fit', 'Comfortable cotton', 'Modern style', 'Trendy design'],
      image: '🫂'
    },
    {
      id: 'hoodie',
      name: 'Hoodie',
      type: 'hoodie',
      price: 2600,
      description: 'Warm and cozy hoodie perfect for cooler weather',
      features: ['Warm material', 'Hood with drawstring', 'Kangaroo pocket', 'Comfortable fit'],
      image: '🧥'
    }
  ]

  const designFeatures = [
    {
      icon: <Type className="h-6 w-6" />,
      title: 'Custom Text',
      description: 'Add your own text with custom fonts, sizes, and colors'
    },
    {
      icon: <ImageIcon className="h-6 w-6" />,
      title: 'Upload Images',
      description: 'Upload your own images or logos to create unique designs'
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: 'Color Options',
      description: 'Choose from multiple background colors for your design'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Quick Process',
      description: 'Simple design process with fast turnaround times'
    }
  ]

  const colorOptions = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
  ]

  // Add product images for selection
  const productImages = [
    {
      id: 'premium-tshirt',
      name: 'Premium T-Shirt',
      image: '/premium-tshirt.png',
      display: <img src="/premium-tshirt.png" alt="Premium T-Shirt" className="h-32 mx-auto" />,
    },
    {
      id: 'oversize-tshirt',
      name: 'Oversize T-Shirt',
      image: '/oversize-tshirt.png',
      display: <img src="/oversize-tshirt.png" alt="Oversize T-Shirt" className="h-32 mx-auto" />,
    },
    {
      id: 'classic-tshirt',
      name: 'Classic T-Shirt Pure Cotton',
      image: '/classic-tshirt.png',
      display: <img src="/classic-tshirt.png" alt="Classic T-Shirt Pure Cotton" className="h-32 mx-auto" />,
    },
    {
      id: 'hoodie',
      name: 'Hoodie',
      image: '/hoodie.png',
      display: <img src="/hoodie.png" alt="Hoodie" className="h-32 mx-auto" />,
    },
  ]

  const sizeOptions = ['S', 'M', 'L', 'XL']

  // Set base price per product (update as needed)
  const getBasePrice = () => {
    if (!selectedProduct) return 0
    if (selectedProduct.id === 'premium-tshirt') return 2000
    if (selectedProduct.id === 'oversize-tshirt') return 1300
    if (selectedProduct.id === 'classic-tshirt' || selectedProduct.id === 'tshirt') return 1000
    if (selectedProduct.id === 'hoodie') return 2600
    return 1000
  }

  // Charges
  const deliveryCharge = 200
  const designCharge = 200

  const basePrice = getBasePrice()
  const totalPrice = basePrice + deliveryCharge + designCharge

  useEffect(() => {
    drawCanvas()
  }, [elements, designColor, printSide])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = designColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    elements.forEach(element => {
      if (element.type === 'text') {
        ctx.save()
        ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.fillStyle = element.color
        ctx.font = `${element.fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(element.content, 0, 0)
        ctx.restore()
        if (selectedElement === element.id) {
          ctx.strokeStyle = '#3b82f6'
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4)
          ctx.setLineDash([])
          const handles = [
            { x: element.x - 5, y: element.y - 5, cursor: 'nw' },
            { x: element.x + element.width, y: element.y - 5, cursor: 'ne' },
            { x: element.x - 5, y: element.y + element.height, cursor: 'sw' },
            { x: element.x + element.width, y: element.y + element.height, cursor: 'se' }
          ]
          handles.forEach(handle => {
            ctx.fillStyle = '#3b82f6'
            ctx.fillRect(handle.x, handle.y, 10, 10)
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 1
            ctx.strokeRect(handle.x, handle.y, 10, 10)
          })
        }
      } else if (element.type === 'image' && element.imageUrl) {
        const img = new window.Image()
        img.onload = () => {
          ctx.save()
          ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
          ctx.rotate((element.rotation * Math.PI) / 180)
          ctx.drawImage(img, -element.width / 2, -element.height / 2, element.width, element.height)
          ctx.restore()
          if (selectedElement === element.id) {
            ctx.strokeStyle = '#3b82f6'
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])
            ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4)
            ctx.setLineDash([])
            const handles = [
              { x: element.x - 5, y: element.y - 5, cursor: 'nw' },
              { x: element.x + element.width, y: element.y - 5, cursor: 'ne' },
              { x: element.x - 5, y: element.y + element.height, cursor: 'sw' },
              { x: element.x + element.width, y: element.y + element.height, cursor: 'se' }
            ]
            handles.forEach(handle => {
              ctx.fillStyle = '#3b82f6'
              ctx.fillRect(handle.x, handle.y, 10, 10)
              ctx.strokeStyle = '#ffffff'
              ctx.lineWidth = 1
              ctx.strokeRect(handle.x, handle.y, 10, 10)
            })
          }
        }
        img.src = element.imageUrl
      }
    })
  }

  const addText = () => {
    if (!textInput.trim()) return
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'text',
      x: 150,
      y: 200,
      width: textInput.length * fontSize * 0.6,
      height: fontSize,
      content: textInput,
      fontSize,
      fontFamily: 'Arial',
      color: textColor,
      rotation: 0,
    }
    setElements([...elements, newElement])
    setTextInput('')
    setSelectedElement(newElement.id)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      if (side === 'front') setFrontDesign(imageUrl)
      else setBackDesign(imageUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    if (selectedElement) {
      const element = elements.find(el => el.id === selectedElement)
      if (element) {
        const handles = [
          { x: element.x - 5, y: element.y - 5, cursor: 'nw' },
          { x: element.x + element.width, y: element.y - 5, cursor: 'ne' },
          { x: element.x - 5, y: element.y + element.height, cursor: 'sw' },
          { x: element.x + element.width, y: element.y + element.height, cursor: 'se' }
        ]
        const clickedHandle = handles.find(handle => 
          x >= handle.x && x <= handle.x + 10 && 
          y >= handle.y && y <= handle.y + 10
        )
        if (clickedHandle) {
          setIsResizing(true)
          setResizeHandle(clickedHandle.cursor as 'nw' | 'ne' | 'sw' | 'se')
          return
        }
      }
    }
    const clickedElement = elements.find(element => 
      x >= element.x && x <= element.x + element.width &&
      y >= element.y && y <= element.y + element.height
    )
    setSelectedElement(clickedElement?.id || null)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedElement) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    const element = elements.find(el => el.id === selectedElement)
    if (!element) return
    setIsDragging(true)
    setDragOffset({
      x: x - element.x,
      y: y - element.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    if (isResizing && selectedElement && resizeHandle) {
      const element = elements.find(el => el.id === selectedElement)
      if (!element) return
      let newX = element.x
      let newY = element.y
      let newWidth = element.width
      let newHeight = element.height
      switch (resizeHandle) {
        case 'nw':
          newWidth = element.x + element.width - x
          newHeight = element.y + element.height - y
          newX = x
          newY = y
          break
        case 'ne':
          newWidth = x - element.x
          newHeight = element.y + element.height - y
          newY = y
          break
        case 'sw':
          newWidth = element.x + element.width - x
          newHeight = y - element.y
          newX = x
          break
        case 'se':
          newWidth = x - element.x
          newHeight = y - element.y
          break
      }
      if (newWidth > 20 && newHeight > 20) {
        setElements(elements.map(el => 
          el.id === selectedElement
            ? { ...el, x: newX, y: newY, width: newWidth, height: newHeight }
            : el
        ))
      }
    } else if (isDragging && selectedElement) {
      setElements(elements.map(element => 
        element.id === selectedElement
          ? { ...element, x: x - dragOffset.x, y: y - dragOffset.y }
          : element
      ))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const deleteSelectedElement = () => {
    if (!selectedElement) return
    setElements(elements.filter(element => element.id !== selectedElement))
    setSelectedElement(null)
  }

  const rotateElement = () => {
    if (!selectedElement) return
    setElements(elements.map(element => 
      element.id === selectedElement
        ? { ...element, rotation: element.rotation + 45 }
        : element
    ))
  }

  const saveDesign = () => {
    if (elements.length === 0) {
      alert('Please add at least one design element before saving.')
      return
    }
    const designData = {
      elements,
      designColor,
      designNotes,
      timestamp: Date.now(),
    }
    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]')
    savedDesigns.push({
      id: `design-${Date.now()}`,
      data: designData,
      name: `Custom Design ${savedDesigns.length + 1}`,
      timestamp: Date.now(),
      product: selectedProduct
    })
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns))
    alert('Design saved successfully!')
  }

  const proceedToCheckout = () => {
    if (!selectedProduct) {
      alert('Please select a product.')
      return
    }
    if (!frontDesign && !backDesign) {
      alert('Please upload at least one design (front or back).')
      return
    }
    if (!selectedSize) {
      alert('Please select a size.')
      return
    }
    if (!selectedColor) {
      alert('Please select a color.')
      return
    }
    const orderData = {
      selectedProduct,
      frontDesign,
      backDesign,
      designNotes,
      selectedSize,
      selectedColor,
      totalPrice,
      timestamp: Date.now(),
    }
    localStorage.setItem('customOrder', JSON.stringify(orderData))
    router.push('/custom-design/checkout')
  }

  const addToCart = () => {
    if (!selectedProduct) {
      alert('Please select a product.')
      return
    }
    if (!frontDesign && !backDesign) {
      alert('Please upload at least one design (front or back).')
      return
    }
    if (!selectedSize) {
      alert('Please select a size.')
      return
    }
    if (!selectedColor) {
      alert('Please select a color.')
      return
    }
    const orderData = {
      selectedProduct,
      frontDesign,
      backDesign,
      designNotes,
      selectedSize,
      selectedColor,
      totalPrice,
      timestamp: Date.now(),
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    cart.push(orderData)
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Image Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Choose Your Product</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {productImages.map((product) => (
              <button
                key={product.id}
                className={`p-2 border-2 rounded-lg transition-all bg-white shadow-md focus:outline-none ${
                  selectedProduct?.id === product.id ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200 hover:border-blue-400'
                }`}
                onClick={() => setSelectedProduct({
                  id: product.id,
                  name: product.name,
                  type: product.id,
                  price: getBasePrice(),
                  description: '',
                  features: [],
                  image: product.image,
                })}
                type="button"
              >
                {product.display}
                <div className="text-center mt-2 font-semibold">{product.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selector */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Size</h3>
          <div className="flex flex-wrap gap-4">
            {sizeOptions.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 rounded border text-lg font-bold transition-all ${
                  selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
                }`}
                onClick={() => setSelectedSize(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        </Card>

        {/* Color Selector */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Color</h3>
          <div className="flex flex-wrap gap-4">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`px-4 py-2 rounded border text-lg font-bold transition-all flex items-center gap-2 ${
                  selectedColor === color.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
                }`}
                onClick={() => setSelectedColor(color.value)}
                type="button"
              >
                <span className="inline-block w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color.value }}></span>
                {color.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Upload Front and Back Designs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Front Design</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'front')}
              className="mb-2"
            />
            {frontDesign && (
              <img src={frontDesign} alt="Front Design Preview" className="w-full h-48 object-contain border rounded" />
            )}
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Back Design (optional)</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'back')}
              className="mb-2"
            />
            {backDesign && (
              <img src={backDesign} alt="Back Design Preview" className="w-full h-48 object-contain border rounded" />
            )}
          </Card>
        </div>

        {/* Design Notes */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Design Notes</h3>
          <textarea
            value={designNotes}
            onChange={(e) => setDesignNotes(e.target.value)}
            placeholder="Add any special instructions or notes for your design..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </Card>

        {/* Order Summary and Proceed */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Product:</span>
              <span className="font-medium">{selectedProduct ? selectedProduct.name : 'None selected'}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-medium">{selectedSize || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span>Color:</span>
              <span className="font-medium">{colorOptions.find(c => c.value === selectedColor)?.name || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span>Front Design:</span>
              <span className="font-medium">{frontDesign ? 'Uploaded' : 'Not uploaded'}</span>
            </div>
            <div className="flex justify-between">
              <span>Back Design:</span>
              <span className="font-medium">{backDesign ? 'Uploaded' : 'Not uploaded'}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span className="font-medium">PKR {basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span className="font-medium">PKR {deliveryCharge}</span>
            </div>
            <div className="flex justify-between">
              <span>Design Charge:</span>
              <span className="font-medium">PKR {designCharge}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>PKR {totalPrice}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={addToCart}
              className="w-1/2"
              variant="outline"
            >
              Add to Cart
            </Button>
            <Button
              onClick={proceedToCheckout}
              className="w-1/2"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 