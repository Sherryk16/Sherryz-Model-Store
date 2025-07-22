'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import  supabase  from '@/lib/supabase'
import Image from 'next/image'
import { X, ArrowUp, ArrowDown } from 'lucide-react'
import { FeaturedProducts } from '@/components/FeatureProduct'

export default function AddProductPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [sizes, setSizes] = useState('')
  const [colors, setColors] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleAddProduct = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    if (!name || !price || !description || imageFiles.length === 0) {
      setErrorMsg('Please fill all fields.')
      return
    }
    setUploading(true)
    const imageUrls: string[] = []
    for (const file of imageFiles) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(`public/${Date.now()}-${file.name}`, file)
      if (uploadError) {
        setErrorMsg(`Failed to upload ${file.name}: ${uploadError.message}`)
        setUploading(false)
        return
      }
      const imageUrl = supabase.storage.from('products').getPublicUrl(uploadData.path).data.publicUrl
      imageUrls.push(imageUrl)
    }
    const { error: dbError } = await supabase.from('products').insert([
      {
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrls[0],
        images: imageUrls,
        sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: colors.split(',').map(c => c.trim()).filter(Boolean),
        is_featured: isFeatured,
      }
    ])
    setUploading(false)
    if (dbError) {
      setErrorMsg('Failed to save product: ' + dbError.message)
      return
    }
    setSuccessMsg('Product added successfully!')
    setTimeout(() => router.push('/admin/products'), 1200)
  }

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files)]);
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

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-0"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full p-2 border mb-0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border mb-0"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Sizes (comma separated, e.g. S,M,L,XL)"
          className="w-full p-2 border mb-0"
          value={sizes}
          onChange={e => setSizes(e.target.value)}
        />
        <input
          type="text"
          placeholder="Colors (comma separated, e.g. Red,Blue,Green)"
          className="w-full p-2 border mb-0"
          value={colors}
          onChange={e => setColors(e.target.value)}
        />
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="isFeatured"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
            Mark as Featured Product
          </label>
        </div>
      </div>
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
      {errorMsg && <div className="mb-4 text-red-600">{errorMsg}</div>}
      {successMsg && <div className="mb-4 text-green-600">{successMsg}</div>}
      <button onClick={handleAddProduct} className="bg-green-600 text-white px-6 py-2" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Add Product'}
      </button>
      
      {/* Featured Products Section */}
      <div className="mt-16">
        <FeaturedProducts />
      </div>
    </div>
  )
}
