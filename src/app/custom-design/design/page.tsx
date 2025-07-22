'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, Type, ShoppingCart, RotateCw, Image as ImageIcon, Download, Move, ZoomIn, Save, ArrowLeft } from 'lucide-react'

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

interface ProductOption {
  id: string
  name: string
  type: string
  price: number
  description: string
  features: string[]
  image: string
}

export default function CustomDesignPage() {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null)
  const [designNotes, setDesignNotes] = useState('')

  const designColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#000000' },
    { name: 'Navy Blue', value: '#1e3a8a' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Green', value: '#16a34a' },
  ]

  useEffect(() => {
    // Load selected product from localStorage
    console.log('Design page loading, checking localStorage...')
    const savedProduct = localStorage.getItem('selectedProduct')
    console.log('Saved product from localStorage:', savedProduct)
    
    if (savedProduct) {
      try {
        const product = JSON.parse(savedProduct)
        console.log('Parsed product:', product)
        setSelectedProduct(product)
      } catch (error) {
        console.error('Error parsing saved product:', error)
        router.push('/custom-design')
      }
    } else {
      console.log('No saved product found, redirecting to custom-design')
      router.push('/custom-design')
    }
  }, [router])

  useEffect(() => {
    drawCanvas()
  }, [elements, designColor, printSide])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const scale = 2
    canvas.width = 500 * scale
    canvas.height = 600 * scale
    ctx.scale(scale, scale)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#f9fafb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw T-Shirt shape
    ctx.fillStyle = designColor
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2

    // Body
    ctx.beginPath()
    ctx.moveTo(150, 100)
    ctx.lineTo(350, 100)
    ctx.bezierCurveTo(380, 200, 380, 300, 350, 500)
    ctx.lineTo(150, 500)
    ctx.bezierCurveTo(120, 300, 120, 200, 150, 100)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Neck
    ctx.save()
    ctx.beginPath()
    ctx.arc(250, 140, 40, 0, Math.PI, false)
    ctx.closePath()
    ctx.clip()
    ctx.clearRect(210, 100, 80, 40)
    ctx.restore()

    // Sleeves
    ctx.beginPath()
    ctx.moveTo(150, 100)
    ctx.bezierCurveTo(100, 120, 80, 180, 100, 220)
    ctx.lineTo(130, 230)
    ctx.bezierCurveTo(150, 180, 160, 130, 150, 100)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(350, 100)
    ctx.bezierCurveTo(400, 120, 420, 180, 400, 220)
    ctx.lineTo(370, 230)
    ctx.bezierCurveTo(350, 180, 340, 130, 350, 100)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Define design area
    const designArea = { x: 175, y: 180, width: 150, height: 200 }

    // Draw design elements within the design area
    ctx.save()
    ctx.rect(designArea.x, designArea.y, designArea.width, designArea.height)
    // ctx.stroke() // for debugging
    ctx.clip()
    
    elements.forEach(element => {
      const elX = designArea.x + element.x
      const elY = designArea.y + element.y
      
      if (element.type === 'text') {
        ctx.save()
        ctx.translate(elX + element.width / 2, elY + element.height / 2)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.fillStyle = element.color
        ctx.font = `${element.fontSize}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(element.content, 0, 0)
        ctx.restore()

        if (selectedElement === element.id) {
          drawSelectionHandles(ctx, elX, elY, element.width, element.height)
        }
      } else if (element.type === 'image' && element.imageUrl) {
        const img = new Image()
        img.src = element.imageUrl
        
        ctx.save()
        ctx.translate(elX + element.width / 2, elY + element.height / 2)
        ctx.rotate((element.rotation * Math.PI) / 180)
        ctx.drawImage(img, -element.width / 2, -element.height / 2, element.width, element.height)
        ctx.restore()

        if (selectedElement === element.id) {
          drawSelectionHandles(ctx, elX, elY, element.width, element.height)
        }
      }
    })
    ctx.restore()
  }

  const drawSelectionHandles = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.strokeRect(x - 2, y - 2, width + 4, height + 4)
    ctx.setLineDash([])

    const handles = [
      { x: x - 5, y: y - 5 },
      { x: x + width - 5, y: y - 5 },
      { x: x - 5, y: y + height - 5},
      { x: x + width - 5, y: y + height - 5 }
    ]

    handles.forEach(handle => {
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(handle.x, handle.y, 10, 10)
    })
  }

  const addText = () => {
    if (!textInput.trim()) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if(!ctx) return

    ctx.font = `${fontSize}px Arial`
    const textMetrics = ctx.measureText(textInput)
    const textWidth = textMetrics.width
    const textHeight = fontSize

    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: 'text',
      x: 75 - textWidth / 2, // Centered in design area
      y: 100 - textHeight / 2,
      width: textWidth,
      height: textHeight,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      const img = new Image()
      img.onload = () => {
        const maxSize = 100
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        const newElement: DesignElement = {
          id: Date.now().toString(),
          type: 'image',
          x: 75 - width / 2,
          y: 100 - height / 2,
          width,
          height,
          content: file.name,
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000',
          rotation: 0,
          imageUrl,
        }
        setElements([...elements, newElement])
        setSelectedElement(newElement.id)
      }
      img.src = imageUrl
    }
    reader.readAsDataURL(file)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX / 2 // Adjust for canvas scaling
    const y = (e.clientY - rect.top) * scaleY / 2

    const designArea = { x: 175, y: 180, width: 150, height: 200 }

    const clickedElement = [...elements].reverse().find(el => {
      const elX = designArea.x + el.x
      const elY = designArea.y + el.y
      return x >= elX && x <= elX + el.width && y >= elY && y <= elY + el.height
    })

    if (clickedElement) {
      setSelectedElement(clickedElement.id)
    } else {
      setSelectedElement(null)
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX / 2
    const y = (e.clientY - rect.top) * scaleY / 2
    
    const designArea = { x: 175, y: 180, width: 150, height: 200 }
    
    const selected = elements.find(el => el.id === selectedElement)
    if (!selected) return

    const elX = designArea.x + selected.x
    const elY = designArea.y + selected.y

    // Check for resize handles
    const handleSize = 10
    const handles = {
      nw: { x: elX - 5, y: elY - 5 },
      ne: { x: elX + selected.width - 5, y: elY - 5 },
      sw: { x: elX - 5, y: elY + selected.height - 5 },
      se: { x: elX + selected.width - 5, y: elY + selected.height - 5 }
    }

    for (const [key, pos] of Object.entries(handles)) {
      if (x >= pos.x && x <= pos.x + handleSize && y >= pos.y && y <= pos.y + handleSize) {
        setIsResizing(true)
        setResizeHandle(key as 'nw' | 'ne' | 'sw' | 'se')
        setDragOffset({ x: selected.width - (x - elX), y: selected.height - (y - elY) })
        return
      }
    }

    if (x >= elX && x <= elX + selected.width && y >= elY && y <= elY + selected.height) {
      setIsDragging(true)
      setDragOffset({ x: x - elX, y: y - elY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging && !isResizing) return

    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX / 2
    const y = (e.clientY - rect.top) * scaleY / 2
    
    const designArea = { x: 175, y: 180, width: 150, height: 200 }

    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id === selectedElement) {
          if (isDragging) {
            let newX = x - designArea.x - dragOffset.x
            let newY = y - designArea.y - dragOffset.y
            
            // Constrain within design area
            newX = Math.max(0, Math.min(newX, designArea.width - el.width))
            newY = Math.max(0, Math.min(newY, designArea.height - el.height))
            
            return { ...el, x: newX, y: newY }
          } else if (isResizing && resizeHandle) {
             let newWidth = el.width
             let newHeight = el.height
             let newX = el.x
             let newY = el.y

             const mouseXInDesignArea = x - designArea.x
             const mouseYInDesignArea = y - designArea.y

             if (resizeHandle.includes('e')) {
                newWidth = Math.max(10, mouseXInDesignArea - newX)
             }
             if (resizeHandle.includes('w')) {
                const right = newX + newWidth
                newX = mouseXInDesignArea
                newWidth = right - newX
             }
             if (resizeHandle.includes('s')) {
                newHeight = Math.max(10, mouseYInDesignArea - newY)
             }
             if (resizeHandle.includes('n')) {
                 const bottom = newY + newHeight
                 newY = mouseYInDesignArea
                 newHeight = bottom - newY
             }
             
             // Prevent negative dimensions
             if (newWidth < 10) {
                 newWidth = 10
                 if(resizeHandle.includes('w')) newX = el.x + el.width - 10
             }
             if (newHeight < 10) {
                 newHeight = 10
                 if(resizeHandle.includes('n')) newY = el.y + el.height - 10
             }

             return { ...el, x: newX, y: newY, width: newWidth, height: newHeight }
          }
        }
        return el
      })
    )
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(elements.filter(el => el.id !== selectedElement))
      setSelectedElement(null)
    }
  }

  const rotateElement = () => {
    if (selectedElement) {
      setElements(
        elements.map(el =>
          el.id === selectedElement ? { ...el, rotation: (el.rotation + 45) % 360 } : el
        )
      )
    }
  }

  const saveDesign = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const designDataUrl = canvas.toDataURL('image/png')
    
    try {
      localStorage.setItem('savedDesign', JSON.stringify({
        elements,
        designColor,
        printSide,
        designNotes
      }))
      alert('Design saved locally!')
    } catch (error) {
      console.error('Error saving design:', error)
      alert('Failed to save design. Local storage may be full.')
    }
  }

  const proceedToCheckout = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const designDataUrl = canvas.toDataURL('image/png')
    
    const orderDetails = {
      product: selectedProduct,
      design: {
        elements,
        color: designColor,
        printSide,
        notes: designNotes,
      },
      designImage: designDataUrl,
    }
    
    localStorage.setItem('customOrderDetails', JSON.stringify(orderDetails))
    router.push('/custom-design/checkout')
  }

  const downloadDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'custom-tshirt-design.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  if (!selectedProduct) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading Product...</h2>
          <p className="text-gray-600 mb-8">Please wait while we load your selected product details.</p>
          <Button onClick={() => router.push('/custom-design')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Customize Your {selectedProduct.name}</h2>
            <div className="flex items-center space-x-4">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-24 h-24 rounded-lg object-cover" />
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Product Price:</span>
                  <p className="text-lg font-semibold">PKR {selectedProduct.price.toFixed(2)}</p>
                </div>
                <Badge>{printSide === 'front' ? 'Front Print' : 'Back Print'}</Badge>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">T-Shirt Color</h3>
            <div className="flex flex-wrap gap-2">
              {designColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setDesignColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 ${designColor === color.value ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Printing Side</h3>
            <div className="flex space-x-2">
                <Button onClick={() => setPrintSide('front')} variant={printSide === 'front' ? 'default' : 'outline'} className="w-full">Front</Button>
                <Button onClick={() => setPrintSide('back')} variant={printSide === 'back' ? 'default' : 'outline'} className="w-full">Back</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add Text</h3>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Enter text"
                    className="flex-grow p-2 border rounded-md"
                />
                <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 p-1 border rounded-md"
                    title="Text Color"
                />
                <Button onClick={addText}><Type className="w-4 h-4" /></Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
            />
            <p className="text-xs text-gray-500 mt-2">Max 10MB. PNG, JPG, GIF accepted.</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="grid grid-cols-2 gap-2">
                <Button onClick={rotateElement} disabled={!selectedElement} variant="outline"><RotateCw className="mr-2 h-4 w-4" /> Rotate</Button>
                <Button onClick={deleteSelectedElement} disabled={!selectedElement} variant="destructive"><RotateCw className="mr-2 h-4 w-4" /> Delete</Button>
                <Button onClick={saveDesign} variant="outline" className="col-span-2"><Save className="mr-2 h-4 w-4" /> Save Design</Button>
                <Button onClick={downloadDesign} variant="outline" className="col-span-2"><Download className="mr-2 h-4 w-4" /> Download View</Button>
            </div>
          </Card>

        </div>

        {/* Right Column: Canvas */}
        <div className="lg:col-span-2">
          <Card className="p-2 sm:p-4 sticky top-6">
            <canvas
              ref={canvasRef}
              className="w-full h-auto cursor-crosshair"
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <div className="mt-4 flex justify-end space-x-4">
              <Button onClick={proceedToCheckout} size="lg">
                Proceed to Checkout <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 