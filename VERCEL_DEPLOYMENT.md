# Vercel Deployment Guide

This guide will help you deploy your Angular restaurant website to Vercel.

## Prerequisites

1. **GitHub Account**: Your project should be pushed to GitHub (see `GITHUB_PUSH_INSTRUCTIONS.md`)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free account works)
3. **Node.js**: Vercel will use Node.js automatically, but ensure your project builds locally

## Quick Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   - Make sure your project is pushed to GitHub (see `GITHUB_PUSH_INSTRUCTIONS.md`)

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

3. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository (`MohamedAteef21/FE`)
   - Vercel will auto-detect it's an Angular project

4. **Configure Project Settings**
   - **Framework Preset**: Angular (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (already configured)
   - **Output Directory**: `dist/restaurant-website/browser` (already configured)
   - **Install Command**: `npm install` (already configured)

5. **Environment Variables** (if needed)
   - If your app uses environment variables, add them in the "Environment Variables" section
   - Example: `API_URL` = `https://your-api-url.com/api`

6. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be live at a URL like: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd "D:\mechoo\movies\El Bahwat\FE"
   vercel
   ```
   - Follow the prompts
   - For production deployment, use: `vercel --prod`

## Configuration Files

### vercel.json
Already created in your project root. This file configures:
- Build command
- Output directory
- SPA routing (rewrites all routes to index.html)
- Asset caching headers

### package.json
Updated with:
- `build` script: `ng build --configuration production`
- `vercel-build` script: For Vercel's build process

## Important: Update Production Environment

Before deploying, update your production API URL:

1. **Edit `src/environments/environment.prod.ts`**:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-actual-api-url.com/api', // Update this!
     appName: 'Restaurant Website'
   };
   ```

2. **Or use Environment Variables in Vercel**:
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add: `API_URL` = `https://your-api-url.com/api`
   - Then update `environment.prod.ts` to read from `process.env['API_URL']` (requires build-time replacement)

## Post-Deployment Checklist

- [ ] Test the deployed site URL
- [ ] Verify all routes work (Angular routing)
- [ ] Check API connections (if backend is deployed)
- [ ] Test authentication flow
- [ ] Verify images and assets load correctly
- [ ] Test on mobile devices
- [ ] Check browser console for errors

## Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Domains
   - Add your custom domain (e.g., `restaurant.com`)
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   - Add a CNAME record pointing to Vercel
   - Or add A records as instructed by Vercel

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `node_modules` is not committed (it's in `.gitignore`)
- Verify all dependencies are in `package.json`

### Routes Not Working (404 errors)
- The `vercel.json` includes rewrites for SPA routing
- If issues persist, check the rewrite rules

### API Calls Fail
- Check CORS settings on your backend
- Verify API URL in `environment.prod.ts`
- Check browser console for CORS errors

### Assets Not Loading
- Verify asset paths are relative
- Check that assets are in `src/assets` directory
- Ensure build output includes assets

## Environment Variables in Vercel

If you need to use environment variables:

1. **In Vercel Dashboard**:
   - Project → Settings → Environment Variables
   - Add variables for Production, Preview, and Development

2. **Access in Code** (requires build-time replacement):
   ```typescript
   // In environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: process.env['API_URL'] || 'https://api.yourrestaurant.com/api',
     appName: 'Restaurant Website'
   };
   ```

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch = Production deployment
- Every pull request = Preview deployment
- Automatic deployments are enabled by default

## Performance Tips

1. **Enable Vercel Analytics** (optional):
   - Project → Settings → Analytics
   - Enable Web Analytics for performance insights

2. **Image Optimization**:
   - Consider using Vercel's Image Optimization API
   - Or use a CDN for images

3. **Caching**:
   - Static assets are cached automatically (configured in `vercel.json`)
   - API responses should have proper cache headers

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Angular Deployment: [angular.io/guide/deployment](https://angular.io/guide/deployment)
- Vercel Support: [vercel.com/support](https://vercel.com/support)

## Next Steps After Deployment

1. Test all features on the live site
2. Set up monitoring (Vercel Analytics)
3. Configure custom domain (if needed)
4. Set up CI/CD for automatic deployments
5. Configure environment variables for different environments

