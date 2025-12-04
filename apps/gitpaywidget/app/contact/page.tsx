'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

// Note: metadata export is not supported in client components
// We'll use a separate layout or generateMetadata pattern

const contactReasons = [
  { value: 'general', label: 'General inquiry' },
  { value: 'support', label: 'Technical support' },
  { value: 'sales', label: 'Sales & pricing' },
  { value: 'partnership', label: 'Partnership opportunity' },
  { value: 'feedback', label: 'Product feedback' },
  { value: 'bug', label: 'Report a bug' },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    reason: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-20">
        <div className="gpw-container max-w-2xl">
          <div className="gpw-card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gpw-accent-green/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gpw-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
            <p className="text-gpw-text-muted mb-6">
              Thanks for reaching out. We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="gpw-btn-secondary"
            >
              Send another message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column - Info */}
          <div>
            <span className="gpw-badge-primary mb-4">Contact</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Let's <span className="gpw-text-gradient">talk</span>
            </h1>
            <p className="text-lg text-gpw-text-muted mb-8">
              Have a question, feedback, or want to partner with us? 
              We'd love to hear from you.
            </p>

            {/* Contact methods */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gpw-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gpw-purple-600 dark:text-gpw-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:team@manic.agency" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
                    team@manic.agency
                  </a>
                  <p className="text-sm text-gpw-text-muted mt-1">
                    We respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gpw-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gpw-purple-600 dark:text-gpw-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Discord</h3>
                  <a href="https://discord.gg/gitpaywidget" target="_blank" rel="noopener noreferrer" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
                    Join our community
                  </a>
                  <p className="text-sm text-gpw-text-muted mt-1">
                    Chat with the team and other users
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gpw-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gpw-purple-600 dark:text-gpw-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">GitHub</h3>
                  <a href="https://github.com/manicinc/gitpaywidget" target="_blank" rel="noopener noreferrer" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
                    Open an issue
                  </a>
                  <p className="text-sm text-gpw-text-muted mt-1">
                    For bugs and feature requests
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <div>
            <div className="gpw-card p-8">
              <h2 className="text-xl font-semibold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="gpw-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="gpw-input"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="gpw-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="gpw-input"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="reason" className="gpw-label">What's this about?</label>
                  <select
                    id="reason"
                    className="gpw-select"
                    value={formState.reason}
                    onChange={(e) => setFormState({ ...formState, reason: e.target.value })}
                  >
                    {contactReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="gpw-label">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="gpw-textarea"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Tell us more..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="gpw-btn-primary w-full"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





