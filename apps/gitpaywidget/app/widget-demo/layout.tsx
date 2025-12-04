import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Widget Demo – See GitPayWidget in Action',
  description: 'Preview the GitPayWidget embed with live pricing cards and hosted checkout buttons. Test the widget experience before integrating.',
  openGraph: {
    title: 'GitPayWidget Demo – Live Widget Preview',
    description: 'See how GitPayWidget looks on your site. Interactive demo with pricing cards and checkout.',
    url: '/widget-demo',
  },
  alternates: { canonical: '/widget-demo' },
};

export default function WidgetDemoLayout({ children }: { children: ReactNode }) {
  return children;
}

