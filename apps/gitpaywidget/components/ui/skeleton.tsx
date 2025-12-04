interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gpw-purple-100 via-gpw-purple-50 to-gpw-purple-100 dark:from-gpw-purple-900/40 dark:via-gpw-purple-800/30 dark:to-gpw-purple-900/40 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}
