{/* 
  NOTE: This section contains placeholder testimonials.
  To remove or hide this section, comment out the <TestimonialsSection /> import in app/page.tsx
*/}

const testimonials = [
  {
    quote: "GitPayWidget saved me weeks of work. I had payments on my docs site in under 10 minutes. The API is beautifully designed.",
    author: "Alex Chen",
    role: "Indie Developer",
    avatar: null, // Placeholder - will show initials
    company: "OpenTools",
  },
  {
    quote: "Finally, a payment solution that doesn't require a PhD in backend development. Our conversion rate went up 40% after switching.",
    author: "Sarah Miller",
    role: "Founder",
    avatar: null,
    company: "DevStudio",
  },
  {
    quote: "The widget theming is incredible. It matched our brand perfectly. And the analytics dashboard? Chef's kiss.",
    author: "Marcus Johnson",
    role: "Lead Developer",
    avatar: null,
    company: "VibeCode Labs",
  },
  {
    quote: "We were skeptical about a script-tag solution, but the security and performance exceeded our expectations. Highly recommend.",
    author: "Emily Davis",
    role: "CTO",
    avatar: null,
    company: "StaticShip",
  },
  {
    quote: "Multi-provider support is a game changer. We use Stripe for US and Lemon Squeezy for EU. One widget handles both.",
    author: "Raj Patel",
    role: "Product Lead",
    avatar: null,
    company: "GlobalDocs",
  },
  {
    quote: "Customer support is phenomenal. Had a question at midnight, got a response in 20 minutes. These folks care.",
    author: "Lisa Wong",
    role: "Solo Founder",
    avatar: null,
    company: "CodeSnippets.io",
  },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    'from-gpw-purple-500 to-gpw-pink-500',
    'from-gpw-pink-500 to-orange-500',
    'from-blue-500 to-gpw-purple-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-red-500',
    'from-indigo-500 to-blue-500',
  ];
  const index = name.length % colors.length;
  return colors[index];
}

export function TestimonialsSection() {
  return (
    <section className="gpw-section bg-gpw-bg-base dark:bg-gpw-bg-base overflow-hidden">
      <div className="gpw-container">
        <div className="gpw-section-header">
          <span className="gpw-badge-pink mb-4">Testimonials</span>
          <h2 className="gpw-section-title">
            Loved by{' '}
            <span className="font-display text-gpw-pink-500">developers</span>
            {' '}worldwide
          </h2>
          <p className="gpw-section-subtitle">
            Join hundreds of creators who've simplified their payment stack.
          </p>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="gpw-card p-6 flex flex-col"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-gpw-accent-yellow"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gpw-text-secondary flex-1 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gpw-border">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(testimonial.author)} flex items-center justify-center text-white font-semibold text-sm`}>
                  {getInitials(testimonial.author)}
                </div>
                <div>
                  <p className="font-semibold text-gpw-text-primary text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-gpw-text-muted">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof numbers */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Active Projects' },
            { value: '10M+', label: 'Checkouts Processed' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '4.9/5', label: 'Avg. Rating' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl md:text-4xl font-bold gpw-text-gradient mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gpw-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





