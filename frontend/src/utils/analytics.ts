type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

export function track(event: AnalyticsEvent): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (typeof w.gtag === 'function') {
      w.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  } catch {
    // no-op
  }
}


