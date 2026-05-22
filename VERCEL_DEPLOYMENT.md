# Deploying to Vercel

This guide walks you through deploying the `packages/web` Next.js app to Vercel.

## Prerequisites

1. **Vercel Account**: Create one at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push this monorepo to GitHub
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/bucketlist-app.git
   git push -u origin main
   ```

## Step 1: Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Select a Git Repository"
3. Find and select your `bucketlist-app` repo
4. Click "Import"

## Step 2: Configure Project Settings

On the import page:

1. **Project Name**: `bucketlist-web` (or your preferred name)
2. **Framework Preset**: Should auto-detect as "Next.js"
3. **Root Directory**: Click "Edit" and set to `packages/web`
4. Click "Continue"

## Step 3: Add Environment Variables

On the "Environment Variables" screen, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://ygrgydpcdcighhuqzzqy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_VHLhzRJAWnzv7yVa9G9fIQ_bUgneKK4
```

These are your public Supabase credentials (safe to expose in browser code).

If you need server-side access to Supabase (for API routes), also add:
```
SUPABASE_SERVICE_ROLE_KEY=your_secret_key_here
```

## Step 4: Deploy

Click "Deploy" and wait for the build to complete (usually 2-5 minutes).

Once deployed, you'll get a URL like: `https://bucketlist-web.vercel.app`

## Step 5: Update Your Domain (Optional)

In Vercel dashboard:
1. Go to your project → Settings → Domains
2. Add a custom domain or use the Vercel subdomain

## Automatic Deployments

Every push to `main` branch will automatically trigger a new deployment to Vercel.

To prevent this, you can:
- Only push to `main` when ready for production
- Use a staging branch for testing

## Troubleshooting

### Build fails with "workspace" error
- Ensure your `package.json` at root has `"workspaces"` configured
- Vercel should auto-install with npm workspaces

### Missing environment variables
- Check Vercel project settings → Environment Variables
- Redeploy after adding new variables

### Module not found errors
- Ensure `packages/shared` is properly exported (check `package.json` and `lib/index.ts`)
- Try running locally first: `npm install && npm run build:web`

## Local Testing

Before deploying, test the build locally:

```bash
npm install
npm run build:web
npm run start:web
```

Then open [http://localhost:3000](http://localhost:3000)
