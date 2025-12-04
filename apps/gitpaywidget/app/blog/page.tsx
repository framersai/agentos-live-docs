import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog – Tutorials, Updates & Best Practices',
  description: 'Learn about vibe coding, static site monetization, payment integrations, and developer tools. Tips, tutorials, and product updates from the GitPayWidget team.',
  openGraph: {
    title: 'GitPayWidget Blog – Developer Tutorials & Updates',
    description: 'Tips for monetizing static sites, payment integration guides, and product news.',
    url: '/blog',
  },
  alternates: {
    canonical: '/blog',
  },
};

const blogPosts = [
  {
    slug: 'introducing-gitpaywidget',
    title: 'Introducing GitPayWidget: Payments for the Vibe Coding Era',
    excerpt: 'Today we\'re launching GitPayWidget, the easiest way to accept payments on any static site. No backend required, no PCI compliance headaches.',
    date: '2024-12-01',
    readTime: '5 min read',
    category: 'Announcement',
    featured: true,
  },
  {
    slug: 'stripe-vs-lemonsqueezy',
    title: 'Stripe vs Lemon Squeezy: Which is Right for Your Project?',
    excerpt: 'A deep dive into the pros and cons of each payment provider, and how to choose based on your audience, location, and product type.',
    date: '2024-11-28',
    readTime: '8 min read',
    category: 'Guide',
    featured: false,
  },
  {
    slug: 'monetize-github-pages',
    title: 'How to Monetize Your GitHub Pages Site in 2024',
    excerpt: 'Step-by-step guide to adding payments to your GitHub Pages documentation, portfolio, or open source project.',
    date: '2024-11-25',
    readTime: '6 min read',
    category: 'Tutorial',
    featured: false,
  },
  {
    slug: 'vibe-coding-explained',
    title: 'What is Vibe Coding and Why Does It Matter?',
    excerpt: 'The rise of AI-assisted development, rapid prototyping, and the tools that make shipping faster than ever.',
    date: '2024-11-20',
    readTime: '4 min read',
    category: 'Insights',
    featured: false,
  },
  {
    slug: 'custom-widget-theming',
    title: 'Advanced Widget Theming: Match Your Brand Perfectly',
    excerpt: 'Learn how to customize colors, fonts, and CSS to make the GitPayWidget blend seamlessly with your site.',
    date: '2024-11-15',
    readTime: '7 min read',
    category: 'Tutorial',
    featured: false,
  },
  {
    slug: 'analytics-dashboard-guide',
    title: 'Understanding Your Analytics Dashboard',
    excerpt: 'A guide to MRR tracking, conversion funnels, and the metrics that matter for your payment widget.',
    date: '2024-11-10',
    readTime: '5 min read',
    category: 'Guide',
    featured: false,
  },
];

const categories = ['All', 'Announcement', 'Tutorial', 'Guide', 'Insights'];

export default function BlogPage() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="gpw-badge-primary mb-4">Blog</span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Insights & <span className="gpw-text-gradient">Tutorials</span>
          </h1>
          <p className="text-lg text-gpw-text-muted max-w-2xl mx-auto">
            Learn about vibe coding, payment integrations, and best practices 
            for monetizing your static sites.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === 'All'
                  ? 'bg-gpw-purple-600 text-white'
                  : 'bg-gpw-purple-500/10 text-gpw-purple-600 dark:text-gpw-purple-400 hover:bg-gpw-purple-500/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featuredPost && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block mb-12 gpw-card-hover overflow-hidden group"
          >
            <div className="md:flex">
              <div className="md:w-1/2 aspect-video md:aspect-auto bg-gradient-to-br from-gpw-purple-600 to-gpw-pink-500 flex items-center justify-center p-8">
                <span className="text-6xl">🚀</span>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="gpw-badge-primary">{featuredPost.category}</span>
                  <span className="text-sm text-gpw-text-muted">{featuredPost.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-gpw-purple-600 dark:group-hover:text-gpw-purple-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-gpw-text-muted mb-4">{featuredPost.excerpt}</p>
                <span className="text-sm text-gpw-purple-600 dark:text-gpw-purple-400 font-medium">
                  Read article → {featuredPost.readTime}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="gpw-card-hover p-6 flex flex-col group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="gpw-badge-primary text-2xs">{post.category}</span>
                <span className="text-xs text-gpw-text-muted">{post.date}</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-gpw-purple-600 dark:group-hover:text-gpw-purple-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gpw-text-muted flex-1 mb-4">{post.excerpt}</p>
              <span className="text-sm text-gpw-purple-600 dark:text-gpw-purple-400 font-medium">
                Read more → {post.readTime}
              </span>
            </Link>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 gpw-card p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-2">Subscribe to our newsletter</h3>
          <p className="text-gpw-text-muted mb-6">
            Get the latest tutorials, tips, and product updates delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              className="gpw-input flex-1"
            />
            <button type="submit" className="gpw-btn-primary px-6">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}





