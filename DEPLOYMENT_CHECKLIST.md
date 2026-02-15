# Pre-Deployment Checklist

## Before Deploying to Vercel

### 1. Code Preparation
- [ ] All code is committed to Git
- [ ] Code is pushed to GitHub
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] `.gitignore` is properly configured

### 2. Environment Configuration
- [ ] Update `src/environments/environment.prod.ts` with production API URL
- [ ] Verify API URL is correct (not localhost)
- [ ] Test production build locally: `npm run build`

### 3. Build Verification
- [ ] Run `npm install` to ensure dependencies are up to date
- [ ] Run `npm run build` locally - should complete without errors
- [ ] Check `dist/restaurant-website/browser` folder exists after build
- [ ] Verify all assets are included in build output

### 4. Configuration Files
- [ ] `vercel.json` exists in project root ✓ (already created)
- [ ] `package.json` has build scripts ✓ (already updated)
- [ ] `.gitignore` excludes `node_modules` and `dist` ✓

### 5. Testing
- [ ] Test all routes work locally
- [ ] Test authentication flow
- [ ] Test API connections (if backend is ready)
- [ ] Test on different browsers
- [ ] Test responsive design on mobile

### 6. GitHub Setup
- [ ] Repository is on GitHub
- [ ] You have push access to the repository
- [ ] Repository is public or you've connected it to Vercel

### 7. Vercel Account
- [ ] Vercel account created (vercel.com)
- [ ] GitHub account connected to Vercel
- [ ] Ready to import project

## Deployment Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to vercel.com
   - Import project from GitHub
   - Configure settings (auto-detected)
   - Add environment variables if needed
   - Deploy!

3. **Post-Deployment**
   - [ ] Test live URL
   - [ ] Verify all routes work
   - [ ] Check API connections
   - [ ] Test on mobile
   - [ ] Share URL with team

## Quick Commands

```bash
# Test production build locally
npm run build

# Serve production build locally (optional)
npx http-server dist/restaurant-website/browser -p 8080

# Deploy via CLI (if using)
vercel --prod
```

