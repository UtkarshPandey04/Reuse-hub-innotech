require('dotenv').config()
const cloudinary = require('../lib/cloudinary.ts').default
const fs = require('fs')
const path = require('path')

async function uploadImagesToCloudinary() {
  try {
    console.log('Starting image upload to Cloudinary...')

    const publicDir = path.join(__dirname, '..', 'public')
    const imageFiles = fs.readdirSync(publicDir).filter(file =>
      /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)
    )

    console.log(`Found ${imageFiles.length} image files`)

    const uploadResults = {}

    for (const file of imageFiles) {
      const filePath = path.join(publicDir, file)
      console.log(`Uploading ${file}...`)

      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'reusehub',
          public_id: path.parse(file).name,
          overwrite: true,
        })

        uploadResults[file] = result.secure_url
        console.log(`✓ Uploaded ${file}: ${result.secure_url}`)
      } catch (error) {
        console.error(`✗ Failed to upload ${file}:`, error.message)
      }
    }

    // Save results to a JSON file
    const resultsPath = path.join(__dirname, '..', 'image-upload-results.json')
    fs.writeFileSync(resultsPath, JSON.stringify(uploadResults, null, 2))

    console.log('Upload complete! Results saved to image-upload-results.json')
    console.log('Update your database seed script with these URLs.')

  } catch (error) {
    console.error('Error uploading images:', error)
  }
}

uploadImagesToCloudinary()
