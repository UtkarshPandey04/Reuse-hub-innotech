# Vercel Deployment Guide

This guide will help you deploy your Next.js application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A MongoDB database (MongoDB Atlas recommended)
3. Cloudinary account for image uploads
4. DeepSeek API key for chat functionality

## Quick Deployment

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and configure settings

## Environment Variables

You need to configure the following environment variables in your Vercel project settings:

### Required Environment Variables

1. **MONGODB_URI**
   - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - Secret key for JWT token generation
   - Generate a strong random string
   - Example: Use `openssl rand -base64 32` or any secure random string generator

3. **CLOUDINARY_CLOUD_NAME**
   - Your Cloudinary cloud name
   - Found in your Cloudinary dashboard

4. **CLOUDINARY_API_KEY**
   - Your Cloudinary API key
   - Found in your Cloudinary dashboard

5. **CLOUDINARY_API_SECRET**
   - Your Cloudinary API secret
   - Found in your Cloudinary dashboard

6. **DEEPSEEK_API_KEY**
   - Your DeepSeek/OpenRouter API key for chat functionality
   - Get it from [OpenRouter](https://openrouter.ai/)

### Setting Environment Variables in Vercel

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: The variable name (e.g., `MONGODB_URI`)
   - **Value**: The variable value
   - **Environment**: Select which environments (Production, Preview, Development)
4. Click **Save**

## Deployment Steps

1. **Prepare your code**
   - Ensure all dependencies are in `package.json`
   - Make sure your code is pushed to Git

2. **Configure environment variables**
   - Add all required environment variables in Vercel dashboard

3. **Deploy**
   - Use Vercel CLI or connect via GitHub
   - Vercel will automatically build and deploy your Next.js app

4. **Verify deployment**
   - Check the deployment logs for any errors
   - Test your application endpoints
   - Verify database connections

## Important Notes

- **MongoDB Connection**: Ensure your MongoDB Atlas cluster allows connections from Vercel IPs (0.0.0.0/0 for all IPs, or specific Vercel IPs)
- **Cloudinary**: Make sure your Cloudinary settings allow uploads from your Vercel domain
- **Build Time**: The build process may take a few minutes on first deployment
- **Custom Domain**: You can add a custom domain in Vercel project settings

## Troubleshooting

### Build Errors
- Check that all dependencies are listed in `package.json`
- Verify Node.js version compatibility (Next.js 16 requires Node.js 18+)

### Runtime Errors
- Check environment variables are set correctly
- Verify MongoDB connection string is correct
- Check API keys are valid and have proper permissions

### Database Connection Issues
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Verify database user has proper permissions
- Check connection string format

## Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure preview deployments for pull requests
3. Set up monitoring and analytics
4. Configure automatic deployments from main branch

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)

