'use client';

/**
 * Loading State Components
 * 
 * Provides various loading indicators and skeleton states
 * for a polished loading experience.
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} ${className}`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
      />
    </svg>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gpw-bg-base/80 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gpw-purple-500/20 to-gpw-pink-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <LoadingSpinner size="lg" className="text-gpw-purple-600" />
        </div>
        <p className="text-gpw-text-muted animate-pulse">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  lines?: number;
}

export function LoadingCard({ lines = 3 }: LoadingCardProps) {
  return (
    <div className="gpw-card p-6 animate-pulse">
      <div className="h-6 bg-gpw-purple-500/10 rounded-lg w-1/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className={`h-4 bg-gpw-purple-500/10 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'} ${i > 0 ? 'mt-3' : ''}`} 
        />
      ))}
    </div>
  );
}

interface LoadingButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function LoadingButton({ children = 'Loading...', className = '' }: LoadingButtonProps) {
  return (
    <button 
      disabled 
      className={`gpw-btn-primary opacity-75 cursor-not-allowed ${className}`}
    >
      <LoadingSpinner size="sm" className="mr-2" />
      {children}
    </button>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
  return (
    <span className={`inline-flex gap-1 ${className}`}>
      <span className="w-2 h-2 rounded-full bg-gpw-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-gpw-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-gpw-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="gpw-card p-12 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-gpw-purple-500/10 flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-gpw-text-muted mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'Please try again later.',
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="gpw-card p-6 border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-1">{title}</h3>
          <p className="text-sm text-gpw-text-muted mb-4">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="gpw-btn-secondary text-sm">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default {
  LoadingSpinner,
  LoadingOverlay,
  LoadingCard,
  LoadingButton,
  LoadingDots,
  EmptyState,
  ErrorState,
};


