# Deployment Guide - The Inner Edit

Complete step-by-step guide for deploying to Cloudflare Pages.

## Prerequisites Checklist

- [ ] Cloudflare account created
- [ ] Domain name registered (recommended: theinneredit.com)
- [ ] GitHub account for version control
- [ ] Resend account for email (optional but recommended)
- [ ] Shopify store set up (for e-commerce features)

## Step 1: Prepare Your Repository

1. **Initialize Git repository**
   ```bash
   cd the-inner-edit
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/the-inner-edit.git
   git push -u origin main
   ```

## Step 2: Set Up Cloudflare Pages

1. **Log into Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Navigate to "Workers & Pages"

2. **Create new Pages project**
   - Click "Create application"
   - Select "Pages"
   - Choose "Connect to Git"

3. **Connect GitHub repository**
   - Authorize Cloudflare to access your GitHub
   - Select the `the-inner-edit` repository

4. **Configure build settings**
   ```
   Framework preset: Astro
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```

5. **Set environment variables** (in Pages dashboard)
   ```
   NODE_VERSION=18
   SITE_URL=https://theinneredit.com
   ```

6. **Deploy**
   - Click "Save and Deploy"
   - First deployment will take 2-5 minutes

## Step 3: Set Up D1 Database

1. **Install Wrangler CLI** (if not already installed)
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create D1 database**
   ```bash
   wrangler d1 create inner-edit-db
   ```

4. **Copy the database ID** from output and update `wrangler.toml`:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "inner-edit-db"
   database_id = "YOUR-DATABASE-ID-HERE"
   ```

5. **Run database migrations**
   ```bash
   wrangler d1 execute inner-edit-db --file=./schema.sql
   ```

6. **Bind database to Pages project**
   - Go to Cloudflare Pages dashboard
   - Select your project
   - Go to Settings > Functions > D1 database bindings
   - Add binding: Variable name: `DB`, D1 database: `inner-edit-db`

## Step 4: Configure Email (Resend)

1. **Sign up for Resend**
   - Go to https://resend.com
   - Create account
   - Verify your sending domain

2. **Add domain DNS records**
   In Cloudflare DNS, add the records provided by Resend:
   ```
   TXT  @  "resend-verification-code"
   TXT  _dmarc  "v=DMARC1; p=none;"
   ```

3. **Generate API key**
   - In Resend dashboard, go to API Keys
   - Create new API key
   - Copy the key

4. **Add to Cloudflare**
   ```bash
   wrangler secret put RESEND_API_KEY --env production
   # Paste your Resend API key when prompted
   ```

   Or via dashboard:
   - Go to Pages project > Settings > Environment Variables
   - Add: `RESEND_API_KEY` = your-key-here
   - Type: Secret

## Step 5: Configure Shopify (Optional)

1. **Create custom app in Shopify**
   - Shopify Admin > Settings > Apps and sales channels
   - Click "Develop apps"
   - Create app: "The Inner Edit Website"

2. **Configure Storefront API access**
   - API credentials tab
   - Install app
   - Reveal Storefront API token

3. **Add to Cloudflare environment variables**
   ```
   SHOPIFY_STOREFRONT_TOKEN=your-token-here
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   ```

## Step 6: Custom Domain Setup

1. **Add domain to Cloudflare**
   - If not already on Cloudflare, add your domain
   - Update nameservers at your registrar

2. **Add custom domain to Pages**
   - Pages project > Custom domains
   - Click "Set up a custom domain"
   - Enter: `theinneredit.com`
   - Add `www.theinneredit.com` as well

3. **Configure DNS records** (automatic with Cloudflare)
   - CNAME for apex domain
   - CNAME for www subdomain

4. **Enable SSL** (automatic)
   - Cloudflare will provision free SSL certificate
   - Wait 5-10 minutes for activation

## Step 7: Verify Deployment

1. **Check homepage**
   - Visit https://theinneredit.com
   - Verify all styling loads correctly

2. **Test contact form**
   - Go to /contact
   - Submit test message
   - Check if email arrives

3. **Test newsletter signup**
   - Go to /newsletter
   - Subscribe with test email
   - Verify welcome email received

4. **Check blog**
   - Navigate to /blog
   - Verify posts load correctly

5. **Test shop**
   - Go to /shop
   - Verify products display (if Shopify connected)

## Step 8: Performance Optimization

1. **Enable Cloudflare features**
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - Browser Cache TTL: 4 hours

2. **Configure caching**
   - Static assets: cache everything
   - HTML pages: cache with revalidation

3. **Set up analytics** (optional)
   - Cloudflare Web Analytics (free)
   - Or add Google Analytics / Plausible

## Ongoing Maintenance

### Updating Content

**Adding blog posts:**
1. Create MDX file in `src/content/blog/`
2. Commit and push to GitHub
3. Cloudflare auto-deploys changes

**Updating products:**
- Update in Shopify admin
- Changes reflect automatically via API

### Monitoring

**Check logs:**
```bash
wrangler pages deployment tail
```

**View analytics:**
- Cloudflare Dashboard > Analytics & Logs

### Backup

**Export D1 database:**
```bash
wrangler d1 execute inner-edit-db --command "SELECT * FROM subscribers" > backup.json
```

## Troubleshooting

### Build Failures

**Check build logs:**
- Pages dashboard > Deployments > Click failed deployment
- Review error messages

**Common issues:**
- Missing environment variables
- Node version mismatch (set NODE_VERSION=18)
- Package installation errors (check package.json)

### Email Not Sending

**Verify:**
1. RESEND_API_KEY is set correctly
2. Domain is verified in Resend
3. DNS records are correct
4. Check Resend logs for delivery status

### Database Errors

**Verify binding:**
- Pages Settings > Functions > D1 bindings
- Ensure DB variable is bound to inner-edit-db

**Test database:**
```bash
wrangler d1 execute inner-edit-db --command "SELECT * FROM contacts LIMIT 1"
```

### Shopify Not Loading Products

**Check:**
1. Storefront API token is valid
2. Environment variables are set
3. Store domain is correct (include .myshopify.com)
4. API permissions include product read access

## Support Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **Astro Docs**: https://docs.astro.build
- **Resend Docs**: https://resend.com/docs
- **Shopify Storefront API**: https://shopify.dev/docs/api/storefront

## Next Steps

1. ✅ Deploy to production
2. ✅ Configure custom domain
3. ✅ Set up email delivery
4. ✅ Test all features
5. 📝 Add real content (blog posts, products)
6. 📸 Replace placeholder images
7. 🎨 Customize colors/fonts if needed
8. 📊 Set up analytics
9. 🔒 Review security settings
10. 🚀 Launch!

---

**Questions?** Check README.md or contact support.
