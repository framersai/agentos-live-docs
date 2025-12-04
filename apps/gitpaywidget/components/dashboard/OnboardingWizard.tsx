'use client';

import { useState } from 'react';
import Link from 'next/link';

interface OnboardingWizardProps {
  onComplete: () => void;
  hasProjects: boolean;
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to GitPayWidget!',
    description: 'Let\'s get you set up in just a few minutes.',
    icon: '🎉',
  },
  {
    id: 'create-project',
    title: 'Create Your First Project',
    description: 'Projects represent your sites or apps that will accept payments.',
    icon: '📁',
  },
  {
    id: 'add-keys',
    title: 'Connect Payment Provider',
    description: 'Add your Stripe or Lemon Squeezy API keys to start accepting payments.',
    icon: '🔑',
  },
  {
    id: 'embed',
    title: 'Embed the Widget',
    description: 'Copy the code snippet and add it to your static site.',
    icon: '💻',
  },
];

export function OnboardingWizard({ onComplete, hasProjects }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [projectSlug, setProjectSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleCreateProject = async () => {
    if (!projectName || !projectSlug) return;
    
    setCreating(true);
    setError(null);
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, slug: projectSlug }),
      });
      
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to create project');
      }
      
      handleNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gpw-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-gpw-purple-600'
                  : i < currentStep
                  ? 'w-2 bg-gpw-purple-400'
                  : 'w-2 bg-gpw-purple-200 dark:bg-gpw-purple-800'
              }`}
            />
          ))}
        </div>

        {/* Card */}
        <div className="gpw-card p-8 md:p-12">
          {/* Step icon */}
          <div className="text-6xl text-center mb-6">{step.icon}</div>

          {/* Step title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-3">
            {step.title}
          </h1>
          <p className="text-gpw-text-muted text-center mb-8">
            {step.description}
          </p>

          {/* Step content */}
          {step.id === 'welcome' && (
            <div className="space-y-4">
              <div className="gpw-card p-4 border-l-4 border-gpw-purple-500">
                <p className="text-sm">
                  <strong>What you'll need:</strong>
                </p>
                <ul className="text-sm text-gpw-text-muted mt-2 space-y-1">
                  <li>✓ A static site (GitHub Pages, Netlify, etc.)</li>
                  <li>✓ Stripe or Lemon Squeezy account</li>
                  <li>✓ 5 minutes of your time</li>
                </ul>
              </div>
            </div>
          )}

          {step.id === 'create-project' && (
            <div className="space-y-4">
              {hasProjects ? (
                <div className="text-center">
                  <p className="text-gpw-text-muted mb-4">
                    You already have projects set up. Skip this step or create another.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="projectName" className="gpw-label">Project Name</label>
                    <input
                      type="text"
                      id="projectName"
                      className="gpw-input"
                      placeholder="My Awesome Site"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="projectSlug" className="gpw-label">Project Slug</label>
                    <input
                      type="text"
                      id="projectSlug"
                      className="gpw-input"
                      placeholder="myorg/site"
                      value={projectSlug}
                      onChange={(e) => setProjectSlug(e.target.value)}
                    />
                    <p className="text-xs text-gpw-text-muted mt-1">
                      This will be used in your widget embed code
                    </p>
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </>
              )}
            </div>
          )}

          {step.id === 'add-keys' && (
            <div className="space-y-4">
              <div className="gpw-code-block">
                <div className="gpw-code-content text-sm">
                  <code>
                    <span className="text-gray-400">// Stripe keys format</span>
                    {'\n'}
                    <span className="text-pink-400">&#123;</span>
                    {'\n  '}
                    <span className="text-green-300">"secretKey"</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-green-300"> "sk_..."</span>
                    <span className="text-gray-400">,</span>
                    {'\n  '}
                    <span className="text-green-300">"priceId"</span>
                    <span className="text-gray-400">:</span>
                    <span className="text-green-300"> "price_..."</span>
                    {'\n'}
                    <span className="text-pink-400">&#125;</span>
                  </code>
                </div>
              </div>
              <p className="text-sm text-gpw-text-muted text-center">
                You'll add this in the dashboard after onboarding completes.
              </p>
            </div>
          )}

          {step.id === 'embed' && (
            <div className="space-y-4">
              <div className="gpw-code-block">
                <div className="gpw-code-content text-sm">
                  <code>
                    <span className="text-pink-400">&lt;script</span>
                    {'\n  '}
                    <span className="text-purple-300">src</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-green-300">"cdn.gitpaywidget.com/v0/widget.js"</span>
                    {'\n  '}
                    <span className="text-purple-300">data-project</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-green-300">"{projectSlug || 'your-project'}"</span>
                    {'\n'}
                    <span className="text-pink-400">&gt;&lt;/script&gt;</span>
                  </code>
                </div>
              </div>
              <p className="text-sm text-gpw-text-muted text-center">
                That's it! Copy this to any HTML page to add payments.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gpw-border">
            <button
              onClick={handleSkip}
              className="text-gpw-text-muted hover:text-gpw-text-primary text-sm"
            >
              Skip for now
            </button>
            
            {step.id === 'create-project' && !hasProjects ? (
              <button
                onClick={handleCreateProject}
                disabled={!projectName || !projectSlug || creating}
                className="gpw-btn-primary"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create & Continue'
                )}
              </button>
            ) : (
              <button onClick={handleNext} className="gpw-btn-primary">
                {currentStep === steps.length - 1 ? 'Go to Dashboard' : 'Continue'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Help link */}
        <p className="text-center text-sm text-gpw-text-muted mt-6">
          Need help?{' '}
          <Link href="/docs/quickstart" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
            Read the Quick Start guide
          </Link>
        </p>
      </div>
    </div>
  );
}





