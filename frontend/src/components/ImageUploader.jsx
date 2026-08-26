import React, { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { axiosi } from '../config/axios'
import { showToast } from '../utils/toast'

const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const res = await axiosi.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data.url
}

export const ImageUploader = ({ value, onChange, label, placeholder }) => {
  const [preview, setPreview] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast.error('Please upload a valid image')
      return
    }
    setUploading(true)
    try {
      const localUrl = URL.createObjectURL(file)
      setPreview(localUrl)
      const serverUrl = await uploadImage(file)
      setPreview(serverUrl)
      onChange(serverUrl)
      showToast.success('Image uploaded')
    } catch (err) {
      showToast.error('Upload failed. Try URL instead.')
      setPreview(value || '')
    } finally {
      setUploading(false)
    }
  }

  const onFileSelect = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0])
  }

  const onPaste = async (e) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) await handleFile(file)
        break
      }
    }
  }

  const clear = (e) => {
    e.stopPropagation()
    setPreview('')
    onChange('')
  }

  const inputBase = "w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#0055A4] focus:border-[#0055A4]"

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-[#111827] mb-1.5">{label}</label>}
      
      {/* Drop / Paste / Preview Area */}
      <div
        className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#0055A4] transition-colors cursor-pointer bg-gray-50 outline-none"
        onClick={() => fileRef.current?.click()}
        onPaste={onPaste}
        tabIndex={0}
      >
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/*"
          onChange={onFileSelect}
        />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="w-full h-40 object-contain rounded" />
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded">
                <Loader2 className="animate-spin text-white" size={24} />
              </div>
            )}
            <button
              type="button"
              onClick={clear}
              className="absolute top-1 right-1 w-7 h-7 bg-[#E31837] text-white rounded-full text-sm flex items-center justify-center hover:bg-red-700"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to upload or paste image</p>
            <p className="text-xs text-gray-400 mt-1">Ctrl+V to paste from clipboard</p>
          </div>
        )}
      </div>

      {/* URL Fallback */}
      <input
        type="text"
        value={value || ''}
        onChange={(e) => {
          setPreview(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={placeholder || 'Or paste image URL here'}
        className={inputBase}
      />
    </div>
  )
}