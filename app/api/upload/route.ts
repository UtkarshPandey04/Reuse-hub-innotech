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
      const missingVars = []
      if (!cloudName) missingVars.push('CLOUDINARY_CLOUD_NAME')
      if (!apiKey) missingVars.push('CLOUDINARY_API_KEY')
      if (!apiSecret) missingVars.push('CLOUDINARY_API_SECRET')
      
      console.error('Missing Cloudinary environment variables:', missingVars)
      return NextResponse.json({ 
        error: 'Upload service not configured. Missing Cloudinary credentials.',
        missingVariables: missingVars,
        message: 'Please configure the following environment variables in your Vercel dashboard: ' + missingVars.join(', ')
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

    // Upload to Cloudinary with timeout protection
    const uploadResult = await Promise.race([
      cloudinary.uploader.upload(dataUri, {
        folder: 'reusehub-profiles',
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'fill' },
          { quality: 'auto' }
        ]
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout after 60 seconds')), 60000)
      )
    ]) as any

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
    
    // Provide user-friendly error messages
    let errorMessage = 'Upload failed'
    let errorDetails: any = undefined
    
    if (error?.message?.includes('timeout')) {
      errorMessage = 'Upload timed out. Please try again with a smaller image.'
    } else if (error?.http_code === 401) {
      errorMessage = 'Invalid Cloudinary credentials. Please check your API key and secret.'
    } else if (error?.http_code === 400) {
      errorMessage = `Cloudinary upload failed: ${error?.message || 'Invalid request'}`
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    // Include detailed error information in development
    if (process.env.NODE_ENV === 'development' || error?.http_code) {
      errorDetails = {
        message: error?.message,
        http_code: error?.http_code,
        response: error?.response,
        ...(process.env.NODE_ENV === 'development' && { stack: error?.stack })
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails,
      hint: 'Check your Vercel environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET'
    }, { status: 500 })
  }
}
