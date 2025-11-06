import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary environment variables are set
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      console.error('Missing Cloudinary environment variables:', {
        hasCloudName: !!cloudName,
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret
      })
      return NextResponse.json({ 
        error: 'Upload service not configured. Missing Cloudinary credentials.' 
      }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Only images are allowed. Received: ${file.type}` 
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is 10MB. Received: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert buffer to base64 data URI for Cloudinary
    const base64String = buffer.toString('base64')
    const dataUri = `data:${file.type};base64,${base64String}`

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'reusehub-profiles',
      resource_type: 'image',
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto' }
      ]
    }) as any

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Cloudinary upload failed: No URL returned')
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    })
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      http_code: error?.http_code,
      response: error?.response
    })
    
    const errorMessage = error?.message || 'Upload failed'
    const errorDetails = process.env.NODE_ENV === 'development' ? {
      message: error?.message,
      stack: error?.stack,
      http_code: error?.http_code,
      response: error?.response
    } : undefined
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 })
  }
}
