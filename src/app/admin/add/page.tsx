'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabase'
import Image from 'next/image'
import { X, ArrowUp, ArrowDown } from 'lucide-react'

export default function AddProduct() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isStreetwear, setIsStreetwear] = useState(false)
  const [isUrduCalligraphy, setIsUrduCalligraphy] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [sizes, setSizes] = useState('')
  const [colors, setColors] = useState('')

  const router = useRouter()

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setImageFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    setImageFiles(prev => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const handleMoveDown = (idx: number) => {
    if (idx === imageFiles.length - 1) return;
    setImageFiles(prev => {
      const arr = [...prev];
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return arr;
    });
  };

  const handleAddProduct = async () => {
    if (!name || !price || !description || imageFiles.length === 0) {
      alert('Please fill in all fields and upload at least one image.')
      return
    }
    try {
      // Upload all images to Supabase Storage
      const imageUrls: string[] = []
      for (const file of imageFiles) {
        const filePath = `public/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file)
        if (uploadError || !uploadData) {
          throw new Error(uploadError?.message || 'Image upload failed.')
        }
        const { data: urlData } = supabase.storage.from('products').getPublicUrl(filePath)
        imageUrls.push(urlData.publicUrl)
      }
      // Insert product into Supabase table with images array and image_url as first image
      const { error: insertError } = await supabase.from('products').insert({
        name,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        description,
        image_url: imageUrls[0],
        images: imageUrls,
        is_streetwear: isStreetwear,
        is_urdu_calligraphy: isUrduCalligraphy,
        is_featured: isFeatured,
        sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: colors.split(',').map(c => c.trim()).filter(Boolean),
      })
      if (insertError) {
        throw new Error(insertError.message)
      }
      alert('Product added successfully.')
      router.push('/admin')
    } catch (err: any) {
      console.error('Error adding product:', err)
      alert(err.message || 'Something went wrong.')
    }
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Add Product</h1>
      <input
        type="text"
        placeholder="Product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <input
        type="number"
        placeholder="Current Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <input
        type="number"
        placeholder="Original Price (optional - for discount display)"
        value={originalPrice}
        onChange={(e) => setOriginalPrice(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <input
        type="file"
        multiple
        onChange={handleAddImages}
        className="mb-4"
      />
      {imageFiles.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {imageFiles.map((file, idx) => (
            <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden flex flex-col items-center justify-center bg-white shadow">
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx+1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-1 left-1 flex flex-col gap-1 z-10">
                <button type="button" onClick={() => handleMoveUp(idx)} disabled={idx === 0} className="bg-gray-200 rounded p-0.5 hover:bg-gray-300 disabled:opacity-50"><ArrowUp className="w-4 h-4" /></button>
                <button type="button" onClick={() => handleMoveDown(idx)} disabled={idx === imageFiles.length - 1} className="bg-gray-200 rounded p-0.5 hover:bg-gray-300 disabled:opacity-50"><ArrowDown className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center mb-4 gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isStreetwear}
            onChange={(e) => setIsStreetwear(e.target.checked)}
          />
          Street Wear
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isUrduCalligraphy}
            onChange={(e) => setIsUrduCalligraphy(e.target.checked)}
          />
          Urdu Calligraphy
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured Product
        </label>
      </div>
      <input
        type="text"
        placeholder="Sizes (comma separated, e.g. S,M,L,XL)"
        value={sizes}
        onChange={e => setSizes(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <input
        type="text"
        placeholder="Colors (comma separated, e.g. Red,Blue,Green)"
        value={colors}
        onChange={e => setColors(e.target.value)}
        className="border p-2 w-full mb-4"
      />
      <button
        onClick={handleAddProduct}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Add Product
      </button>
    </div>
  )
}
