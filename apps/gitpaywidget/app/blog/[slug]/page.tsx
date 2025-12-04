import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Blog post data - in production, this would come from a CMS or MDX files
const blogPosts: Record<string, {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  content: string;
}> = {
  'introducing-gitpaywidget': {
    title: 'Introducing GitPayWidget: Payments for the Vibe Coding Era',
    excerpt: 'Today we\'re launching GitPayWidget, the easiest way to accept payments on any static site. No backend required, no PCI compliance headaches.',
    date: 'December 1, 2024',
    readTime: '5 min read',
    category: 'Announcement',
    author: 'Manic Agency',
    content: `
We're excited to announce **GitPayWidget** — the easiest way to accept payments on any static site.

## The Problem

You've built a beautiful documentation site on GitHub Pages. Or a portfolio on Netlify. Or an open-source project landing page on Vercel. And now you want to add a simple "Upgrade to Pro" button.

Suddenly, you're diving into:
- Setting up a backend server
- Handling PCI compliance
- Managing OAuth flows
- Configuring webhooks
- Building a billing dashboard

What should take 10 minutes becomes a week of infrastructure work.

## The Solution

GitPayWidget handles all of that for you. Add a single script tag to your site:

\`\`\`html
<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="your-org/your-site"
></script>
\`\`\`

That's it. The widget renders beautiful pricing cards, handles checkouts via Stripe or Lemon Squeezy, and tracks analytics — all without you writing a single line of backend code.

## How It Works

1. **Sign up** with GitHub OAuth
2. **Create a project** in our dashboard
3. **Add your Stripe or Lemon Squeezy API keys** (encrypted with AES-256-GCM)
4. **Embed the widget** on your static site
5. **Start accepting payments**

Your visitors click a pricing button → we create a checkout session with your provider → they complete payment on Stripe's hosted page → webhooks notify you and update analytics.

## Why We Built This

We're building for the **vibe coding era** — where AI assists development, prototypes ship in hours, and the best tools stay out of your way.

Static sites are everywhere. GitHub Pages, Netlify, Vercel, Cloudflare Pages. They're fast, cheap, and easy to maintain. But adding payments has always required abandoning that simplicity.

Not anymore.

## Pricing

- **Free:** Start with our free tier. We take 1% of transactions (plus your provider's fees).
- **Pro ($250 lifetime):** One-time payment, zero platform fees forever. Full analytics, custom branding, priority support.

## What's Next

We're just getting started. Coming soon:
- Crypto payments via WalletConnect
- A/B testing for pricing pages
- Self-hosted option
- More payment providers (Paddle, PayPal)

[Get started for free →](/login)

---

*Built with ❤️ by [Manic Agency](https://manic.agency) — we craft vibrant, playful, and deeply technical products.*
    `,
  },
  'stripe-vs-lemonsqueezy': {
    title: 'Stripe vs Lemon Squeezy: Which is Right for Your Project?',
    excerpt: 'A deep dive into the pros and cons of each payment provider, and how to choose based on your audience, location, and product type.',
    date: 'November 28, 2024',
    readTime: '8 min read',
    category: 'Guide',
    author: 'Manic Agency',
    content: `
Choosing a payment provider is one of the first decisions you'll make when monetizing your project. Let's compare the two most popular options for indie developers: **Stripe** and **Lemon Squeezy**.

## Quick Comparison

| Feature | Stripe | Lemon Squeezy |
|---------|--------|---------------|
| Transaction fees | 2.9% + 30¢ | 5% + 50¢ |
| Merchant of Record | No | Yes |
| Sales tax handling | You handle it | They handle it |
| Global payouts | 46+ countries | 200+ countries |
| Setup complexity | Medium | Easy |

## Stripe: The Industry Standard

### Pros
- **Lower fees:** 2.9% + 30¢ is hard to beat
- **Extensive API:** Build anything you can imagine
- **Mature ecosystem:** Tons of integrations and tools
- **Global reach:** Available in 46+ countries
- **Custom checkout:** Build your own UI with Stripe Elements

### Cons
- **You're the merchant:** Handle sales tax, VAT, invoicing yourself
- **Complex tax compliance:** Tools like Stripe Tax help but add fees
- **Account reviews:** Can be strict about certain business types
- **Learning curve:** More powerful = more complex

### Best For
- US/EU-based businesses with clear tax situations
- Projects that need advanced customization
- B2B SaaS where customers handle their own taxes
- High-volume businesses where 2.9% matters

## Lemon Squeezy: The Easy Button

### Pros
- **Merchant of Record:** They handle all tax compliance
- **Global payouts:** Pay creators in 200+ countries
- **Simple setup:** Get started in minutes
- **Built-in features:** Affiliates, discounts, license keys
- **EU VAT handled:** Automatic MOSS compliance

### Cons
- **Higher fees:** 5% + 50¢ adds up
- **Less customization:** Fewer API options
- **Newer platform:** Smaller ecosystem
- **Checkout branding:** Always shows Lemon Squeezy

### Best For
- Solo creators who don't want tax headaches
- Global audience with complex VAT situations
- Digital products (courses, software, ebooks)
- Quick launches where speed matters

## The Tax Question

This is usually the deciding factor.

With **Stripe**, you are the merchant. You need to:
- Register for sales tax in applicable states/countries
- Calculate the correct tax rate at checkout
- File returns and remit taxes quarterly/monthly
- Handle VAT for EU customers (VAT MOSS registration)

With **Lemon Squeezy**, they are the merchant. They:
- Calculate and collect all taxes automatically
- File and remit taxes on your behalf
- Handle VAT for EU customers
- Provide compliant invoices

For a solo founder selling to a global audience, the tax compliance alone can justify Lemon Squeezy's higher fees.

## Use Case: Side Project SaaS

**Scenario:** You built a $9/month developer tool. You expect 100 customers, mostly in the US and EU.

**With Stripe:**
- Revenue: $900/month
- Stripe fees: ~$56/month (2.9% + 30¢ × 100)
- Your cut: ~$844/month
- Plus: tax compliance time/cost

**With Lemon Squeezy:**
- Revenue: $900/month
- LS fees: ~$95/month (5% + 50¢ × 100)
- Your cut: ~$805/month
- Plus: zero tax headaches

The $39/month difference might be worth it for the simplicity.

## Use Case: High-Volume B2B

**Scenario:** You sell enterprise licenses at $500/month. You have 50 customers, mostly US companies.

**With Stripe:**
- Revenue: $25,000/month
- Stripe fees: ~$740/month
- Your cut: ~$24,260/month

**With Lemon Squeezy:**
- Revenue: $25,000/month
- LS fees: ~$1,275/month
- Your cut: ~$23,725/month

At this scale, the $535/month difference is significant. And B2B customers typically handle their own taxes (reverse charge), so the MoR benefit matters less.

## GitPayWidget Supports Both

The beauty of GitPayWidget is that **you can use either provider** — or both! Configure different providers for different plans, and we handle the routing automatically.

Start with Lemon Squeezy for simplicity, then switch to Stripe as you scale. Or use Stripe for US customers and Lemon Squeezy for international.

## Our Recommendation

- **Just starting?** Use Lemon Squeezy. Get to market fast.
- **US-only B2B?** Use Stripe. Lower fees, more control.
- **Global consumer product?** Lemon Squeezy for tax peace of mind.
- **High volume?** Stripe. The fee savings add up.

---

*Need help deciding? [Contact us](/contact) — we're happy to chat through your specific situation.*
    `,
  },
  'monetize-github-pages': {
    title: 'How to Monetize Your GitHub Pages Site in 2024',
    excerpt: 'Step-by-step guide to adding payments to your GitHub Pages documentation, portfolio, or open source project.',
    date: 'November 25, 2024',
    readTime: '6 min read',
    category: 'Tutorial',
    author: 'Manic Agency',
    content: `
GitHub Pages is one of the most popular ways to host documentation, portfolios, and project landing pages. But until now, adding payments meant setting up a whole backend. Not anymore.

This tutorial shows you how to add payments to any GitHub Pages site in under 10 minutes.

## Prerequisites

- A GitHub Pages site (or any static site)
- A Stripe or Lemon Squeezy account
- 5-10 minutes

## Step 1: Sign Up for GitPayWidget

1. Visit [gitpaywidget.com/login](/login)
2. Click "Continue with GitHub"
3. Authorize the app

## Step 2: Create a Project

1. Go to [Dashboard](/dashboard)
2. Click "Create Project"
3. Enter a name (e.g., "My Docs Site")
4. Enter a slug (e.g., "myname/my-docs")

## Step 3: Add Your Payment Provider Keys

### For Stripe:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Secret Key** (starts with \`sk_test_\` or \`sk_live_\`)
3. Create a Product and Price in Stripe
4. Copy the **Price ID** (starts with \`price_\`)
5. In GitPayWidget dashboard, paste as JSON:

\`\`\`json
{
  "secretKey": "sk_test_...",
  "priceId": "price_..."
}
\`\`\`

### For Lemon Squeezy:

1. Go to [Lemon Squeezy Settings](https://app.lemonsqueezy.com/settings/api)
2. Create an API key and copy it
3. Note your Store ID and Variant ID
4. In GitPayWidget dashboard, paste as JSON:

\`\`\`json
{
  "apiKey": "...",
  "storeId": "12345",
  "variantId": "67890"
}
\`\`\`

## Step 4: Add the Widget to Your Site

Add this script tag to your HTML, just before \`</body>\`:

\`\`\`html
<script
  src="https://cdn.gitpaywidget.com/v0/widget.js"
  data-project="myname/my-docs"
></script>
\`\`\`

Or for more control, use the JavaScript API:

\`\`\`html
<div id="pricing"></div>

<script type="module">
  import { renderGitPayWidget } from 'https://cdn.gitpaywidget.com/v0/widget.js';
  
  renderGitPayWidget({
    project: 'myname/my-docs',
    mount: document.getElementById('pricing'),
    plans: [
      {
        id: 'free',
        label: 'Free',
        price: '$0',
        description: 'Basic access',
        features: ['Public docs', 'Community support'],
      },
      {
        id: 'pro',
        label: 'Pro',
        price: '$9.99/mo',
        description: 'Full access',
        features: ['All features', 'Priority support', 'Early access'],
      },
    ],
  });
</script>
\`\`\`

## Step 5: Configure Webhooks (Optional)

To get notified when someone subscribes:

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: \`https://gitpaywidget.com/api/webhook\`
3. Events: \`checkout.session.completed\`, \`customer.subscription.*\`
4. Copy the signing secret
5. Add to GitPayWidget dashboard

## Step 6: Test It

1. Visit your site
2. Click a pricing button
3. Use test card: \`4242 4242 4242 4242\`
4. Complete checkout
5. Check your dashboard for analytics

## Example: VitePress Docs

If you're using VitePress, add the widget to your theme:

\`\`\`js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme';

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    if (typeof window !== 'undefined') {
      import('https://cdn.gitpaywidget.com/v0/widget.js').then(({ renderGitPayWidget }) => {
        // Widget will auto-mount if you have an element with id="pricing"
      });
    }
  },
};
\`\`\`

## Example: Docusaurus

For Docusaurus, create a custom component:

\`\`\`jsx
// src/components/Pricing.js
import { useEffect, useRef } from 'react';

export default function Pricing() {
  const ref = useRef();
  
  useEffect(() => {
    import('https://cdn.gitpaywidget.com/v0/widget.js').then(({ renderGitPayWidget }) => {
      renderGitPayWidget({
        project: 'myname/my-docs',
        mount: ref.current,
        plans: [...],
      });
    });
  }, []);
  
  return <div ref={ref} />;
}
\`\`\`

## Next Steps

- [Customize your widget theme](/docs/theming)
- [Set up webhook forwarding](/docs/integration)
- [View your analytics](/dashboard)

---

*Questions? [Contact us](/contact) — we're here to help!*
    `,
  },
  'vibe-coding-explained': {
    title: 'What is Vibe Coding and Why Does It Matter?',
    excerpt: 'The rise of AI-assisted development, rapid prototyping, and the tools that make shipping faster than ever.',
    date: 'November 20, 2024',
    readTime: '4 min read',
    category: 'Insights',
    author: 'Manic Agency',
    content: `
You might have seen the term "vibe coding" floating around Twitter and developer communities. But what does it actually mean, and why are we building tools for it?

## The Vibe Coding Philosophy

Vibe coding is a development approach characterized by:

1. **Speed over perfection** — Ship the MVP, iterate based on real feedback
2. **AI-assisted development** — Use Copilot, GPT, Claude to accelerate
3. **Minimal infrastructure** — Static sites, serverless, managed services
4. **Beautiful defaults** — Tailwind, shadcn/ui, pre-built components
5. **Solo-friendly tools** — Products that don't require a team to use

It's not about sloppy code. It's about **optimizing for shipping**.

## Why Now?

Three trends converged to make vibe coding viable:

### 1. AI Coding Assistants

GitHub Copilot, ChatGPT, and Claude changed how we write code. A solo developer today can be 2-5x more productive than a few years ago. Complex tasks that required senior expertise are now accessible to anyone who can describe what they want.

### 2. Static Site Renaissance

Platforms like Vercel, Netlify, and Cloudflare Pages made deploying static sites trivially easy. Combined with frameworks like Next.js, Astro, and SvelteKit, you can build sophisticated apps without managing servers.

### 3. Component Libraries

shadcn/ui, Radix, Headless UI — high-quality, accessible components that look great out of the box. No more spending weeks on design systems.

## The Missing Piece: Payments

We built GitPayWidget because payments were the last major friction point for vibe coders.

You could spin up a beautiful docs site in an hour with AI assistance. Deploy it to Vercel in seconds. But adding a "Upgrade to Pro" button? That meant:

- Setting up Stripe
- Building a backend
- Handling webhooks
- Managing subscriptions
- Worrying about PCI compliance

That's not vibe-friendly.

## Vibe-Friendly Design Principles

When building for vibe coders, we follow these principles:

### 1. One-Line Integration
If it takes more than 5 minutes to add, it's too complex. GitPayWidget is a single script tag.

### 2. Sensible Defaults
Out of the box should look great. Customization is optional.

### 3. No Backend Required
Static sites shouldn't need servers. We host the infrastructure.

### 4. Transparent Pricing
No usage-based pricing calculators. Free to start, $250 for lifetime Pro.

### 5. Fast Iteration
Ship changes in minutes, not days. Our dashboard is designed for quick updates.

## The Future of Vibe Coding

We believe vibe coding will become the dominant way indie developers build products. As AI gets better and infrastructure gets simpler, the gap between idea and shipped product will continue to shrink.

The tools that win will be the ones that stay out of your way. That let you maintain the creative flow. That don't make you context-switch into infrastructure mode.

That's the future we're building toward.

---

*GitPayWidget is built for the vibe coding era. [Start free →](/login)*
    `,
  },
  'custom-widget-theming': {
    title: 'Advanced Widget Theming: Match Your Brand Perfectly',
    excerpt: 'Learn how to customize colors, fonts, and CSS to make the GitPayWidget blend seamlessly with your site.',
    date: 'November 15, 2024',
    readTime: '7 min read',
    category: 'Tutorial',
    author: 'Manic Agency',
    content: `
The GitPayWidget is designed to look great out of the box, but you might want to customize it to match your brand. This guide covers all the theming options available.

## Quick Customization

### Via Dashboard

The easiest way to customize is through your GitPayWidget dashboard:

1. Go to Dashboard → Select your project
2. Click "Widget Theme"
3. Set your accent color
4. Customize the CTA button text
5. Save

Changes apply immediately to your embedded widget.

### Via Code

Pass theme options when rendering the widget:

\`\`\`javascript
renderGitPayWidget({
  project: 'my/site',
  plans: [...],
  accentColor: '#ec4899', // pink
  theme: 'dark',
});
\`\`\`

## CSS Custom Properties

The widget uses CSS custom properties (variables) that you can override:

\`\`\`css
:root {
  /* Colors */
  --gpw-accent: #8b5cf6;
  --gpw-accent-hover: #7c3aed;
  --gpw-accent-light: rgba(139, 92, 246, 0.1);
  
  /* Card styling */
  --gpw-card-bg: #ffffff;
  --gpw-card-bg-featured: linear-gradient(135deg, #8b5cf6, #ec4899);
  --gpw-card-border: rgba(139, 92, 246, 0.1);
  --gpw-card-shadow: 0 8px 32px rgba(139, 92, 246, 0.1);
  --gpw-card-radius: 1.25rem;
  
  /* Typography */
  --gpw-font-display: 'Caveat', cursive;
  --gpw-font-body: system-ui, sans-serif;
  --gpw-text-primary: #1e1b4b;
  --gpw-text-secondary: #6b7280;
  
  /* Button styling */
  --gpw-button-radius: 9999px;
  --gpw-button-padding: 0.875rem 1.5rem;
}
\`\`\`

## Dark Mode

The widget automatically detects your site's color scheme using \`prefers-color-scheme\`. You can also force a theme:

\`\`\`javascript
renderGitPayWidget({
  project: 'my/site',
  theme: 'dark', // or 'light'
  plans: [...],
});
\`\`\`

For dark mode, these variables are used:

\`\`\`css
.dark, [data-theme="dark"] {
  --gpw-card-bg: #1e1a35;
  --gpw-text-primary: #f5f3ff;
  --gpw-text-secondary: #a78bfa;
  --gpw-card-border: rgba(139, 92, 246, 0.2);
}
\`\`\`

## Custom CSS Injection

For advanced customization, inject your own CSS:

\`\`\`javascript
renderGitPayWidget({
  project: 'my/site',
  plans: [...],
  customCss: \`
    /* Rounded corners instead of pill buttons */
    .gpw-plan-button {
      border-radius: 12px !important;
    }
    
    /* Different font */
    .gpw-widget-root {
      font-family: 'Inter', sans-serif;
    }
    
    /* Custom feature list icons */
    .gpw-feature-list li::before {
      content: '→' !important;
      color: #ec4899;
    }
  \`,
});
\`\`\`

## Common Customizations

### Brand Colors

Match your primary brand color:

\`\`\`css
:root {
  --gpw-accent: #0066cc; /* Blue brand */
  --gpw-accent-hover: #0052a3;
  --gpw-accent-light: rgba(0, 102, 204, 0.1);
}
\`\`\`

### Card Style

Square cards instead of rounded:

\`\`\`css
:root {
  --gpw-card-radius: 8px;
  --gpw-button-radius: 8px;
}
\`\`\`

### Minimal Style

Remove shadows and borders:

\`\`\`css
:root {
  --gpw-card-shadow: none;
  --gpw-card-border: 1px solid #e5e7eb;
}
\`\`\`

### Enterprise Style

More corporate look:

\`\`\`css
:root {
  --gpw-accent: #1a1a1a;
  --gpw-accent-hover: #333333;
  --gpw-card-bg: #fafafa;
  --gpw-font-display: 'Inter', sans-serif;
  --gpw-card-radius: 4px;
  --gpw-button-radius: 4px;
}
\`\`\`

## Loading Custom Fonts

If you want to use a custom display font:

\`\`\`html
<!-- Add to your <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">

<style>
  :root {
    --gpw-font-display: 'Playfair Display', serif;
  }
</style>
\`\`\`

## Responsive Adjustments

The widget is responsive by default, but you can customize breakpoints:

\`\`\`css
@media (max-width: 640px) {
  .gpw-plan-card {
    padding: 1.5rem !important;
  }
  
  .gpw-plan-price {
    font-size: 2rem !important;
  }
}
\`\`\`

## Testing Your Theme

Use our [Widget Demo](/widget-demo) to preview your customizations before deploying.

---

*Need help with theming? [Contact us](/contact) — we're happy to help match your brand.*
    `,
  },
  'analytics-dashboard-guide': {
    title: 'Understanding Your Analytics Dashboard',
    excerpt: 'A guide to MRR tracking, conversion funnels, and the metrics that matter for your payment widget.',
    date: 'November 10, 2024',
    readTime: '5 min read',
    category: 'Guide',
    author: 'Manic Agency',
    content: `
Your GitPayWidget dashboard provides real-time analytics to help you understand your revenue and optimize conversions. Here's what each metric means and how to use it.

## Overview Metrics

### Monthly Recurring Revenue (MRR)

MRR is the total predictable revenue from active subscriptions, normalized to a monthly amount.

**Calculation:**
- Monthly subscriptions: Full price
- Annual subscriptions: Price ÷ 12
- One-time purchases: Not included in MRR

**Why it matters:** MRR is the #1 metric for subscription businesses. It tells you your baseline revenue and helps predict future growth.

### Checkouts Today / This Month

Raw count of completed checkouts. Use this to:
- Spot trends (weekday vs weekend)
- Measure campaign effectiveness
- Set daily/monthly goals

### Conversion Rate

\`\`\`
Conversion Rate = Completed Checkouts ÷ Checkout Starts × 100
\`\`\`

Industry benchmarks:
- 2-3%: Typical for cold traffic
- 5-10%: Good for warm traffic
- 10%+: Excellent (usually return visitors)

### Active Subscriptions

Count of customers with active, paying subscriptions. Watch for:
- Growth rate (new subs - churned)
- Seasonal patterns
- Impact of pricing changes

### Churn Rate

\`\`\`
Monthly Churn = Cancelled Subscriptions ÷ Active Subscriptions × 100
\`\`\`

Benchmarks:
- <3%: Excellent
- 3-5%: Good
- 5-7%: Average
- >7%: Needs attention

## Revenue Chart

The revenue chart shows your earnings over time. Toggle between:

- **Daily:** Spot immediate trends
- **Weekly:** Smooth out day-to-day noise
- **Monthly:** Long-term growth picture

## Using Analytics to Improve

### Low Conversion Rate?

1. **Simplify your pricing** — Too many options causes decision paralysis
2. **Add social proof** — Testimonials, customer count, trust badges
3. **Reduce friction** — Fewer form fields, faster checkout
4. **Test pricing** — Try different price points

### High Churn Rate?

1. **Improve onboarding** — Help users get value quickly
2. **Add engagement emails** — Remind users of features they're missing
3. **Offer annual discounts** — Lock in longer commitments
4. **Survey churned users** — Ask why they left

### Flat MRR?

1. **Launch new features** — Give upgrade reasons
2. **Raise prices** — Often easier than getting more customers
3. **Add upsells** — Higher tiers or add-ons
4. **Reduce churn** — Retention is often cheaper than acquisition

## Pro Analytics (Pro Plan)

With a Pro license, you get additional analytics:

- **Cohort analysis** — Track retention by signup month
- **Revenue breakdown** — By plan, provider, geography
- **Webhook logs** — Debug payment events
- **Export data** — CSV download for custom analysis

## Setting Up Analytics

Analytics are automatic once you add the widget. To ensure accuracy:

1. **Configure webhooks** — Essential for subscription tracking
2. **Use consistent plan IDs** — Don't change IDs mid-campaign
3. **Tag metadata** — Add user IDs, referrers, UTM params

\`\`\`javascript
renderGitPayWidget({
  project: 'my/site',
  plans: [...],
  onCheckout: (plan) => {
    // Track in your analytics
    gtag('event', 'begin_checkout', {
      plan_id: plan.id,
      plan_price: plan.price,
    });
  },
});
\`\`\`

## Questions?

[Contact us](/contact) if you need help interpreting your analytics or have suggestions for new metrics.

---

*Pro tip: Check your analytics weekly. Daily checks lead to overreacting to noise.*
    `,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: `/blog/${slug}`,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="gpw-badge-primary">{post.category}</span>
            <span className="text-sm text-gpw-text-muted">{post.date}</span>
            <span className="text-sm text-gpw-text-muted">•</span>
            <span className="text-sm text-gpw-text-muted">{post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-gpw-text-muted">
            {post.excerpt}
          </p>
        </header>

        {/* Content */}
        <article className="gpw-prose">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gpw-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gpw-text-muted">
              Written by <strong>{post.author}</strong>
            </p>
            <div className="flex gap-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://gitpaywidget.com/blog/${slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gpw-btn-ghost text-sm"
              >
                Share on Twitter
              </a>
              <Link href="/blog" className="gpw-btn-secondary text-sm">
                More Articles
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

