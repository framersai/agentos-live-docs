import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'Integration Guide – GitPayWidget',
  description: 'Step-by-step guide to integrating GitPayWidget into your static site.',
};

export default function IntegrationPage() {
  const integrationMd = fs.readFileSync(
    path.join(process.cwd(), 'docs/INTEGRATION_GUIDE.md'),
    'utf-8'
  );

  return (
    <article className="prose prose-lg prose-ink dark:prose-invert mx-auto px-6 py-16 max-w-4xl">
      <ReactMarkdown>{integrationMd}</ReactMarkdown>
    </article>
  );
}
