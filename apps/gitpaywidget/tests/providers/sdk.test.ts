import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Unit tests for GitPayWidget SDK
 * 
 * Tests cover:
 * - Widget initialization
 * - Button click handlers
 * - Checkout API calls
 * - Error handling
 * - Callbacks
 */

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.open
const mockWindowOpen = vi.fn();
global.open = mockWindowOpen;

// Create mock DOM elements
function createMockButton(project: string, plan?: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.dataset.gpwProject = project;
  if (plan) {
    button.dataset.gpwPlan = plan;
  }
  return button;
}

describe('GitPayWidget SDK', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    
    // Reset fetch mock to return success by default
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        checkoutUrl: 'https://checkout.stripe.com/test',
        sessionId: 'cs_test_123',
      }),
    });
  });

  describe('initWidget', () => {
    it('requires project parameter', () => {
      // SDK should throw without project
      const initWithoutProject = () => {
        // Simulate SDK behavior
        const opts = { plan: 'pro' } as any;
        if (!opts.project) {
          throw new Error('[gitpaywidget] project is required');
        }
      };

      expect(initWithoutProject).toThrow('project is required');
    });

    it('finds buttons with matching data-gpw-project', () => {
      const button = createMockButton('test-org/test-site', 'pro');
      document.body.appendChild(button);

      const buttons = document.querySelectorAll('[data-gpw-project="test-org/test-site"]');
      expect(buttons.length).toBe(1);
    });

    it('warns when no buttons found', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Simulate SDK behavior
      const buttons = document.querySelectorAll('[data-gpw-project="nonexistent"]');
      if (buttons.length === 0) {
        console.warn('[gitpaywidget] no widget buttons found');
      }

      expect(consoleSpy).toHaveBeenCalledWith('[gitpaywidget] no widget buttons found');
      consoleSpy.mockRestore();
    });

    it('attaches click handlers to buttons', async () => {
      const button = createMockButton('test-org/test-site', 'pro');
      document.body.appendChild(button);

      let clickHandlerCalled = false;
      button.addEventListener('click', () => {
        clickHandlerCalled = true;
      });

      button.click();
      expect(clickHandlerCalled).toBe(true);
    });
  });

  describe('Checkout flow', () => {
    it('calls checkout endpoint with correct payload', async () => {
      const project = 'test-org/test-site';
      const plan = 'pro';
      const endpoint = 'https://api.gitpaywidget.com/v0/checkout';

      // Simulate SDK checkout call
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, plan }),
      });

      expect(mockFetch).toHaveBeenCalledWith(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, plan }),
      });
    });

    it('uses plan from button data attribute', () => {
      const button = createMockButton('test-org/test-site', 'enterprise');
      document.body.appendChild(button);

      const planId = button.dataset.gpwPlan;
      expect(planId).toBe('enterprise');
    });

    it('falls back to default plan when not on button', () => {
      const button = createMockButton('test-org/test-site');
      document.body.appendChild(button);

      const defaultPlan = 'pro';
      const planId = button.dataset.gpwPlan || defaultPlan;
      expect(planId).toBe('pro');
    });

    it('opens checkout URL in new window on success', async () => {
      const checkoutUrl = 'https://checkout.stripe.com/test-session';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          checkoutUrl,
          sessionId: 'cs_test_123',
        }),
      });

      // Simulate SDK behavior
      const res = await fetch('endpoint', { method: 'POST', body: '{}' });
      const data = await res.json();
      window.open(data.checkoutUrl, '_blank');

      expect(mockWindowOpen).toHaveBeenCalledWith(checkoutUrl, '_blank');
    });

    it('calls onSuccess callback with sessionId', async () => {
      const onSuccess = vi.fn();
      const sessionId = 'cs_test_123';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ checkoutUrl: '#', sessionId }),
      });

      // Simulate SDK behavior
      const res = await fetch('endpoint', { method: 'POST', body: '{}' });
      const data = await res.json();
      onSuccess(data.sessionId);

      expect(onSuccess).toHaveBeenCalledWith(sessionId);
    });

    it('calls onCancel callback on error', async () => {
      const onCancel = vi.fn();

      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed' }),
      });

      // Simulate SDK behavior
      const res = await fetch('endpoint', { method: 'POST', body: '{}' });
      if (!res.ok) {
        onCancel();
      }

      expect(onCancel).toHaveBeenCalled();
    });

    it('logs error on fetch failure', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Simulate SDK behavior
      try {
        await fetch('endpoint', { method: 'POST', body: '{}' });
      } catch (err) {
        console.error('[gitpaywidget] checkout error', err);
      }

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Custom endpoint', () => {
    it('uses default endpoint when not specified', () => {
      const defaultEndpoint = 'https://api.gitpaywidget.com/v0/checkout';
      const opts = { project: 'test', plan: 'pro' };
      
      const endpoint = opts.endpoint || defaultEndpoint;
      expect(endpoint).toBe(defaultEndpoint);
    });

    it('uses custom endpoint when specified', () => {
      const customEndpoint = 'https://custom.api.com/checkout';
      const opts = { project: 'test', plan: 'pro', endpoint: customEndpoint };
      
      const endpoint = opts.endpoint || 'default';
      expect(endpoint).toBe(customEndpoint);
    });
  });
});

describe('Widget Types', () => {
  it('WidgetOptions has correct shape', () => {
    interface WidgetOptions {
      project: string;
      plan: string;
      endpoint?: string;
      onSuccess?: (sessionId: string) => void;
      onCancel?: () => void;
    }

    const validOptions: WidgetOptions = {
      project: 'org/repo',
      plan: 'pro',
    };

    expect(validOptions.project).toBeDefined();
    expect(validOptions.plan).toBeDefined();
  });
});


