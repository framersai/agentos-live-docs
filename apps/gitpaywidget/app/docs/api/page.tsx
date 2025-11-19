import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'API Reference – GitPayWidget',
  description: 'Complete REST API documentation for GitPayWidget checkout and project management.',
};

export default function APIDocsPage() {
  const apiMd = fs.readFileSync(path.join(process.cwd(), 'docs/API.md'), 'utf-8');

  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <ReactMarkdown>{apiMd}</ReactMarkdown>
    </article>
  );
}
