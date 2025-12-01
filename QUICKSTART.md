# Quick Start Guide - The Inner Edit

Get your blog up and running in 5 minutes!

## 🚀 Fastest Path to Launch

### 1. Install Dependencies (2 minutes)
```bash
cd the-inner-edit
npm install
```

### 2. Start Development Server (30 seconds)
```bash
npm run dev
```
Visit: http://localhost:4321

### 3. Test the Site
- ✅ Homepage loads
- ✅ Blog section works
- ✅ Shop displays products
- ✅ About page shows content
- ✅ Contact form exists

## 📝 Customize Content

### Update Site Information
Edit `src/layouts/Layout.astro`:
- Line 8: Update page title
- Line 38: Update navigation links
- Lines 60-95: Update footer content

### Change Colors
Edit `src/styles/global.css`:
- Lines 8-18: Color palette variables
- Already set to design brief colors!

### Add Blog Posts
Create file: `src/content/blog/your-post-title.mdx`
```mdx
---
title: "Your Title"
date: "2024-11-28"
category: "The Lead Story"
excerpt: "Brief description"
---

Your content here...
```

### Add Products (Shopify)
1. Set up Shopify store
2. Add products in Shopify admin
3. Get Storefront API token
4. Add to `.env`:
   ```
   SHOPIFY_STOREFRONT_TOKEN=your_token
   SHOPIFY_STORE_DOMAIN=yourstore.myshopify.com
   ```

## 🌐 Deploy to Production

### Option 1: Cloudflare Pages (Recommended)
1. Push code to GitHub
2. Connect repo in Cloudflare Pages
3. Build command: `npm run build`
4. Deploy! 🎉

See `DEPLOYMENT.md` for detailed instructions.

### Option 2: Quick Deploy
```bash
npm run build
npm run deploy
```

## 🎨 Replace Placeholder Images

Add your images to `public/images/`:
- Hero images
- Blog post images
- Product photos
- About page portrait

Update image paths in pages:
- `src/pages/index.astro` - homepage images
- `src/pages/blog/index.astro` - blog images
- `src/pages/shop/index.astro` - product images
- `src/pages/about.astro` - about image

## ✉️ Enable Contact Form

1. Sign up at https://resend.com
2. Verify your domain
3. Get API key
4. Add to Cloudflare:
   ```bash
   wrangler secret put RESEND_API_KEY
   ```

## 📊 Add Analytics (Optional)

Add to `src/layouts/Layout.astro` in `<head>`:

**Google Analytics:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

**Plausible:**
```html
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🔧 Common Tasks

**Add new page:**
1. Create `src/pages/your-page.astro`
2. Use Layout component
3. Add link to navigation

**Change fonts:**
Edit `src/styles/global.css` line 3 (Google Fonts import)

**Update social links:**
Edit `src/layouts/Layout.astro` footer section

## 📚 Need More Help?

- **Full README**: `README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Astro Docs**: https://docs.astro.build
- **Cloudflare Docs**: https://developers.cloudflare.com/pages

## 🎯 Pre-Launch Checklist

- [ ] Replace all placeholder images
- [ ] Add at least 3 blog posts
- [ ] Update About page with your story
- [ ] Configure contact form email
- [ ] Test on mobile devices
- [ ] Add real product information (if using shop)
- [ ] Update social media links
- [ ] Set up domain name
- [ ] Deploy to Cloudflare Pages
- [ ] Test all forms work in production
- [ ] Add favicon (`public/favicon.svg`)

## 🚀 You're Ready!

Your minimalist, intentional blog is ready to go. Focus on creating beautiful content - the tech is handled.

**Design matches the brief:**
- ✅ Soft, neutral color palette
- ✅ Editorial typography (Playfair Display + Inter)
- ✅ Minimalist aesthetic
- ✅ Blog with categories
- ✅ E-commerce integration ready
- ✅ Newsletter signup
- ✅ Contact form
- ✅ Fully responsive

Start creating!
