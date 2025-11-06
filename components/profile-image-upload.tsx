"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload } from "lucide-react"

interface ProfileImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
  userName?: string
}

export function ProfileImageUpload({ currentImage, onImageChange, userName }: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        onImageChange(data.url)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
        const errorMessage = errorData.message || errorData.error || 'Upload failed'
        alert(errorMessage + (errorData.hint ? `\n\n${errorData.hint}` : ''))
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error?.message || 'Upload failed. Please try again.'
      alert(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="w-24 h-24">
          <AvatarImage src={currentImage} alt={userName} />
          <AvatarFallback className="text-lg">
            {getInitials(userName)}
          </AvatarFallback>
        </Avatar>

        <Button
          size="sm"
          variant="secondary"
          className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile image"
      />

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Change Photo'}
      </Button>
    </div>
  )
}
