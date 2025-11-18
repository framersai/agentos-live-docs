interface SkeletonProps {
  className?: string;
}

/**
 * Animated gray placeholder used during loading states.
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-md bg-ink-100 dark:bg-ink-700 ${className}`} />;
}
