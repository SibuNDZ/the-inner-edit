# The Inner Edit - Blog & E-commerce Site

A beautiful, minimalist blog and e-commerce platform built with Astro, React, and deployed on Cloudflare Pages + Workers.

## 🎨 Design Philosophy

The Inner Edit embodies:
- **Minimalist aesthetic** with soft, neutral color palette
- **Editorial typography** using Playfair Display and Inter
- **Intentional user experience** focused on reading and discovery
- **Seamless e-commerce** integrated with Shopify

## 🛠 Tech Stack

- **Framework**: [Astro](https://astro.build) v4.x - Static Site Generation with Islands Architecture
- **UI Components**: React 18 for interactive elements
- **Styling**: Custom CSS with design system variables
- **Hosting**: [Cloudflare Pages](https://pages.cloudflare.com)
- **Serverless**: Cloudflare Workers for API endpoints
- **Database**: Cloudflare D1 (SQLite)
- **Email**: Resend API
- **E-commerce**: Shopify Storefront API
- **Image Optimization**: Cloudflare Images

## 📁 Project Structure

```
the-inner-edit/
├── src/
│   ├── components/       # React components
│   ├── layouts/          # Astro layouts
│   ├── pages/            # File-based routing
│   │   ├── blog/         # Blog posts
│   │   ├── shop/         # Product pages
│   │   └── index.astro   # Homepage
│   ├── styles/           # Global styles
│   └── content/          # MDX blog content
├── functions/            # Cloudflare Workers
│   └── api/              # API endpoints
├── public/               # Static assets
├── astro.config.mjs      # Astro configuration
├── wrangler.toml         # Cloudflare config
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Cloudflare account
- (Optional) Shopify store for e-commerce

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd the-inner-edit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   - Cloudflare Account ID and API Token
   - Resend API key (for contact form emails)
   - Shopify credentials (if using e-commerce)

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:4321`

## 📝 Content Management

### Blog Posts

Blog posts are stored in `src/content/blog/` as MDX files:

```mdx
---
title: "Your Post Title"
date: "2024-11-28"
category: "The Lead Story"
excerpt: "A brief description"
image: "/images/blog-post.jpg"
---

Your content here...
```

### Blog Categories

The blog uses these categories (as per design brief):
- The Lead Story
- The Rewrite
- In-depth
- The Sunday Supplement
- The Editor's Desk

## 🛍 E-commerce Setup

### Shopify Integration

1. **Create a Shopify Store**
   - Sign up at [Shopify](https://shopify.com)
   - Set up your products and collections

2. **Get Shopify Credentials**
   - Go to Settings > Apps and sales channels > Develop apps
   - Create a custom app
   - Enable Storefront API access
   - Copy the Storefront Access Token

3. **Configure Environment Variables**
   ```env
   SHOPIFY_STOREFRONT_TOKEN=your_token_here
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   ```

4. **Product Collections** (as per design brief):
   - Jewelry
   - Candles
   - Apparel / T-shirts
   - Gift Sets

### Create a Shopify Integration Component

The project includes basic product display. To integrate with live Shopify data, create a service file:

```typescript
// src/lib/shopify.ts
export async function getProducts() {
  const response = await fetch(
    `https://${import.meta.env.SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': import.meta.env.SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: `{
          products(first: 10) {
            edges {
              node {
                id
                title
                description
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }`
      })
    }
  );
  
  return await response.json();
}
```

## 📧 Contact Form Setup

The contact form uses Cloudflare Workers and Resend for email delivery.

### Set up Resend

1. Sign up at [Resend](https://resend.com)
2. Verify your domain
3. Create an API key
4. Add to environment variables:
   ```bash
   wrangler secret put RESEND_API_KEY
   ```

### D1 Database Setup

1. **Create D1 database**
   ```bash
   wrangler d1 create inner-edit-db
   ```

2. **Update wrangler.toml** with the database ID

3. **Create tables**
   ```bash
   wrangler d1 execute inner-edit-db --file=./schema.sql
   ```

Create `schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT 1
);
```

## 🎨 Customization

### Color Palette (from design brief)

The design uses these CSS variables (defined in `src/styles/global.css`):

```css
:root {
  --color-eggshell: #F7F4F2;
  --color-warm-beige: #E9E2DB;
  --color-soft-sand: #D6CFC8;
  --color-charcoal: #2A2A2A;
  --color-soft-blush: #F1E5E4;
  --color-muted-gold: #C8B58B;
}
```

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Accents**: Cormorant Garamond (italic)

## 🚢 Deployment

### Cloudflare Pages Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Cloudflare Pages**

   **Option A: Via Wrangler CLI**
   ```bash
   npm run deploy
   ```

   **Option B: Via Cloudflare Dashboard**
   - Connect your Git repository
   - Set build command: `npm run build`
   - Set build output directory: `dist`
   - Add environment variables

3. **Set up custom domain**
   - Go to Cloudflare Pages project
   - Add custom domain: `theinneredit.com`
   - Update DNS records

### Environment Variables

Set these in Cloudflare Pages dashboard:

- `RESEND_API_KEY`
- `SHOPIFY_STOREFRONT_TOKEN`
- `SHOPIFY_STORE_DOMAIN`
- `SITE_URL`

### Secrets

For sensitive data, use Wrangler secrets:

```bash
wrangler secret put RESEND_API_KEY
wrangler secret put SHOPIFY_STOREFRONT_TOKEN
```

## 🔧 Development

### Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Cloudflare Pages
npm run deploy

# Type checking
npm run astro check
```

### Adding New Pages

1. Create new `.astro` file in `src/pages/`
2. Use the Layout component
3. Add navigation link in `src/layouts/Layout.astro`

### Adding New Blog Posts

1. Create MDX file in `src/content/blog/`
2. Include frontmatter with title, date, category, excerpt
3. Post will automatically appear in blog listing

## 📱 Responsive Design

The site is fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet: 768px - 968px
- Desktop: > 968px

## ⚡️ Performance

- **Static Generation**: Most pages are pre-rendered
- **Image Optimization**: Using Cloudflare Images
- **Edge Caching**: Content cached on Cloudflare's edge network
- **Minimal JavaScript**: Only React where needed

## 🔒 Security

- CORS headers configured
- Input validation on forms
- Environment variables for sensitive data
- HTTPS enforced via Cloudflare

## 📊 Analytics (Optional)

Add analytics by including tracking code in `src/layouts/Layout.astro`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>

<!-- or Plausible -->
<script defer data-domain="theinneredit.com" src="https://plausible.io/js/script.js"></script>
```

## 🤝 Contributing

This is a personal project, but suggestions are welcome via issues.

## 📄 License

All rights reserved. Content and design © The Inner Edit.

## 📞 Support

For questions or issues:
- Email: hello@theinneredit.com
- GitHub Issues: [repository-url/issues]

---

**Design Brief Reference**: VUYO_The_Inner_Edit.docx

Built with ❤️ using Astro, React, and Cloudflare
