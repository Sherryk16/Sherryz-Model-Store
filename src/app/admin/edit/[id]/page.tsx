'use client'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import supabase  from '@/lib/supabase'
import Image from 'next/image'
import { X, ArrowUp, ArrowDown } from 'lucide-react'

export default function EditProduct() {
  const router = useRouter()
  const { id } = useParams()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState('')
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
  const [sizes, setSizes] = useState('')
  const [colors, setColors] = useState('')
  const [isStreetwear, setIsStreetwear] = useState(false)
  const [isUrduCalligraphy, setIsUrduCalligraphy] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
        if (error) throw error
        if (data) {
          setName(data.name)
          setPrice(data.price)
          setOriginalPrice(data.original_price || '')
          setDescription(data.description)
          setCurrentImageUrl(data.image_url)
          setCurrentImages(data.images || [data.image_url])
          setSizes((data.sizes || []).join(', '))
          setColors((data.colors || []).join(', '))
          setIsStreetwear(data.is_streetwear || false)
          setIsUrduCalligraphy(data.is_urdu_calligraphy || false)
          setIsFeatured(data.is_featured || false)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        setError('Failed to load product')
      }
    }
    if (id) fetchProduct()
  }, [id])

  const handleUpdate = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Validate inputs
      if (!name || !price || !description) {
        setError('Please fill in all required fields')
        return
      }

      // Validate price is a valid number
      const priceNum = parseFloat(price)
      if (isNaN(priceNum) || priceNum <= 0) {
        setError('Please enter a valid price')
        return
      }

      // Process sizes and colors
      const sizesArray = sizes
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      
      const colorsArray = colors
        .split(',')
        .map(c => c.trim())
        .filter(Boolean)

      // Prepare update data
      const updateData = {
        name,
        price: priceNum,
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        description,
        sizes: sizesArray,
        colors: colorsArray,
        is_streetwear: isStreetwear,
        is_urdu_calligraphy: isUrduCalligraphy,
        is_featured: isFeatured,
      }

      // Log the data being sent
      console.log('Attempting to update product with data:', {
        id,
        ...updateData
      })

      // First, try to update without the image
      const { data: updateResult, error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()

      if (updateError) {
        console.error('Update error details:', updateError)
        throw new Error(`Database update failed: ${updateError.message}`)
      }

      // Handle image updates
      const finalImages = currentImages.filter(img => !imagesToRemove.includes(img));
      
      // Upload new images
      if (newImageFiles.length > 0) {
        try {
          for (const file of newImageFiles) {
            const filePath = `public/${Date.now()}-${file.name}`
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('products')
              .upload(filePath, file)

            if (uploadError) {
              console.error('Image upload error:', uploadError)
              throw new Error(`Failed to upload image: ${uploadError.message}`)
            }

            const { data: urlData } = supabase.storage
              .from('products')
              .getPublicUrl(filePath)

            finalImages.push(urlData.publicUrl);
          }
        } catch (imageError: any) {
          console.error('Image processing error:', imageError)
          throw new Error(`Image processing failed: ${imageError.message}`)
        }
      }

      // Update images in database
      if (finalImages.length > 0) {
        const { error: imageUpdateError } = await supabase
          .from('products')
          .update({ 
            image_url: finalImages[0],
            images: finalImages
          })
          .eq('id', id)

        if (imageUpdateError) {
          console.error('Image URL update error:', imageUpdateError)
          throw new Error(`Failed to update image URL: ${imageUpdateError.message}`)
        }
      }

      console.log('Update successful:', updateResult)
      router.push('/admin')
    } catch (error: any) {
      console.error('Error updating product:', error)
      setError(error.message || 'Failed to update product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setNewImageFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveNewImage = (idx: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveCurrentImage = (imageUrl: string) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
    setCurrentImages(prev => prev.filter(img => img !== imageUrl));
  };

  const handleMoveNewImageUp = (idx: number) => {
    if (idx === 0) return;
    setNewImageFiles(prev => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const handleMoveNewImageDown = (idx: number) => {
    if (idx === newImageFiles.length - 1) return;
    setNewImageFiles(prev => {
      const arr = [...prev];
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return arr;
    });
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Edit Product</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Product name" 
            className="border w-full p-2 rounded-md" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            placeholder="Current Price" 
            className="border w-full p-2 rounded-md" 
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (optional)</label>
          <input 
            type="number" 
            value={originalPrice} 
            onChange={(e) => setOriginalPrice(e.target.value)} 
            placeholder="Original Price (for discount display)" 
            className="border w-full p-2 rounded-md" 
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Product description" 
            className="border w-full p-2 rounded-md" 
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
          <input 
            type="text" 
            value={sizes} 
            onChange={e => setSizes(e.target.value)} 
            placeholder="Sizes (comma separated, e.g., S, M, L)" 
            className="border w-full p-2 rounded-md" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
          <input 
            type="text" 
            value={colors} 
            onChange={e => setColors(e.target.value)} 
            placeholder="Colors (comma separated, e.g., Red, Blue, Green)" 
            className="border w-full p-2 rounded-md" 
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Collections</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isStreetwear}
                onChange={(e) => setIsStreetwear(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Street Wear</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isUrduCalligraphy}
                onChange={(e) => setIsUrduCalligraphy(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Urdu Calligraphy</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Featured Product</span>
            </label>
          </div>
          <p className="text-xs text-gray-500">Select which collection(s) this product belongs to. A product can be in multiple collections.</p>
        </div>

        {/* Current Images */}
        {currentImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Images</label>
            <div className="flex flex-wrap gap-4 mb-4">
              {currentImages.map((imageUrl, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden flex flex-col items-center justify-center bg-white shadow">
                  <Image
                    src={imageUrl}
                    alt={`Current ${idx+1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCurrentImage(imageUrl)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add New Images</label>
          <input 
            type="file" 
            multiple
            onChange={handleAddImages}
            className="w-full" 
            accept="image/*"
          />
        </div>

        {/* New Image Previews */}
        {newImageFiles.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Images Preview</label>
            <div className="flex flex-wrap gap-4 mb-4">
              {newImageFiles.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden flex flex-col items-center justify-center bg-white shadow">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${idx+1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-1 left-1 flex flex-col gap-1 z-10">
                    <button type="button" onClick={() => handleMoveNewImageUp(idx)} disabled={idx === 0} className="bg-gray-200 rounded p-0.5 hover:bg-gray-300 disabled:opacity-50"><ArrowUp className="w-4 h-4" /></button>
                    <button type="button" onClick={() => handleMoveNewImageDown(idx)} disabled={idx === newImageFiles.length - 1} className="bg-gray-200 rounded p-0.5 hover:bg-gray-300 disabled:opacity-50"><ArrowDown className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={handleUpdate} 
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white px-6 py-2 rounded-md ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Updating...' : 'Update Product'}
        </button>
      </div>
    </div>
  )
}
