# Firebase Deployment Guide

## Quick Deploy

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not done):
   ```bash
   firebase init hosting
   ```
   - Choose your project
   - Public directory: **`out`**
   - Configure as single-page app: **Yes**
   - Don't overwrite index.html

4. **Build your project**:
   ```bash
   pnpm run build
   ```

5. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```

## What Changed

- ✅ Removed deprecated `next export` from build script
- ✅ Added `output: 'export'` to `next.config.mjs`
- ✅ Created `firebase.json` for hosting configuration
- ✅ Set images to `unoptimized` for static export

## Environment Variables

Don't forget to add your environment variables in Firebase:

```bash
# Add your Supabase credentials
firebase functions:config:set \
  supabase.url="your_supabase_url" \
  supabase.key="your_supabase_anon_key"
```

Or better, use Firebase Hosting with a `.env` file and deploy the `out` folder.

## Alternative: Vercel (Recommended for Next.js)

Next.js works best on Vercel. To deploy there instead:

1. Push to GitHub
2. Visit https://vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

Vercel handles everything automatically and supports SSR, which Firebase Hosting doesn't.
