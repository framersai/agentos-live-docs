import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'DNS Setup – GitPayWidget',
  description:
    'Configure your domain with Porkbun, Cloudflare, and Linode for GitPayWidget deployment.',
};

export default function DNSPage() {
  const dnsMd = fs.readFileSync(path.join(process.cwd(), 'docs/DNS_SETUP.md'), 'utf-8');

  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <ReactMarkdown>{dnsMd}</ReactMarkdown>
    </article>
  );
}
